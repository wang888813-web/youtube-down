"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Copy, Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface Result {
  title: string;
  summary: string;
  keyPoints: string[];
  transcript: { time: string; text: string }[];
}

function ResultContent() {
  const params = useSearchParams();
  const url = params.get("url") || "";
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(`/api/transcript?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setResult(data);
      })
      .catch(() => setError("Failed to process video. Please try again."))
      .finally(() => setLoading(false));
  }, [url]);

  const copyTranscript = () => {
    if (!result) return;
    const text = result.transcript.map((t) => `[${t.time}] ${t.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!result) return;
    const text = `${result.title}\n\nSUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.keyPoints.map((k, i) => `${i + 1}. ${k}`).join("\n")}\n\nTRANSCRIPT:\n${result.transcript.map((t) => `[${t.time}] ${t.text}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transcript.txt";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="text-gray-400">Processing video with AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-gray-300">{error}</p>
        <a href="/" className="text-red-400 hover:text-red-300 text-sm">← Try another URL</a>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 line-clamp-2">{result.title}</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 w-fit">
        {(["summary", "transcript"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-3 text-gray-300 text-sm uppercase tracking-wide">AI Summary</h2>
            <p className="text-gray-200 leading-relaxed">{result.summary}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4 text-gray-300 text-sm uppercase tracking-wide">Key Points</h2>
            <ul className="space-y-3">
              {result.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-gray-200">
                  <span className="text-red-500 font-bold shrink-0">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "transcript" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wide">Full Transcript</h2>
            <div className="flex gap-2">
              <button onClick={copyTranscript} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={downloadTxt} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                <Download className="w-4 h-4" /> .txt
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {result.transcript.map((t, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-red-400 font-mono shrink-0 w-14">{t.time}</span>
                <span className="text-gray-300">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="w-10 h-10 text-red-500 animate-spin" /></div>}>
      <ResultContent />
    </Suspense>
  );
}
