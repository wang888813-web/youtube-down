import { Check } from "lucide-react";

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    desc: "适合偶尔使用",
    features: ["每月 20 次 AI 生成", "720p 视频下载", "MP3 音频提取", "复制和导出字幕"],
    cta: "免费开始",
    highlight: false,
  },
  {
    name: "专业版",
    price: "¥69",
    period: "/月",
    desc: "适合创作者和研究者",
    features: ["无限次 AI 生成", "1080p 视频下载", "批量处理", "优先处理速度", "API 访问"],
    cta: "开始专业版",
    highlight: true,
  },
  {
    name: "团队版",
    price: "¥199",
    period: "/月",
    desc: "适合团队和机构",
    features: ["包含专业版所有功能", "5 个团队账号", "团队管理面板", "使用数据分析", "优先客服支持"],
    cta: "开始团队版",
    highlight: false,
  },
];

export default function ZhPricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">简单透明的定价</h1>
        <p className="text-gray-400">免费开始，按需升级。</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? "border-red-500 bg-red-600/5" : "border-gray-800 bg-gray-900"}`}>
            {plan.highlight && (
              <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 w-fit mb-4">
                最受欢迎
              </div>
            )}
            <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-400 mb-1">{plan.period}</span>
            </div>
            <button className={`w-full py-3 rounded-xl font-semibold mb-6 transition-colors ${plan.highlight ? "bg-red-600 hover:bg-red-500" : "bg-gray-800 hover:bg-gray-700"}`}>
              {plan.cta}
            </button>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
