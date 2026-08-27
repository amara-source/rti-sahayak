"use client";

import { useState } from "react";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { ScriptedAssistant } from "@/components/rti/ScriptedAssistant";
import { askAnswers } from "@/lib/rti/ask-answers";

export function FloatingTools() {
  // Interface copy in the selected language, English where untranslated.
  const { shell: shellCopy } = useCopy();
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
          {/* The same character mark as inside the panel, so the button says
              what it opens rather than showing a bare question mark. */}
          <span aria-hidden="true" className="chat-toggle__mark">
            <svg viewBox="0 0 48 48" role="presentation">
              <circle className="chat-toggle__face" cx="24" cy="25" r="13" />
              <circle className="chat-toggle__eye" cx="19" cy="23" r="2.1" />
              <circle className="chat-toggle__eye" cx="29" cy="23" r="2.1" />
              <path className="chat-toggle__smile" d="M18.5 29.5a6.5 6.5 0 0 0 11 0" />
              <path className="chat-toggle__antenna" d="M24 12V7.5" />
              <circle className="chat-toggle__spark" cx="24" cy="6" r="3.1" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
