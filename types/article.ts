export interface Article {
  id: string;
  title: string;
  author: string;
  body: string;
  imageUrl?: string;
  publishedAt: Date;
  category: "general" | "major" | "core";
}