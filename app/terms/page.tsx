export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-invert space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By using YTTools, you agree to these terms. If you do not agree, please do not use the service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Personal Use Only</h2>
          <p>This service is intended for personal, non-commercial use only. You may not use YTTools to download or process content that you do not have the right to access.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Copyright</h2>
          <p>You are responsible for ensuring that your use of downloaded content complies with applicable copyright laws. YTTools does not condone copyright infringement.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
          <p>YTTools is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Changes</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </div>
  );
}
