import { Youtube, Zap, Shield } from "lucide-react";

export default function ZhAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">关于 YTTools</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-3">
        <p className="text-gray-200 text-lg leading-relaxed">YTTools 是一款免费、快速的 YouTube 视频转换在线工具。</p>
        <p className="text-gray-400 leading-relaxed">我们的使命：让每个人都能轻松、安全、免费地下载视频。</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Youtube className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">专为 YouTube 打造</h3>
          <p className="text-gray-400 text-sm">专门针对 YouTube 视频和 Shorts 优化。</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">快速免费</h3>
          <p className="text-gray-400 text-sm">无需注册，秒速开始下载。</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">隐私优先</h3>
          <p className="text-gray-400 text-sm">不存储您的数据，不追踪您的行为。</p>
        </div>
      </div>
    </div>
  );
}
