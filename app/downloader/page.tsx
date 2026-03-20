"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Music, Loader2, FileText, Scissors, Mic, Youtube, Shield, Zap, Star, Volume2, VolumeX, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface VideoFormat {
  quality: number;
  quality_note: string;
  video_url: string;
  video_ext: string;
  video_size: number;
  audio_url: string | null;
  separate: number;
}

interface ParseResult {
  title: string;
  preview_url: string;
  formats: VideoFormat[];
  audio_url: string | null;
}

const relatedTools = [
  { icon: <FileText className="w-5 h-5 text-red-400" />, bg: "bg-red-500/15", title: "AI Script Generator", desc: "Extract transcript and generate AI summary from any YouTube video.", href: "/script", tag: "AI", tagColor: "bg-red-500/10 text-red-400 border-red-500/20" },
  { icon: <Mic className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/15", title: "MP3 Extractor", desc: "Extract high-quality MP3 audio from YouTube videos instantly.", href: "/downloader?tab=mp3", tag: "Audio", tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { icon: <Youtube className="w-5 h-5 text-pink-400" />, bg: "bg-pink-500/15", title: "Shorts Downloader", desc: "Download YouTube Shorts as MP4 without watermark.", href: "/downloader?tab=mp4", tag: "Video", tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { icon: <Scissors className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15", title: "Transcript Exporter", desc: "Get full timestamped transcript and export as .txt file.", href: "/script", tag: "Text", tagColor: "bg-green-500/10 text-green-400 border-green-500/20" },
];

const steps = [
  { step: "01", title: "Copy the URL", desc: "Find the YouTube video or Shorts and copy the URL from your browser." },
  { step: "02", title: "Paste & Analyze", desc: "Paste the URL and click Analyze to fetch video info and available formats." },
  { step: "03", title: "Choose Quality", desc: "Pick 720p or 1080p, with or without audio." },
  { step: "04", title: "Click Download", desc: "Hit the download button and save your file instantly." },
];

const badges = [
  { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: "Fast Processing" },
  { icon: <Shield className="w-4 h-4 text-green-400" />, label: "No Data Stored" },
  { icon: <Star className="w-4 h-4 text-blue-400" />, label: "Free to Use" },
];

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
}

