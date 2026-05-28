---
id: backend-ai
title: Backend AI
description: Call the W7S-provided AI service from JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can opt into W7S AI without adding provider credentials to the repo.

Declare the service binding in `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "ai": ["W7S_AI"]
  }
}
```

W7S injects these bindings during deploy:

- `W7S_AI`: internal service binding to the W7S AI runner.
- `W7S_AI_TOKEN`: W7S-generated secret token for this deployment.
- `W7S_AI_CALLER`: the deployed `<owner>/<repo>`.
- `W7S_AI_ENVIRONMENT`: the deployed environment.

No W7S account, provider account, provider API token, card, or GitHub secret is required for hosted deploys that use this binding.

## Run a Model

```ts title="backend/index.ts"
type Env = {
  W7S_AI: Fetcher;
  W7S_AI_TOKEN: string;
  W7S_AI_CALLER: string;
  W7S_AI_ENVIRONMENT: string;
};

export default {
  async fetch(_request: Request, env: Env) {
    const response = await env.W7S_AI.fetch("https://w7s.internal/api/v1/ai/run", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_AI_TOKEN}`,
        "content-type": "application/json",
        "x-w7s-ai-caller": env.W7S_AI_CALLER,
        "x-w7s-ai-environment": env.W7S_AI_ENVIRONMENT
      },
      body: JSON.stringify({
        model: "@cf/meta/llama-3.1-8b-instruct-fp8",
        input: {
          prompt: "Write one short, original deployment joke."
        }
      })
    });

    return response;
  }
};
```

The response is JSON:

```json
{
  "status": "success",
  "data": {
    "model": "@cf/meta/llama-3.1-8b-instruct-fp8",
    "result": {
      "response": "..."
    }
  }
}
```

## Limits

W7S validates the deployment token, checks app suspension, applies `ai.run` usage limits, and then calls the platform-owned AI binding. The first supported model is `@cf/meta/llama-3.1-8b-instruct-fp8`; more models can be enabled by the W7S platform operator.

See [`w7s-io/example-ai-joke`](https://github.com/w7s-io/example-ai-joke) for a full frontend plus backend example.
