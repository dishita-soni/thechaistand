"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Article } from "@/types/article";
import Link from "next/link";
import { WashingMachine, Bot, Amphora, Fish } from "lucide-react";

const AUTHORS = [
  { id: "dobby", label: "dobby", Icon: WashingMachine },
  { id: "dumb little robot", label: "dumb little robot", Icon: Bot },
  { id: "potterypasta", label: "potterypasta", Icon: Amphora },
  { id: "fishy fishy", label: "fishy fishy", Icon: Fish },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const q = query(collection(db, "articles"), orderBy("publishedAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          publishedAt: d.publishedAt?.toDate?.() ?? new Date(),
        };
      }) as Article[];
      setArticles(data);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const filtered = articles.filter((a) => {
    const matchSearch =
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase());
    const matchAuthor =
      !authorFilter || a.author.toLowerCase() === authorFilter.toLowerCase();
    return matchSearch && matchAuthor;
  });

  return (
    <main className="home-main">
      <div className="search-wrap">
        <input
          className="search-input"
          type="text"
          placeholder="search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="author-row">
        {AUTHORS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`author-btn ${authorFilter === id ? "author-btn--active" : ""}`}
            onClick={() => setAuthorFilter(authorFilter === id ? null : id)}
            title={label}
          >
            <span className="author-icon-wrap">
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <span className="author-name">{label}</span>
          </button>
        ))}
      </div>

      {loading && <p className="home-loading">brewing...</p>}

      {/* Bulletin card — uncomment and set the article ID when there is one
      <Link href="/article?id=YOUR_ARTICLE_ID_HERE" className="bulletin-link">
        <div className="bulletin-card">
          <div className="bulletin-label">bulletin!</div>
          <div className="bulletin-title">Bulletin title here</div>
          <div className="bulletin-meta">author · date</div>
        </div>
      </Link>
      */}

      <div className="article-list">
        {filtered.map((article) => (
          <Link key={article.id} href={`/article?id=${article.id}`} className="article-row-link">
            <div className="article-row">
              <div className="article-row-thumb" />            
              <div className="article-row-info">
                <div className="article-row-author">{article.author}</div>
                <div className="article-row-title">{article.title}</div>
                <div className="article-row-date">{formatDate(article.publishedAt)}</div>
              </div>
            </div>
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="home-empty">no articles found.</p>
        )}
      </div>
    </main>
  );
}