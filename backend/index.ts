const CANONICAL_ORIGIN = "https://www.w7s.io";
const APEX_HOST = "w7s.io";
const LEGACY_DOCS_HOST = "community.w7s.io";

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

  if (source.hostname.toLowerCase() === LEGACY_DOCS_HOST) {
    if (source.pathname === "/" || source.pathname === "/docs" || source.pathname === "/docs/") {
      target.pathname = "/docs/";
    } else if (source.pathname.startsWith("/docs/")) {
      target.pathname = source.pathname;
    } else {
      target.pathname = `/docs${source.pathname}`;
    }
  } else {
    target.pathname = source.pathname;
  }

  target.search = source.search;
  return target.toString();
};

export default {
  fetch(request: Request) {
    const hostname = new URL(request.url).hostname.toLowerCase();
    if (hostname === APEX_HOST || hostname === LEGACY_DOCS_HOST) {
      return redirect(canonicalUrl(request));
    }

    return new Response("Not found.", { status: 404 });
  }
};
