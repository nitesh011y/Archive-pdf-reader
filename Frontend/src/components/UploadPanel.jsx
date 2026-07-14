import { useRef, useState } from "react";

export default function UploadPanel({ docs, onFiles }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  };

  return (
    <div className="upload-panel">
      <div
        className="dropzone"
        data-active={dragActive}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3v12m0-12 4 4m-4-4-4 4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Drop PDFs here or click to browse</span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => e.target.files?.length && onFiles(e.target.files)}
        />
      </div>

      <ul className="doc-list">
        {docs.map((doc) => (
          <li key={doc.id} className="doc-row" data-status={doc.status}>
            <div className="doc-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {doc.status === "indexing" && <span className="scan-line" />}
            </div>
            <div className="doc-meta">
              <span className="doc-name" title={doc.name}>
                {doc.name}
              </span>
              <span className="doc-status">
                {doc.status === "indexing" && `indexing… ${doc.progress}%`}
                {doc.status === "ready" &&
                  (doc.pages ? `${doc.pages} pages · ready` : "ready")}
                {doc.status === "error" && (doc.error || "failed")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
