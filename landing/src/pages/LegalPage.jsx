import { useEffect } from "react";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import Footer from "../components/landing/Footer";

const UPDATED_AT = "June 3, 2026";
const COMPANY_NAME = "W7S SERVICES LLC";

const CLOUDFLARE_REFERENCES = [
  {
    label: "Cloudflare Self-Serve Subscription Agreement",
    href: "https://www.cloudflare.com/terms/",
  },
  {
    label: "Cloudflare Service-Specific Terms",
    href: "https://www.cloudflare.com/service-specific-terms-application-services/",
  },
  {
    label: "Cloudflare for Platforms documentation",
    href: "https://developers.cloudflare.com/cloudflare-for-platforms/",
  },
  {
    label: "Cloudflare Workers for Platforms documentation",
    href: "https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/",
  },
];

const CLOUDFLARE_PRIVACY_REFERENCES = [
  {
    label: "Cloudflare Privacy Policy",
    href: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    label: "Cloudflare Data Processing Addendum",
    href: "https://www.cloudflare.com/cloudflare-customer-dpa/",
  },
  ...CLOUDFLARE_REFERENCES,
];

const TERMS_SECTIONS = [
  {
    title: "1. The Service",
    body: [
      "W7S is an open-source deployment platform for GitHub-native applications. The hosted Service receives build output from GitHub Actions, verifies the GitHub workflow context, and serves deployed applications from public URLs.",
      "The open-source W7S code is available under the MIT License. These Terms govern only the hosted Service operated by W7S. Self-hosted instances are governed solely by the applicable open-source license.",
    ],
  },
  {
    title: "2. Your Content and Ownership",
    body: [
      'You retain all ownership rights in your code, repositories, build artifacts, deployment logs, configuration, custom domains, and any other content you submit to the Service ("Your Content").',
      "You grant W7S a limited, worldwide, non-exclusive, royalty-free license to receive, store, process, transmit, cache, analyze, and serve Your Content solely as necessary to provide, secure, debug, and improve the Service.",
      "You are solely responsible for Your Content, including ensuring you have all necessary rights to deploy it and that it complies with applicable laws.",
    ],
  },
  {
    title: "3. GitHub Integration",
    body: [
      "The Service operates through GitHub Actions and GitHub OAuth. By using the Service, you authorize W7S to access necessary repository metadata, workflow information, commit data, and deployment artifacts using the permissions you grant via GitHub.",
      "You are responsible for managing repository access, workflow security, secret rotation, and GitHub permissions.",
    ],
  },
  {
    title: "4. Acceptable Use",
    body: [
      "You may not use the Service to:",
    ],
    list: [
      "Host, distribute, or promote malware, phishing, spam, scams, or illegal content",
      "Infringe intellectual property rights",
      "Engage in harassment, abuse, or harmful behavior",
      "Perform crypto mining, denial-of-service attacks, or unauthorized scanning",
      "Attempt to exploit, test, or abuse another tenant, customer, end user, repository, workflow, domain, or deployment without authorization",
      "Create or intentionally trigger cookie bombing, cross-site scripting, storage poisoning, credential theft, session fixation, header exhaustion, or similar attacks",
      "Bypass platform limits or engage in abusive automation",
      "Violate any applicable laws or regulations",
    ],
    afterList: [
      "We may monitor, throttle, suspend, or remove any deployment that violates these rules or poses a risk to the Service.",
    ],
  },
  {
    title: "5. Service Limits and Changes",
    body: [
      "The Service is provided on a best-effort basis with usage limits. We may modify features, limits, APIs, or infrastructure at any time. We will make reasonable efforts to notify users of material breaking changes.",
    ],
  },
  {
    title: "6. Billing and Payments",
    body: [
      "Usage of the Service may be free or metered according to our pricing page. You are responsible for all charges and taxes incurred through your account or authorized GitHub organizations.",
      "We use third-party payment processors, such as Stripe. Their terms also apply.",
      "Refunds: All payments are non-refundable. In exceptional cases, we may issue credits at our sole discretion.",
    ],
  },
  {
    title: "7. Data Handling and Security",
    body: [
      "We store Your Content only temporarily as needed to provide the Service and delete it as soon as operationally feasible, retaining the minimum data necessary for functionality, security, and billing.",
      "We use reasonable technical and organizational measures to protect the Service. However, no system is completely secure.",
      "You are responsible for the security of applications, code, dependencies, configuration, cookies, browser storage, authentication flows, authorization logic, headers, uploaded files, third-party scripts, and any data processing implemented by Your Content.",
      "You are responsible for preventing vulnerabilities in Your Content, including cross-site scripting, cookie leakage, cookie bombing, storage poisoning, insecure redirects, injection, broken access control, unsafe file handling, exposed secrets, and insecure dependency or workflow configuration.",
      "W7S may apply platform-level protections, filters, limits, monitoring, suspension, takedown, or other mitigations to protect the Service, other tenants, end users, or infrastructure. These measures do not make W7S responsible for securing Your Content or guarantee that attacks, vulnerabilities, data loss, unauthorized access, or service interruptions will not occur.",
      "Do not send sensitive regulated data, payment card information, health data, government IDs, etc. to the Service unless we have expressly agreed in writing.",
      "We use Stripe for billing and Simple Analytics for basic traffic statistics. These providers have their own privacy practices.",
    ],
  },
  {
    title: "8. Tenant Isolation and Shared Domains",
    body: [
      "Hosted W7S deployments may be served from organization subdomains under shared parent domains such as w7s.cloud. Each organization subdomain is treated as a separate tenant and a separate trust boundary.",
      "You must not set cookies, authentication state, authorization decisions, browser storage assumptions, or security controls that rely on trusting sibling subdomains or the shared parent domain.",
      "You are responsible for using host-only cookies, appropriate SameSite, Secure, and HttpOnly attributes, safe browser storage practices, content security policies, origin checks, CSRF protections, upload handling, and other application-level controls suitable for your deployment.",
      "W7S may remove, reject, rewrite, rate limit, or block traffic, headers, cookies, content, or deployments that appear to threaten tenant isolation, platform reliability, security, or legal compliance.",
    ],
  },
  {
    title: "9. Third-Party Services",
    body: [
      "The Service depends on third parties, including GitHub, infrastructure providers, DNS providers, and other service providers. We are not responsible for their performance or terms.",
    ],
  },
  {
    title: "10. Security Incidents and Abuse Response",
    body: [
      "You must promptly notify W7S at security@w7s.io if you discover a vulnerability, compromise, abusive use, unauthorized access, data exposure, or security incident involving the Service, Your Content, your deployment, your users, your GitHub organization, or credentials used with W7S.",
      "You are responsible for investigating, remediating, notifying affected parties, and complying with laws that apply to incidents caused by or involving Your Content, your repositories, your credentials, your users, your domains, your third-party services, or your configuration.",
      "W7S may investigate suspected abuse or security issues and may preserve logs, disable deploys, suspend traffic, remove content, rotate or revoke platform credentials, notify infrastructure providers, notify affected parties, or cooperate with legal process when we believe it is necessary to protect the Service, users, third parties, or the public.",
    ],
  },
  {
    title: "11. Indemnification",
    body: [
      "You agree to indemnify, defend, and hold harmless W7S, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses, including reasonable legal fees, arising from:",
    ],
    list: [
      "Your Content",
      "Your use of the Service",
      "Your applications, end users, data processing, privacy notices, security practices, authentication, authorization, cookies, browser storage, uploaded files, third-party scripts, domains, repositories, workflows, credentials, or dependencies",
      "Any vulnerability, attack, compromise, data breach, data loss, service interruption, abuse report, takedown request, regulatory inquiry, or third-party claim caused by or relating to Your Content, your configuration, your users, or your use of the Service",
      "Your violation of these Terms or applicable laws",
    ],
  },
  {
    title: "12. Disclaimers and Limitation of Liability",
    body: [
      'The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.',
      "To the fullest extent permitted by law, W7S disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
      "W7S does not warrant that the Service, any deployment, any tenant subdomain, any security control, or any third-party service will be uninterrupted, error-free, secure, immune from attack, free of vulnerabilities, or that data will not be lost, corrupted, disclosed, or accessed without authorization.",
      "W7S is not responsible for vulnerabilities, attacks, data exposure, data loss, legal claims, end-user claims, outages, or damages arising from Your Content, your application code, your dependencies, your GitHub workflows, your credentials, your configuration, your domains, your users, third-party services, or misuse of the Service by you or others.",
      "W7S will not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total aggregate liability shall not exceed the greater of USD $100 or the amount you paid to W7S in the six months preceding the claim.",
    ],
  },
  {
    title: "13. Termination",
    body: [
      "You may stop using the Service at any time. We may suspend or terminate your access if you violate these Terms, create risk for the Service, or fail to pay charges.",
      "Upon termination, we may delete Your Content according to our data retention practices.",
    ],
  },
  {
    title: "14. Governing Law and Dispute Resolution",
    body: [
      "These Terms are governed by the laws of the State of Wyoming, USA, without regard to conflict of laws principles.",
      "Any disputes shall be resolved exclusively in the state or federal courts located in Sheridan, Wyoming.",
    ],
  },
  {
    title: "15. DMCA and Copyright",
    body: [
      "We respect copyright and will respond to valid DMCA takedown notices. Please send notices to legal@w7s.io.",
    ],
  },
  {
    title: "16. Changes to These Terms",
    body: [
      'We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will update the "Last updated" date above.',
    ],
  },
  {
    title: "17. Contact",
    body: [
      "Questions about these Terms should be sent to: legal@w7s.io",
      COMPANY_NAME,
      "30 N Gould St, STE R",
      "Sheridan, WY 82801, USA",
    ],
  },
];

