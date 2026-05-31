import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const readPort = () => {
  const index = process.argv.indexOf("--port");
  return Number(process.env.PORT || (index >= 0 ? process.argv[index + 1] : "") || 5180);
};

const readPackageConfig = async () => {
  const raw = await readFile(join(process.cwd(), "package.json"), "utf8");
  const parsed = JSON.parse(raw);
  return parsed.w7sLocal ?? {};
};

const requestHeaders = (incoming) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }
  return headers;
};

const readBody = async (incoming) => {
  if (incoming.method === "GET" || incoming.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of incoming) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const writeResponse = async (outgoing, response) => {
  outgoing.statusCode = response.status;
  response.headers.forEach((value, key) => outgoing.setHeader(key, value));
  if (!response.body) {
    outgoing.end();
    return;
  }
  for await (const chunk of response.body) outgoing.write(chunk);
  outgoing.end();
};

const config = await readPackageConfig();
const backend = await import(pathToFileURL(join(process.cwd(), "backend", "index.js")));
const port = readPort();
const owner = process.env.W7S_OWNER ?? config.owner ?? "acme";
const repo = process.env.W7S_REPO ?? config.repo ?? "app";
const environment = process.env.W7S_ENVIRONMENT ?? config.environment ?? "production";
const env = {
  ...process.env,
  W7S_OWNER: owner,
  W7S_REPO: repo,
  W7S_REPOSITORY: process.env.W7S_REPOSITORY ?? `${owner}/${repo}`,
  W7S_ENVIRONMENT: environment
};

createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host ?? `127.0.0.1:${port}`;
    const request = new Request(new URL(incoming.url ?? "/", `http://${host}`), {
      method: incoming.method,
      headers: requestHeaders(incoming),
      body: await readBody(incoming)
    });
    await writeResponse(outgoing, await backend.default.fetch(request, env, {}));
  } catch (error) {
    console.error(error);
    outgoing.statusCode = 500;
    outgoing.end("Internal error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`${owner}/${repo} backend listening on http://127.0.0.1:${port}`);
});
