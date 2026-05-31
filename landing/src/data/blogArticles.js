export const blogArticles = [
  {
    slug: "w7s-vs-vercel-github-native-deploys-without-a-dashboard",
    title: "W7S vs Vercel: GitHub-Native Deploys Without a Dashboard",
    category: "Alternatives",
    readingTime: "6 min",
    summary:
      "A practical comparison of Vercel's dashboard-led workflow and W7S's GitHub-native deploy path, where the repository stays in charge.",
    sections: [
      {
        heading: "The difference is where control lives",
        paragraphs: [
          "Vercel is built around a polished hosted workflow: connect a project, let the platform watch the repo, and manage the rest from a product dashboard. That can feel effortless, especially when a team wants conventional previews and a familiar UI for every project.",
          "W7S starts from a different premise. The repository and its GitHub Actions workflow should be enough to ship the app. The deploy token is the GitHub token, the archive comes from CI, and the public URL is derived from the GitHub owner and repository.",
          "That changes the daily rhythm. A deployment is no longer a thing hidden behind project settings; it is a workflow file someone can review, copy, test, and change in the same pull request as the app."
        ]
      },
      {
        heading: "What you trade",
        paragraphs: [
          "The tradeoff is intentional. W7S does not try to copy every hosted platform workflow. It focuses on direct deploys, repo-scoped environments, backend bindings, usage accounting, and self-hostability.",
          "If your team wants a visual project dashboard with managed previews and commercial integrations, Vercel may still fit. If you want deploy behavior that is explicit, auditable, and portable, W7S is designed for that path.",
          "The interesting part is not that one model is universally better. It is that teams now have a real choice between outsourcing the deployment surface and keeping more of that surface in code."
        ]
      }
    ]
  },
  {
    slug: "w7s-vs-netlify-static-sites-backends-storage-one-repo",
    title: "W7S vs Netlify: Static Sites, Backends, and Storage From One Repo",
    category: "Alternatives",
    readingTime: "6 min",
    summary:
      "How W7S keeps static sites, backend handlers, and storage declarations together as projects grow beyond a simple frontend.",
    sections: [
      {
        heading: "Beyond static hosting",
        paragraphs: [
          "Netlify helped make static deploys feel simple: push a frontend, get a URL, attach the extras when the site needs more. That workflow is still attractive, but many projects stop being purely static long before they become large applications.",
          "W7S can publish static assets and a JavaScript or TypeScript backend from the same repository archive. A React frontend can live beside a native backend route, with W7S deciding the static-or-backend routing at runtime.",
          "That matters when a project starts as a landing page and grows into an app. You do not need to move the project to a different platform just because it needs a small API, queue, schedule, or persistent database binding."
        ]
      },
      {
        heading: "Storage follows the repository",
        paragraphs: [
          "W7S storage bindings are declared in `w7s.json`. The platform provisions resources per repository and environment, then reuses them on later deploys. That keeps state close to the deployment contract instead of scattered across console setup steps.",
          "The result is a repo that explains how it runs: build commands in GitHub Actions, runtime shape in `w7s.json`, and public URLs derived from the GitHub owner and repository.",
          "For small teams, that clarity is the practical win. The person reviewing a feature branch can see not only the UI change, but also the storage, route, and background-work shape that will ship with it."
        ]
      }
    ]
  },
  {
    slug: "w7s-vs-cloudflare-pages-deploy-platform-not-just-primitives",
    title: "W7S vs Cloudflare Pages: When You Want a Deploy Platform, Not Just Primitives",
    category: "Alternatives",
    readingTime: "6 min",
    summary:
      "Cloudflare offers powerful building blocks. W7S turns a focused set of those blocks into a GitHub-native app platform.",
    sections: [
      {
        heading: "Primitives are not the same as a product workflow",
        paragraphs: [
          "Cloudflare gives developers a deep set of building blocks: Workers, object storage, key-value storage, databases, queues, workflows, and more. Those primitives are powerful, and they are one reason W7S can stay small.",
          "The hard part is not always the primitive itself. Teams still need conventions for deploys, URLs, resource naming, branch isolation, access control, and the question every new repo asks: what exactly do I do first?",
          "W7S takes a platform stance on those conventions. A GitHub repository deploys to predictable URLs, branch environments get isolated resource names, and app bindings are generated from a small manifest."
        ]
      },
      {
        heading: "Why the wrapper matters",
        paragraphs: [
          "The wrapper saves repeated setup decisions. Instead of wiring every project directly to raw platform resources, W7S creates a repo-level deployment contract that can be reused across static sites, fullstack apps, and native backends.",
          "You still benefit from edge-native infrastructure, but the workflow feels more like shipping an app than assembling infrastructure every time.",
          "That distinction becomes visible after the third or fourth small project. The best platform is often the one that removes the most choices you did not actually want to make again."
        ]
      }
    ]
  },
  {
    slug: "w7s-vs-railway-and-fly-edge-native-apps-without-managing-services",
    title: "W7S vs Railway and Fly.io: Edge-Native Apps Without Managing Services",
    category: "Alternatives",
    readingTime: "6 min",
    summary:
      "When an app fits an edge-native model, W7S can remove the service-management layer that heavier runtimes require.",
    sections: [
      {
        heading: "Different runtime assumptions",
        paragraphs: [
          "Railway and Fly.io are strong choices when you need process-oriented services, custom containers, private networking, or long-running server workloads. They are built for apps that need a real process with real operational knobs.",
          "W7S is aimed at a different shape: apps that fit edge-native request handlers, static assets, and managed bindings. You do not choose a region, size a process, or keep a tiny service warm just in case traffic arrives.",
          "For those apps, not having to operate always-on services is the point. You publish a repository archive, W7S wires the runtime and bindings, and requests route through the shared control plane."
        ]
      },
      {
        heading: "Less infrastructure to babysit",
        paragraphs: [
          "The cost and operational savings come from avoiding idle services, manually managed sidecars, and separate deployment targets for every small app. Static assets, native backends, key-value data, object files, queues, schedules, and workflows can share one deployment model.",
          "That smaller surface changes what a solo builder or lean team can ship. A side project with a form, upload path, queue, and admin endpoint should not automatically become a miniature infrastructure program.",
          "If you need full containers, use the platform that matches that need. If you need GitHub-native edge apps, W7S keeps the surface smaller."
        ]
      }
    ]
  },
  {
    slug: "self-hosting-w7s-run-your-own-github-native-cloud",
    title: "Self-Hosting W7S: Run Your Own GitHub-Native Cloud",
    category: "Self-hosting",
    readingTime: "6 min",
    summary:
      "W7S can run as your own deployment cloud on a Cloudflare account and domain you control, without changing the app workflow.",
    sections: [
      {
        heading: "Hosted is not the only mode",
        paragraphs: [
          "The hosted `w7s.cloud` service is one W7S deployment. The same core can be deployed under your own domain, using your own Cloudflare account resources and GitHub repositories.",
          "That gives teams a path many app platforms do not offer: start with the hosted service, then run the same style of cloud yourself when ownership, compliance, cost controls, or internal conventions require it.",
          "The important word is same. Self-hosting should not mean relearning the entire deploy story or rewriting every project around a private fork of your infrastructure."
        ]
      },
      {
        heading: "What stays the same",
        paragraphs: [
          "The deployment shape stays familiar. App repositories still use the W7S GitHub Action, but point it at your self-hosted deploy endpoint. URLs are derived from the GitHub owner and repo under your domain, and branch environments use the same prefix model.",
          "Self-hosting is not about abandoning the workflow. It is about owning the control plane that receives those deploys.",
          "That can be the difference between renting convenience forever and keeping a practical escape hatch. You still move quickly, but the long-term operating model belongs to you."
        ]
      }
    ]
  },
  {
    slug: "why-deploy-from-github-actions-instead-of-a-cloud-dashboard",
    title: "Why Deploy From GitHub Actions Instead of a Cloud Dashboard?",
    category: "Workflow",
    readingTime: "6 min",
    summary:
      "A deploy workflow in code is easier to review, copy, audit, and reproduce than settings spread across a platform dashboard.",
    sections: [
      {
        heading: "CI is already the release boundary",
        paragraphs: [
          "Most teams already trust GitHub Actions to install dependencies, run tests, build apps, and gate merges. The release boundary is already there; deploy is often the only part that gets pushed into a separate product UI.",
          "Letting that same workflow package and deploy the app keeps release behavior in one place. The person reviewing the workflow can see the build command, the environment, the deploy target, and the permissions in plain text.",
          "W7S leans into that. The action sends the repository, branch, commit, and archive to the deploy API. The cloud verifies the token against GitHub and publishes the app."
        ]
      },
      {
        heading: "Fewer invisible settings",
        paragraphs: [
          "Dashboard configuration tends to become hidden infrastructure. A new teammate can read the repository but still miss the settings that decide production behavior.",
          "A GitHub Actions deploy file makes the install command, build command, deploy directory, secrets, variables, and environment override visible in code review.",
          "That does not make dashboards bad. It makes code a better home for release rules that must survive team changes, audits, forks, and the next person trying to understand why production works the way it does."
        ]
      }
    ]
  },
  {
    slug: "migrating-a-static-site-from-vercel-or-netlify-to-w7s",
    title: "Migrating a Static Site From Vercel or Netlify to W7S",
    category: "Migration",
    readingTime: "6 min",
    summary:
      "Most static site migrations to W7S are a matter of moving the build into GitHub Actions and deploying the output directory.",
    sections: [
      {
        heading: "Keep the build where it is easiest to see",
        paragraphs: [
          "A static site migration sounds bigger than it usually is. The core path is still checkout, install, build, and publish the generated files. W7S simply asks that those steps be visible in `.github/workflows/deploy.yml`.",
          "If the build output is `dist/`, `build/`, or another supported directory, W7S can publish it as static assets. If the deployable output lives in a generated directory, pass `working-directory` to the action.",
          "That keeps the migration honest. You are not recreating a project in a dashboard; you are writing down the exact build steps the site already depends on."
        ]
      },
      {
        heading: "URLs and domains",
        paragraphs: [
          "The default URL is based on the GitHub owner and repo, such as `https://owner.w7s.cloud/repo/`. A same-name repository can serve the owner root. Custom domains are declared with a `CNAME` file and verified through DNS ownership rules.",
          "That gives static sites a path from first deploy to custom domain without creating a separate app record by hand.",
          "The best migration test is boring: push a branch, confirm the generated URL, compare the rendered site, then move the domain only after the workflow is repeatable."
        ]
      }
    ]
  },
  {
    slug: "migrating-a-fullstack-javascript-app-to-w7s",
    title: "Migrating a Fullstack JavaScript App to W7S",
    category: "Migration",
    readingTime: "6 min",
    summary:
      "Move the frontend, backend handler, and platform bindings into a repository shape W7S can detect and reproduce.",
    sections: [
      {
        heading: "Split the runtime shape clearly",
        paragraphs: [
          "A fullstack migration works best when the repository tells a clear story. Which directory produces static assets? Which file handles requests? Which resources does the app expect at runtime?",
          "W7S detects static frontend output and native backend entrypoints from the uploaded archive. A common shape is `frontend/dist/` for assets and `backend/index.ts` or `worker/index.ts` for the request handler.",
          "Framework SSR outputs can also work when they produce a server entrypoint and client assets. The important part is that CI builds the project before the W7S action packages it."
        ]
      },
      {
        heading: "Move platform needs into bindings",
        paragraphs: [
          "Instead of hardcoding provider credentials, declare W7S-managed bindings in `w7s.json`. Key-value stores, files, serverless databases, queues, schedules, workflows, and internal service bindings can all become part of the deploy contract.",
          "That makes the app easier to promote across production and branch environments because resource names and tokens are generated for each environment.",
          "A good migration leaves less mystery behind than it found. The repo should explain the app, the runtime, and the resources well enough that the next deploy is routine."
        ]
      }
    ]
  },
  {
    slug: "replacing-serverless-functions-with-w7s-native-backends",
    title: "Replacing Serverless Functions With W7S Native Backends",
    category: "Backends",
    readingTime: "6 min",
    summary:
      "A W7S native backend gives small apps one request handler, injected bindings, and routing logic that stays in code.",
    sections: [
      {
        heading: "One backend entrypoint",
        paragraphs: [
          "Serverless function platforms often encourage many small files mapped to routes. That can be convenient at first, then awkward once shared middleware, auth, logging, and error handling start appearing in every function.",
          "W7S uses a native backend entrypoint that receives requests and decides routing in code. The result feels closer to a small service than a folder of disconnected handlers.",
          "That model works well with lightweight routers such as Hono, but it does not require a specific framework. The default export just needs to handle `fetch(request, env, ctx)`."
        ]
      },
      {
        heading: "Bindings are injected",
        paragraphs: [
          "Native backends receive environment bindings from W7S. That can include key-value stores, file buckets, databases, AI, internal RPC, queues, and workflow services.",
          "The backend remains normal JavaScript or TypeScript, but the deployment environment is produced by the platform instead of manually assembled in a dashboard.",
          "The payoff is composability. A route can read from KV, enqueue a job, write a file, and call another backend without each capability turning into a separate credential-management exercise."
        ]
      }
    ]
  },
  {
    slug: "deploy-preview-alternatives-branch-environments-in-w7s",
    title: "Deploy Preview Alternatives: Branch Environments in W7S",
    category: "Workflow",
    readingTime: "6 min",
    summary:
      "W7S uses branch-derived environments for non-production deploys, giving previews their own URLs and managed resources.",
    sections: [
      {
        heading: "Branches become environments",
        paragraphs: [
          "Preview deploys are useful because they make review concrete. Instead of imagining what a branch will do, reviewers can open a URL and test the actual build.",
          "`main` and `master` deploy to `production`. Other branches are normalized into DNS-safe environment names and served from branch-prefixed hosts like `https://feature-login--owner.w7s.cloud/repo/`.",
          "That gives reviewers a predictable URL without needing a platform dashboard to discover it."
        ]
      },
      {
        heading: "Isolation is the real feature",
        paragraphs: [
          "Branch environments are not only about URLs. Managed resources are scoped by repository and environment, so a feature branch can test storage, queues, schedules, or workflow changes without sharing the production binding names.",
          "For teams that review infrastructure changes in branches, that model keeps preview behavior close to the code.",
          "The result is a more honest preview. You are not just looking at a static screenshot of the frontend; you are exercising the app with the resources and runtime shape that branch asked for."
        ]
      }
    ]
  },
  {
    slug: "custom-domains-without-a-platform-account-system",
    title: "Custom Domains Without a Platform Account System",
    category: "Domains",
    readingTime: "6 min",
    summary:
      "W7S custom domains are declared from the repository and verified through DNS ownership rules instead of dashboard-only settings.",
    sections: [
      {
        heading: "The repository declares the hostname",
        paragraphs: [
          "Custom domains are often treated as platform account settings, which makes them easy to forget and hard to review. The app depends on the hostname, but the hostname lives somewhere outside the app.",
          "A W7S app can include a `CNAME` file with one or more hostnames. During deploy, W7S reads that file and stores custom-domain mappings for the deployment.",
          "This keeps the custom domain close to the application source instead of turning it into a hidden dashboard setting."
        ]
      },
      {
        heading: "DNS still decides ownership",
        paragraphs: [
          "The domain owner points DNS at the W7S cloud. For stronger ownership control, an `_w7s.<zone>` TXT record can allow a whole GitHub owner or an exact `owner/repo`.",
          "That model is simple enough for small apps but still gives domain owners a way to prevent unwanted claims.",
          "It also keeps the trust boundary where it belongs. The repository can request a hostname, but DNS decides whether that request should be honored."
        ]
      }
    ]
  },
  {
    slug: "serverless-database-without-adding-a-separate-provider",
    title: "Serverless Database Without Adding a Separate Provider",
    category: "Storage",
    readingTime: "6 min",
    summary:
      "For app-local relational data, a W7S-managed database can remove another account, token, and provisioning workflow.",
    sections: [
      {
        heading: "Declare the database with the app",
        paragraphs: [
          "A small app should not need a procurement story before it can store a row. For notes, settings, tenant metadata, product catalogs, and internal tools, the database often belongs to the app more than it belongs to a separate platform account.",
          "A W7S native backend can declare a database binding in `w7s.json`. W7S provisions the resource per repository and environment, then injects it into the backend as `env.DB` or the binding name you choose.",
          "Migrations can live in the repository, so schema changes travel with the app deploy rather than through a separate manual operation."
        ]
      },
      {
        heading: "Good default for app-local data",
        paragraphs: [
          "This is a strong fit for notes, settings, tenant metadata, product catalogs, internal dashboards, and prototypes that need SQL without running a separate database service.",
          "If the app needs an existing external Postgres service, W7S can bind that too. The point is to make the simple path simple before adding more infrastructure.",
          "That default matters because database decisions tend to harden quickly. Starting with a repo-scoped binding gives the app a real persistence layer without turning the first deploy into a platform migration."
        ]
      }
    ]
  },
  {
    slug: "backend-queues-cron-and-workflows-without-extra-infrastructure",
    title: "Backend Queues, Cron, and Workflows Without Extra Infrastructure",
    category: "Backends",
    readingTime: "6 min",
    summary:
      "Background work can be declared with the app instead of assembled from separate queue, scheduler, and worker services.",
    sections: [
      {
        heading: "Queues and schedules belong near code",
        paragraphs: [
          "The first background job in a product is usually modest: send an email later, process an upload, refresh a cache, or sweep old records. The infrastructure people reach for can be much larger than the job itself.",
          "A backend that needs background work can declare queues and schedules in `w7s.json`. W7S provisions the platform resources and routes delivery back to the declaring backend.",
          "That avoids the common small-app pattern of adding a separate queue vendor, a scheduler account, and a worker service before the product has enough traffic to justify the complexity."
        ]
      },
      {
        heading: "Workflows for durable steps",
        paragraphs: [
          "When a job needs retries or durable status, W7S workflows give the backend a platform-managed runner while keeping the app-facing API simple.",
          "The deployment stays GitHub-native: the same repo describes the HTTP routes, background consumers, and workflow entrypoints.",
          "This keeps background work from becoming a separate universe. The app code, deploy workflow, and operational shape stay close enough that a reviewer can understand the whole path."
        ]
      }
    ]
  },
  {
    slug: "replacing-nats-with-w7s-components",
    title: "Replacing NATS With W7S Components",
    category: "Architecture",
    readingTime: "9 min",
    summary:
      "Map NATS-style request/reply, queues, pub/sub, durable streams, schedules, and workflows onto W7S-native components before adding a broker.",
    sections: [
      {
        heading: "Start with the behavior, not the broker",
        paragraphs: [
          "NATS is a strong general-purpose messaging system. It gives teams subjects, request/reply, publish/subscribe, queue groups, JetStream persistence, and a fast broker that can sit between many services.",
          "W7S does not need to copy that model to support the same application patterns. In many W7S apps, adding NATS would introduce another control plane, another credential model, another operational surface, and another local development story.",
          "The better default is to ask whether the same product behavior can be built from W7S components that already exist: RPC, queues, schedules, workflows, DB, KV, R2, and `w7s-local`."
        ]
      },
      {
        heading: "Request reply maps to backend RPC",
        paragraphs: [
          "NATS request/reply is usually a service call: auth returns a session, billing returns entitlement state, or an internal API returns a computed result. That maps cleanly to W7S Backend RPC.",
          "A caller uses `env.W7S_RPC.fetch(\"https://w7s.internal/api/v1/rpc/<owner>/<repo>/<path>\")` with its W7S deployment token. W7S resolves the caller from the token, loads the target deployment in the same environment, applies authorization rules, and dispatches directly to the target backend.",
          "That keeps the call HTTP-shaped and easy to debug while preserving repository identity, branch environment isolation, same-owner defaults, cross-owner allowlists, and usage accounting."
        ],
        code: `const response = await env.W7S_RPC.fetch(
  "https://w7s.internal/api/v1/rpc/acme/auth/session",
  {
    headers: {
      authorization: \`Bearer \${env.W7S_RPC_TOKEN}\`,
      cookie: request.headers.get("cookie") ?? ""
    }
  }
);`
      },
      {
        heading: "Work queues map to W7S queues",
        paragraphs: [
          "When a caller does not need an immediate result, W7S queues are the direct replacement. The target repository declares the queue in `w7s.json`, and producers send JSON messages through the `W7S_QUEUE` binding.",
          "The consumer receives batches at its configured backend path. That keeps ownership clear: the app that owns the work also owns the consumer route, retry behavior, and data model.",
          "This covers upload processing, emails, cache refreshes, low-priority sync jobs, and other asynchronous tasks without adding a separate queue vendor or broker."
        ],
        code: `{
  "queues": [
    {
      "name": "jobs",
      "consumer": "/_w7s/queues/jobs"
    }
  ]
}`
      },
      {
        heading: "Pub sub becomes explicit event fanout",
        paragraphs: [
          "NATS subjects are useful because publishers do not need to know every subscriber. The tradeoff is that the broker becomes the place where important topology lives.",
          "A W7S-native version can be explicit: an event router receives a publish request, authenticates the publisher, looks up deployment subscription metadata, and forwards one message to each subscriber queue.",
          "That is less dynamic than wildcard subjects, but easier to review from a repository. The repo declares what it emits and what it consumes, and W7S can reuse queue provisioning, queue delivery, environment scoping, and usage accounting."
        ],
        code: `{
  "events": {
    "publish": ["orders.created"],
    "subscribe": [
      {
        "subject": "orders.created",
        "queue": "orders"
      }
    ]
  },
  "queues": ["orders"]
}`
      },
      {
        heading: "JetStream-like needs split into storage plus delivery",
        paragraphs: [
          "JetStream persistence is not one feature. It can mean audit history, replay, large payload storage, latest state by key, or durable delivery after writing an event.",
          "In W7S, use Serverless DB for indexed event records, KV for latest small state, R2 for large payloads, queues for async delivery, and workflows for repair or replay operations that need durable steps.",
          "That does not reproduce every JetStream consumer policy. It gives the application explicit storage, query, replay, and delivery behavior using resources already scoped per repository and environment."
        ]
      },
      {
        heading: "Schedules and workflows cover orchestration",
        paragraphs: [
          "If a subject is mostly fed by cron jobs, W7S schedules are the cleaner primitive. The app declares the cron expression and the backend path that should receive it.",
          "If the use case is actually orchestration rather than messaging, W7S workflows fit better than raw pub/sub. They provide a named process boundary, durable dispatch, retries, and status around multi-step work.",
          "That distinction keeps the platform honest: queues move work, schedules create time-based work, workflows coordinate long-running work, and RPC handles synchronous service calls."
        ]
      },
      {
        heading: "Try the event router locally",
        paragraphs: [
          "The docs repo includes a runnable `examples/w7s-local-native-events` suite for this pattern. It starts three local W7S repos with `w7s-local`: an `order-api` publisher, an `event-router` fanout service, and an `email-worker` queue consumer.",
          "The test path creates an order, routes an `orders.created` event, and verifies that the subscriber received a queue-shaped delivery, all without running NATS or another broker."
        ]
      },
      {
        heading: "Where NATS still wins",
        paragraphs: [
          "W7S should not pretend to replace every NATS capability today. Dynamic wildcard subscriptions, high-volume many-subscriber streams, long-lived service subscriptions, broker clustering, leaf-node topologies, and mature JetStream consumer semantics are real NATS strengths.",
          "If an app depends on those features directly, NATS can still be the right external service. W7S compatibility would then mean making it possible to connect to that service explicitly, not quietly turning W7S into a broker platform.",
          "For the default W7S path, the recommendation is different: use RPC, queues, schedules, workflows, DB, KV, R2, and `w7s-local` first. Add a small W7S Events layer only when explicit event fanout becomes a repeated need."
        ]
      }
    ]
  },
  {
    slug: "replacing-dapr-with-w7s-components",
    title: "Replacing Dapr With W7S Components",
    category: "Architecture",
    readingTime: "10 min",
    summary:
      "Map Dapr sidecars, service invocation, pub/sub, state stores, bindings, actors, workflows, secrets, config, and observability onto W7S-native primitives.",
    sections: [
      {
        heading: "Start with the runtime boundary",
        paragraphs: [
          "Dapr is a strong distributed application runtime. It gives teams a sidecar, service invocation, pub/sub, state management, bindings, actors, workflows, secrets, configuration, and a component model that can sit beside services across different hosting environments.",
          "W7S starts from a different premise. If the application already deploys through W7S, the platform can own many of those concerns directly: deployment identity, internal routing, managed bindings, storage provisioning, background delivery, workflow dispatch, local multi-repo testing, and usage accounting.",
          "That makes the useful question narrower than whether W7S can run Dapr. The practical question is whether the product behavior people reach for Dapr to get can be built from W7S components that already exist."
        ]
      },
      {
        heading: "Sidecars become platform bindings",
        paragraphs: [
          "Dapr standardizes through a runtime process beside every service. The app talks to the sidecar over HTTP or gRPC, and the sidecar talks to service discovery, brokers, state stores, secret stores, and external components.",
          "W7S standardizes through repository deployment metadata and runtime bindings. Native backends receive platform bindings such as `W7S_RPC`, `W7S_QUEUE`, `W7S_WORKFLOW`, `W7S_AI`, storage bindings, owner/repo identity, and environment metadata directly on `env`.",
          "That removes the sidecar lifecycle from the default path. The repo remains the service boundary, and W7S owns the routing, identity, authorization, and resource wiring."
        ]
      },
      {
        heading: "Invocation maps to backend RPC",
        paragraphs: [
          "Dapr service invocation calls an app ID through the local runtime. In W7S, the app ID is the GitHub owner and repository, and the runtime call becomes Backend RPC.",
          "A caller uses `env.W7S_RPC.fetch(\"https://w7s.internal/api/v1/rpc/<owner>/<repo>/<path>\")` with its deployment token. W7S resolves the caller, checks authorization, dispatches to the target in the same environment, and injects caller identity headers.",
          "Use RPC when the caller needs the target response before it can finish its own request. Same-owner calls work by default, while cross-owner calls stay controlled by target allowlists."
        ],
        code: `const response = await env.W7S_RPC.fetch(
  "https://w7s.internal/api/v1/rpc/acme/auth/session",
  {
    headers: {
      authorization: \`Bearer \${env.W7S_RPC_TOKEN}\`,
      cookie: request.headers.get("cookie") ?? ""
    }
  }
);`
      },
      {
        heading: "Pub sub maps to fanout plus queues",
        paragraphs: [
          "Dapr pub/sub gives an app a stable publish API while the underlying broker can change. W7S can cover many product cases with explicit app-level fanout instead.",
          "A publisher calls an event-router backend through RPC. The router validates the subject and publisher, looks up subscribers from repo metadata or app config, and enqueues one W7S queue message per subscriber.",
          "This is less dynamic than Dapr broker-backed topics, but easier to review from a repository. The topology lives in code and W7S metadata instead of a sidecar component stack."
        ],
        code: `{
  "queues": [
    {
      "name": "events",
      "consumer": "/_w7s/queues/events"
    }
  ]
}`
      },
      {
        heading: "State stores become app-owned storage",
        paragraphs: [
          "Dapr state management gives apps a portable key/value API over a configured store. W7S takes a narrower approach: declare the storage the app actually needs, then read the binding directly from the backend.",
          "Use Serverless DB for relational app data, KV for cache or latest state by key, FS for files and larger payloads, Stateful Objects for per-entity compute and state, and managed Postgres bindings when the app needs an existing database.",
          "That gives up Dapr's common state API, but it gives the app a clearer data model and a deployment-owned migration path."
        ],
        code: `{
  "bindings": {
    "kv": ["CACHE"],
    "fs": ["FILES"],
    "db": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ]
  }
}`
      },
      {
        heading: "Actors map to Stateful Objects",
        paragraphs: [
          "Dapr actors provide a virtual actor model with identity, state, single-threaded execution, lifecycle behavior, timers, and reminders.",
          "W7S Stateful Objects cover the most common app need behind that model: route all operations for one logical entity to one durable object with attached state.",
          "This is not a full clone of Dapr actors. If an application depends on actor reminders, placement behavior, or Dapr actor SDK semantics, keep Dapr or build those semantics explicitly. If it needs durable per-key compute and state, Stateful Objects are the W7S-native fit."
        ]
      },
      {
        heading: "Workflows stay workflows",
        paragraphs: [
          "Dapr workflows are for long-running, fault-tolerant, stateful processes. W7S Workflows target the same product need: start a named process, persist the instance, dispatch work to the app, retry failures, and expose status.",
          "The W7S app declares the workflow in `w7s.json`, starts instances through `env.W7S_WORKFLOW`, and receives workflow runs at a backend route.",
          "W7S deliberately keeps the app API small. The platform owns the workflow runner; the app owns the business step."
        ]
      },
      {
        heading: "Where Dapr still wins",
        paragraphs: [
          "W7S should not pretend to replace Dapr's full surface. Dapr remains the better abstraction when a team needs a language-agnostic sidecar API, broker and state-store portability through component specs, Dapr actor semantics, Kubernetes operator behavior, resiliency policy resources, or sidecar-to-sidecar service mesh behavior.",
          "If a team is standardizing across Kubernetes, VMs, edge nodes, local containers, and multiple languages, Dapr can still be the right dependency.",
          "For W7S-native apps, the recommendation is different: use Backend RPC, queues, storage bindings, Stateful Objects, schedules, workflows, vars, secrets, and `w7s-local` first. Let W7S be the platform instead of adding another distributed runtime beside it."
        ]
      }
    ]
  },
  {
    slug: "replacing-vercel-and-netlify-with-w7s",
    title: "Replacing Vercel and Netlify With W7S",
    category: "Platforms",
    readingTime: "9 min",
    summary:
      "When a frontend platform starts becoming an app platform, W7S can move deploys, backends, storage, previews, and domains back into the repository.",
    sections: [
      {
        heading: "Frontend hosting becomes app hosting",
        paragraphs: [
          "Vercel and Netlify made frontend deployment feel simple: connect a repository, let the platform build it, get a URL, and add functions when the site needs backend behavior.",
          "W7S keeps the repository-first flow but moves the deploy control plane into GitHub Actions. The workflow builds the app, packages the archive, and deploys with the GitHub token.",
          "That makes release behavior reviewable with the app instead of splitting it between source code and project dashboard settings."
        ]
      },
      {
        heading: "Functions become a backend",
        paragraphs: [
          "W7S replaces many file-per-function setups with a native backend entrypoint that handles routing in code. Shared auth, validation, logging, database access, and queue helpers can live in one small service shape.",
          "Storage and background work are declared in `w7s.json`: DB, KV, FS, queues, schedules, workflows, vars, and secrets. Branch deploys become isolated environments rather than only static previews.",
          "Vercel and Netlify still fit when their framework integrations, dashboard workflows, plugins, forms, analytics, or platform-specific features are the product you want. W7S fits when the repository should own the deployment and runtime contract."
        ]
      }
    ]
  },
  {
    slug: "vercel-competitors",
    title: "Vercel Competitors",
    category: "Platforms",
    readingTime: "10 min",
    summary:
      "A practical comparison of Vercel alternatives, including Netlify, Cloudflare Pages, Render, Railway, Fly.io, GitHub Pages, AWS Amplify, Firebase, Supabase, and why W7S is better for GitHub-native apps.",
    sections: [
      {
        heading: "Start with what Vercel is doing for you",
        paragraphs: [
          "Vercel is not just a static host. Its public docs cover Git-connected deployments, framework-aware builds, serverless functions, storage products, queues, cron jobs, and spend controls. That is why the right competitor depends on which part of the platform you are replacing.",
          "If your main need is frontend previews, Netlify and Cloudflare Pages are close comparisons. If your app needs web services, background workers, or containers, Render, Railway, Fly.io, Cloud Run, and App Runner are closer. If the app is a repository-shaped frontend plus backend routes and managed bindings, W7S is a real alternative instead of just another hosting target."
        ],
        sources: [
          {label: "Vercel deployments", url: "https://vercel.com/docs/deployments"},
          {label: "Vercel functions", url: "https://vercel.com/docs/functions"},
          {label: "Vercel pricing", url: "https://vercel.com/pricing"}
        ]
      },
      {
        heading: "Where W7S competes directly",
        paragraphs: [
          "W7S competes when the team wants the repository to own the deployment contract. The deploy path is a GitHub Actions workflow, the deploy token is the GitHub token, and the app layout is documented in source rather than hidden behind project dashboard settings.",
          "That matters for production review. Build commands, deployment permissions, output directories, native backend entrypoints, environment behavior, storage bindings, queues, schedules, and workflows can all be reviewed beside the application code."
        ],
        sources: [
          {label: "Deploy from GitHub", url: "/docs/deploy-from-github/"},
          {label: "Project layouts", url: "/docs/project-layouts/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"}
        ]
      },
      {
        heading: "Why W7S is not only a static host",
        paragraphs: [
          "A Vercel competitor is not convincing if it stops at uploading a frontend build. W7S can deploy static assets with a native JavaScript or TypeScript backend, then attach database, key-value, file storage, queue, schedule, workflow, and RPC primitives to that backend.",
          "That lets an app grow from marketing pages into real product behavior: form handlers, webhook receivers, checkout routes, background email work, scheduled syncs, internal service calls, and durable processes. The point is not that W7S has every Vercel product. The point is that it has enough app primitives to replace Vercel for many GitHub-native apps."
        ],
        sources: [
          {label: "Backend queues", url: "/docs/backend-queues/"},
          {label: "Backend schedules", url: "/docs/backend-schedules/"},
          {label: "Backend workflows", url: "/docs/backend-workflows/"},
          {label: "Backend RPC", url: "/docs/backend-rpc/"}
        ]
      },
      {
        heading: "The competitor map",
        paragraphs: [
          "Netlify is the closest frontend-platform comparison because its docs emphasize deploy previews, functions, edge functions, forms, and scheduled functions. Render, Railway, and Fly.io are stronger comparisons when the workload is a process or machine. Cloud Run and App Runner are good comparisons when the organization wants containerized HTTP services on a hyperscaler.",
          "W7S sits in a narrower but useful lane: GitHub-native app deployment for projects that can be expressed as static assets, native backend handlers, and managed runtime bindings. That narrower lane is exactly what makes it simpler when the app fits."
        ],
        sources: [
          {label: "Netlify deploy previews", url: "https://docs.netlify.com/deploy/deploy-types/deploy-previews/"},
          {label: "Render web services", url: "https://render.com/docs/web-services"},
          {label: "Fly Machines", url: "https://fly.io/docs/machines/"},
          {label: "Cloud Run", url: "https://docs.cloud.google.com/run/docs"}
        ]
      },
      {
        heading: "When W7S is the better choice",
        paragraphs: [
          "Choose W7S when the repo should stay in charge: GitHub Actions for deploys, repo-derived URLs, branch environments, native backend code, storage declared with the app, usage feedback near the code, and an open-source or self-hostable platform path.",
          "Choose Vercel when the team specifically wants Vercel's managed frontend product, framework behavior, collaboration surface, marketplace, and account-level controls. The strongest W7S argument is not that every team should leave Vercel. It is that teams with GitHub-native apps now have a real alternative whose deployment truth lives in the repository."
        ],
        sources: [
          {label: "URLs and routing", url: "/docs/urls-and-routing/"},
          {label: "Usage accounting", url: "/docs/usage-accounting/"},
          {label: "Self host W7S", url: "/docs/self-host/"}
        ]
      }
    ]
  },
  {
    slug: "heroku-alternatives",
    title: "Heroku Alternatives",
    category: "Platforms",
    readingTime: "10 min",
    summary:
      "A practical guide to Heroku alternatives and when W7S is the better fit for apps that do not need always-on processes.",
    sections: [
      {
        heading: "Heroku is a process platform",
        paragraphs: [
          "Heroku's own material presents dynos as the heart of a Heroku app: isolated containers that run code, dependencies, and scaling. Its Dev Center documents `Procfile` process types, config vars, add-ons, and one-off dynos. That is a strong model when the app really needs web and worker processes.",
          "The important migration question is whether your app still needs that process model. A Rails app, Django app, Phoenix app, long-running worker, or custom service can still belong on Heroku or another process platform. A small JavaScript app with frontend assets, a few backend routes, storage, and background jobs may not."
        ],
        sources: [
          {label: "Heroku dynos", url: "https://devcenter.heroku.com/articles/dynos"},
          {label: "Heroku Procfile", url: "https://devcenter.heroku.com/articles/procfile"},
          {label: "Heroku config vars", url: "https://devcenter.heroku.com/articles/config-vars"},
          {label: "Heroku add-ons", url: "https://devcenter.heroku.com/articles/add-ons"}
        ]
      },
      {
        heading: "W7S replaces the common app shape",
        paragraphs: [
          "W7S is a Heroku alternative when the process was mostly packaging around request handlers and jobs. A W7S app can deploy static assets, expose a native backend entrypoint, declare DB, KV, and file storage bindings, and run from a GitHub Actions workflow.",
          "That changes the ownership model. Instead of a `Procfile`, dyno settings, add-on dashboards, and app config spread across a platform console, the repository explains how the app builds, deploys, routes requests, and receives runtime bindings."
        ],
        sources: [
          {label: "Deploy from GitHub", url: "/docs/deploy-from-github/"},
          {label: "Project layouts", url: "/docs/project-layouts/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"}
        ]
      },
      {
        heading: "Background work without worker dynos",
        paragraphs: [
          "Heroku worker dynos are useful for long-running background processes. W7S uses a different shape for apps that only need asynchronous delivery, cron-style work, or durable business processes: queues, schedules, and workflows declared with the app.",
          "That is a real replacement for common jobs such as email delivery, webhook retries, billing syncs, content refreshes, and moderation workflows. It is not a replacement for every daemon. It is a way to avoid paying the operational cost of a worker process when the job only needs platform delivery."
        ],
        sources: [
          {label: "Backend queues", url: "/docs/backend-queues/"},
          {label: "Backend schedules", url: "/docs/backend-schedules/"},
          {label: "Backend workflows", url: "/docs/backend-workflows/"},
          {label: "Heroku one-off dynos", url: "https://devcenter.heroku.com/articles/one-off-dynos"}
        ]
      },
      {
        heading: "How other Heroku alternatives compare",
        paragraphs: [
          "Render, Railway, Fly.io, Cloud Run, App Runner, and Coolify are closer to Heroku when you still want processes, services, containers, or servers. Render documents web services, background workers, and cron jobs. Fly.io documents Machines. Cloud Run and App Runner focus on containerized or source-based services.",
          "W7S is better only when the app fits its narrower model. That narrower model is a strength for repo-shaped apps because it removes instance sizing, process topology, server maintenance, and dashboard drift from everyday deployment decisions."
        ],
        sources: [
          {label: "Render web services", url: "https://render.com/docs/web-services"},
          {label: "Render workers", url: "https://render.com/docs/background-workers"},
          {label: "Fly Machines", url: "https://fly.io/docs/machines/"},
          {label: "AWS App Runner", url: "https://docs.aws.amazon.com/apprunner/latest/dg/what-is-apprunner.html"}
        ]
      },
      {
        heading: "When W7S is the better alternative",
        paragraphs: [
          "Choose W7S when the app is static assets plus JavaScript or TypeScript backend routes, and when storage, jobs, schedules, workflows, vars, and secrets should be declared with the repository. That is a real platform alternative because the deploy, runtime contract, and usage feedback are all tied to GitHub.",
          "Keep Heroku or another process platform for arbitrary containers, long-running daemons, non-JavaScript app servers, custom TCP services, direct shell access, private service networks, and mature process controls. W7S is not trying to beat Heroku at dynos. It is replacing the need for dynos when the app no longer needs them."
        ],
        sources: [
          {label: "URLs and routing", url: "/docs/urls-and-routing/"},
          {label: "Usage accounting", url: "/docs/usage-accounting/"},
          {label: "W7S pricing", url: "/docs/pricing/"}
        ]
      }
    ]
  },
  {
    slug: "netlify-alternative",
    title: "Netlify Alternative",
    category: "Platforms",
    readingTime: "10 min",
    summary:
      "Why W7S is a strong Netlify alternative for teams that want deploys, backends, storage, and branch environments owned by the repository.",
    sections: [
      {
        heading: "Netlify is a strong frontend platform",
        paragraphs: [
          "Netlify is a strong product for frontend teams. Its docs cover deploy previews, serverless functions, edge functions, forms, scheduled functions, and a dashboard-driven workflow. For many marketing sites and frontend-heavy apps, that is exactly the right tool.",
          "The reason to look at W7S is not that Netlify is weak. It is that some sites become apps. Once the project needs backend routes, storage, queues, workflows, internal calls, and branch-isolated runtime behavior, the deploy platform starts making application architecture decisions."
        ],
        sources: [
          {label: "Netlify previews", url: "https://docs.netlify.com/deploy/deploy-types/deploy-previews/"},
          {label: "Netlify functions", url: "https://docs.netlify.com/build/functions/overview/"},
          {label: "Netlify edge functions", url: "https://docs.netlify.com/build/edge-functions/overview/"},
          {label: "Netlify forms", url: "https://docs.netlify.com/manage/forms/setup/"}
        ]
      },
      {
        heading: "W7S moves the app contract into GitHub",
        paragraphs: [
          "W7S deploys from GitHub Actions, so build steps, tests, generated assets, deploy permissions, and release behavior are normal workflow code. That makes the deploy contract reviewable in pull requests instead of scattered between repository files and hosted project settings.",
          "The runtime contract also stays in the repo. A W7S app can include static output, a native backend handler, DB and storage bindings, queues, schedules, workflows, vars, secrets, and internal RPC. The app is not limited to a static deploy with a few isolated functions bolted on."
        ],
        sources: [
          {label: "Deploy from GitHub", url: "/docs/deploy-from-github/"},
          {label: "Project layouts", url: "/docs/project-layouts/"},
          {label: "Backend RPC", url: "/docs/backend-rpc/"}
        ]
      },
      {
        heading: "Forms and functions become app code",
        paragraphs: [
          "Netlify Forms are useful when a form is just a form. W7S is stronger when a form becomes application behavior: validation, database writes, file uploads, notification queues, approval workflows, fraud checks, or account provisioning.",
          "The same is true for functions. File-per-function routing is convenient early, but shared auth, logging, validation, storage helpers, and service calls often push teams toward a service-shaped backend. W7S gives that backend a first-class place in the repository."
        ],
        sources: [
          {label: "Netlify forms", url: "https://docs.netlify.com/manage/forms/setup/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"},
          {label: "Serverless database", url: "/docs/serverless-database/"},
          {label: "Backend queues", url: "/docs/backend-queues/"}
        ]
      },
      {
        heading: "Previews need runtime isolation too",
        paragraphs: [
          "Netlify deploy previews are valuable because reviewers can open the branch at a unique URL. W7S keeps the preview idea but treats branch environments as runtime environments, so backend routes and storage behavior can be tested along with the frontend.",
          "That matters when a branch changes a schema, queue consumer, scheduled job, or file upload path. A preview that only renders the frontend is not enough once the project is a real app."
        ],
        sources: [
          {label: "Netlify deploy previews", url: "https://docs.netlify.com/deploy/deploy-types/deploy-previews/"},
          {label: "URLs and routing", url: "/docs/urls-and-routing/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"}
        ]
      },
      {
        heading: "When W7S is the better Netlify alternative",
        paragraphs: [
          "Choose W7S when GitHub should be the release control plane, when backend and storage behavior should be visible in source, and when the project needs queues, schedules, workflows, usage feedback, and a self-hostable path. That is enough to make W7S a real Netlify alternative for app-shaped frontend projects.",
          "Choose Netlify when its visual collaboration, forms product, plugin ecosystem, dashboard workflow, and frontend platform surface are the features you want. The point is ownership: Netlify centralizes a polished product workflow, while W7S keeps the deployment and runtime contract close to the repository."
        ],
        sources: [
          {label: "Netlify pricing", url: "https://www.netlify.com/pricing/"},
          {label: "Usage accounting", url: "/docs/usage-accounting/"},
          {label: "Self host W7S", url: "/docs/self-host/"}
        ]
      }
    ]
  },
  {
    slug: "vercel-pricing",
    title: "Vercel Pricing",
    category: "Pricing",
    readingTime: "10 min",
    summary:
      "A practical comparison of Vercel pricing and W7S pricing for teams deciding whether GitHub-native deployment is a better fit.",
    sections: [
      {
        heading: "Vercel is a plan plus usage model",
        paragraphs: [
          "Vercel's public pricing page lists Hobby, Pro, and Enterprise plans. It also describes Pro as a monthly plan with additional usage, and its pricing docs explain managed infrastructure usage with meters such as data transfer, request count, and compute duration.",
          "That model makes sense for a broad commercial frontend cloud. The product includes deployments, compute, storage, image optimization, queues, workflows, observability, security, and spend controls. The tradeoff is that the bill can come from many product-specific meters as the app grows."
        ],
        sources: [
          {label: "Vercel pricing", url: "https://vercel.com/pricing"},
          {label: "Vercel pricing docs", url: "https://vercel.com/docs/pricing"},
          {label: "Vercel spend management", url: "https://vercel.com/docs/spend-management"}
        ]
      },
      {
        heading: "W7S starts from app usage",
        paragraphs: [
          "W7S starts from a different premise: deploy from GitHub Actions without a W7S account, credit card, or separate cloud setup, then model cost around the app primitives the repository uses. The W7S pricing page is an estimator for runtime requests, CPU, storage, DB, KV, FS, queues, Stateful Objects, logs, routing, usage guards, platform overhead, and target margin.",
          "That does not mean W7S is cheaper for every workload. It means the price discussion follows the architecture that is visible in the repo: static assets, backend routes, database bindings, queues, schedules, workflows, and usage accounting."
        ],
        sources: [
          {label: "W7S pricing", url: "/docs/pricing/"},
          {label: "Usage accounting", url: "/docs/usage-accounting/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"}
        ]
      },
      {
        heading: "Backend features change the bill",
        paragraphs: [
          "A frontend app usually gets more expensive when it stops being only frontend. On Vercel, backend behavior can involve Functions, Blob, Edge Config, Queues, Cron Jobs, Workflows, image optimization, observability, and other platform products.",
          "On W7S, those choices stay under one app model. A backend route can use declared DB, KV, FS, queue, schedule, workflow, and RPC bindings. Usage still matters, but the app has a single repository-owned contract instead of several dashboard products."
        ],
        sources: [
          {label: "Vercel Functions", url: "https://vercel.com/docs/functions"},
          {label: "Vercel Blob", url: "https://vercel.com/docs/vercel-blob"},
          {label: "Vercel Queues", url: "https://vercel.com/docs/queues"},
          {label: "Backend queues", url: "/docs/backend-queues/"}
        ]
      },
      {
        heading: "The real comparison is ownership",
        paragraphs: [
          "Vercel pricing is attached to a hosted product account. That product may be worth paying for because it gives teams a polished dashboard, framework behavior, collaboration tools, deployment protection, analytics, observability, security products, and support.",
          "W7S pricing is attached to a repository-shaped deployment model. The deploy workflow, runtime shape, branch environments, app URL, storage bindings, jobs, and usage feedback are closer to source control. That is the real alternative for teams that want fewer dashboard-owned decisions."
        ],
        sources: [
          {label: "Vercel deployments", url: "https://vercel.com/docs/deployments"},
          {label: "Deploy from GitHub", url: "/docs/deploy-from-github/"},
          {label: "URLs and routing", url: "/docs/urls-and-routing/"}
        ]
      },
      {
        heading: "When W7S pricing is better",
        paragraphs: [
          "W7S is better when the app fits static assets plus native backend routes and managed bindings, especially before a team needs a paid dashboard-centered frontend cloud. It lets a project start from GitHub and grow into usage-based infrastructure instead of adopting a subscription-shaped product early.",
          "Vercel is still worth it when Vercel-specific framework behavior, team collaboration, enterprise controls, observability, security products, and the Vercel dashboard are part of the value. The pricing decision should follow that product decision, not only a single headline number."
        ],
        sources: [
          {label: "Vercel pricing", url: "https://vercel.com/pricing"},
          {label: "W7S pricing", url: "/docs/pricing/"},
          {label: "Self host W7S", url: "/docs/self-host/"}
        ]
      }
    ]
  },
  {
    slug: "coolify-vs-w7s",
    title: "Coolify vs W7S",
    category: "Self-hosting",
    readingTime: "10 min",
    summary:
      "A practical comparison of Coolify and W7S for teams choosing between self-hosted server management and GitHub-native app deployment.",
    sections: [
      {
        heading: "Coolify is server-oriented",
        paragraphs: [
          "Coolify is strongest when you want a friendly control plane over servers you own or rent. Its pricing page distinguishes self-hosting on your own infrastructure from Coolify Cloud, and its docs organize the product around applications, services, and servers.",
          "That is a good model for teams that want containers, databases, service deployments, VPS ownership, homelab workflows, or direct server control. Coolify is not just a Vercel-like frontend host. It is a way to operate application infrastructure on machines you bring."
        ],
        sources: [
          {label: "Coolify pricing", url: "https://coolify.io/pricing/"},
          {label: "Coolify docs", url: "https://coolify.io/docs/get-started/introduction"},
          {label: "Coolify applications", url: "https://coolify.io/docs/applications/"},
          {label: "Coolify servers", url: "https://coolify.io/docs/knowledge-base/server/introduction"}
        ]
      },
      {
        heading: "W7S is repository-oriented",
        paragraphs: [
          "W7S starts from the GitHub repository instead of the server. Apps deploy through GitHub Actions and declare runtime needs through project layout and `w7s.json`: static assets, native backend routes, DB, KV, FS, queues, schedules, workflows, branch environments, and RPC.",
          "That makes W7S a real alternative when the team wants the app deployment contract, not server management, to be the thing every repository owns. The app team reviews workflow files and runtime declarations rather than choosing servers, patching machines, or managing container lifecycles."
        ],
        sources: [
          {label: "Deploy from GitHub", url: "/docs/deploy-from-github/"},
          {label: "Project layouts", url: "/docs/project-layouts/"},
          {label: "Storage bindings", url: "/docs/storage-bindings/"}
        ]
      },
      {
        heading: "Self-hosting means different things",
        paragraphs: [
          "With Coolify, self-hosting usually means you run the control plane and deploy your apps onto servers you manage. You own capacity, OS updates, Docker behavior, disks, backups, network rules, service health, and database operations.",
          "With W7S, self-hosting means running the W7S deployment cloud under your own domain and infrastructure account while application repositories keep the same GitHub-native workflow. The app still deploys through the W7S action and still uses W7S platform conventions."
        ],
        sources: [
          {label: "Coolify services", url: "https://coolify.io/docs/services/introduction"},
          {label: "Coolify servers", url: "https://coolify.io/docs/knowledge-base/server/introduction"},
          {label: "Self host W7S", url: "/docs/self-host/"}
        ]
      },
      {
        heading: "Where W7S is a real alternative",
        paragraphs: [
          "W7S is a real Coolify alternative for teams that wanted self-hostability as an escape hatch, not server ownership as the daily workflow. A repository-shaped app can deploy static assets, backend handlers, storage, queues, schedules, workflows, and internal calls without every project becoming a server operations project.",
          "That is the practical difference. Coolify gives you control over infrastructure. W7S gives the repository a platform contract. For app teams that do not need arbitrary containers or long-running processes, the W7S contract is easier to reason about and easier to review."
        ],
        sources: [
          {label: "Backend queues", url: "/docs/backend-queues/"},
          {label: "Backend schedules", url: "/docs/backend-schedules/"},
          {label: "Backend workflows", url: "/docs/backend-workflows/"},
          {label: "Backend RPC", url: "/docs/backend-rpc/"}
        ]
      },
      {
        heading: "When Coolify still wins",
        paragraphs: [
          "Choose Coolify when the workload needs arbitrary containers, long-running processes, databases you operate directly, custom service topology, server shell access, private server networks, or a broad self-hosted PaaS over your machines.",
          "Choose W7S when the app fits static assets plus JavaScript or TypeScript backend handlers, and when GitHub Actions, repo-scoped URLs, branch environments, usage feedback, and self-hostable platform ownership matter more than server control. The better tool is the one that matches what you actually want to own."
        ],
        sources: [
          {label: "Coolify applications", url: "https://coolify.io/docs/applications/"},
          {label: "URLs and routing", url: "/docs/urls-and-routing/"},
          {label: "Usage accounting", url: "/docs/usage-accounting/"},
          {label: "W7S pricing", url: "/docs/pricing/"}
        ]
      }
    ]
  },
  {
    slug: "replacing-heroku-render-railway-and-fly-with-w7s",
    title: "Replacing Heroku, Render, Railway, and Fly.io With W7S",
    category: "Platforms",
    readingTime: "9 min",
    summary:
      "Replace process-oriented app hosting with W7S when the app fits static assets, native backends, managed bindings, queues, schedules, and workflows.",
    sections: [
      {
        heading: "Processes are not always the app",
        paragraphs: [
          "Heroku, Render, Railway, and Fly.io are good platforms when an application needs a web process, worker, container image, machine, or long-running service with operational controls.",
          "Many small apps do not need that much runtime. They need a frontend, a few backend routes, a database, a cache, file storage, a background job, a schedule, and a clean deploy path from GitHub.",
          "For that shape, W7S replaces process management with static assets, native request handlers, and platform-managed bindings."
        ]
      },
      {
        heading: "Workers become queues",
        paragraphs: [
          "Instead of running a worker process beside a web process, W7S lets the app declare queues and consume batches through backend routes. Schedules and workflows cover timed work and durable processes.",
          "Databases, key-value storage, files, variables, and secrets are declared in `w7s.json`, then injected into the backend. The app runtime contract stays visible in the repository.",
          "Keep a process platform when the app needs arbitrary containers, long-running daemons, custom TCP listeners, private networking, shell access, or process-level controls. Use W7S when the process was mostly packaging."
        ]
      }
    ]
  },
  {
    slug: "replacing-github-pages-with-w7s",
    title: "Replacing GitHub Pages With W7S",
    category: "Platforms",
    readingTime: "8 min",
    summary:
      "GitHub Pages is excellent for static sites. W7S is the next step when the same repository needs backend routes, storage, jobs, or runtime bindings.",
    sections: [
      {
        heading: "Static stays simple",
        paragraphs: [
          "GitHub Pages is one of the cleanest ways to publish static HTML, CSS, and JavaScript from a repository. For docs, personal sites, and project pages, that can be exactly enough.",
          "W7S keeps the static deploy path simple, but gives the repository room to grow into backend routes, database bindings, files, queues, schedules, workflows, and branch environments.",
          "The migration stays natural because both models start from GitHub."
        ]
      },
      {
        heading: "The next step after static",
        paragraphs: [
          "A Pages site often outgrows static hosting when it needs a form handler, status API, search endpoint, uploaded files, or generated data. W7S lets the same repository add a native backend instead of calling out to a separate service.",
          "Custom domains can still live in a `CNAME` file, while DNS remains the ownership boundary. Branch deploys can preview runtime changes, not just static output.",
          "Keep GitHub Pages for purely static sites. Move to W7S when the site becomes an app."
        ]
      }
    ]
  },
  {
    slug: "replacing-cloudflare-workers-with-w7s",
    title: "Replacing Raw Cloudflare Workers Setup With W7S",
    category: "Platforms",
    readingTime: "9 min",
    summary:
      "W7S does not replace Cloudflare Workers as infrastructure. It replaces the repeated product workflow around Workers projects, bindings, deploys, URLs, and environments.",
    sections: [
      {
        heading: "Primitives need conventions",
        paragraphs: [
          "Cloudflare Workers and the surrounding platform are powerful primitives. Teams still have to choose repository conventions, resource names, routing, environments, deploy flow, service calls, and binding configuration.",
          "W7S is a product workflow on top of a focused set of those primitives. The app declares intent in `w7s.json`, deploys through GitHub Actions, and gets owner/repo-based URLs and branch environments.",
          "The goal is not less Cloudflare. The goal is less repeated platform glue."
        ]
      },
      {
        heading: "Bindings become an app contract",
        paragraphs: [
          "W7S turns common Cloudflare-style resources into app-level bindings: DB, KV, FS, queues, workflows, Stateful Objects, RPC, AI, vars, and secrets.",
          "Use raw Cloudflare when the app needs direct account control, advanced routes, compatibility flags, Terraform ownership, custom Workers for Platforms behavior, or exact product features on day one.",
          "Use W7S when the repeated questions around deploys, URLs, branch environments, app-to-app calls, and bindings are more expensive than the infrastructure choices."
        ]
      }
    ]
  },
  {
    slug: "replacing-kubernetes-for-small-apps-with-w7s",
    title: "Replacing Kubernetes for Small Apps With W7S",
    category: "Platforms",
    readingTime: "9 min",
    summary:
      "Kubernetes is excellent infrastructure for container fleets. W7S is a smaller default when an app only needs static assets, request handlers, storage, queues, schedules, and workflows.",
    sections: [
      {
        heading: "A cluster is often too much",
        paragraphs: [
          "Kubernetes can run almost anything, which is why it is often too much for small apps. Many projects need a frontend, backend routes, storage, background work, schedules, workflows, deploys, logs, and usage feedback.",
          "W7S maps that shape to repository identity, static assets, native backends, managed bindings, queues, schedules, workflows, and GitHub Actions deploys.",
          "The service boundary becomes the repository instead of a collection of cluster objects."
        ]
      },
      {
        heading: "Use clusters for cluster-shaped problems",
        paragraphs: [
          "Kubernetes still wins for arbitrary containers, long-running processes, private networking, service meshes, custom operators, GPUs, TCP services, strict cluster policy, and existing platform engineering built around Kubernetes.",
          "W7S fits when the app can be static assets plus JavaScript or TypeScript request handlers and managed platform bindings.",
          "The mistake is not choosing Kubernetes. The mistake is choosing Kubernetes before the application has Kubernetes-shaped problems."
        ]
      }
    ]
  },
  {
    slug: "internal-backend-rpc-without-public-service-urls",
    title: "Internal Backend RPC Without Public Service URLs",
    category: "Backends",
    readingTime: "6 min",
    summary:
      "W7S backends can call each other through internal bindings, avoiding public URLs for private service traffic.",
    sections: [
      {
        heading: "Service calls do not need to leave the platform",
        paragraphs: [
          "Once an app becomes a few backends instead of one, teams often create public HTTP endpoints for service-to-service calls because that is the easiest thing to route. It works, but it also turns private behavior into something that must be protected from the public internet.",
          "Native backends receive a `W7S_RPC` service binding and a deployment token. Calls through that binding stay inside the W7S control plane and identify the caller repository and environment.",
          "This keeps internal service communication separate from public URLs and avoids exposing private routes just because one backend needs to call another."
        ]
      },
      {
        heading: "Environment-aware by default",
        paragraphs: [
          "A feature branch backend calling another service looks for the target in the same branch environment. Production callers use production targets.",
          "That behavior makes multi-service testing less surprising because branch deploys do not accidentally call production services unless you explicitly design that bridge.",
          "The practical benefit is confidence. A branch can test a coordinated change across services without pretending production is the only shared environment that exists."
        ]
      }
    ]
  },
  {
    slug: "usage-accounting-for-small-apps-before-billing-gets-complicated",
    title: "Usage Accounting for Small Apps Before Billing Gets Complicated",
    category: "Operations",
    readingTime: "6 min",
    summary:
      "W7S exposes per-app usage rollups and GitHub-native warnings before usage surprises become billing surprises.",
    sections: [
      {
        heading: "Measure the app, not just the platform",
        paragraphs: [
          "Usage problems rarely arrive as one dramatic spike. They usually start as a cache that misses too often, a branch that keeps running jobs, or a small app quietly becoming important.",
          "W7S records usage per repository and environment. Deploys, runtime requests, static asset operations, storage activity, queues, schedules, workflows, and logs can be tracked in the same rollup.",
          "That gives small teams a practical view of which app is consuming shared infrastructure without building their own metering system."
        ]
      },
      {
        heading: "Warnings belong in GitHub",
        paragraphs: [
          "The W7S deploy action can read usage after a deploy and open or update a GitHub issue when an app is near or over limits. A scheduled workflow can run the same check without redeploying.",
          "That keeps cost and quota feedback in the same place teams already review work.",
          "It also makes usage a product conversation instead of a surprise bill conversation. The team can see which repository needs attention while the context is still fresh."
        ]
      }
    ]
  },
  {
    slug: "open-source-deployment-clouds-what-you-own-with-w7s",
    title: "Open Source Deployment Clouds: What You Own With W7S",
    category: "Self-hosting",
    readingTime: "6 min",
    summary:
      "An open deployment platform changes the relationship between hosted convenience, operational ownership, and long-term control.",
    sections: [
      {
        heading: "The deploy contract is portable",
        paragraphs: [
          "A hosted platform can be productive and still make the exit path unclear. The code may be yours, but the deploy contract can live in a place that is hard to copy, inspect, or run yourself.",
          "A W7S app deploys from GitHub Actions to a deploy endpoint. That endpoint can be the hosted service or your own self-hosted W7S core.",
          "Because the workflow is code and the app manifest lives in the repo, you can understand and move the deployment contract more easily than a dashboard-only setup."
        ]
      },
      {
        heading: "Ownership is not only source code",
        paragraphs: [
          "Owning the application code is useful. Owning the deployment path, resource conventions, and URL rules is better.",
          "W7S gives teams a route toward that ownership without giving up the productivity of a hosted deployment flow.",
          "That is the stronger promise of an open deployment cloud: not that you must operate everything yourself today, but that the operating model remains visible when you need it."
        ]
      }
    ]
  },
  {
    slug: "building-a-personal-cloud-for-github-repositories",
    title: "Building a Personal Cloud for GitHub Repositories",
    category: "Self-hosting",
    readingTime: "5 min",
    summary:
      "A personal W7S cloud can turn GitHub repositories into deployable apps under your own domain, without turning every project into infrastructure work.",
    sections: [
      {
        heading: "Repos become apps",
        paragraphs: [
          "A personal cloud sounds grand, but the useful version is simple: push a repository and get a working app under a domain you control. The less ceremony around that loop, the more experiments you actually ship.",
          "With W7S, a repository can become an app with a small workflow file. The default URL maps the GitHub owner and repository to a domain you control.",
          "That is useful for personal projects, demos, client prototypes, internal tools, and experiments that should be easy to ship without becoming permanent infrastructure chores."
        ]
      },
      {
        heading: "Start small, keep a path forward",
        paragraphs: [
          "A personal cloud does not need to start with every enterprise feature. It needs predictable deploys, static assets, backend handlers, custom domains, and enough storage primitives to build real things.",
          "W7S is designed to keep that baseline simple while still allowing richer backend features when the app grows.",
          "The appeal is cumulative. Every new repository can reuse the same deploy pattern, so small projects stop dying at the point where setup becomes more work than the idea."
        ]
      }
    ]
  },
  {
    slug: "from-git-push-to-public-url-how-w7s-deploys-apps",
    title: "From Git Push to Public URL: How W7S Deploys Apps",
    category: "Workflow",
    readingTime: "6 min",
    summary:
      "The W7S deploy flow is a short, auditable path from GitHub Actions archive to predictable public URL.",
    sections: [
      {
        heading: "The deploy request",
        paragraphs: [
          "A W7S deploy begins in the place most teams already trust: GitHub Actions. The workflow checks out the code, runs the build, and hands the deployable output to the official action.",
          "The official action packages the deployable directory and posts it to the W7S deploy API with repository, branch, and commit headers.",
          "W7S verifies the bearer token against GitHub repo access. If the token can read the repository, it can deploy that repository."
        ]
      },
      {
        heading: "Publishing targets",
        paragraphs: [
          "The deploy API inspects the archive for static assets and native backend entrypoints. Static files are published to object storage. Backends are uploaded to the runtime with generated bindings.",
          "The final response includes deployment metadata and the URL derived from the repository and environment.",
          "That short loop is the point. A push becomes an archive, the archive becomes a runtime shape, and the runtime shape becomes a URL people can open."
        ]
      }
    ]
  },
  {
    slug: "what-you-lose-and-gain-moving-away-from-hosted-app-platforms",
    title: "What You Lose and Gain Moving Away From Hosted App Platforms",
    category: "Strategy",
    readingTime: "6 min",
    summary:
      "Leaving a hosted app platform is not automatically better. The decision depends on what your team wants to own.",
    sections: [
      {
        heading: "What you may lose",
        paragraphs: [
          "Hosted platforms are popular for real reasons. They smooth over messy edges, package common workflows, and give teams a shared place to see what is running.",
          "They often provide dashboards, marketplace integrations, visual team management, and a familiar commercial support path. Those features are valuable for some teams.",
          "A smaller open platform may ask you to keep more of the workflow in GitHub and understand more of the underlying deployment model."
        ]
      },
      {
        heading: "What you gain",
        paragraphs: [
          "You gain explicit workflows, fewer hidden settings, self-hosting options, and deployment conventions that are not locked behind one vendor account.",
          "You also gain leverage. When deploy behavior is described in a repo, it becomes easier to audit, duplicate, modify, and eventually move.",
          "The practical question is whether your app needs the platform dashboard, or whether it needs a clear deploy contract that can live with the code."
        ]
      }
    ]
  },
  {
    slug: "choosing-between-hosted-w7s-and-self-hosted-w7s",
    title: "Choosing Between Hosted W7S and Self-Hosted W7S",
    category: "Self-hosting",
    readingTime: "6 min",
    summary:
      "Use the hosted service for speed, or self-host when ownership, domain policy, and operational boundaries matter more.",
    sections: [
      {
        heading: "Hosted first",
        paragraphs: [
          "The hosted W7S service is the fastest way to try the deployment model. You add the action, push from GitHub, and get a public URL without creating a W7S account or configuring a cloud account.",
          "That is the right path for examples, demos, prototypes, small tools, and teams evaluating whether the workflow fits.",
          "It also keeps the first test honest. Before you decide to operate the control plane yourself, you can find out whether GitHub-native deploys actually match how your team wants to ship."
        ]
      },
      {
        heading: "Self-host when you need control",
        paragraphs: [
          "Self-hosting makes sense when you need your own domain conventions, Cloudflare account, resource policies, or operational boundaries.",
          "The key benefit is continuity: apps still deploy from GitHub Actions using the same style of workflow, but the deploy endpoint and platform resources belong to you.",
          "That means the decision does not have to be permanent on day one. Start hosted when speed matters, move self-hosted when the ownership case is concrete."
        ]
      }
    ]
  },
  {
    slug: "using-w7s-files-storage-instead-of-s3",
    title: "Using W7S Files Storage Instead of S3",
    category: "Storage",
    readingTime: "8 min",
    summary:
      "Use the W7S `FILES` binding for app-owned uploads and generated objects without S3 credentials, bucket setup, or cross-environment confusion.",
    sections: [
      {
        heading: "Why use Files storage",
        paragraphs: [
          "Object storage is one of those features that looks small until the setup starts. A profile-photo upload or generated CSV export can quickly pull in bucket creation, credentials, IAM policy, CORS, lifecycle rules, and provider-specific SDK wiring.",
          "Many apps reach for S3 because they need a place to put uploaded files, generated exports, thumbnails, backups, or other binary objects. The hidden cost is not only the bill; it is the separate control plane every developer now has to understand.",
          "W7S Files storage is designed for the app-local version of that problem. Declare an R2-style file binding in `w7s.json`, and W7S provisions a per-repository, per-environment bucket. Your backend receives the binding as `env.FILES` or whichever binding name you choose."
        ],
        code: `{
  "bindings": {
    "r2": ["FILES"]
  }
}`
      },
      {
        heading: "Basic usage",
        paragraphs: [
          "A native backend can write, read, and delete objects through the binding. The app does not need an S3 access key in GitHub secrets, and branch environments do not share the same bucket by accident.",
          "Use stable object keys that match your product model. For example, prefix user files by tenant or account id, and store metadata in your database when you need search, ownership checks, or expiration behavior.",
          "That separation keeps the file body in object storage and the product meaning in your app. The upload path stays simple, while your database remains the source of truth for who owns what."
        ],
        code: `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "PUT" && url.pathname.startsWith("/files/")) {
      const key = url.pathname.slice("/files/".length);
      await env.FILES.put(key, request.body, {
        httpMetadata: {
          contentType: request.headers.get("content-type") || "application/octet-stream"
        }
      });
      return Response.json({ ok: true, key });
    }

    if (request.method === "GET" && url.pathname.startsWith("/files/")) {
      const key = url.pathname.slice("/files/".length);
      const object = await env.FILES.get(key);
      if (!object) return new Response("Not found", { status: 404 });
      return new Response(object.body, {
        headers: {
          "content-type": object.httpMetadata?.contentType || "application/octet-stream"
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};`
      },
      {
        heading: "Advantages over a separate S3 setup",
        paragraphs: [
          "The biggest advantage is removing another control plane. You do not create a separate object storage account path for every small app, and you do not have to rotate long-lived object-store credentials through GitHub secrets.",
          "The second advantage is environment isolation. Production and branch deploys receive separate managed resources, so a test upload path does not accidentally write into production. For small teams, that isolation is often worth more than any single storage feature.",
          "S3 is still the right answer for many large or deeply integrated storage systems. W7S Files is for the large number of apps that simply need durable objects close to the app, with fewer steps between the idea and the working upload."
        ]
      }
    ]
  },
  {
    slug: "using-w7s-kv-instead-of-redis-for-snappy-services",
    title: "Using W7S KV Instead of Redis for Snappy Services",
    category: "Storage",
    readingTime: "8 min",
    summary:
      "Use the W7S `CACHE` binding for low-latency app data, cached API responses, feature state, and read-heavy lookups without running Redis.",
    sections: [
      {
        heading: "Redis is powerful, but many apps need less",
        paragraphs: [
          "Redis is a full in-memory data system. It is excellent when you need advanced data structures, atomic counters, streams, pub/sub, or very specific latency guarantees.",
          "Many web apps, however, use Redis as a cache for API responses, session-adjacent state, computed JSON, or small read-heavy records. They are not really choosing Redis because they need the whole toolbox; they are choosing it because they need something fast.",
          "For that simpler class of work, W7S KV can replace a full Redis database. You declare a key-value binding, W7S provisions it for the repository and environment, and the backend reads and writes through `env.CACHE`."
        ],
        code: `{
  "bindings": {
    "kv": ["CACHE"]
  }
}`
      },
      {
        heading: "What costs it can remove",
        paragraphs: [
          "A Redis setup often means an always-on server or managed cluster, minimum monthly capacity, private networking decisions, memory sizing, backups, upgrades, and alerts. Even a small cache becomes another service with idle cost and operational drag.",
          "KV changes the default. You pay attention to reads, writes, and stored bytes instead of running a warm database process all month. For small and bursty services, that can remove a surprising amount of fixed cost.",
          "It also changes the mental model. The cache is no longer a separate pet service; it is an app binding declared in the same repo as the code using it."
        ]
      },
      {
        heading: "Use KV for snappy services",
        paragraphs: [
          "The best pattern is read-through caching. Try KV first. If the value is present, return it immediately. If it is missing, compute or fetch the source data, write it with an expiration, and return the fresh value.",
          "Keep values compact, use predictable key prefixes, cache public or permission-checked data separately, and choose expirations that match how stale the data can safely be. Do not use KV as a lock manager or a transactional database; use it to avoid repeated slow work.",
          "That boundary is what makes the pattern durable. KV should make common reads feel instant while your source systems remain responsible for correctness."
        ],
        code: `const json = (body, init) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/profile") return new Response("Not found", { status: 404 });

    const userId = url.searchParams.get("user");
    if (!userId) return json({ error: "Missing user" }, { status: 400 });

    const key = \`profile:v1:\${userId}\`;
    const cached = await env.CACHE.get(key, "json");
    if (cached) {
      return json({ profile: cached, cache: "hit" }, {
        headers: { "cache-control": "private, max-age=30" }
      });
    }

    const profile = await loadProfileFromDatabase(userId);
    await env.CACHE.put(key, JSON.stringify(profile), {
      expirationTtl: 300
    });

    return json({ profile, cache: "miss" });
  }
};`
      }
    ]
  }
];

export const featuredBlogArticles = [
  "using-w7s-files-storage-instead-of-s3",
  "using-w7s-kv-instead-of-redis-for-snappy-services",
  "w7s-vs-vercel-github-native-deploys-without-a-dashboard",
  "self-hosting-w7s-run-your-own-github-native-cloud"
];

export const getBlogArticle = (slug) =>
  blogArticles.find((article) => article.slug === slug);
