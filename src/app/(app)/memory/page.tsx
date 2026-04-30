import { Badge } from "@/components/ui/badge";
import { MemoryChat } from "./memory-chat";

export const metadata = {
  title: "Memory — Hintsight",
};

export default function MemoryPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Memory
          </p>
          <Badge variant="accent">vector search</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Ask your past predictions
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl text-pretty">
          Search your prediction history in plain language. Answers are
          grounded in your own words — every claim is cited.
        </p>
      </div>

      <MemoryChat />

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-mono uppercase tracking-widest text-muted-foreground/80 mb-1">
          how it works
        </p>
        <p className="leading-relaxed">
          Your question is embedded with{" "}
          <code className="font-mono text-foreground/80">bge-small-en-v1.5</code>{" "}
          and matched against your prediction embeddings via pgvector HNSW.
          The top 6 hits are passed to{" "}
          <code className="font-mono text-foreground/80">
            llama-3.3-70b-versatile
          </code>{" "}
          on Groq, which writes a grounded answer with{" "}
          <code className="font-mono text-foreground/80">[#n]</code> citations.
        </p>
      </div>
    </div>
  );
}
