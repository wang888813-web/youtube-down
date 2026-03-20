"use client";

import { Check, X, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    iconColor: "text-gray-400",
    monthly: 0,
    yearly: 0,
    desc: "Get started for free",
    badge: null,
    cardClass: "bg-gray-900 border border-gray-800",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-gray-800 hover:bg-gray-700 text-white",
    features: [
      { text: "30 downloads / month", ok: true },
      { text: "10 AI uses / month", ok: true },
      { text: "720p max quality", ok: true },
      { text: "Download history (last 20)", ok: true },
      { text: "Ad-free experience", ok: false },
      { text: "4K download", ok: false },
      { text: "Priority processing", ok: false },
      { text: "Email support", ok: false },
    ],
    cta: "Get Started",
    ctaHref: "/downloader",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Star,
    iconColor: "text-yellow-400",
    monthly: 9.9,
    yearly: 7.9,
    desc: "For creators & researchers",
    badge: "Most Popular",
    cardClass: "bg-gradient-to-b from-gray-900 via-gray-900 to-red-950/30 border-2 border-red-500 shadow-2xl shadow-red-500/10",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30",
    features: [
      { text: "500 downloads / month", ok: true },
      { text: "200 AI uses / month", ok: true },
      { text: "4K max quality", ok: true },
      { text: "Download history (last 50)", ok: true },
      { text: "Ad-free experience", ok: true },
      { text: "Priority processing", ok: true },
    ],
    cta: "Start Pro",
    ctaHref: "#",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    icon: Crown,
    iconColor: "text-purple-400",
    monthly: 19.9,
    yearly: 15.9,
    desc: "For power users & teams",
    badge: null,
    cardClass: "bg-gray-900 border border-gray-700",
    headClass: "text-white",
    priceClass: "text-white",
    ctaClass: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
    features: [
      { text: "Unlimited downloads", ok: true },
      { text: "Unlimited AI uses", ok: true },
      { text: "4K max quality", ok: true },
      { text: "Permanent history", ok: true },
      { text: "Ad-free experience", ok: true },
      { text: "Highest priority processing", ok: true },
      { text: "Email support (24h)", ok: true },
      { text: "API access", ok: true },
    ],
    cta: "Go Unlimited",
    ctaHref: "#",
  },
];

const FAQ = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately.",
  },
  {
    q: "What happens when I hit the monthly limit?",
    a: "Downloads will be paused until next month. Upgrade anytime to get more capacity.",
  },
  {
    q: "How does the referral reward work?",
    a: "Share your unique link. When a friend registers, you get 1 day Pro free. When they subscribe to a paid plan, you earn 15 more days Pro.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Invite a friend to register and you'll get a free day of Pro to try it out.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Star className="w-3 h-3" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-red-600" : "bg-gray-700"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${yearly ? "left-7" : "left-1"}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? "text-white" : "text-gray-500"}`}>
              Yearly
              <span className="ml-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full font-semibold">-20%</span>
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
                      <span className="text-gray-500 mb-1.5 text-sm">/ forever</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className={`text-5xl font-black ${plan.priceClass}`}>${price}</span>
                        <span className="text-gray-500 mb-1.5 text-sm">/ month</span>
                      </div>
                      {yearly && (
                        <p className="text-xs text-green-400 mt-1">
                          Billed ${(price * 12).toFixed(0)} / year · Save ${((plan.monthly - plan.yearly) * 12).toFixed(0)}
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
            <p className="text-white font-semibold text-sm mb-0.5">Earn Pro for free via referrals</p>
            <p className="text-gray-400 text-xs">Invite a friend → get 1 day Pro when they register, 15 days Pro when they subscribe. Days stack forever.</p>
          </div>
          <Link href="/profile" className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap">
            Get My Link
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
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
