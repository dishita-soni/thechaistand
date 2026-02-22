"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ArticleClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  //eslint-disable-next-line
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      const snapshot = await getDoc(doc(db, "articles", id));
      setArticle(snapshot.data());
    }

    fetchArticle();
  }, [id]);

  if (!id) return <div>No article ID provided</div>;
  if (!article) return <div>Loading...</div>;

  return (
    <main style={{ padding: 40 }}>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
    </main>
  );
}