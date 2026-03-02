export interface Article {
  id: string;
  title: string;
  author: string;
  body: string;
  publishedAt: Date;
  category: "general" | "major" | "core";
}