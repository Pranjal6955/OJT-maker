import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Download, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { generateFullJournalEntries } from "@/app/actions";
import { fillPdfTemplate } from "@/lib/pdf-utils";

interface GenerateStepProps {
    onPrev: () => void;
    formData: any;
    reviewLogs: { date: string, work: string }[];
}

export function GenerateStep({ onPrev, formData, reviewLogs }: GenerateStepProps) {
    const [status, setStatus] = useState<"generating" | "done" | "error">("generating");
    const [progress, setProgress] = useState(0);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generate = async () => {
            try {
                setProgress(10);
                // Step 1: Generate detailed entries via AI
                const detailedEntries = await generateFullJournalEntries(formData.apiKey, reviewLogs);
                setProgress(60);

                // Step 2: Fill PDF template
                const pdfBuffer = await formData.file.arrayBuffer();
                const filledPdfBytes = await fillPdfTemplate(
                    pdfBuffer,
                    detailedEntries,
                    formData,
                    formData.pageRangeType === "custom" ? parseInt(formData.customRange?.split("-")[0] || "8") : 8
                );
                setProgress(90);

                const blob = new Blob([filledPdfBytes as any], { type: "application/pdf" });
                setPdfBlob(blob);
                setStatus("done");
                setProgress(100);
            } catch (err) {
                console.error(err);
                setError("Failed to generate PDF. Please check your AI key and network.");
                setStatus("error");
            }
        };

        generate();
    }, [formData, reviewLogs]);

    const handleDownload = () => {
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `OJT_Journal_${formData.name.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Generate & Download</CardTitle>
                <CardDescription>Your journal is being prepared and filled using AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-10">
                {status === "generating" && (
                    <div className="space-y-6 text-center animate-in fade-in duration-500">
                        <div className="relative w-24 h-24 mx-auto">
                            <Loader2 className="w-24 h-24 text-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                                {progress}%
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Generating Your Journal...</h3>
                            <p className="text-muted-foreground">Please wait while the AI fills in all the details.</p>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 text-center py-10">
                        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-destructive">Generation Failed</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={onPrev} variant="outline">Go Back & Try Again</Button>
                    </div>
                )}

                {status === "done" && (
                    <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-lg shadow-success/10 border-2 border-success/20">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Journal Ready!</h3>
                            <p className="text-muted-foreground">Your OJT daily journal PDF has been generated successfully.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDownload}
                                className="w-full h-14 text-lg font-bold bg-success hover:bg-success/90 shadow-xl shadow-success/20 gap-2"
                            >
                                <Download size={20} />
                                Download PDF
                            </Button>
                            <Button variant="ghost" onClick={() => window.location.reload()} className="w-full">
                                ↩ Start Over
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
