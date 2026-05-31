# w7s-local RPC client

Caller service for local W7S RPC-style testing.

Run this next to `examples/w7s-local-rpc-time-service`.

## Run

Start the target service first:

```sh
cd ../w7s-local-rpc-time-service
npm install
npm run local
```

Then start this client in another terminal:

```sh
npm install
npm run local
```

This starts:

- a small backend dev server on `127.0.0.1:5179`;
- `w7s-local` on `127.0.0.1:8789`;
- a W7S-shaped app at `http://acme.local.w7s.cloud:8789/rpc-client/`.

Call the client:

```sh
curl -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8789/rpc-client/datetime
```

By default the client calls:

```text
http://127.0.0.1:8788/rpc-time/datetime
```

Override the target URL with:

```sh
LOCAL_RPC_DATETIME_URL=http://127.0.0.1:8788/rpc-time/datetime npm run local
```
