# W7S Docs Agent Runbook

## Local Verification

For a fresh checkout, install both dependency sets using the deployment workflow's commands:

```sh
npm ci --prefer-offline
npm install --prefix landing --no-package-lock --legacy-peer-deps --prefer-offline
```

If cached registry metadata produces an `ETARGET` dependency-resolution error, retry the landing install with `--prefer-online` instead of `--prefer-offline` before changing dependency versions.

```sh
npm run check
```

## Deploy Verification

After pushing to `main`, check the GitHub Actions deploy run and verify the live docs route:

```sh
gh run list --limit 3
curl -fsS https://w7s.io/docs/backend-email/ | head
```
