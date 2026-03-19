"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Music, Loader2 } from "lucide-react";

function DownloaderContent() {
  const params = useSearchParams();
  const defaultTab = params.get("tab") === "mp3" ? "mp3" : "mp4";
  const [tab, setTab] = useState<"mp4" | "mp3">(defaultTab);
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("720p");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${tab}&quality=${quality}`);
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Download failed");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = tab === "mp4" ? "video.mp4" : "audio.mp3";
      a.click();
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">YouTube Downloader</h1>
      <p className="text-gray-400 mb-8">Download Shorts as MP4 or extract MP3 audio.</p>

      {/* Tab */}
      <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab("mp4")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "mp4" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>
          <Download className="w-4 h-4" /> MP4 Video
        </button>
        <button onClick={() => setTab("mp3")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "mp3" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>
          <Music className="w-4 h-4" /> MP3 Audio
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        {tab === "mp4" && (
          <div className="flex gap-3">
            {["720p", "1080p"].map((q) => (
              <button key={q} onClick={() => setQuality(q)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${quality === q ? "border-red-500 text-red-400 bg-red-500/10" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                {q}
              </button>
            ))}
          </div>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleDownload}
          disabled={loading || !url.trim()}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {loading ? "Processing..." : `Download ${tab.toUpperCase()}`}
        </button>
      </div>
      <p className="text-gray-600 text-xs mt-4 text-center">For personal use only. Respect copyright laws.</p>
    </div>
  );
}

export default function DownloaderPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="w-10 h-10 text-red-500 animate-spin" /></div>}>
      <DownloaderContent />
    </Suspense>
  );
}
