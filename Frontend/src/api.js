const UPLOAD_URL = `${import.meta.env.VITE_BACKEND_URL}/files/upload`;
const QUERY_URL = `${import.meta.env.VITE_BACKEND_URL}/users/query`;

export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let body = {};
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          // non-JSON response, ignore
        }
        resolve(normalizeUpload(body, file));
      } else {
        reject(
          new Error(
            `Upload failed (${xhr.status}): ${xhr.responseText || xhr.statusText}`,
          ),
        );
      }
    };

    xhr.onerror = () =>
      reject(
        new Error("Upload failed — is the backend running on localhost:3000?"),
      );

    xhr.send(form);
  });
}

function normalizeUpload(body, file) {
  return {
    id: body.id ?? body.fileId ?? body._id ?? file.name,
    name: body.filename ?? body.name ?? file.name,
    pages: body.pages ?? body.pageCount ?? null,
  };
}

export async function queryDocs(message) {
  const res = await fetch(QUERY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Query failed (${res.status}): ${text || res.statusText}`);
  }

  let body = {};
  try {
    body = await res.json();
  } catch {
    throw new Error("Query succeeded but response was not valid JSON.");
  }

  return normalizeQuery(body);
}

function normalizeQuery(body) {
  const answer =
    body.answer ??
    body.response ??
    body.result ??
    body.message ??
    body.data?.answer ??
    (typeof body === "string" ? body : null) ??
    JSON.stringify(body);

  const rawSources =
    body.sources ?? body.context ?? body.citations ?? body.chunks ?? [];

  const sources = Array.isArray(rawSources)
    ? rawSources.map((s, i) => {
        if (typeof s === "string") return { id: i, label: s };
        return {
          id: s.id ?? i,
          label: s.source ?? s.filename ?? s.file ?? `source ${i + 1}`,
          page: s.page ?? s.pageNumber ?? null,
          snippet: s.text ?? s.content ?? s.snippet ?? null,
        };
      })
    : [];

  return { answer, sources };
}
