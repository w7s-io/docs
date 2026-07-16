# W7S Docs Agent Runbook

## Local Verification

```sh
npm run check
```

## Deploy Verification

After pushing to `main`, check the GitHub Actions deploy run and verify the live docs route:

```sh
gh run list --limit 3
curl -fsS https://w7s.io/docs/backend-email/ | head
```
