# email-worker

Consumes queue-shaped `orders.created` deliveries.

```sh
npm install
npm run local
```

Inspect deliveries:

```sh
curl -sS \
  -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8792/email-worker/deliveries
```
