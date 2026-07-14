import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatPanel({ messages, onAsk, asking, hasDocs }) {
  const [value, setValue] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAsk(value);
    setValue("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-scroll" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            <p className="empty-title">Ask something about your documents.</p>
            <p className="empty-sub">
              {hasDocs
                ? "Your index is ready — try a question about the content you uploaded."
                : "Upload a PDF on the left to get started."}
            </p>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <form className="composer" onSubmit={submit}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
          placeholder="Ask a question about your documents…"
          rows={1}
        />
        <button
          type="submit"
          disabled={asking || !value.trim()}
          aria-label="Send question"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12h16m0 0-6-6m6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
