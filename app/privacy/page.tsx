import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Academy Radio 97.5 FM',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="mb-10">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl font-bold text-white">Privacy Policy for Academy Radio 97.5 FM</h1>
          <p className="text-white/40 text-sm mt-2">Last Updated: September 9, 2026</p>
        </div>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <p>
            Academy Radio 97.5 FM (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the Academy Radio 97.5 FM
            mobile application (the &quot;Service&quot;). This page informs users regarding our policies
            regarding the collection, use, and disclosure of personal data when using our Service,
            in strict compliance with the Google Play Developer Program Policies and applicable
            data privacy regulations.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Information Collection and Use</h2>
            <p className="mb-3">
              We do not collect, store, sell, or share any personal identifiable information (PII).
            </p>
            <p>
              The Academy Radio 97.5 FM mobile application functions solely as an online radio
              streaming player. Users can access the live broadcast stream without creating an
              account, registering personal details, or logging in.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Device Permissions and Usage</h2>
            <p className="mb-4">
              To provide reliable audio playback, the application requests the following Android
              system permissions:
            </p>
            <ul className="space-y-3 list-none pl-0">
              {[
                {
                  perm: 'INTERNET & ACCESS_NETWORK_STATE',
                  desc: 'Allows the app to establish a secure HTTP/HTTPS connection to retrieve the live audio stream hosted via Swifftnet infrastructure (stream.swifftnet.site) and detect active network connectivity (Wi-Fi / Cellular data).',
                },
                {
                  perm: 'WAKE_LOCK & FOREGROUND_SERVICE / FOREGROUND_SERVICE_MEDIA_PLAYBACK',
                  desc: 'Permits the app to maintain uninterrupted live audio playback when the device screen is off, while navigating between screens, or while using other applications.',
                },
                {
                  perm: 'POST_NOTIFICATIONS (Android 13+)',
                  desc: 'Enables the system media notification drawer and lock-screen playback controls (Play, Pause, Stop), allowing users to control stream playback externally.',
                },
              ].map(({ perm, desc }) => (
                <li key={perm} className="p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="text-white font-medium text-sm block mb-1 font-mono">{perm}</span>
                  <span className="text-sm">{desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm p-3 rounded-lg bg-brand-900/20 border border-brand-700/20 text-white/50">
              <span className="text-white/70 font-medium">Note:</span> The application does not
              access your camera, microphone, device storage, contact list, precise GPS location,
              or SMS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Services and External Links</h2>
            <p className="mb-4">
              Our application includes options for users to interact with external platforms:
            </p>
            <ul className="space-y-3 list-none pl-0">
              {[
                {
                  title: 'Direct Links',
                  desc: 'Links to our official Facebook Page, website, or email app (mailto: link for song requests). Clicking these links redirects you directly to the respective external third-party platform or browser, which operates under its own distinct privacy policies.',
                },
                {
                  title: 'Content Delivery & CDN',
                  desc: 'Audio stream delivery is handled securely over standard HTTP/HLS transmission protocols without tracking user-specific browsing histories.',
                },
              ].map(({ title, desc }) => (
                <li key={title} className="flex gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                  <span><span className="text-white font-medium">{title}:</span> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Children&apos;s Privacy (Family &amp; COPPA Compliance)</h2>
            <p>
              The Service does not address anyone under the age of 13 intentionally to collect
              personal information. Because our application collects no personal information
              whatsoever, it complies fully with the Children&apos;s Online Privacy Protection Act
              (COPPA) and international standards for general audience multimedia applications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Security</h2>
            <p>
              We value the security of your data. The connection to our live stream server is
              handled through standard encrypted protocols. Because we do not store, process, or
              transmit personal databases, user information is neither logged nor vulnerable to
              unauthorized third-party access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy periodically to reflect app updates or regulatory
              compliance. Any changes will be posted on this page with an updated &quot;Last Updated&quot;
              date. Continued use of the application after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions, suggestions, or concerns regarding this Privacy Policy
              or the Academy Radio 97.5 FM application, you may contact us at:
            </p>
            <ul className="space-y-2 list-none pl-0">
              {([
                ['Developer Support', 'Swifftnet Network & Development Team'],
                ['Email', 'ramoshowardkingsley58@gmail.com'],
                ['Station Location', 'Santa Cruz, Santa Ana, Cagayan, Philippines'],
                ['Website', 'stream.swifftnet.site'],
              ] as [string, string][]).map(([label, value]) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="text-white/40 w-44 flex-shrink-0">{label}</span>
                  {label === 'Email' ? (
                    <a href={`mailto:${value}`} className="text-brand-400 hover:text-brand-300 transition-colors">{value}</a>
                  ) : label === 'Website' ? (
                    <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 transition-colors">{value}</a>
                  ) : (
                    <span className="text-white/70">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-sm text-white/30">
          <Link href="/" className="hover:text-white/50 transition-colors">← Home</Link>
          <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service →</Link>
        </div>
      </main>
    </div>
  );
}