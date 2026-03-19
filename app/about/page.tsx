import { Youtube, Zap, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">About YTTools</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-3">
        <p className="text-gray-200 text-lg leading-relaxed">
          YTTools is a free, fast online tool for YouTube video conversion.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Our mission: make downloading easy, safe, and free for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Youtube className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">YouTube Native</h3>
          <p className="text-gray-400 text-sm">Built specifically for YouTube videos and Shorts.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Fast & Free</h3>
          <p className="text-gray-400 text-sm">No signup required. Start downloading in seconds.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Privacy First</h3>
          <p className="text-gray-400 text-sm">We don't store your data or track your activity.</p>
        </div>
      </div>
    </div>
  );
}
