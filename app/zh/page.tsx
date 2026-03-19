"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Music, Loader2, FileText, Scissors, Mic, Youtube, ArrowRight, Shield, Zap, Star } from "lucide-react";
import Link from "next/link";

const relatedTools = [
  {
    icon: <FileText className="w-5 h-5 text-red-400" />,
    bg: "bg-red-500/15",
    title: "AI 脚本生成器",
    desc: "从任意 YouTube 视频中提取字幕并生成 AI 摘要。",
    href: "/zh/script",
    tag: "AI",
    tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    icon: <Mic className="w-5 h-5 text-blue-400" />,
    bg: "bg-blue-500/15",
    title: "MP3 提取器",
    desc: "从 YouTube 视频中提取高质量 MP3 音频。",
    href: "/zh?tab=mp3",
    tag: "音频",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: <Youtube className="w-5 h-5 text-pink-400" />,
    bg: "bg-pink-500/15",
    title: "Shorts 下载器",
    desc: "无水印下载 YouTube Shorts，支持 720p 和 1080p。",
    href: "/zh?tab=mp4",
    tag: "视频",
    tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    icon: <Scissors className="w-5 h-5 text-green-400" />,
    bg: "bg-green-500/15",
    title: "字幕导出器",
    desc: "获取带时间戳的完整字幕并导出为 .txt 文件。",
    href: "/zh/script",
    tag: "文本",
    tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
];

const steps = [
  { step: "01", title: "复制视频链接", desc: "打开 YouTube，找到想要下载的视频或 Shorts，复制浏览器地址栏中的链接。" },
  { step: "02", title: "粘贴并选择格式", desc: "将链接粘贴到输入框中，选择 MP4（视频）或 MP3（仅音频）。" },
  { step: "03", title: "选择画质", desc: "MP4 可选择 720p（文件较小）或 1080p（高清）。" },
  { step: "04", title: "点击下载", desc: "点击下载按钮并等待。大文件可能需要 1-2 分钟，请保持页面开启。" },
];

const badges = [
  { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: "极速处理" },
  { icon: <Shield className="w-4 h-4 text-green-400" />, label: "不存储数据" },
  { icon: <Star className="w-4 h-4 text-blue-400" />, label: "完全免费" },
];

function ZhDownloaderContent() {
  const params = useSearchParams();
  const defaultTab = params.get("tab") === "mp3" ? "mp3" : "mp4";
  const [tab, setTab] = useState<"mp4" | "mp3">(defaultTab);
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("720p");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = params.get("tab");
    if (t === "mp3") setTab("mp3");
    else if (t === "mp4") setTab("mp4");
  }, [params]);

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${tab}&quality=${quality}`);
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "下载失败");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = tab === "mp4" ? "video.mp4" : "audio.mp3";
      a.click();
    } catch {
      setError("下载失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-white">下载器</span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-10">
            免费下载 YouTube 视频和 Shorts，支持 MP4 视频和 MP3 音频，无需注册。
          </p>

          {/* Main Card */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur">
            <div className="flex gap-2 mb-6">
              <button onClick={() => setTab("mp4")} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp4" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
                <Download className="w-4 h-4" /> MP4 视频
              </button>
              <button onClick={() => setTab("mp3")} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "mp3" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
                <Music className="w-4 h-4" /> MP3 音频
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                placeholder="粘贴 YouTube 或 Shorts 链接..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-sm"
              />
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20 whitespace-nowrap text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {loading ? "处理中..." : "立即下载"}
              </button>
            </div>

            {tab === "mp4" && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 text-xs">画质：</span>
                {["720p", "1080p"].map((q) => (
                  <button key={q} onClick={() => setQuality(q)} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${quality === q ? "border-red-500 text-red-400 bg-red-500/10" : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"}`}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>正在处理中，大文件可能需要 1-2 分钟，请保持页面开启...</span>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
            )}
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">使用教程</h2>
          <p className="text-gray-500 text-sm">4 步下载 YouTube 视频和 Shorts</p>
        </div>
        <div className="relative flex items-start justify-between gap-6">
          <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          {steps.map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center text-center flex-1 gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                <span className="text-white text-sm font-black">{s.step}</span>
              </div>
              <h3 className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{s.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* More Tools */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-5">更多工具</h2>
        <div className="grid grid-cols-4 gap-4">
          {relatedTools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${tool.bg} flex items-center justify-center`}>{tool.icon}</div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tool.tagColor}`}>{tool.tag}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white mb-1">{tool.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-red-400 transition-colors mt-auto">
                立即使用 <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border border-gray-700 rounded-2xl px-6 py-5 grid grid-cols-2 gap-3 bg-gray-900/60">
          {[
            "本工具仅供下载您拥有版权或已获授权的视频使用。",
            "我们尊重版权法律和 DMCA，请勿下载受版权保护的内容。",
            "我们不托管、存储或缓存任何来自 YouTube 的视频文件。",
            "本站与 YouTube、Google 及任何内容提供商均无关联。",
          ].map((item, i) => (
            <p key={i} className="text-gray-200 text-xs flex gap-2">
              <span className="text-red-500 shrink-0 font-bold">{i + 1}.</span>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ZhPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="w-10 h-10 text-red-500 animate-spin" /></div>}>
      <ZhDownloaderContent />
    </Suspense>
  );
}
