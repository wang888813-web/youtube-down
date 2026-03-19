export default function ZhPrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
      <div className="space-y-6 text-gray-300">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
          {[
            "YTTools 不托管、存储或缓存任何视频或文件。",
            "我们不收集个人数据，不追踪用户，不共享信息。",
            "本服务仅供个人使用。",
          ].map((item, i) => (
            <p key={i} className="flex gap-2 text-sm"><span className="text-green-400 shrink-0">✓</span>{item}</p>
          ))}
        </div>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. 我们收集的信息</h2>
          <p>我们仅收集最少量的数据：您提交的 YouTube 链接和基本使用统计（页面浏览量、功能使用情况）。除非您创建账号，否则我们不收集个人信息。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. 数据使用方式</h2>
          <p>提交的链接仅用于提取字幕和生成 AI 摘要，处理完成后不会永久存储，将被立即删除。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Cookie</h2>
          <p>我们仅使用会话管理所必需的 Cookie，不使用任何第三方追踪 Cookie。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. 第三方服务</h2>
          <p>我们使用 AI API 处理字幕内容，您的内容可能仅出于处理目的发送至这些服务。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. 联系我们</h2>
          <p>如有隐私相关问题，请通过网站联系我们。</p>
        </section>
      </div>
    </div>
  );
}
