import Articles from "@/components/Articles/Articles";
import Loading from "@/components/Articles/loading";
import { Suspense } from "react";

export const metadata = {
  title: "Articles  | IR Lens",
  description: "Articles from our team of writers, editors and artists",
};

export default function ArticlesPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Articles />
      </Suspense>
    </main>
  );
}