const PRIVACY_SECTIONS = [
  {
    title: "1. Scope",
    body: [
      `This Privacy Policy explains how ${COMPANY_NAME} collects and uses information when you visit w7s.io, read the documentation, use hosted W7S deployment services on w7s.cloud, call W7S APIs, or deploy through the W7S GitHub Action.`,
      "If you self-host W7S on infrastructure you control, W7S does not receive that self-hosted deployment data unless you separately send it to a hosted W7S service.",
    ],
  },
  {
    title: "2. Information W7S collects",
    body: [
      "Website and docs data: page views, referrers, browser and device details, approximate location derived from IP address, interaction data, cookies, and similar analytics information.",
      "GitHub and deployment data: repository owner, repository name, branch, commit SHA, workflow run metadata, GitHub Actions OIDC verification data, deploy archive metadata, custom domain declarations, configuration files, and generated deployment URLs.",
      "Runtime and operational data: request paths, status codes, timestamps, region or edge metadata, IP addresses, user agents, performance timings, error data, usage counters, bandwidth, storage, worker execution metrics, application logs, security events, cookie and header metadata, origin and referrer metadata, and abuse-prevention signals.",
      "Billing and contact data: email address, organization details, invoice data, and payment processor references if you use paid hosted features.",
    ],
  },
  {
    title: "3. How W7S uses information",
    body: [
      "W7S uses information to authenticate deploys, receive and serve applications, route custom domains, provide public URLs, calculate usage, enforce limits, detect abuse, debug failures, improve reliability, secure the platform, provide support, communicate service changes, and process billing where applicable.",
      "W7S does not sell your code, deploy artifacts, or personal information. W7S does not use your code, deploy artifacts, prompts, logs, or app content to train AI models unless you explicitly opt in or enter into a separate written agreement.",
    ],
  },
  {
    title: "4. Customer app data",
    body: [
      "Applications deployed on W7S may collect data from their own end users. The developer or organization that deploys the application is responsible for that application, its privacy notices, and its compliance obligations.",
      "Developers and organizations are responsible for explaining to their own end users how their deployed applications use cookies, browser storage, logs, analytics, authentication, uploaded files, and third-party services.",
      "W7S processes customer app traffic and logs only as needed to operate, secure, route, debug, measure, and enforce limits for hosted deployments.",
    ],
  },
  {
    title: "5. Cookies and analytics",
    body: [
      "W7S websites may use cookies, local storage, analytics tools, and session analytics to understand site usage and improve the product. Analytics may include page interactions and technical details about the browser session.",
      "You can control cookies through your browser settings. Blocking cookies may affect some features, but the documentation and public landing pages should generally remain readable.",
    ],
  },
  {
    title: "6. Sharing and subprocessors",
    body: [
      "W7S may share information with service providers that help operate the platform, including hosting and infrastructure providers, GitHub, analytics providers, support tools, billing providers, payment processors, abuse-prevention tools, and professional advisors.",
      "Hosted W7S services use Cloudflare as an infrastructure provider for routing, network delivery, programmable compute, storage, security, observability, and related platform operations. Cloudflare may process end-user traffic, IP addresses, request metadata, logs, network data, deploy artifacts, and other customer content as needed to provide those underlying services to W7S.",
      "Cloudflare privacy, data-processing, and service terms may apply to Cloudflare's processing as an infrastructure provider or subprocessor.",
      "W7S may also disclose information when required by law, to protect users or the service, to investigate abuse, to enforce terms, or as part of a merger, acquisition, financing, or transfer of assets.",
    ],
    links: CLOUDFLARE_PRIVACY_REFERENCES,
  },
  {
    title: "7. Retention",
    body: [
      "W7S keeps information for as long as needed to provide the service, comply with legal obligations, resolve disputes, enforce agreements, prevent abuse, and maintain security and reliability.",
      "Deploy artifacts, routing metadata, logs, usage data, and analytics data may have different retention periods. W7S may delete or aggregate older operational data when it is no longer needed.",
    ],
  },
  {
    title: "8. Security",
    body: [
      "W7S uses reasonable safeguards to protect information, including access controls and operational monitoring. No system is perfectly secure, and you are responsible for securing your repositories, workflows, secrets, dependencies, and application code.",
      "W7S may monitor, inspect, filter, block, or retain security-relevant metadata to detect abuse, investigate vulnerabilities, enforce tenant isolation, respond to attacks, and protect the Service.",
      "If you believe you found a security issue, contact security@w7s.io.",
    ],
  },
  {
    title: "9. International processing",
    body: [
      "W7S and its service providers may process information in countries other than where you live. By using W7S, you understand that information may be processed and stored in those locations, subject to applicable law.",
    ],
  },
  {
    title: "10. Your choices and rights",
    body: [
      "You can stop using hosted W7S services, remove workflow configuration from a repository, rotate or revoke GitHub credentials, remove a custom domain declaration, or request deletion of hosted deployment data where applicable.",
      "Depending on where you live, you may have rights to access, correct, delete, export, or object to certain processing of personal information. Requests can be sent to privacy@w7s.io.",
    ],
  },
  {
    title: "11. Children",
    body: [
      "W7S is intended for developers and organizations. It is not directed to children under 13, and W7S does not knowingly collect personal information from children under 13.",
    ],
  },
  {
    title: "12. Updates and contact",
    body: [
      "W7S may update this Privacy Policy from time to time. The updated date above shows when this page was last changed.",
      "Questions or privacy requests can be sent to privacy@w7s.io.",
    ],
  },
];

