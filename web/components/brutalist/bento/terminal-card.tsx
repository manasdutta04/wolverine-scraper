"use client";

import { useEffect, useState } from "react";

const LOG_LINES = [
  "> bdata scraper run c_msyvm0ar1gznj2dlrq",
  "> Parsing Adafruit listing…",
  "> Snapshot → db/wolverine.db",
  "> Red flag: empty stock field",
  "> Heal Court: REPAIR",
  "> bdata scraper heal <collector>",
  "> bdata scraper approve <collector>",
  "> Re-run confirm: fields hold",
  "> Verdict: RELEASE",
  "> Scar Feed: signal trusted",
  "> Suppress false restock noise",
  "> CI cron: scrape + heal loop",
  "> Status: OPERATIONAL",
  "> --------- CYCLE COMPLETE ---------",
];

export function TerminalCard() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        const next = prev + 1;
        if (next >= LOG_LINES.length) {
          setLines([]);
          return 0;
        }
        setLines((l) => [...l.slice(-8), LOG_LINES[next]]);
        return next;
      });
    }, 600);

    setLines([LOG_LINES[0]]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b-2 border-foreground px-4 py-2">
        <span className="h-2 w-2 bg-[#ea580c]" />
        <span className="h-2 w-2 bg-foreground" />
        <span className="h-2 w-2 border border-foreground" />
        <span className="ml-auto text-[10px] tracking-widest text-muted-foreground uppercase">
          heal_loop.sys
        </span>
      </div>
      <div className="flex-1 bg-foreground p-4 overflow-hidden">
        <div className="flex flex-col gap-1">
          {lines.map((line, i) => (
            <span
              key={`${currentLine}-${i}`}
              className="text-xs text-background font-mono block"
              style={{ opacity: i === lines.length - 1 ? 1 : 0.6 }}
            >
              {line}
            </span>
          ))}
          <span className="text-xs text-[#ea580c] font-mono animate-blink">
            {"_"}
          </span>
        </div>
      </div>
    </div>
  );
}
