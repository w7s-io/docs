const deliveries = [];

const json = (body, init = {}) =>
  new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init.headers
    }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ ok: true, service: "email-worker" });
    }

    if (url.pathname === "/deliveries" && request.method === "GET") {
      return json({
        ok: true,
        service: "email-worker",
        count: deliveries.length,
        deliveries
      });
    }

    if (url.pathname === "/deliveries" && request.method === "DELETE") {
      deliveries.length = 0;
      return json({ ok: true, cleared: true });
    }

    if (url.pathname === "/_w7s/queues/events" && request.method === "POST") {
      const batch = await request.json().catch(() => ({ messages: [] }));
      for (const message of batch.messages ?? []) {
        deliveries.push({
          id: message.id,
          queue: batch.queue ?? "events",
          receivedAt: new Date().toISOString(),
          repository: message.body?.source ?? null,
          subject: message.body?.subject ?? null,
          data: message.body?.data ?? null,
          routedOwner: request.headers.get("x-w7s-org-slug"),
          routedRepo: request.headers.get("x-w7s-repo-slug"),
          originalPath: request.headers.get("x-w7s-original-path"),
          queueCaller: request.headers.get("x-w7s-queue-caller-repository")
        });
      }

      return json({
        ok: true,
        service: "email-worker",
        processed: batch.messages?.length ?? 0,
        total: deliveries.length,
        environment: env.W7S_ENVIRONMENT ?? "production"
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
