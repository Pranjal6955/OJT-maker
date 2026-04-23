import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JournalWizard } from "@/components/journal-wizard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <JournalWizard />
      </main>
      <Footer />
    </div>
  );
}
