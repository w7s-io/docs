# w7s-local native events

This example turns the "Replacing NATS With W7S Components" article into a runnable local setup.

It uses three small W7S-style repos:

- `order-api`: accepts `POST /orders` and publishes an `orders.created` event.
- `event-router`: receives the event and fans it out to subscriber queues.
- `email-worker`: consumes the queue-shaped event batch and stores received deliveries in memory.

The hosted W7S path uses existing primitives:

- `order-api` calls `event-router` through `W7S_RPC`.
- `event-router` delivers to `email-worker` through `W7S_QUEUE`.
- `email-worker` receives the batch at `/_w7s/queues/events`.

The local path uses `w7s-local` URLs instead of managed W7S bindings, so the same repo boundaries can be tested without a broker.

## Run

Start the consumer first:

```sh
cd examples/w7s-local-native-events/email-worker
npm install
npm run local
```

Start the event router in a second terminal:

```sh
cd examples/w7s-local-native-events/event-router
npm install
npm run local
```

Start the order API in a third terminal:

```sh
cd examples/w7s-local-native-events/order-api
npm install
npm run local
```

Create an order through the local W7S URL:

```sh
curl -sS \
  -X POST \
  -H "host: acme.local.w7s.cloud" \
  -H "content-type: application/json" \
  --data '{"orderId":"ord_local_1","email":"buyer@example.com","amount":42}' \
  http://127.0.0.1:8790/order-api/orders
```

Check what the subscriber received:

```sh
curl -sS \
  -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8792/email-worker/deliveries
```

You should see a delivery with:

```json
{
  "subject": "orders.created",
  "repository": "acme/order-api",
  "queue": "events"
}
```

## Ports

| Repo | Backend dev server | `w7s-local` router |
| --- | --- | --- |
| `order-api` | `127.0.0.1:5180` | `127.0.0.1:8790` |
| `event-router` | `127.0.0.1:5181` | `127.0.0.1:8791` |
| `email-worker` | `127.0.0.1:5182` | `127.0.0.1:8792` |

## Override local targets

The defaults are wired for the ports above. Override them when needed:

```sh
LOCAL_EVENT_ROUTER_URL=http://127.0.0.1:8791/event-router/publish npm run local
LOCAL_EMAIL_CONSUMER_URL=http://127.0.0.1:8792/email-worker/_w7s/queues/events npm run local
```

## Production shape

The same pattern can be deployed as three repos:

`order-api/w7s.json`

```json
{
  "rpc": {
    "allow": ["acme"]
  }
}
```

`event-router/w7s.json`

```json
{
  "queue": {
    "allow": ["acme"]
  }
}
```

`email-worker/w7s.json`

```json
{
  "queues": [
    {
      "name": "events",
      "consumer": "/_w7s/queues/events"
    }
  ]
}
```

The allowlists are illustrative for cross-repo/cross-owner cases. Same-owner W7S RPC and queue sends are allowed by default.
