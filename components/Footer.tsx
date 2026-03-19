import Link from "next/link";
import { Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Youtube className="text-red-500 w-5 h-5" />
          <span className="font-semibold text-white">YTTools</span>
          <span className="ml-2">© 2026</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/" className="hover:text-white transition-colors">AI Script</Link>
          <Link href="/downloader" className="hover:text-white transition-colors">Downloader</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
