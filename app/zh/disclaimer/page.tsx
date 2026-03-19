export default function ZhDisclaimerPage() {
  const items = [
    "本工具仅供下载您拥有版权或已获授权的视频使用。",
    "您必须拥有内容版权或获得版权所有者的许可。",
    "本站与 YouTube 或 Google 均无关联。",
    "我们不在服务器上存储任何视频文件。",
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">免责声明</h1>
      <p className="text-gray-400 mb-8">使用 YTTools 前请仔细阅读以下声明。</p>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
            <span className="text-red-500 font-bold text-lg shrink-0">{i + 1}.</span>
            <p className="text-gray-200">{item}</p>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">使用本服务即表示您同意遵守所有适用的版权和知识产权相关法律法规。</p>
    </div>
  );
}
