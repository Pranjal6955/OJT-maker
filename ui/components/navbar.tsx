import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export function Navbar() {
    return (
        <header className="w-full bg-card border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="text-2xl animate-in fade-in zoom-in duration-500">📋</div>
            <h1 className="text-xl font-bold tracking-tight">
                OJT <span className="text-primary">Journal Maker</span>
            </h1>
            <div className="ml-auto">
                <Button size="sm" className="gap-2 font-semibold shadow-lg shadow-primary/20">
                    <DownloadIcon size={18} />
                    Download Template
                </Button>
            </div>
        </header>
    );
}
