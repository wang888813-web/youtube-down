export default function ZhTermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">服务条款</h1>
      <div className="prose prose-invert space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. 接受条款</h2>
          <p>使用 YTTools 即表示您同意本服务条款。如不同意，请停止使用本服务。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. 仅限个人使用</h2>
          <p>本服务仅供个人非商业用途使用。您不得使用 YTTools 下载或处理您无权访问的内容。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. 版权声明</h2>
          <p>您有责任确保对下载内容的使用符合适用的版权法律。YTTools 不支持任何形式的版权侵权行为。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. 责任限制</h2>
          <p>YTTools 按"现状"提供，不附带任何形式的保证。对于因使用本服务而产生的任何损失，我们不承担责任。</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. 条款变更</h2>
          <p>我们保留随时修改本条款的权利。继续使用本服务即视为接受更新后的条款。</p>
        </section>
      </div>
    </div>
  );
}