function DownloaderContent() {
  const params = useSearchParams();
  const defaultTab = params.get("tab") === "mp3" ? "mp3" : "mp4";
  const [tab, setTab] = useState<"mp4" | "mp3">(defaultTab);
  useEffect(() => {
    const t = params.get("tab");
    if (t === "mp3") setTab("mp3");
    else if (t === "mp4") setTab("mp4");
  }, [params]);

  const [url, setUrl] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleParse = async () => {
    if (!url.trim()) return;
    setParsing(true);
    setError("");
    setParseResult(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to parse video"); return; }
      setParseResult(data);
    } catch {
      setError("Failed to parse video. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  const handleDownloadUrl = (videoUrl: string, quality: string, key: string) => {
    setDownloading(key);
    try {
      window.open(`https://api.yttoolsbox.com/proxy?url=${encodeURIComponent(videoUrl)}`, "_blank");
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleThumbDownload = async () => {
    if (!parseResult?.preview_url) return;
    setDownloading("thumb");
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(parseResult.preview_url)}`);
      if (!res.ok) { setError("Failed to download thumbnail"); return; }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "thumbnail.jpg";
      a.click();
    } catch {
      setError("Failed to download thumbnail.");
    } finally {
      setDownloading(null);
    }
  };

  const handleMp3Download = () => {
    if (!parseResult?.audio_url) { setError("No audio URL available. Please analyze the video first."); return; }
    setDownloading("mp3");
    try {
      window.open(`https://api.yttoolsbox.com/proxy?url=${encodeURIComponent(parseResult.audio_url)}`, "_blank");
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // Filter formats: only show 720p and 1080p mp4
  const videoFormats = parseResult?.formats.filter(f =>
    (f.quality === 720 || f.quality === 1080) && f.video_ext === "mp4"
  ) || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 pt-16 pb-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700/50 rounded-full px-3 py-1 text-xs text-gray-300">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">YouTube</span>{" "}
            <span className="text-white">Downloader</span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-10">
            Download YouTube videos & Shorts as MP4 or extract MP3 audio — free, fast, no signup.
          </p>

          {/* Main Card */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button onClick={() => { setTab("mp4"); setParseResult(null); setError(""); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp4" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
                <Download className="w-4 h-4" /> MP4 Video
              </button>
              <button onClick={() => { setTab("mp3"); setParseResult(null); setError(""); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp3" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
                <Music className="w-4 h-4" /> MP3 Audio
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-4">
              <input type="url" value={url} onChange={(e) => { setUrl(e.target.value); setParseResult(null); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && (tab === "mp4" ? handleParse() : handleMp3Download())}
                placeholder="Paste YouTube or Shorts URL here..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-sm" />
              <button onClick={tab === "mp4" ? handleParse : (parseResult ? handleMp3Download : handleParse)}
                disabled={parsing || !!downloading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20 whitespace-nowrap text-sm">
                {(parsing || downloading === "mp3") ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {parsing ? "Analyzing..." : downloading === "mp3" ? "Downloading..." : tab === "mp3" && !parseResult ? "Analyze" : tab === "mp3" ? "Download MP3" : "Analyze"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">{error}</div>
            )}

            {/* Parse Result */}
            {parseResult && tab === "mp3" && (
              <div className="mt-4 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="flex gap-4 p-4 bg-gray-800/50">
                  {parseResult.preview_url && (
                    <img src={parseResult.preview_url} alt="thumbnail" className="w-32 h-20 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-2 mb-1">{parseResult.title}</p>
                    <p className="text-gray-500 text-xs mb-3">Ready to download as MP3</p>
                    <button
                      onClick={handleMp3Download}
                      disabled={!!downloading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    >
                      {downloading === "mp3" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                      {downloading === "mp3" ? "Downloading..." : "Download MP3"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {parseResult && tab === "mp4" && (
              <div className="mt-4 border border-gray-700 rounded-2xl overflow-hidden">
                {/* Video info */}
                <div className="flex gap-4 p-4 bg-gray-800/50">
                  {parseResult.preview_url && (
                    <div className="relative shrink-0">
                      <img src={parseResult.preview_url} alt="thumbnail" className="w-32 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => handleThumbDownload()}
                        className="absolute bottom-1 right-1 bg-black/70 hover:bg-black/90 rounded-md p-1 transition-colors"
                        title="Download thumbnail"
                      >
                        {downloading === "thumb" ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-2 mb-1">{parseResult.title}</p>
                    <p className="text-gray-500 text-xs">Select quality to download</p>
                  </div>
                </div>

                {/* Format buttons */}
                <div className="p-4 space-y-2">
                  {videoFormats.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-2">No 720p/1080p MP4 formats available</p>
                  )}
                  {videoFormats.map((f) => {
                    const hasAudio = f.separate === 0 || !!f.audio_url;
                    const key = `${f.quality}`;
                    const isLoading = downloading === key;
                    return (
                      <button
                        key={f.quality}
                        onClick={() => handleDownloadUrl(f.video_url, f.quality_note, key)}
                        disabled={!!downloading}
                        className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 disabled:opacity-50 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                          ) : (
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                          )}
                          <span className="text-white font-semibold text-sm">{f.quality_note}</span>
                          <span className="text-gray-500 text-xs">{f.video_ext.toUpperCase()}</span>
                          {f.video_size > 0 && (
                            <span className="text-gray-500 text-xs">{formatSize(f.video_size)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {hasAudio ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs">
                              <Volume2 className="w-4 h-4" /> Audio
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                              <VolumeX className="w-4 h-4" /> No Audio
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* MP3 audio download if available */}
                  {parseResult.audio_url && (
                    <button
                      onClick={() => handleMp3Download()}
                      disabled={!!downloading}
                      className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 disabled:opacity-50 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {downloading === "audio" ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Music className="w-4 h-4 text-blue-400" />}
                        <span className="text-white font-semibold text-sm">Audio Only</span>
                        <span className="text-gray-500 text-xs">M4A</span>
                      </div>
                      <Volume2 className="w-4 h-4 text-green-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {downloading && downloading !== "mp3" && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-400 text-sm mt-4">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Downloading... Please keep this page open.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-2">How to Use</h2>
          <p className="text-gray-400 text-center text-sm mb-10">Download YouTube video &amp; Shorts in 4 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-red-600/40 to-transparent" />}
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg shadow-red-600/30">
                  <span className="text-white font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Tools */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-2">More Tools</h2>
          <p className="text-gray-400 text-center text-sm mb-10">Everything you need for YouTube content</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((t) => (
              <Link key={t.title} href={t.href} className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-black/20">
                <div className={`w-10 h-10 ${t.bg} rounded-xl flex items-center justify-center mb-3`}>{t.icon}</div>
                <h3 className="font-semibold text-sm mb-1 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{t.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{t.desc}</p>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${t.tagColor}`}>{t.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
          <p className="text-gray-200 text-xs leading-relaxed">
            YTTools is an independent tool not affiliated with YouTube or Google. Only download content you have the right to download. Respect copyright laws and YouTube&apos;s Terms of Service.{" "}
            <Link href="/disclaimer" className="text-red-400 hover:underline">Read Disclaimer</Link>
          </p>
        </div>
      </section>
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
