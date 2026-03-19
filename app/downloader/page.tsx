"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Music, Loader2, FileText, Scissors, Mic, Youtube, ArrowRight } from "lucide-react";
import Link from "next/link";

const relatedTools = [
  {
    icon: <FileText className="w-6 h-6 text-red-400" />,
    title: "AI Script Generator",
    desc: "Extract transcript and generate AI summary from any YouTube video.",
    href: "/",
    tag: "AI",
    tagColor: "bg-red-500/10 text-red-400",
  },
  {
    icon: <Mic className="w-6 h-6 text-blue-400" />,
    title: "MP3 Extractor",
    desc: "Extract high-quality MP3 audio from YouTube videos instantly.",
    href: "/downloader#mp3",
    tag: "Audio",
    tagColor: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: <Youtube className="w-6 h-6 text-pink-400" />,
    title: "Shorts Downloader",
    desc: "Download YouTube Shorts as MP4 without watermark. 720p & 1080p.",
    href: "/downloader#mp4",
    tag: "Video",
    tagColor: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: <Scissors className="w-6 h-6 text-green-400" />,
    title: "Transcript Exporter",
    desc: "Get full timestamped transcript and export as .txt file.",
    href: "/",
    tag: "Text",
    tagColor: "bg-green-500/10 text-green-400",
  },
];

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
        {loading && (
          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-400 text-sm">
            <span className="shrink-0">⏳</span>
            <span>Processing your request... Large videos may take 1–2 minutes. Please keep this page open.</span>
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

      <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl px-5 py-4 space-y-2">
        {[
          "This tool is only for downloading videos you own or have authorized rights to download.",
          "We respect the copyright laws and DMCA. Please do not download copyrighted content.",
          "We do not host, store, or cache any videos from YouTube.",
          "We are not affiliated with YouTube, Google, or any content providers.",
        ].map((item, i) => (
          <p key={i} className="text-gray-500 text-xs flex gap-2">
            <span className="text-gray-600 shrink-0">{i + 1}.</span>
            {item}
          </p>
        ))}
      </div>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">More Tools</h2>
        <div className="grid grid-cols-4 gap-3">
          {relatedTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-4 flex flex-col gap-3 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  {tool.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-sm text-white mb-1">{tool.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-red-400 transition-colors mt-auto">
                Try it <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
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
