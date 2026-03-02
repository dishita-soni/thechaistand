"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ArticleCard from "@/src/components/ArticleCard";
import { ChevronLeftSquare } from "lucide-react";

export default function ArticleClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  //eslint-disable-next-line
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      const snapshot = await getDoc(doc(db, "articles", id));
      const d = snapshot.data();
      if (d) {
        setArticle({
          ...d,
          publishedAt: d.publishedAt?.toDate?.() ?? new Date(),
        });
      }
    }

    fetchArticle();
  }, [id]);

  if (!id) return <div>No article ID provided</div>;
  if (!article) return <div>Loading...</div>;

return (
  <main>
    <div className="article-back-wrap">
      <button onClick={() => window.history.back()} className="article-back-btn">
        <ChevronLeftSquare/>
      </button>
    </div>
    <ArticleCard {...article} />
  </main>
);
}