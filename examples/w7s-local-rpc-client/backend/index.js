const defaultLocalDatetimeUrl = "http://127.0.0.1:8788/rpc-time/datetime";
const productionRpcUrl = "https://w7s.internal/api/v1/rpc/acme/rpc-time/datetime";

const callDatetimeService = (env) => {
  if (env.W7S_RPC && env.W7S_RPC_TOKEN) {
    return env.W7S_RPC.fetch(productionRpcUrl, {
      headers: {
        authorization: `Bearer ${env.W7S_RPC_TOKEN}`
      }
    });
  }

  return fetch(env.LOCAL_RPC_DATETIME_URL ?? defaultLocalDatetimeUrl, {
    headers: {
      "x-w7s-rpc": "1",
      "x-w7s-rpc-caller-owner": env.W7S_OWNER ?? "acme",
      "x-w7s-rpc-caller-repo": env.W7S_REPO ?? "rpc-client",
      "x-w7s-rpc-caller-repository": env.W7S_REPOSITORY ?? "acme/rpc-client",
      "x-w7s-rpc-caller-environment": env.W7S_ENVIRONMENT ?? "production"
    }
  });
};

const readPayload = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/datetime") {
      const response = await callDatetimeService(env);
      const target = await readPayload(response);

      return Response.json(
        {
          ok: response.ok,
          source: env.W7S_RPC ? "w7s-rpc-binding" : "local-w7s-url",
          status: response.status,
          target
        },
        { status: response.ok ? 200 : 502 }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};
