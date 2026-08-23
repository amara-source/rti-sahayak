"use client";

import { useState } from "react";
import { shellCopy } from "@/content/shell-copy";

export function FloatingTools() {
  const [chatOpen, setChatOpen] = useState(false);

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
          <section className="floating-chat__panel">
            <strong>{shellCopy.floating.chatHeading}</strong>
            <p>{shellCopy.floating.chatBody}</p>
            <button onClick={() => setChatOpen(false)} type="button">
              {shellCopy.floating.close}
            </button>
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
