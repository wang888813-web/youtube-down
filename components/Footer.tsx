import Link from "next/link";
import { Youtube } from "lucide-react";

const footerLinks = [
  { group: "Tools", links: [{ href: "/script", label: "AI Script" }, { href: "/downloader", label: "Downloader" }, { href: "/pricing", label: "Pricing" }] },
  { group: "Company", links: [{ href: "/about", label: "About" }, { href: "/disclaimer", label: "Disclaimer" }] },
  { group: "Legal", links: [{ href: "/privacy", label: "Privacy Policy" }, { href: "/terms", label: "Terms of Service" }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-gray-950 pt-12 pb-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/downloader" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight">
                <span className="text-white">YT</span><span className="text-red-500">Tools</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[180px]">
              Free, fast YouTube video downloader and AI content tools.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.group}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group.group}</h4>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span>© 2026 YTTools. All rights reserved.</span>
          <span>For personal use only · Not affiliated with YouTube or Google</span>
        </div>
      </div>
    </footer>
  );
}
