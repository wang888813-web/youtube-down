import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for occasional use",
    features: ["20 AI generations/month", "720p video download", "MP3 extraction", "Copy & export transcript"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.9",
    period: "/month",
    desc: "For creators and researchers",
    features: ["Unlimited AI generations", "1080p video download", "Batch processing", "Priority processing", "API access"],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    desc: "For teams and agencies",
    features: ["Everything in Pro", "5 team accounts", "Team dashboard", "Usage analytics", "Priority support"],
    cta: "Start Team",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-gray-400">Start free. Upgrade when you need more.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? "border-red-500 bg-red-600/5" : "border-gray-800 bg-gray-900"}`}>
            {plan.highlight && (
              <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 w-fit mb-4">
                Most Popular
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
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
