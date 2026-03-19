export default function DisclaimerPage() {
  const items = [
    "YTTools is for personal use only.",
    "You must own the content or have permission from the copyright owner.",
    "We are not affiliated with YouTube or Google.",
    "We do NOT store any video files on our servers.",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="text-gray-400 mb-8">Please read this disclaimer carefully before using YTTools.</p>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
            <span className="text-red-500 font-bold text-lg shrink-0">{i + 1}.</span>
            <p className="text-gray-200">{item}</p>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">
        By using this service, you agree to comply with all applicable laws and regulations regarding copyright and intellectual property.
      </p>
    </div>
  );
}
