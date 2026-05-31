# w7s-local RPC time service

Target service for local W7S RPC-style testing.

## Run

```sh
npm install
npm run local
```

This starts:

- a small backend dev server on `127.0.0.1:5178`;
- `w7s-local` on `127.0.0.1:8788`;
- a W7S-shaped app at `http://acme.local.w7s.cloud:8788/rpc-time/`.

Test it directly:

```sh
curl -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8788/rpc-time/datetime
```

The caller example expects this service to be reachable at:

```text
http://127.0.0.1:8788/rpc-time/datetime
```
