const defaultEmailConsumerUrl = "http://127.0.0.1:8792/email-worker/_w7s/queues/events";

const json = (body, init = {}) =>
  new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init.headers
    }
  });

const readJson = async (request) => request.json().catch(() => ({}));

const readResponsePayload = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
};

const subscriptionsFor = (env, subject) => {
  const subscriptions = {
    "orders.created": [
      {
        repository: "acme/email-worker",
        queue: "events",
        localUrl: env.LOCAL_EMAIL_CONSUMER_URL ?? defaultEmailConsumerUrl
      }
    ]
  };
  return subscriptions[subject] ?? [];
};

const queueUrlFor = (subscription) =>
  `https://w7s.internal/api/v1/queues/${subscription.repository}/${subscription.queue}`;

const queueBatchFor = (event, subscription) => ({
  queue: subscription.queue,
  messages: [
    {
      id: event.id ?? crypto.randomUUID(),
      body: event,
      attempts: 1,
      enqueuedAt: new Date().toISOString()
    }
  ]
});

const deliver = async (env, event, subscription) => {
  const body = queueBatchFor(event, subscription);
  const target = env.W7S_QUEUE && env.W7S_QUEUE_TOKEN
    ? queueUrlFor(subscription)
    : subscription.localUrl;
  const response = await (env.W7S_QUEUE && env.W7S_QUEUE_TOKEN
    ? env.W7S_QUEUE.fetch(target, {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(event)
      })
    : fetch(target, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-w7s-queue": "1",
          "x-w7s-queue-caller-repository": env.W7S_REPOSITORY ?? "acme/event-router",
          "x-w7s-queue-environment": env.W7S_ENVIRONMENT ?? "production"
        },
        body: JSON.stringify(body)
      }));
  return {
    repository: subscription.repository,
    queue: subscription.queue,
    target,
    ok: response.ok,
    status: response.status,
    response: await readResponsePayload(response)
  };
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ ok: true, service: "event-router" });
    }

    if (url.pathname === "/subscriptions") {
      return json({
        subjects: {
          "orders.created": subscriptionsFor(env, "orders.created").map(({ repository, queue }) => ({
            repository,
            queue
          }))
        }
      });
    }

    if (url.pathname === "/publish" && request.method === "POST") {
      const event = await readJson(request);
      if (!event.subject) {
        return json({ ok: false, error: "Missing event subject." }, { status: 400 });
      }

      const subscriptions = subscriptionsFor(env, event.subject);
      const deliveries = await Promise.all(
        subscriptions.map((subscription) => deliver(env, event, subscription))
      );

      return json({
        ok: deliveries.every((delivery) => delivery.ok),
        service: "event-router",
        accepted: true,
        subject: event.subject,
        publisher: request.headers.get("x-w7s-rpc-caller-repository") ?? event.source ?? null,
        deliveries
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
