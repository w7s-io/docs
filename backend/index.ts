const CANONICAL_DOCS_URL = "https://community.w7s.io/docs/";
const REDIRECT_HOSTS = new Set(["w7s.io", "www.w7s.io"]);

const canonicalDocsUrl = (request: Request) => {
  const source = new URL(request.url);
  const target = new URL(CANONICAL_DOCS_URL);

  if (source.pathname === "/" || source.pathname === "/docs" || source.pathname === "/docs/") {
    target.pathname = "/docs/";
  } else if (source.pathname.startsWith("/docs/")) {
    target.pathname = source.pathname;
  } else {
    target.pathname = `/docs${source.pathname}`;
  }

  target.search = source.search;
  return target.toString();
};

export default {
  fetch(request: Request) {
    const hostname = new URL(request.url).hostname.toLowerCase();
    if (REDIRECT_HOSTS.has(hostname)) {
      return Response.redirect(canonicalDocsUrl(request), 308);
    }

    return new Response("Not found.", { status: 404 });
  }
};
