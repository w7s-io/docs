export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/datetime") {
      return Response.json({
        ok: true,
        service: "rpc-time",
        now: new Date().toISOString(),
        received: {
          routedOwner: request.headers.get("x-w7s-org-slug"),
          routedRepo: request.headers.get("x-w7s-repo-slug"),
          originalPath: request.headers.get("x-w7s-original-path"),
          rpc: request.headers.get("x-w7s-rpc") === "1",
          callerOwner: request.headers.get("x-w7s-rpc-caller-owner"),
          callerRepo: request.headers.get("x-w7s-rpc-caller-repo"),
          callerRepository: request.headers.get("x-w7s-rpc-caller-repository"),
          callerEnvironment: request.headers.get("x-w7s-rpc-caller-environment")
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
