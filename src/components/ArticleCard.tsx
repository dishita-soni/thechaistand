import React from "react";
import { Article } from "@/types/article";

interface ArticleCardProps extends Article {
  imageUrl?: string;
}

function formatDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "general",
  major: "major update",
  core: "core",
};

const ArticleCard: React.FC<ArticleCardProps> = ({ title, author, body, category, publishedAt, imageUrl }) => {
  return (
    <article className="article-page">
      <div className="article-content">
        <div className={`article-badge article-badge--${category}`}>
          {CATEGORY_LABELS[category] ?? category}
        </div>
        
        <div className="article-img-placeholder" />

        <h1 className="article-title">{title}</h1>

        <div className="article-meta">
          <span className="article-author">{author}</span>
          <span className="article-dot">·</span>
          <time className="article-date">
            {formatDate(publishedAt)}
          </time>
        </div>

        <div className="article-divider" />

        <div className="article-body">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;