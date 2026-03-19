"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Music, Loader2, FileText, Scissors, Mic, Youtube, ArrowRight, Shield, Zap, Star } from "lucide-react";
import Link from "next/link";

const relatedTools = [
  {
    icon: <FileText className="w-5 h-5 text-red-400" />,
    title: "AI Script Generator",
    desc: "Extract transcript and generate AI summary from any YouTube video.",
    href: "/script",
    tag: "AI",
    tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    icon: <Mic className="w-5 h-5 text-blue-400" />,
    title: "MP3 Extractor",
    desc: "Extract high-quality MP3 audio from YouTube videos instantly.",
    href: "/downloader#mp3",
    tag: "Audio",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: <Youtube className="w-5 h-5 text-pink-400" />,
    title: "Shorts Downloader",
    desc: "Download YouTube Shorts as MP4 without watermark.",
    href: "/downloader#mp4",
    tag: "Video",
    tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    icon: <Scissors className="w-5 h-5 text-green-400" />,
    title: "Transcript Exporter",
    desc: "Get full timestamped transcript and export as .txt file.",
    href: "/script",
    tag: "Text",
    tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
];

const steps = [
  { step: "01", title: "Copy the URL", desc: "Find the YouTube video or Shorts and copy the URL from your browser." },
  { step: "02", title: "Paste & Choose Format", desc: "Paste the URL and select MP4 for video or MP3 for audio." },
  { step: "03", title: "Select Quality", desc: "Choose 720p for smaller size or 1080p for HD quality." },
  { step: "04", title: "Click Download", desc: "Hit Download and wait. Large videos may take 1–2 minutes." },
];

const badges = [
  { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: "Fast Processing" },
  { icon: <Shield className="w-4 h-4 text-green-400" />, label: "No Data Stored" },
  { icon: <Star className="w-4 h-4 text-blue-400" />, label: "Free to Use" },
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 pt-16 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700/50 rounded-full px-3 py-1 text-xs text-gray-300">
                {b.icon} {b.label}
              </div>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-3 tracking-tight">
            YouTube <span className="text-red-500">Downloader</span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-10">
            Download YouTube videos & Shorts as MP4 or extract MP3 audio — free, fast, no signup.
          </p>

          {/* Main Card */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab("mp4")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp4" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}
              >
                <Download className="w-4 h-4" /> MP4 Video
              </button>
              <button
                onClick={() => setTab("mp3")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp3" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}
              >
                <Music className="w-4 h-4" /> MP3 Audio
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                placeholder="Paste YouTube or Shorts URL here..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-sm"
              />
              <button
                onClick={handleDownload}
                disabled={loading || !url.trim()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20 whitespace-nowrap text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {loading ? "Processing..." : `Download`}
              </button>
            </div>

            {/* Quality selector */}
            {tab === "mp4" && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 text-xs">Quality:</span>
                {["720p", "1080p"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${quality === q ? "border-red-500 text-red-400 bg-red-500/10" : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Processing... Large videos may take 1–2 minutes. Please keep this page open.</span>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">How to Use</h2>
          <p className="text-gray-500 text-sm">Download any YouTube video in 4 simple steps</p>
        </div>
        <div className="relative flex items-start justify-between gap-6">
          <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          {steps.map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center text-center flex-1 gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-950 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <span className="text-red-400 text-xs font-bold">{s.step}</span>
              </div>
              <h3 className="font-semibold text-sm text-white">{s.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* More Tools */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-5">More Tools</h2>
        <div className="grid grid-cols-4 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  {tool.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white mb-1">{tool.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-red-400 transition-colors mt-auto">
                Try it <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border border-gray-700 rounded-2xl px-6 py-5 grid grid-cols-2 gap-3 bg-gray-900/40">
          {[
            "This tool is only for downloading videos you own or have authorized rights to download.",
            "We respect the copyright laws and DMCA. Please do not download copyrighted content.",
            "We do not host, store, or cache any videos from YouTube.",
            "We are not affiliated with YouTube, Google, or any content providers.",
          ].map((item, i) => (
            <p key={i} className="text-gray-400 text-xs flex gap-2">
              <span className="text-red-500 shrink-0 font-bold">{i + 1}.</span>
              {item}
            </p>
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
