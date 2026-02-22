"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Article } from "@/types/article";
import Link from "next/link";

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const q = query(
        collection(db, "articles"),
        orderBy("publishedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
            id: doc.id,
            ...d,
            publishedAt: d.publishedAt?.toDate?.() ?? new Date(),
        };
      }) as Article[];
      setArticles(data);
    }

    fetchArticles();
  }, []);

  return (
    <main>
        {articles.map(article => (
        <div key={article.id}>
            <Link href={`/article?id=${article.id}`}>
            <h2>{article.title}</h2>
            </Link>
        </div>
        ))}
    </main>
  );
}