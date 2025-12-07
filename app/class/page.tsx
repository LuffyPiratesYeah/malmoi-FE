import { Navbar } from "@/components/layout/Navbar";
import { ClassListClient } from "./client";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function ClassListPage() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/classes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch classes", await response.text());
  }

  const classes = response.ok ? await response.json() : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-12">
        <ClassListClient classes={classes} />
      </main>
    </div>
  );
}
