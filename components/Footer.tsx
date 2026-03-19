"use client";
import Link from "next/link";
import { Youtube } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const p = (en: string) => isZh ? `/zh${en}` : en;

  const footerLinks = [
    {
      group: isZh ? "工具" : "Tools",
      links: [
        { href: p("/script"), label: isZh ? "AI 脚本" : "AI Script" },
        { href: isZh ? "/zh" : "/downloader", label: isZh ? "下载器" : "Downloader" },
        { href: p("/pricing"), label: isZh ? "定价" : "Pricing" },
      ],
    },
    {
      group: isZh ? "公司" : "Company",
      links: [
        { href: p("/about"), label: isZh ? "关于我们" : "About" },
        { href: p("/disclaimer"), label: isZh ? "免责声明" : "Disclaimer" },
      ],
    },
    {
      group: isZh ? "法律" : "Legal",
      links: [
        { href: p("/privacy"), label: isZh ? "隐私政策" : "Privacy Policy" },
        { href: p("/terms"), label: isZh ? "服务条款" : "Terms of Service" },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-800/60 bg-gray-950 pt-12 pb-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href={isZh ? "/zh" : "/downloader"} className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight">
                <span className="text-white">YT</span><span className="text-red-500">Tools</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[180px]">
              {isZh ? "免费快速的 YouTube 视频下载和 AI 内容工具。" : "Free, fast YouTube video downloader and AI content tools."}
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.group}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group.group}</h4>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-500 hover:text-white text-sm transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span>© 2026 YTTools. {isZh ? "保留所有权利。" : "All rights reserved."}</span>
          <span>{isZh ? "仅供个人使用 · 与 YouTube 或 Google 无关联" : "For personal use only · Not affiliated with YouTube or Google"}</span>
        </div>
      </div>
    </footer>
  );
}
