const defaultRouterUrl = "http://127.0.0.1:8791/event-router/publish";
const productionRouterUrl = "https://w7s.internal/api/v1/rpc/acme/event-router/publish";

const json = (body, init = {}) =>
  new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init.headers
    }
  });

const readJson = async (request) => {
  if (!request.body) return {};
  return request.json().catch(() => ({}));
};

const readResponsePayload = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
};

const publishEvent = (env, event) => {
  if (env.W7S_RPC && env.W7S_RPC_TOKEN) {
    return env.W7S_RPC.fetch(productionRouterUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(event)
    });
  }

  return fetch(env.LOCAL_EVENT_ROUTER_URL ?? defaultRouterUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-w7s-rpc": "1",
      "x-w7s-rpc-caller-owner": env.W7S_OWNER ?? "acme",
      "x-w7s-rpc-caller-repo": env.W7S_REPO ?? "order-api",
      "x-w7s-rpc-caller-repository": env.W7S_REPOSITORY ?? "acme/order-api",
      "x-w7s-rpc-caller-environment": env.W7S_ENVIRONMENT ?? "production"
    },
    body: JSON.stringify(event)
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ ok: true, service: "order-api" });
    }

    if (url.pathname === "/orders" && request.method === "POST") {
      const body = await readJson(request);
      const order = {
        orderId: body.orderId ?? `ord_${crypto.randomUUID()}`,
        email: body.email ?? "buyer@example.com",
        amount: Number(body.amount ?? 0),
        createdAt: new Date().toISOString()
      };
      const event = {
        id: crypto.randomUUID(),
        subject: "orders.created",
        source: env.W7S_REPOSITORY ?? "acme/order-api",
        data: order
      };
      const routed = await publishEvent(env, event);
      const routedBody = await readResponsePayload(routed);

      return json(
        {
          ok: routed.ok,
          service: "order-api",
          order,
          event,
          routed: {
            status: routed.status,
            body: routedBody
          }
        },
        { status: routed.ok ? 202 : 502 }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};
