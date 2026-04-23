"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema, type UploadFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUp, Info, Key } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UploadStepProps {
    onNext: (data: any) => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
    const [file, setFile] = useState<File | null>(null);
    const [pageRangeType, setPageRangeType] = useState("all");
    const [fileError, setFileError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            ojtTiming: "8:00 AM – 5:00 PM",
            designation: "OJT Trainee",
            semester: "6th",
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setFileError("Please upload a valid PDF file");
                return;
            }
            if (selectedFile.size > 50 * 1024 * 1024) {
                setFileError("File size exceeds 50MB");
                return;
            }
            setFile(selectedFile);
            setFileError(null);
        }
    };

    const onSubmit = (data: UploadFormData) => {
        if (!file) {
            setFileError("PDF template is required");
            return;
        }
        onNext({ ...data, file, pageRangeType });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-border/50 shadow-xl shadow-primary/5">
                <CardHeader>
                    <CardTitle className="text-2xl">Upload PDF Template</CardTitle>
                    <CardDescription>
                        Upload your OJT journal PDF template and configure the OJT details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Quick Tips */}
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 text-sm">
                        <Info className="text-primary shrink-0" size={20} />
                        <div>
                            <p className="font-bold text-primary mb-1">Quick Tips:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>
                                    <span className="font-semibold">Download template:</span> Use the button in the header if you need a PDF.
                                </li>
                                <li>
                                    <span className="font-semibold">API Key:</span> Use a fresh Gemini API key for best results.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Dropzone */}
                    <div className="space-y-2">
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer",
                                file
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                                fileError && "border-destructive bg-destructive/5"
                            )}
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center",
                                fileError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                            )}>
                                <FileUp size={28} />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg">
                                    {file ? file.name : "Drop your PDF template here"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse (Max 50MB)"}
                                </p>
                            </div>
                            <input
                                type="file"
                                id="pdf-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                        {fileError && <p className="text-xs text-destructive font-medium">{fileError}</p>}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className={errors.startDate ? "text-destructive" : ""}>Start Date</Label>
                            <Input type="date" id="start-date" {...register("startDate")} className={errors.startDate ? "border-destructive" : ""} />
                            {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className={errors.endDate ? "text-destructive" : ""}>End Date</Label>
                            <Input type="date" id="end-date" {...register("endDate")} className={errors.endDate ? "border-destructive" : ""} />
                            {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="skip-dates">Skip Dates (Optional)</Label>
                            <Input
                                id="skip-dates"
                                placeholder="Select multiple dates..."
                                {...register("skipDates")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ojt-timing" className={errors.ojtTiming ? "text-destructive" : ""}>OJT Timing</Label>
                            <Input
                                id="ojt-timing"
                                placeholder="e.g. 8:00 AM – 5:00 PM"
                                {...register("ojtTiming")}
                                className={errors.ojtTiming ? "border-destructive" : ""}
                            />
                            {errors.ojtTiming && <p className="text-xs text-destructive">{errors.ojtTiming.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department" className={errors.department ? "text-destructive" : ""}>Department</Label>
                            <Input
                                id="department"
                                placeholder="e.g. Information Technology"
                                {...register("department")}
                                className={errors.department ? "border-destructive" : ""}
                            />
                            {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="designation" className={errors.designation ? "text-destructive" : ""}>Designation / Position</Label>
                            <Input
                                id="designation"
                                placeholder="e.g. OJT Trainee"
                                {...register("designation")}
                                className={errors.designation ? "border-destructive" : ""}
                            />
                            {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            Trainee Details <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">(Page 3)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Name</Label>
                                <Input id="name" placeholder="John Doe" {...register("name")} className={errors.name ? "border-destructive" : ""} />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber" className={errors.registrationNumber ? "text-destructive" : ""}>Registration Number</Label>
                                <Input id="registrationNumber" placeholder="12345678" {...register("registrationNumber")} className={errors.registrationNumber ? "border-destructive" : ""} />
                                {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="programName" className={errors.programName ? "text-destructive" : ""}>Program Name</Label>
                                <Input id="programName" placeholder="e.g. B.Tech Computer Science" {...register("programName")} className={errors.programName ? "border-destructive" : ""} />
                                {errors.programName && <p className="text-xs text-destructive">{errors.programName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="semester" className={errors.semester ? "text-destructive" : ""}>Semester</Label>
                                <Input id="semester" placeholder="e.g. 6th" {...register("semester")} className={errors.semester ? "border-destructive" : ""} />
                                {errors.semester && <p className="text-xs text-destructive">{errors.semester.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className={errors.location ? "text-destructive" : ""}>Location</Label>
                                <Input id="location" placeholder="e.g. New York" {...register("location")} className={errors.location ? "border-destructive" : ""} />
                                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industryPartner" className={errors.industryPartner ? "text-destructive" : ""}>Industry Partner Name</Label>
                                <Input id="industryPartner" placeholder="e.g. Acme Corp" {...register("industryPartner")} className={errors.industryPartner ? "border-destructive" : ""} />
                                {errors.industryPartner && <p className="text-xs text-destructive">{errors.industryPartner.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="font-bold text-lg">Journal Specifics</h3>
                        <div className="space-y-4">
                            <Label>Journal Page Range</Label>
                            <RadioGroup
                                defaultValue="all"
                                onValueChange={setPageRangeType}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="r1" />
                                    <Label htmlFor="r1" className="font-normal cursor-pointer">
                                        All (Default, starts from page 8)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="custom" id="r2" />
                                    <Label htmlFor="r2" className="font-normal cursor-pointer">
                                        Custom Range
                                    </Label>
                                </div>
                            </RadioGroup>

                            {pageRangeType === "custom" && (
                                <div className="p-4 bg-muted/50 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                                    <Label htmlFor="custom-range">Custom Page Range</Label>
                                    <Input id="custom-range" placeholder="e.g. 8-55" {...register("customRange")} />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Specify exactly which pages the daily journals should span. Example: 8-55.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="work-desc" className={errors.workDesc ? "text-destructive" : ""}>Work Description</Label>
                        <Textarea
                            id="work-desc"
                            rows={5}
                            className={cn("resize-none", errors.workDesc && "border-destructive")}
                            placeholder="Describe the overall work you did during the OJT. The AI will split it into daily tasks..."
                            {...register("workDesc")}
                        />
                        {errors.workDesc && <p className="text-xs text-destructive">{errors.workDesc.message}</p>}
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="api-key" className={cn("flex items-center gap-2", errors.apiKey && "text-destructive")}>
                            <Key size={14} className={errors.apiKey ? "text-destructive" : "text-primary"} />
                            Gemini API Key
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="password"
                                id="api-key"
                                placeholder="AIza…"
                                className={cn("flex-1", errors.apiKey && "border-destructive")}
                                {...register("apiKey")}
                            />
                            <Button variant="outline" asChild>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank">Get Key</a>
                            </Button>
                        </div>
                        {errors.apiKey && <p className="text-xs text-destructive">{errors.apiKey.message}</p>}
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20">
                        Upload & Process
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
