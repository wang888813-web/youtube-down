"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    if (!url.trim()) return;
    router.push(`/result?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <section className="py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered YouTube Tools
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Paste a YouTube link,<br />
          <span className="text-red-500">get AI insights in 30s</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Extract transcripts, generate AI summaries, download videos and audio — all from one link.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Paste YouTube URL here..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap"
          >
            Generate <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-4">Free · No signup required · 5 uses/day</p>
      </div>
    </section>
  );
}
