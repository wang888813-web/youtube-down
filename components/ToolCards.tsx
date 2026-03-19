import Link from "next/link";
import { FileText, Download, Music } from "lucide-react";

const tools = [
  {
    icon: <FileText className="w-8 h-8 text-red-400" />,
    title: "AI Script Generator",
    desc: "Extract transcript and generate AI summary, key points from any YouTube video.",
    href: "/",
    cta: "Try Now",
  },
  {
    icon: <Download className="w-8 h-8 text-blue-400" />,
    title: "Shorts Downloader",
    desc: "Download YouTube Shorts as MP4 without watermark. 720p & 1080p supported.",
    href: "/downloader",
    cta: "Download",
  },
  {
    icon: <Music className="w-8 h-8 text-green-400" />,
    title: "MP3 Extractor",
    desc: "Extract audio from any YouTube video and download as high-quality MP3.",
    href: "/downloader?tab=mp3",
    cta: "Extract",
  },
];

export default function ToolCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {tools.map((t) => (
          <div key={t.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors">
            <div className="mb-4">{t.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
            <p className="text-gray-400 text-sm mb-5">{t.desc}</p>
            <Link href={t.href} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
              {t.cta} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
