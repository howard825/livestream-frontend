import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Academy Radio 97.5 FM',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="mb-10">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl font-bold text-white">Terms of Service for Academy Radio 97.5 FM</h1>
          <p className="text-white/40 text-sm mt-2">Last Updated: September 9, 2026</p>
        </div>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <p>
            Welcome to the Academy Radio 97.5 FM mobile application (the &quot;Application&quot; or &quot;Service&quot;),
            operated and managed by Academy Radio 97.5 FM in collaboration with its technical
            infrastructure provider (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p>
            By downloading, accessing, or using the Application, you agree to be bound by these Terms
            of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Application.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. License and Scope of Use</h2>
            <ul className="space-y-2 pl-4">
              {[
                'We grant you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Application strictly for your personal, non-commercial enjoyment.',
                'You agree not to copy, decompile, reverse engineer, disassemble, modify, or create derivative works of the Application, its underlying source code, or audio streams.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Intellectual Property Rights</h2>
            <ul className="space-y-2 pl-4">
              {[
                'All live audio broadcasts, recorded shows, music programming, station identifiers, voiceovers, trade names, logos, and visual trademarks displayed in the Application are the proprietary property of Academy Radio 97.5 FM or their respective copyright holders.',
                'Commercial redistribution, unauthorized rebroadcasting, stream ripping, digital archiving, or public performance for monetary gain without prior written consent from the station management is strictly prohibited.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Service Availability and Stream Continuity</h2>
            <ul className="space-y-2 pl-4">
              {[
                'The Application delivers live streaming content over the internet. Transmission quality, availability, and stability depend on internet routing, ISP conditions, cellular network coverage, and server maintenance.',
                'While we strive for continuous 24/7 broadcast operations, the Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranty that the stream will be uninterrupted, error-free, or compatible with all network environments at all times.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Charges and Network Usage</h2>
            <p>
              Audio streaming consumes network bandwidth. You are solely responsible for any data usage
              fees, roaming charges, or ISP billing incurred while using the Application over mobile
              networks or Wi-Fi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Third-Party Links and Services</h2>
            <ul className="space-y-2 pl-4">
              {[
                'The Application may contain links or shortcuts directing you to external websites, social media pages (e.g., official Facebook Page), or email clients.',
                'We do not control or endorse the content, policies, or practices of external third-party platforms. Your interactions with third-party sites are governed exclusively by their respective terms and policies.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Academy Radio 97.5 FM, its owners,
              operators, and technology partners shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use or inability to use the
              Application, system downtime, or transmission delays.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Termination</h2>
            <p>
              We reserve the right to suspend, discontinue, or terminate stream feeds or modify the
              features of the Application at any time without prior liability or notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Governing Law</h2>
            <p>
              These Terms are governed by and constructed in accordance with the applicable laws and
              broadcasting regulations of the Republic of the Philippines, without regard to conflict
              of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Changes to These Terms</h2>
            <p>
              We reserve the right to revise or replace these Terms at our discretion. Any revisions
              take effect immediately upon updating this document. Continued use of the Application
              signifies your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Contact Information</h2>
            <p className="mb-4">
              For inquiries, legal notices, or technical feedback concerning these Terms:
            </p>
            <ul className="space-y-2 list-none pl-0">
              {([
                ['Broadcast Entity', 'Academy Radio 97.5 FM'],
                ['Station Location', 'Santa Cruz Santa Ana, Cagayan, Philippines'],
                ['Technical & Network Support', 'Howard Kingsley Ramos'],
                ['Official Website', 'stream.swifftnet.site/watch/advance-academy'],
              ] as [string, string][]).map(([label, value]) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="text-white/40 w-56 flex-shrink-0">{label}</span>
                  {label === 'Official Website' ? (
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
          <Link href="/privacy" className="hover:text-white/50 transition-colors">← Privacy Policy</Link>
          <Link href="/" className="hover:text-white/50 transition-colors">Home →</Link>
        </div>
      </main>
    </div>
  );
}
