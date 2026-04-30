"use client";

import { useState, useRef, useEffect, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SendIcon, SparkleIcon, MicIcon } from "@/components/app/icons";

import { askMemory, type Citation } from "./actions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  error?: boolean;
};

export function MemoryChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, startThinking] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  function send(prefilled?: string) {
    const text = (prefilled ?? input).trim();
    if (!text || thinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    startThinking(async () => {
      const result = await askMemory(text);
      if (!result.ok) {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: result.error,
            error: true,
          },
        ]);
        return;
      }
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ]);
    });
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-[520px]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="size-7 rounded-lg bg-foreground text-background flex items-center justify-center">
            <SparkleIcon />
          </span>
          <span>Memory</span>
          <Badge variant="muted" className="ml-1">
            grounded
          </Badge>
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          vector search · top-6
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {isEmpty ? (
          <EmptyState onPick={(q) => send(q)} />
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} />)
        )}
        {thinking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-7 rounded-lg bg-foreground text-background flex items-center justify-center flex-shrink-0">
              <SparkleIcon />
            </span>
            <div className="flex gap-1 items-center">
              <span className="size-1.5 rounded-full bg-foreground/40 animate-pulse" />
              <span
                className="size-1.5 rounded-full bg-foreground/40 animate-pulse"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="size-1.5 rounded-full bg-foreground/40 animate-pulse"
                style={{ animationDelay: "240ms" }}
              />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="border-t border-border bg-background p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 transition-colors">
          <button
            type="button"
            title="Voice input (coming soon)"
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors flex-shrink-0"
          >
            <MicIcon />
          </button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask your past predictions…"
            className="min-h-9 max-h-32 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none focus-visible:ring-0"
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || thinking}
            className="h-9 px-3 flex-shrink-0"
          >
            <SendIcon />
            <span className="sr-only sm:not-sr-only">Send</span>
          </Button>
        </div>
        <p className="mt-2 px-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          Enter to send · Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  const starters = [
    "Where am I most overconfident?",
    "Show me predictions about pricing.",
    "How did I do on hiring last quarter?",
    "Find high-confidence ones I got wrong.",
  ];
  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="size-12 rounded-2xl bg-foreground/[0.05] border border-border flex items-center justify-center mb-4">
        <SparkleIcon className="text-foreground/70" />
      </div>
      <h3 className="text-lg font-semibold text-foreground tracking-tight">
        Ask anything about what you&apos;ve predicted.
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Memory searches across every prediction and outcome, then answers in
        plain language with citations to your own words.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        {starters.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-foreground text-background px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span
        className={`size-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          message.error
            ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
            : "bg-foreground text-background"
        }`}
      >
        <SparkleIcon />
      </span>
      <div className="flex-1 max-w-[85%] space-y-3">
        <div
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            message.error ? "text-rose-700 dark:text-rose-300" : "text-foreground"
          }`}
        >
          {renderWithCitationLinks(message.content, message.citations ?? [])}
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              From your predictions
            </p>
            {message.citations.map((c, i) => (
              <CitationCard key={c.id} index={i + 1} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderWithCitationLinks(content: string, citations: Citation[]) {
  if (citations.length === 0) return content;
  // Highlight [#n] tokens
  const parts = content.split(/(\[#\d+\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[#(\d+)\]$/);
    if (m) {
      const idx = Number(m[1]);
      const valid = idx >= 1 && idx <= citations.length;
      return (
        <span
          key={i}
          className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md text-[10px] font-mono align-middle mx-0.5 ${
            valid
              ? "bg-brand/15 text-brand border border-brand/30"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {idx}
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function CitationCard({ index, c }: { index: number; c: Citation }) {
  const dot =
    c.status === "pending"
      ? "bg-amber-400"
      : c.status === "right"
      ? "bg-emerald-500"
      : c.status === "wrong"
      ? "bg-rose-500"
      : "bg-foreground/30";
  return (
    <div className="rounded-lg border border-border bg-background p-3 text-sm text-foreground/85">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md text-[10px] font-mono bg-brand/15 text-brand border border-brand/30">
          {index}
        </span>
        <span className={`size-1.5 rounded-full ${dot}`} />
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          {c.date.slice(0, 10)}
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-xs text-muted-foreground font-mono">
          {c.confidence}%
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">
          {Math.round(c.similarity * 100)}% match
        </span>
      </div>
      <p className="leading-snug">{c.text}</p>
    </div>
  );
}
