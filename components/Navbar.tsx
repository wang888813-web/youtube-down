"use client";
import Link from "next/link";
import { Youtube, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/script", label: "AI Script" },
  { href: "/downloader", label: "Downloader" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/downloader" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Youtube className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-white">YT</span><span className="text-red-500">Tools</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">Login</button>
          <button className="text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/20">
            Sign Up Free
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 py-4 flex flex-col gap-2 text-sm bg-gray-950">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button className="mt-2 bg-red-600 hover:bg-red-500 px-4 py-2.5 rounded-lg font-semibold w-full transition-colors">Sign Up Free</button>
        </div>
      )}
    </nav>
  );
}
