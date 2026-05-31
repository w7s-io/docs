import { createServer } from "node:http";
import backend from "./backend/index.js";

const readPort = () => {
  const index = process.argv.indexOf("--port");
  return Number(process.env.PORT || (index >= 0 ? process.argv[index + 1] : "") || 5179);
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

const port = readPort();
const env = {
  W7S_OWNER: process.env.W7S_OWNER ?? "acme",
  W7S_REPO: process.env.W7S_REPO ?? "rpc-client",
  W7S_REPOSITORY: process.env.W7S_REPOSITORY ?? "acme/rpc-client",
  W7S_ENVIRONMENT: process.env.W7S_ENVIRONMENT ?? "production",
  LOCAL_RPC_DATETIME_URL: process.env.LOCAL_RPC_DATETIME_URL
};

createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host ?? `127.0.0.1:${port}`;
    const request = new Request(new URL(incoming.url ?? "/", `http://${host}`), {
      method: incoming.method,
      headers: requestHeaders(incoming),
      body: await readBody(incoming)
    });
    await writeResponse(outgoing, await backend.fetch(request, env, {}));
  } catch (error) {
    console.error(error);
    outgoing.statusCode = 500;
    outgoing.end("Internal error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`rpc client backend listening on http://127.0.0.1:${port}`);
});
