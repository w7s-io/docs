export const blogArticles = [
  {
    slug: "w7s-vs-vercel-github-native-deploys-without-a-dashboard",
    title: "W7S vs Vercel: GitHub-Native Deploys Without a Dashboard",
    category: "Alternatives",
    readingTime: "5 min",
    summary:
      "A practical look at using GitHub Actions as the deployment control plane instead of routing every project through a hosted dashboard.",
    sections: [
      {
        heading: "The difference is where control lives",
        paragraphs: [
          "Vercel is built around a polished hosted workflow. W7S starts from a different premise: the repository and its GitHub Actions workflow should be enough to ship the app. The deploy token is the GitHub token, the archive comes from CI, and the public URL is derived from the GitHub owner and repository.",
          "That shape works well for teams that already treat GitHub as the source of truth. You can review the deployment workflow like any other code change, keep build steps in the same repo, and avoid teaching contributors a separate product dashboard before they can ship."
        ]
      },
      {
        heading: "What you trade",
        paragraphs: [
          "The tradeoff is intentional. W7S does not try to copy every hosted platform workflow. It focuses on direct deploys, repo-scoped environments, backend bindings, usage accounting, and self-hostability.",
          "If your team wants a visual project dashboard with managed previews and commercial integrations, Vercel may still fit. If you want deploy behavior that is explicit, auditable, and portable, W7S is designed for that path."
        ]
      }
    ]
  },
  {
    slug: "w7s-vs-netlify-static-sites-backends-storage-one-repo",
    title: "W7S vs Netlify: Static Sites, Backends, and Storage From One Repo",
    category: "Alternatives",
    readingTime: "5 min",
    summary:
      "How W7S combines static frontends, native backends, and storage declarations inside a GitHub-first deployment model.",
    sections: [
      {
        heading: "Beyond static hosting",
        paragraphs: [
          "Static hosting is only one part of most modern apps. W7S can publish static assets and a JavaScript or TypeScript backend from the same repository archive. A React frontend can live beside a native backend route, with W7S deciding the static-or-backend routing at runtime.",
          "That matters when a project starts as a landing page and grows into an app. You do not need to move the project to a different platform just because it needs a small API, queue, schedule, or persistent database binding."
        ]
      },
      {
        heading: "Storage follows the repository",
        paragraphs: [
          "W7S storage bindings are declared in `w7s.json`. The platform provisions resources per repository and environment, then reuses them on later deploys. That keeps state close to the deployment contract instead of scattered across console setup steps.",
          "The result is a repo that explains how it runs: build commands in GitHub Actions, runtime shape in `w7s.json`, and public URLs derived from the GitHub owner and repository."
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
      "Cloudflare provides powerful primitives. W7S packages a GitHub-native app platform on top of those primitives.",
    sections: [
      {
        heading: "Primitives are not the same as a product workflow",
        paragraphs: [
          "Cloudflare gives developers a deep set of building blocks: Workers, object storage, key-value storage, databases, queues, workflows, and more. Those primitives are powerful, but teams still need conventions for deploys, URLs, resource naming, and access control.",
          "W7S takes a platform stance on those conventions. A GitHub repository deploys to predictable URLs, branch environments get isolated resource names, and app bindings are generated from a small manifest."
        ]
      },
      {
        heading: "Why the wrapper matters",
        paragraphs: [
          "The wrapper saves repeated setup decisions. Instead of wiring every project directly to raw platform resources, W7S creates a repo-level deployment contract that can be reused across static sites, fullstack apps, and native backends.",
          "You still benefit from edge-native infrastructure, but the workflow feels more like shipping an app than assembling infrastructure every time."
        ]
      }
    ]
  },
  {
    slug: "w7s-vs-railway-and-fly-edge-native-apps-without-managing-services",
    title: "W7S vs Railway and Fly.io: Edge-Native Apps Without Managing Services",
    category: "Alternatives",
    readingTime: "5 min",
    summary:
      "When the app fits an edge-native model, W7S can remove service management from the deployment path.",
    sections: [
      {
        heading: "Different runtime assumptions",
        paragraphs: [
          "Railway and Fly.io are strong choices when you need process-oriented services, custom containers, or long-running server workloads. W7S is aimed at apps that fit edge-native request handlers, static assets, and managed bindings.",
          "For those apps, not having to operate always-on services is the point. You publish a repository archive, W7S wires the runtime and bindings, and requests route through the shared control plane."
        ]
      },
      {
        heading: "Less infrastructure to babysit",
        paragraphs: [
          "The cost and operational savings come from avoiding idle services, manually managed sidecars, and separate deployment targets for every small app. Static assets, native backends, key-value data, object files, queues, schedules, and workflows can share one deployment model.",
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
      "W7S can run as your own deployment cloud on a Cloudflare account and domain you control.",
    sections: [
      {
        heading: "Hosted is not the only mode",
        paragraphs: [
          "The hosted `w7s.cloud` service is one W7S deployment. The same core can be deployed under your own domain, using your own Cloudflare account resources and GitHub repositories.",
          "That gives teams a path that many app platforms do not offer: start with the hosted service, then run the same style of cloud yourself when ownership, compliance, cost controls, or internal conventions require it."
        ]
      },
      {
        heading: "What stays the same",
        paragraphs: [
          "The deployment shape stays familiar. App repositories still use the W7S GitHub Action, but point it at your self-hosted deploy endpoint. URLs are derived from the GitHub owner and repo under your domain, and branch environments use the same prefix model.",
          "Self-hosting is not about abandoning the workflow. It is about owning the control plane that receives those deploys."
        ]
      }
    ]
  },
  {
    slug: "why-deploy-from-github-actions-instead-of-a-cloud-dashboard",
    title: "Why Deploy From GitHub Actions Instead of a Cloud Dashboard?",
    category: "Workflow",
    readingTime: "5 min",
    summary:
      "A deploy workflow in code is easier to review, copy, audit, and reproduce than dashboard state.",
    sections: [
      {
        heading: "CI is already the release boundary",
        paragraphs: [
          "Most teams already trust GitHub Actions to install dependencies, run tests, build apps, and gate merges. Letting that same workflow package and deploy the app keeps release behavior in one place.",
          "W7S leans into that. The action sends the repository, branch, commit, and archive to the deploy API. The cloud verifies the token against GitHub and publishes the app."
        ]
      },
      {
        heading: "Fewer invisible settings",
        paragraphs: [
          "Dashboard configuration tends to become hidden infrastructure. A new teammate can read the repository but still miss the settings that decide production behavior.",
          "A GitHub Actions deploy file makes the install command, build command, deploy directory, secrets, variables, and environment override visible in code review."
        ]
      }
    ]
  },
  {
    slug: "migrating-a-static-site-from-vercel-or-netlify-to-w7s",
    title: "Migrating a Static Site From Vercel or Netlify to W7S",
    category: "Migration",
    readingTime: "5 min",
    summary:
      "Most static site migrations to W7S come down to building in GitHub Actions and deploying the output directory.",
    sections: [
      {
        heading: "Keep the build where it is easiest to see",
        paragraphs: [
          "A static site usually needs checkout, install, build, and deploy. With W7S, those steps live in `.github/workflows/deploy.yml`. If the build output is `dist/`, `build/`, or another supported directory, W7S can publish it as static assets.",
          "If the deployable output lives in a generated directory, pass `working-directory` to the action. The action packages that directory and sends it to W7S."
        ]
      },
      {
        heading: "URLs and domains",
        paragraphs: [
          "The default URL is based on the GitHub owner and repo, such as `https://owner.w7s.cloud/repo/`. A same-name repository can serve the owner root. Custom domains are declared with a `CNAME` file and verified through DNS ownership rules.",
          "That gives static sites a path from first deploy to custom domain without creating a separate app record by hand."
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
      "Move the frontend, backend handler, and app bindings into a repository shape W7S can detect.",
    sections: [
      {
        heading: "Split the runtime shape clearly",
        paragraphs: [
          "W7S detects static frontend output and native backend entrypoints from the uploaded archive. A common shape is `frontend/dist/` for assets and `backend/index.ts` or `worker/index.ts` for the request handler.",
          "Framework SSR outputs can also work when they produce a server entrypoint and client assets. The important part is that CI builds the project before the W7S action packages it."
        ]
      },
      {
        heading: "Move platform needs into bindings",
        paragraphs: [
          "Instead of hardcoding provider credentials, declare W7S-managed bindings in `w7s.json`. Key-value stores, files, serverless databases, queues, schedules, workflows, and internal service bindings can all become part of the deploy contract.",
          "That makes the app easier to promote across production and branch environments because resource names and tokens are generated for each environment."
        ]
      }
    ]
  },
  {
    slug: "replacing-serverless-functions-with-w7s-native-backends",
    title: "Replacing Serverless Functions With W7S Native Backends",
    category: "Backends",
    readingTime: "5 min",
    summary:
      "A W7S native backend is a request handler deployed with the same archive as your app.",
    sections: [
      {
        heading: "One backend entrypoint",
        paragraphs: [
          "Serverless function platforms often encourage many small files mapped to routes. W7S uses a native backend entrypoint that receives requests and decides routing in code.",
          "That model works well with lightweight routers such as Hono, but it does not require a specific framework. The default export just needs to handle `fetch(request, env, ctx)`."
        ]
      },
      {
        heading: "Bindings are injected",
        paragraphs: [
          "Native backends receive environment bindings from W7S. That can include key-value stores, file buckets, databases, AI, internal RPC, queues, and workflow services.",
          "The backend remains normal JavaScript or TypeScript, but the deployment environment is produced by the platform instead of manually assembled in a dashboard."
        ]
      }
    ]
  },
  {
    slug: "deploy-preview-alternatives-branch-environments-in-w7s",
    title: "Deploy Preview Alternatives: Branch Environments in W7S",
    category: "Workflow",
    readingTime: "5 min",
    summary:
      "W7S uses branch-derived environments for non-production deploys, with separate URLs and resources.",
    sections: [
      {
        heading: "Branches become environments",
        paragraphs: [
          "`main` and `master` deploy to `production`. Other branches are normalized into DNS-safe environment names and served from branch-prefixed hosts like `https://feature-login--owner.w7s.cloud/repo/`.",
          "That gives reviewers a predictable URL without needing a platform dashboard to discover it."
        ]
      },
      {
        heading: "Isolation is the real feature",
        paragraphs: [
          "Branch environments are not only about URLs. Managed resources are scoped by repository and environment, so a feature branch can test storage, queues, schedules, or workflow changes without sharing the production binding names.",
          "For teams that review infrastructure changes in branches, that model keeps preview behavior close to the code."
        ]
      }
    ]
  },
  {
    slug: "custom-domains-without-a-platform-account-system",
    title: "Custom Domains Without a Platform Account System",
    category: "Domains",
    readingTime: "5 min",
    summary:
      "W7S custom domains are declared from the repository and verified through DNS ownership rules.",
    sections: [
      {
        heading: "The repository declares the hostname",
        paragraphs: [
          "A W7S app can include a `CNAME` file with one or more hostnames. During deploy, W7S reads that file and stores custom-domain mappings for the deployment.",
          "This keeps the custom domain close to the application source instead of turning it into a hidden dashboard setting."
        ]
      },
      {
        heading: "DNS still decides ownership",
        paragraphs: [
          "The domain owner points DNS at the W7S cloud. For stronger ownership control, an `_w7s.<zone>` TXT record can allow a whole GitHub owner or an exact `owner/repo`.",
          "That model is simple enough for small apps but still gives domain owners a way to prevent unwanted claims."
        ]
      }
    ]
  },
  {
    slug: "serverless-database-without-adding-a-separate-provider",
    title: "Serverless Database Without Adding a Separate Provider",
    category: "Storage",
    readingTime: "5 min",
    summary:
      "For app-local relational data, a W7S-managed database can remove another account, token, and provisioning step.",
    sections: [
      {
        heading: "Declare the database with the app",
        paragraphs: [
          "A W7S native backend can declare a database binding in `w7s.json`. W7S provisions the resource per repository and environment, then injects it into the backend as `env.DB` or the binding name you choose.",
          "Migrations can live in the repository, so schema changes travel with the app deploy rather than through a separate manual operation."
        ]
      },
      {
        heading: "Good default for app-local data",
        paragraphs: [
          "This is a strong fit for notes, settings, tenant metadata, product catalogs, internal dashboards, and prototypes that need SQL without running a separate database service.",
          "If the app needs an existing external Postgres service, W7S can bind that too. The point is to make the simple path simple before adding more infrastructure."
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
      "Background work can be declared with the app instead of assembled from separate services.",
    sections: [
      {
        heading: "Queues and schedules belong near code",
        paragraphs: [
          "A backend that needs background work can declare queues and schedules in `w7s.json`. W7S provisions the platform resources and routes delivery back to the declaring backend.",
          "That avoids the common small-app pattern of adding a separate queue vendor, a scheduler account, and a worker service before the product has enough traffic to justify the complexity."
        ]
      },
      {
        heading: "Workflows for durable steps",
        paragraphs: [
          "When a job needs retries or durable status, W7S workflows give the backend a platform-managed runner while keeping the app-facing API simple.",
          "The deployment stays GitHub-native: the same repo describes the HTTP routes, background consumers, and workflow entrypoints."
        ]
      }
    ]
  },
  {
    slug: "internal-backend-rpc-without-public-service-urls",
    title: "Internal Backend RPC Without Public Service URLs",
    category: "Backends",
    readingTime: "5 min",
    summary:
      "W7S backends can call each other through internal bindings instead of public HTTP endpoints.",
    sections: [
      {
        heading: "Service calls do not need to leave the platform",
        paragraphs: [
          "Native backends receive a `W7S_RPC` service binding and a deployment token. Calls through that binding stay inside the W7S control plane and identify the caller repository and environment.",
          "This keeps internal service communication separate from public URLs and avoids exposing private routes just because one backend needs to call another."
        ]
      },
      {
        heading: "Environment-aware by default",
        paragraphs: [
          "A feature branch backend calling another service looks for the target in the same branch environment. Production callers use production targets.",
          "That behavior makes multi-service testing less surprising because branch deploys do not accidentally call production services unless you explicitly design that bridge."
        ]
      }
    ]
  },
  {
    slug: "usage-accounting-for-small-apps-before-billing-gets-complicated",
    title: "Usage Accounting for Small Apps Before Billing Gets Complicated",
    category: "Operations",
    readingTime: "5 min",
    summary:
      "W7S exposes per-app usage rollups and warnings before usage surprises become billing surprises.",
    sections: [
      {
        heading: "Measure the app, not just the platform",
        paragraphs: [
          "W7S records usage per repository and environment. Deploys, runtime requests, static asset operations, storage activity, queues, schedules, workflows, and logs can be tracked in the same rollup.",
          "That gives small teams a practical view of which app is consuming shared infrastructure without building their own metering system."
        ]
      },
      {
        heading: "Warnings belong in GitHub",
        paragraphs: [
          "The W7S deploy action can read usage after a deploy and open or update a GitHub issue when an app is near or over limits. A scheduled workflow can run the same check without redeploying.",
          "That keeps cost and quota feedback in the same place teams already review work."
        ]
      }
    ]
  },
  {
    slug: "open-source-deployment-clouds-what-you-own-with-w7s",
    title: "Open Source Deployment Clouds: What You Own With W7S",
    category: "Self-hosting",
    readingTime: "5 min",
    summary:
      "An open deployment platform changes the relationship between hosted convenience and long-term control.",
    sections: [
      {
        heading: "The deploy contract is portable",
        paragraphs: [
          "A W7S app deploys from GitHub Actions to a deploy endpoint. That endpoint can be the hosted service or your own self-hosted W7S core.",
          "Because the workflow is code and the app manifest lives in the repo, you can understand and move the deployment contract more easily than a dashboard-only setup."
        ]
      },
      {
        heading: "Ownership is not only source code",
        paragraphs: [
          "Owning the application code is useful. Owning the deployment path, resource conventions, and URL rules is better.",
          "W7S gives teams a route toward that ownership without giving up the productivity of a hosted deployment flow."
        ]
      }
    ]
  },
  {
    slug: "building-a-personal-cloud-for-github-repositories",
    title: "Building a Personal Cloud for GitHub Repositories",
    category: "Self-hosting",
    readingTime: "4 min",
    summary:
      "A personal W7S cloud can turn GitHub repositories into deployable apps under your own domain.",
    sections: [
      {
        heading: "Repos become apps",
        paragraphs: [
          "With W7S, a repository can become an app with a small workflow file. The default URL maps the GitHub owner and repository to a domain you control.",
          "That is useful for personal projects, demos, client prototypes, internal tools, and experiments that should be easy to ship without becoming permanent infrastructure chores."
        ]
      },
      {
        heading: "Start small, keep a path forward",
        paragraphs: [
          "A personal cloud does not need to start with every enterprise feature. It needs predictable deploys, static assets, backend handlers, custom domains, and enough storage primitives to build real things.",
          "W7S is designed to keep that baseline simple while still allowing richer backend features when the app grows."
        ]
      }
    ]
  },
  {
    slug: "from-git-push-to-public-url-how-w7s-deploys-apps",
    title: "From Git Push to Public URL: How W7S Deploys Apps",
    category: "Workflow",
    readingTime: "5 min",
    summary:
      "The W7S deploy flow is a short path from GitHub Actions archive to predictable public URL.",
    sections: [
      {
        heading: "The deploy request",
        paragraphs: [
          "The official action builds your project, packages the deployable directory, and posts it to the W7S deploy API with repository, branch, and commit headers.",
          "W7S verifies the bearer token against GitHub repo access. If the token can read the repository, it can deploy that repository."
        ]
      },
      {
        heading: "Publishing targets",
        paragraphs: [
          "The deploy API inspects the archive for static assets and native backend entrypoints. Static files are published to object storage. Backends are uploaded to the runtime with generated bindings.",
          "The final response includes deployment metadata and the URL derived from the repository and environment."
        ]
      }
    ]
  },
  {
    slug: "what-you-lose-and-gain-moving-away-from-hosted-app-platforms",
    title: "What You Lose and Gain Moving Away From Hosted App Platforms",
    category: "Strategy",
    readingTime: "5 min",
    summary:
      "Leaving a hosted app platform is not automatically better. The decision depends on what you want to own.",
    sections: [
      {
        heading: "What you may lose",
        paragraphs: [
          "Hosted platforms often provide dashboards, marketplace integrations, visual team management, and a familiar commercial support path. Those features are valuable for some teams.",
          "A smaller open platform may ask you to keep more of the workflow in GitHub and understand more of the underlying deployment model."
        ]
      },
      {
        heading: "What you gain",
        paragraphs: [
          "You gain explicit workflows, fewer hidden settings, self-hosting options, and deployment conventions that are not locked behind one vendor account.",
          "The practical question is whether your app needs the platform dashboard, or whether it needs a clear deploy contract that can live with the code."
        ]
      }
    ]
  },
  {
    slug: "choosing-between-hosted-w7s-and-self-hosted-w7s",
    title: "Choosing Between Hosted W7S and Self-Hosted W7S",
    category: "Self-hosting",
    readingTime: "5 min",
    summary:
      "Use the hosted service for speed, or self-host when ownership and policy matter more.",
    sections: [
      {
        heading: "Hosted first",
        paragraphs: [
          "The hosted W7S service is the fastest way to try the deployment model. You add the action, push from GitHub, and get a public URL without creating a W7S account or configuring a cloud account.",
          "That is the right path for examples, demos, prototypes, small tools, and teams evaluating whether the workflow fits."
        ]
      },
      {
        heading: "Self-host when you need control",
        paragraphs: [
          "Self-hosting makes sense when you need your own domain conventions, Cloudflare account, resource policies, or operational boundaries.",
          "The key benefit is continuity: apps still deploy from GitHub Actions using the same style of workflow, but the deploy endpoint and platform resources belong to you."
        ]
      }
    ]
  },
  {
    slug: "using-w7s-files-storage-instead-of-s3",
    title: "Using W7S Files Storage Instead of S3",
    category: "Storage",
    readingTime: "7 min",
    summary:
      "Use the W7S `FILES` binding for app-owned uploads and generated objects without S3 credentials or bucket setup.",
    sections: [
      {
        heading: "Why use Files storage",
        paragraphs: [
          "Many apps reach for S3 because they need a place to put uploaded files, generated exports, thumbnails, backups, or other binary objects. The hidden cost is setup: bucket creation, credentials, IAM policy, environment variables, CORS, lifecycle rules, and provider-specific SDK wiring.",
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
          "Use stable object keys that match your product model. For example, prefix user files by tenant or account id, and store metadata in your database when you need search, ownership checks, or expiration behavior."
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
          "The second advantage is environment isolation. Production and branch deploys receive separate managed resources, so a test upload path does not accidentally write into production. For small teams, that isolation is often worth more than any single storage feature."
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
      "Use the W7S `CACHE` binding for low-latency app data, cached API responses, feature state, and read-heavy lookups without running a Redis server.",
    sections: [
      {
        heading: "Redis is powerful, but many apps need less",
        paragraphs: [
          "Redis is a full in-memory data system. It is excellent when you need advanced data structures, atomic counters, streams, pub/sub, or very specific latency guarantees. Many web apps, however, use Redis as a cache for API responses, session-adjacent state, computed JSON, or small read-heavy records.",
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
          "KV changes the default. You pay attention to reads, writes, and stored bytes instead of running a warm database process all month. For small and bursty services, that can remove a surprising amount of fixed cost."
        ]
      },
      {
        heading: "Use KV for snappy services",
        paragraphs: [
          "The best pattern is read-through caching. Try KV first. If the value is present, return it immediately. If it is missing, compute or fetch the source data, write it with an expiration, and return the fresh value.",
          "Keep values compact, use predictable key prefixes, cache public or permission-checked data separately, and choose expirations that match how stale the data can safely be. Do not use KV as a lock manager or a transactional database; use it to avoid repeated slow work."
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
