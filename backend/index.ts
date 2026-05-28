const CANONICAL_ORIGIN = "https://w7s.io";
const WWW_HOST = "www.w7s.io";
const STATUS_PATH = "/status.json";
const STATUS_API_URL = "https://w7s.cloud/api/v1/status";

const statusHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "cache-control": "no-store",
};

const redirect = (url: string) =>
  new Response(null, {
    status: 302,
    headers: {
      "cache-control": "no-store",
      location: url,
    },
  });

const canonicalUrl = (request: Request) => {
  const source = new URL(request.url);
  const target = new URL(CANONICAL_ORIGIN);

  target.pathname = source.pathname;
  target.search = source.search;
  return target.toString();
};

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    if (hostname === WWW_HOST) {
      return redirect(canonicalUrl(request));
    }

    if (request.method === "OPTIONS" && url.pathname === STATUS_PATH) {
      return new Response(null, {
        status: 204,
        headers: statusHeaders,
      });
    }

    if (request.method === "GET" && url.pathname === STATUS_PATH) {
      return redirect(STATUS_API_URL);
    }

    return new Response("Not found.", { status: 404 });
  }
};
