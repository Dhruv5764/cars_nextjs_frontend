"use client";
// import translations from "../Language/lang";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  // const language = "en";
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <h1 className="text-4xl font-bold text-blue-600">{translations[language].title}</h1>
      <p className="mt-4 text-gray-700">Tailwind is now working in your Next.js project.</p> */}
    </div>
  );
}
