"use client";

import { Check, X, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "免费版",
    icon: Zap,
    iconColor: "text-gray-400",
    monthly: 0,
    yearly: 0,
    desc: "免费体验核心功能",
    badge: null,
    cardClass: "bg-gray-900 border border-gray-800",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-gray-800 hover:bg-gray-700 text-white",
    features: [
      { text: "每月 30 次下载", ok: true },
      { text: "每月 10 次 AI 功能", ok: true },
      { text: "最高 720p 画质", ok: true },
      { text: "下载记录（最近 20 条）", ok: true },
      { text: "去广告体验", ok: false },
      { text: "4K 超清下载", ok: false },
      { text: "优先处理队列", ok: false },
      { text: "邮件客服支持", ok: false },
    ],
    cta: "免费开始",
    ctaHref: "/zh",
  },
  {
    id: "pro",
    name: "Pro 会员",
    icon: Star,
    iconColor: "text-yellow-400",
    monthly: 9.9,
    yearly: 7.9,
    desc: "适合创作者与研究者",
    badge: "最受推荐",
    cardClass: "bg-gradient-to-b from-gray-900 via-gray-900 to-red-950/30 border-2 border-red-500 shadow-2xl shadow-red-500/10",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30",
    features: [
      { text: "每月 500 次下载", ok: true },
      { text: "每月 200 次 AI 功能", ok: true },
      { text: "4K 超清画质", ok: true },
      { text: "下载记录（最近 50 条）", ok: true },
      { text: "去广告体验", ok: true },
      { text: "优先处理队列", ok: true },
    ],
    cta: "立即升级 Pro",
    ctaHref: "#",
  },
  {
    id: "unlimited",
    name: "无限制版",
    icon: Crown,
    iconColor: "text-purple-400",
    monthly: 19.9,
    yearly: 15.9,
    desc: "适合重度用户与团队",
    badge: null,
    cardClass: "bg-gray-900 border border-gray-700",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
    features: [
      { text: "无限次下载", ok: true },
      { text: "无限次 AI 功能", ok: true },
      { text: "4K 超清画质", ok: true },
      { text: "下载记录永久保存", ok: true },
      { text: "去广告体验", ok: true },
      { text: "最高优先级处理", ok: true },
      { text: "邮件支持（24h）", ok: true },
      { text: "API 访问权限", ok: true },
    ],
    cta: "选择无限制版",
    ctaHref: "#",
  },
];

const FAQ = [
  {
    q: "可以随时切换套餐吗？",
    a: "可以，随时升级或降级，变更立即生效。",
  },
  {
    q: "达到月度限制后会怎样？",
    a: "下载功能将暂停，下个月自动重置。可随时升级套餐获取更多额度。",
  },
  {
    q: "推荐奖励是如何运作的？",
    a: "分享你的专属链接，好友注册即送你 1 天 Pro；好友付费订阅后，再额外奖励 15 天 Pro，天数永久叠加。",
  },
  {
    q: "有免费试用吗？",
    a: "邀请一位好友注册，即可免费获得 1 天 Pro 体验，无需绑定支付方式。",
  },
];

export default function ZhPricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Star className="w-3 h-3" /> 简单透明的定价
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
            选择适合你的套餐
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            免费开始，按需升级，随时可改。
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-gray-500"}`}>按月付费</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-red-600" : "bg-gray-700"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${yearly ? "left-7" : "left-1"}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? "text-white" : "text-gray-500"}`}>
              按年付费
              <span className="ml-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full font-semibold">省 20%</span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = yearly ? plan.yearly : plan.monthly;
            const isPro = plan.id === "pro";

            return (
              <div key={plan.id} className={`relative rounded-3xl p-7 flex flex-col ${plan.cardClass} ${isPro ? "md:-mt-4 md:pb-11" : ""}`}>
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-red-600/40 whitespace-nowrap">
                      <Star className="w-3 h-3 fill-current" /> {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isPro ? "bg-yellow-500/10 border border-yellow-500/20" : plan.id === "unlimited" ? "bg-purple-500/10 border border-purple-500/20" : "bg-gray-800 border border-gray-700"
                  }`}>
                    <Icon className={`w-4 h-4 ${plan.iconColor}`} />
                  </div>
                  <h2 className={`text-xl font-black tracking-tight ${plan.headClass}`}>{plan.name}</h2>
                </div>
                <p className="text-gray-400 text-sm mb-5">{plan.desc}</p>

                {/* Price */}
                <div className="mb-6">
                  {price === 0 ? (
                    <div className="flex items-end gap-1">
                      <span className={`text-5xl font-black ${plan.priceClass}`}>$0</span>
                      <span className="text-gray-500 mb-1.5 text-sm">/ 永久免费</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className={`text-5xl font-black ${plan.priceClass}`}>${price}</span>
                        <span className="text-gray-500 mb-1.5 text-sm">/ 月</span>
                      </div>
                      {yearly && (
                        <p className="text-xs text-green-400 mt-1">
                          年付 ${(price * 12).toFixed(0)} · 节省 ${((plan.monthly - plan.yearly) * 12).toFixed(0)}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* CTA */}
                <a href={plan.ctaHref}
                  className={`w-full py-3 rounded-2xl font-bold text-sm text-center transition-all mb-6 block ${plan.ctaClass}`}>
                  {plan.cta}
                </a>

                {/* Divider */}
                <div className="border-t border-gray-800 mb-5" />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.ok ? (
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPro ? "bg-red-500/10" : "bg-green-500/10"}`}>
                          <Check className={`w-2.5 h-2.5 ${isPro ? "text-red-400" : "text-green-400"}`} />
                        </div>
                      ) : (
                        <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-gray-800">
                          <X className="w-2.5 h-2.5 text-gray-600" />
                        </div>
                      )}
                      <span className={f.ok ? "text-gray-300" : "text-gray-600"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Referral banner */}
        <div className="mt-10 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-0.5">通过推荐免费获得 Pro</p>
            <p className="text-gray-400 text-xs">好友注册得 1 天 Pro，好友付费再得 15 天 Pro，天数永久叠加，上不封顶。</p>
          </div>
          <Link href="/zh/profile" className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap">
            获取我的链接
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-black text-center mb-8">常见问题</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FAQ.map((item) => (
              <div key={item.q} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-white font-semibold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
