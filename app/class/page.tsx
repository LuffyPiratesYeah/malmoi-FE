import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { ClassListClient } from "./client";

export default async function ClassListPage() {
  const classes = await db.class.getAll();

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-12">
        <ClassListClient classes={classes} />
      </main>
    </div>
  );
}

