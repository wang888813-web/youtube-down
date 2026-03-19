"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, FileText, Clock, Globe } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: <Sparkles className="w-5 h-5 text-yellow-400" />, title: "智能摘要", desc: "AI 将长视频浓缩为简洁摘要和关键要点。" },
  { icon: <Globe className="w-5 h-5 text-blue-400" />, title: "多语言支持", desc: "支持 20+ 种语言字幕，自动识别视频语言。" },
  { icon: <Clock className="w-5 h-5 text-green-400" />, title: "带时间戳", desc: "完整字幕附带时间戳，可快速跳转到任意位置。" },
];

export default function ZhScriptPage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    if (!url.trim()) return;
    router.push(`/zh/result?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 py-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" /> AI 驱动的 YouTube 工具
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white">粘贴链接，</span><br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">30 秒获得 AI 摘要</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            提取字幕、生成 AI 摘要、下载视频和音频 — 一个链接搞定一切。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="粘贴 YouTube 链接..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
            />
            <button
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20 whitespace-nowrap"
            >
              生成摘要 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-4">免费 · 无需注册 · 每日 5 次</p>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: <FileText className="w-8 h-8 text-red-400" />, title: "AI 脚本生成器", desc: "从任意 YouTube 视频提取字幕并生成 AI 摘要和关键要点。", href: "/zh/script", cta: "立即使用" },
            { icon: <ArrowRight className="w-8 h-8 text-blue-400" />, title: "Shorts 下载器", desc: "无水印下载 YouTube Shorts，支持 720p 和 1080p。", href: "/zh?tab=mp4", cta: "去下载" },
            { icon: <Clock className="w-8 h-8 text-green-400" />, title: "MP3 提取器", desc: "从 YouTube 视频中提取高质量 MP3 音频文件。", href: "/zh?tab=mp3", cta: "去提取" },
          ].map((t) => (
            <div key={t.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors">
              <div className="mb-4">{t.icon}</div>
              <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{t.title}</h3>
              <p className="text-gray-400 text-sm mb-5">{t.desc}</p>
              <Link href={t.href} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">{t.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">使用流程</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "粘贴链接", desc: "复制任意 YouTube 视频链接，粘贴到输入框中。" },
              { step: "02", title: "AI 处理", desc: "系统提取字幕并通过 AI 生成摘要和关键要点。" },
              { step: "03", title: "获取结果", desc: "查看 AI 摘要、复制字幕或下载视频/音频。" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <span className="text-white font-black text-lg">{s.step}</span>
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择 YTTools？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
