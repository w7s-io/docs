# order-api

Publishes `orders.created` events.

```sh
npm install
npm run local
```

Create an order:

```sh
curl -sS \
  -X POST \
  -H "host: acme.local.w7s.cloud" \
  -H "content-type: application/json" \
  --data '{"orderId":"ord_local_1","email":"buyer@example.com","amount":42}' \
  http://127.0.0.1:8790/order-api/orders
```
