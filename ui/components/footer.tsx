import { Globe } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-10 px-6 text-center border-t border-border mt-auto bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground text-sm mb-2">
                ✨ <span className="font-bold">OJT Journal Maker</span> is open source
            </p>
            <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
                💙 Contribute and improve:{" "}
                <a
                    href="https://github.com/Va16hav07/OJT-maker.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                    <Globe size={14} />
                    github
                </a>
            </p>
        </footer>
    );
}
