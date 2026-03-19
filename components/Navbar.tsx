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
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Youtube className="text-red-500 w-6 h-6" />
          <span className="font-extrabold tracking-tight">
            <span className="text-white">YT</span><span className="text-red-500">Tools</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-gray-300 hover:text-white px-3 py-1.5">Login</button>
          <button className="text-sm bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg font-medium transition-colors">
            Sign Up Free
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 py-4 flex flex-col gap-4 text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-medium w-full">Sign Up Free</button>
        </div>
      )}
    </nav>
  );
}
