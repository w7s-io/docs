---
id: backend-email
title: Email Bindings
description: Send transactional email from W7S JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can declare Cloudflare Email Service send bindings in `w7s.json`. W7S uploads those declarations as Worker `send_email` bindings, so backend code can call `env.EMAIL.send(...)` without storing an email API token in the repository.

W7S only uploads the runtime binding. The sending domain must already be enabled for Email Service in the Cloudflare account before the backend sends mail.

## Declare the binding

Add `bindings.email` to `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "email": ["EMAIL"]
  }
}
```

W7S exposes this binding to the backend at `env.EMAIL`.

## Send an email

```ts title="backend/index.ts"
type Env = {
  EMAIL: {
    send(message: {
      to: string | string[];
      from: string | { email: string; name?: string };
      subject: string;
      text?: string;
      html?: string;
      replyTo?: string;
    }): Promise<{ messageId?: string }>;
  };
};

export default {
  async fetch(_request: Request, env: Env) {
    const result = await env.EMAIL.send({
      to: "customer@example.com",
      from: { email: "noreply@example.com", name: "Example App" },
      subject: "Welcome",
      text: "Thanks for signing up.",
      html: "<p>Thanks for signing up.</p>"
    });

    return Response.json({ sent: true, messageId: result.messageId ?? null });
  }
};
```

The `from` address must use a domain that is enabled for Email Service sending. Include both `text` and `html` when possible so more email clients can render the message.

## Restrict the binding

You can restrict a binding to specific sender or destination addresses:

```json title="w7s.json"
{
  "bindings": {
    "email": [
      {
        "binding": "EMAIL",
        "allowedSenderAddresses": ["noreply@example.com"],
        "allowedDestinationAddresses": ["ops@example.com"]
      }
    ]
  }
}
```

W7S also accepts Cloudflare-style snake_case fields:

```json title="w7s.json"
{
  "bindings": {
    "email": [
      {
        "binding": "EMAIL",
        "allowed_sender_addresses": ["noreply@example.com"],
        "allowed_destination_addresses": ["ops@example.com"]
      }
    ]
  }
}
```

Use `destinationAddress` when the binding should send only to one fixed recipient:

```json title="w7s.json"
{
  "bindings": {
    "email": [
      {
        "binding": "ALERT_EMAIL",
        "destinationAddress": "ops@example.com"
      }
    ]
  }
}
```

`destinationAddress` and `allowedDestinationAddresses` are mutually exclusive.

## Limitations

- Email bindings require a JavaScript or TypeScript native backend deployment.
- W7S does not onboard Email Service sending domains.
- W7S currently allows up to two email bindings per app.
- Cloudflare Email Service is intended for transactional email, not bulk marketing sends.
