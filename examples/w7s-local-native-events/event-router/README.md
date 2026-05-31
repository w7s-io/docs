# event-router

Receives app events and fans them out to queue-shaped subscriber deliveries.

```sh
npm install
npm run local
```

Inspect subscriptions:

```sh
curl -sS \
  -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8791/event-router/subscriptions
```
