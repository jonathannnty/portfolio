import type { Metadata } from "next";
import Section from "../../components/section";

export const metadata: Metadata = {
  title: "Cookie Jar — Privacy Policy",
  description:
    "Privacy policy for Cookie Jar, a Chrome extension for cookie management.",
  openGraph: {
    title: "Cookie Jar — Privacy Policy",
    description:
      "Privacy policy for Cookie Jar, a Chrome extension for cookie management.",
    url: "/cookie-jar/privacy",
  },
};

export default function CookieJarPrivacyPage() {
  return (
    <Section
      eyebrow="Cookie Jar"
      title="Privacy Policy"
      titleAs="h1"
    >
      <div className="max-w-2xl space-y-10 text-[color:var(--color-fg-muted)]">
        <p className="text-sm">
          <span className="font-semibold text-[color:var(--color-fg)]">Last updated:</span> May 26, 2025
          <span className="mx-3 opacity-30">·</span>
          <span className="font-semibold text-[color:var(--color-fg)]">Developer:</span> Jonathan Ty —{" "}
          <a
            href="mailto:jonathanty42@gmail.com"
            className="underline underline-offset-2 hover:text-[color:var(--color-primary-700)]"
          >
            jonathanty42@gmail.com
          </a>
        </p>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Overview
          </h2>
          <p className="leading-relaxed">
            Cookie Jar is a Chrome extension that helps you understand and control the cookies
            websites place in your browser. This policy explains what data the extension accesses
            and how it is handled.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Data collected and stored
          </h2>

          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold text-[color:var(--color-fg)]">
              Blocked cookie log
            </h3>
            <p className="leading-relaxed">
              When Cookie Jar blocks a cookie, it records the timestamp, the website domain, and
              the cookie category (e.g. "tracking", "advertising") in your browser's local storage
              (<code className="font-mono text-sm">chrome.storage.local</code>). This log never
              leaves your device and is used only to power the Statistics panel within the
              extension.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold text-[color:var(--color-fg)]">
              Preferences
            </h3>
            <p className="leading-relaxed">
              Your cookie category preferences, mode settings, custom rules, and paused domains are
              stored in Chrome's sync storage (<code className="font-mono text-sm">chrome.storage.sync</code>).
              This data syncs across your signed-in Chrome instances so your preferences follow you.
              It is stored and managed entirely by Google Chrome — Cookie Jar does not transmit,
              process, or have server-side access to this data.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Data we do NOT collect
          </h2>
          <ul className="space-y-2 leading-relaxed">
            {[
              "Cookie Jar does not collect, transmit, or store any data on external servers.",
              "No browsing history, cookie values, or personally identifiable information is ever sent anywhere.",
              "The extension makes no network requests of its own.",
              "No analytics, crash reporting, or telemetry is included.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Third parties
          </h2>
          <p className="leading-relaxed">
            Cookie Jar shares no data with any third party. There are no SDKs, analytics libraries,
            advertising networks, or remote APIs in the extension.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Your controls
          </h2>
          <ul className="space-y-3 leading-relaxed">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]" />
              <span>
                <span className="font-semibold text-[color:var(--color-fg)]">Export / import:</span>{" "}
                You can export your preferences as a JSON file at any time from the extension's
                Settings panel.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]" />
              <span>
                <span className="font-semibold text-[color:var(--color-fg)]">Clear log:</span>{" "}
                The blocked cookie log can be cleared through your browser's extension storage
                (<code className="font-mono text-sm">chrome://settings/clearBrowserData</code>) or
                by uninstalling the extension.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]" />
              <span>
                <span className="font-semibold text-[color:var(--color-fg)]">Uninstall:</span>{" "}
                Removing Cookie Jar from Chrome deletes all locally stored data.
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Changes to this policy
          </h2>
          <p className="leading-relaxed">
            If this policy changes materially, the "Last updated" date above will be updated.
            Continued use of the extension after a change constitutes acceptance of the revised
            policy.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-fg)]">
            Contact
          </h2>
          <p className="leading-relaxed">
            Questions about this policy? Reach out at{" "}
            <a
              href="mailto:jonathanty42@gmail.com"
              className="underline underline-offset-2 hover:text-[color:var(--color-primary-700)]"
            >
              jonathanty42@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
