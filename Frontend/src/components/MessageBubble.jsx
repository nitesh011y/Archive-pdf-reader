export default function MessageBubble({ message }) {
  const { role, text, pending, error, sources } = message;

  if (role === "user") {
    return (
      <div className="msg msg-user">
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="msg msg-assistant">
      {pending && (
        <div className="thinking">
          <span />
          <span />
          <span />
        </div>
      )}

      {!pending && error && (
        <p className="msg-error">Couldn't get an answer — {error}</p>
      )}

      {!pending && !error && (
        <>
          <p>{text}</p>
          {sources?.length > 0 && (
            <div className="sources">
              {sources.map((s) => (
                <span
                  className="source-chip"
                  key={s.id}
                  title={s.snippet || undefined}
                >
                  {s.label}
                  {s.page != null ? ` · p.${s.page}` : ""}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
