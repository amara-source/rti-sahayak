"use client";

import { useState } from "react";
import { shellCopy } from "@/content/shell-copy";
import { ScriptedAssistant } from "@/components/rti/ScriptedAssistant";
import { askAnswers } from "@/lib/rti/ask-answers";

export function FloatingTools() {
  const [chatOpen, setChatOpen] = useState(false);
  // Read straight from the rule pack. No model, no network.
  const answers = askAnswers();

  return (
    <div className="floating-tools">
      <button
        aria-label={shellCopy.floating.top}
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
      >
        <span aria-hidden="true">↑</span>
      </button>
      <div className="floating-chat">
        {chatOpen ? (
          <section
            aria-label={shellCopy.floating.chatHeading}
            className="floating-chat__panel"
            role="dialog"
          >
            <header className="floating-chat__bar">
              <strong>{shellCopy.floating.chatHeading}</strong>
              <button
                aria-label={shellCopy.floating.close}
                onClick={() => setChatOpen(false)}
                type="button"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>
            <div className="floating-chat__body">
              <ScriptedAssistant answers={answers} compact />
            </div>
          </section>
        ) : null}
        <button
          aria-expanded={chatOpen}
          aria-label={shellCopy.floating.chat}
          className="chat-toggle"
          onClick={() => setChatOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true">?</span>
        </button>
      </div>
    </div>
  );
}
