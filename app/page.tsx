"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    setUrl("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      alert("Failed to create paste");
      return;
    }

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={8}
          placeholder="Enter your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={submit}
        >
          Create Paste
        </button>

        {url && (
          <p className="mt-4">
            Share URL:{" "}
            <a className="text-blue-600 underline" href={url}>
              {url}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
