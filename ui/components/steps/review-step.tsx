import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { calculateOJTDays } from "@/lib/date-utils";
import { generateDailyLogs } from "@/app/actions";
import { Loader2, AlertCircle } from "lucide-react";

interface ReviewStepProps {
    onPrev: () => void;
    onNext: (data: any) => void;
    formData: any;
}

export function ReviewStep({ onPrev, onNext, formData }: ReviewStepProps) {
    const [logs, setLogs] = useState<{ date: string, work: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!formData) return;

            try {
                setLoading(true);
                const days = calculateOJTDays(formData.startDate, formData.endDate, formData.skipDates);
                const generatedWorks = await generateDailyLogs(formData.workDesc, formData.apiKey, days.length);

                const combinedLogs = days.map((date, i) => ({
                    date,
                    work: generatedWorks[i] || "No task generated for this day."
                }));

                setLogs(combinedLogs);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to generate work logs. Please check your API key and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [formData]);

    const handleLogChange = (index: number, newWork: string) => {
        const newLogs = [...logs];
        newLogs[index].work = newWork;
        setLogs(newLogs);
    };

    return (
        <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Review Daily Work</CardTitle>
                <CardDescription>
                    Review and edit the AI-generated task descriptions for each day.
                    ({logs.length} days total)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? (
                    <div className="h-80 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Gemini is brainstorming your daily tasks...</p>
                    </div>
                ) : error ? (
                    <div className="h-80 flex flex-col items-center justify-center gap-4 text-destructive text-center px-6">
                        <AlertCircle size={48} />
                        <p className="font-semibold">{error}</p>
                        <Button variant="outline" onClick={onPrev}>Go Back & Fix Config</Button>
                    </div>
                ) : (
                    <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        {logs.map((log, index) => (
                            <div key={log.date} className="space-y-2 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Day {index + 1}: {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </Label>
                                </div>
                                <Input
                                    value={log.work}
                                    onChange={(e) => handleLogChange(index, e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={onPrev} className="flex-1 h-12 text-lg">
                        Back
                    </Button>
                    <Button
                        onClick={() => onNext(logs)}
                        disabled={loading || !!error}
                        className="flex-1 h-12 text-lg font-bold shadow-xl shadow-primary/20"
                    >
                        Review Done 🚀
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
