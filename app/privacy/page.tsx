export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>We collect minimal data: YouTube URLs you submit and basic usage analytics (page views, feature usage). We do not collect personal information unless you create an account.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Data</h2>
          <p>Submitted URLs are processed to extract transcripts and generate AI summaries. They are not stored permanently and are deleted after processing.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Cookies</h2>
          <p>We use essential cookies only for session management. No third-party tracking cookies are used.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Third Parties</h2>
          <p>We use AI APIs to process transcripts. Your content may be sent to these services solely for processing purposes.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Contact</h2>
          <p>For privacy concerns, please contact us through our website.</p>
        </section>
      </div>
    </div>
  );
}
