"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const AUTHORS = ["dobby", "dumb little robot", "potterypasta", "fishy fishy"];
const CATEGORIES = ["general", "major", "core"];

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(AUTHORS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("title and body are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const docData: Record<string, unknown> = {
        title: title.trim(),
        author,
        category,
        body: body.trim(),
        publishedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "articles"), docData);

      setTitle("");
      setAuthor(AUTHORS[0]);
      setCategory(CATEGORIES[0]);
      setBody("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("something went wrong. check the console.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-main">
      <h1 className="admin-title">new article</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-field">
          <label className="admin-label">title</label>
          <input
            className="admin-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="article title..."
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">author</label>
          <select
            className="admin-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          >
            {AUTHORS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label className="admin-label">category</label>
          <select
            className="admin-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label className="admin-label">body</label>
          <textarea
            className="admin-input admin-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="write the article here... (separate paragraphs with a blank line)"
            rows={12}
          />
        </div>

        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">article published!</p>}

        <button type="submit" className="admin-btn" disabled={submitting}>
          {submitting ? "publishing..." : "publish article"}
        </button>
      </form>
    </main>
  );
}