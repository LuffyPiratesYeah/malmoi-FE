import { Navbar } from "@/components/layout/Navbar";
import { ClassListClient } from "./client";
import { getClasses } from "@/app/service/classService";

export default async function ClassListPage() {
  const classes = await getClasses();
  console.log("Fetched classes:", classes);
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ClassListClient classes={classes} />
      </main>
    </div>
  );
}
