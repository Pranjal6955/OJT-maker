"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { UploadStep } from "./steps/upload-step";
import { ReviewStep } from "./steps/review-step";
import { GenerateStep } from "./steps/generate-step";

const STEPS = [
    { id: 1, label: "Upload & Configure" },
    { id: 2, label: "Review Daily Work" },
    { id: 3, label: "Generate & Download" },
];

export function JournalWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>(null);
    const [reviewLogs, setReviewLogs] = useState<{ date: string, work: string }[]>([]);

    const handleUploadNext = (data: any) => {
        setFormData(data);
        setCurrentStep(2);
    };

    const handleReviewNext = (logs: any) => {
        setReviewLogs(logs);
        setCurrentStep(3);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 text-foreground">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
                <div className="absolute top-[1.25rem] left-0 w-full h-[2px] bg-border z-0" />
                {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isDone = currentStep > step.id;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 group px-4 bg-background">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                    isActive && "bg-primary border-primary text-primary-foreground shadow-[0_0_0_8px_rgba(108,99,255,0.1)] scale-110",
                                    isDone && "bg-primary border-primary text-primary-foreground",
                                    !isActive && !isDone && "bg-card border-border text-muted-foreground group-hover:border-primary/50"
                                )}
                            >
                                {isDone ? <CheckIcon size={20} /> : <span className="font-bold text-sm">{step.id}</span>}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] uppercase tracking-wider font-bold text-center transition-colors duration-500",
                                    isActive ? "text-primary" : "text-muted-foreground/60"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="space-y-6">
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                        <UploadStep onNext={handleUploadNext} />
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                        <ReviewStep onPrev={() => setCurrentStep(1)} onNext={handleReviewNext} formData={formData} />
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                        <GenerateStep onPrev={() => setCurrentStep(2)} formData={formData} reviewLogs={reviewLogs} />
                    </div>
                )}
            </div>
        </div>
    );
}
