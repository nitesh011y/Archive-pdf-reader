import { useState, useCallback, useRef } from "react";
import UploadPanel from "./components/UploadPanel.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import { uploadFile, queryDocs } from "./api.js";
import "./App.css";

let idCounter = 0;
const nextId = () => `m_${Date.now()}_${idCounter++}`;

export default function App() {
  const [docs, setDocs] = useState([]); // { id, name, pages, status: 'indexing'|'ready'|'error', progress, error }
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);

  const handleFiles = useCallback((fileList) => {
    const files = Array.from(fileList).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf"),
    );
    files.forEach((file) => {
      const localId = nextId();
      setDocs((prev) => [
        ...prev,
        {
          id: localId,
          name: file.name,
          pages: null,
          status: "indexing",
          progress: 0,
          error: null,
        },
      ]);

      uploadFile(file, (pct) => {
        setDocs((prev) =>
          prev.map((d) => (d.id === localId ? { ...d, progress: pct } : d)),
        );
      })
        .then((result) => {
          setDocs((prev) =>
            prev.map((d) =>
              d.id === localId
                ? {
                    ...d,
                    status: "ready",
                    progress: 100,
                    pages: result.pages,
                    name: result.name || d.name,
                  }
                : d,
            ),
          );
        })
        .catch((err) => {
          setDocs((prev) =>
            prev.map((d) =>
              d.id === localId
                ? { ...d, status: "error", error: err.message }
                : d,
            ),
          );
        });
    });
  }, []);

  const handleAsk = useCallback(
    async (question) => {
      if (!question.trim() || asking) return;

      const userMsg = { id: nextId(), role: "user", text: question };
      const pendingId = nextId();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: pendingId, role: "assistant", pending: true },
      ]);
      setAsking(true);

      try {
        const { answer, sources } = await queryDocs(question);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? { id: pendingId, role: "assistant", text: answer, sources }
              : m,
          ),
        );
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  id: pendingId,
                  role: "assistant",
                  text: null,
                  error: err.message,
                }
              : m,
          ),
        );
      } finally {
        setAsking(false);
      }
    },
    [asking],
  );

  const readyCount = docs.filter((d) => d.status === "ready").length;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">§</span>
          <div>
            <h1>Archive</h1>
            <p className="brand-sub">retrieval-augmented reading</p>
          </div>
        </div>

        <UploadPanel docs={docs} onFiles={handleFiles} />

        <div className="sidebar-footer">
          <span className="dot" data-live={readyCount > 0} />
          {readyCount === 0
            ? "no documents indexed"
            : `${readyCount} document${readyCount > 1 ? "s" : ""} indexed`}
        </div>
      </aside>

      <main className="main">
        <ChatPanel
          messages={messages}
          onAsk={handleAsk}
          asking={asking}
          hasDocs={readyCount > 0}
        />
      </main>
    </div>
  );
}
