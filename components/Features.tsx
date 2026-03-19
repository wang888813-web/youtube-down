import { Sparkles, Globe, Clock } from "lucide-react";

const features = [
  { icon: <Sparkles className="w-5 h-5 text-yellow-400" />, title: "Smart Summary", desc: "AI condenses long videos into concise summaries and bullet-point key takeaways." },
  { icon: <Globe className="w-5 h-5 text-blue-400" />, title: "Multi-Language", desc: "Supports transcripts in 20+ languages. Auto-detects video language." },
  { icon: <Clock className="w-5 h-5 text-green-400" />, title: "Timestamped", desc: "Full transcript with timestamps so you can jump to any part of the video." },
];

export default function Features() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why YTTools?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
