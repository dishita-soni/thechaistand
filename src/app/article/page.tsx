import { Suspense } from "react";
import ArticleClient from "./ArticleClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleClient />
    </Suspense>
  );
}