const LEGAL_PAGES = {
  terms: {
    title: "Terms of Service",
    eyebrow: "// legal",
    description:
      "The public terms for using W7S websites, hosted deploys, APIs, GitHub Action integrations, and related services.",
    intro: [
      `${COMPANY_NAME} ("W7S", "we", "us", or "our") operates w7s.io, w7s.cloud, and the hosted W7S services. These Terms of Service ("Terms") govern your access to and use of W7S websites, documentation, hosted deployment endpoints, APIs, GitHub Actions integrations, and related services (collectively, the "Service").`,
      "By using the Service, you agree to these Terms. If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms. If you do not agree to these Terms, do not use the Service.",
    ],
    icon: FileText,
    sections: TERMS_SECTIONS,
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "// privacy",
    description:
      "How W7S collects, uses, shares, and retains information for the website, docs, hosted deploys, APIs, and GitHub Action integrations.",
    icon: ShieldCheck,
    sections: PRIVACY_SECTIONS,
  },
};

function LegalHeader({ page }) {
  const Icon = page.icon;

  return (
    <header className="border-b border-white/10 bg-[#050505]/95">
      <div className="mx-auto flex min-h-16 max-w-[1400px] flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <a href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tighter text-white">W7S</span>
          <span className="hidden border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:inline-block">
            legal
          </span>
        </a>
        <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-zinc-400">
          <a href="/" className="hover:text-amber-400 transition-colors">
            Home
          </a>
          <a href="/docs/" className="hover:text-amber-400 transition-colors">
            Docs
          </a>
          <a href="/status" className="hover:text-amber-400 transition-colors">
            Status
          </a>
          <a
            href="https://github.com/w7s-io"
            className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 pb-14 pt-10 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="flex items-center gap-3 text-amber-400">
          <Icon className="h-5 w-5" strokeWidth={2} />
          <p className="text-[10px] uppercase tracking-[0.3em]">{page.eyebrow}</p>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.9] text-white sm:text-6xl lg:text-7xl">
          {page.title}
        </h1>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {page.description}
        </p>
        <div className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
          Last updated {UPDATED_AT}
        </div>
      </div>
    </header>
  );
}

export default function LegalPage({ type }) {
  const page = LEGAL_PAGES[type] || LEGAL_PAGES.terms;

  useEffect(() => {
    document.title = `W7S ${page.title}`;
  }, [page.title]);

  return (
    <div className="relative z-10 min-h-screen bg-[#050505] text-zinc-100">
      <LegalHeader page={page} />
      <main className="mx-auto max-w-[1100px] px-6 py-14 lg:px-10 lg:py-20">
        {page.intro ? (
          <div className="mb-12 border-l-2 border-amber-400/70 pl-5 text-sm leading-relaxed text-zinc-300">
            <div className="space-y-4">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-10">
          {page.sections.map((section) => (
            <section key={section.title} className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.afterList
                  ? section.afterList.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))
                  : null}
                {section.links ? (
                  <ul className="space-y-2 pt-2 font-mono text-xs leading-relaxed">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-400 underline decoration-amber-400/30 underline-offset-4 transition-colors hover:text-amber-300 hover:decoration-amber-300"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
