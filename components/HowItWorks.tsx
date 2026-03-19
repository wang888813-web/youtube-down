import { Link2, Cpu, FileDown } from "lucide-react";

const steps = [
  { icon: <Link2 className="w-6 h-6 text-red-400" />, title: "Paste URL", desc: "Copy any YouTube video or Shorts link and paste it in the input box." },
  { icon: <Cpu className="w-6 h-6 text-red-400" />, title: "AI Processing", desc: "We extract the transcript and run it through AI to generate summary and key points." },
  { icon: <FileDown className="w-6 h-6 text-red-400" />, title: "Get Results", desc: "View your AI summary, copy the transcript, or download the video/audio." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-gray-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
