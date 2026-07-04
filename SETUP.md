# Setup — n3ary/branding

What a fresh checkout needs to deploy. For the local-machine one-time
setup (Cloudflare + GitHub credentials in this repo's Actions secrets).

## 1. Cloudflare API token

The deploy workflow needs an API token with permission to deploy to the
`branding` Cloudflare Pages project (and to attach the custom domain
the first time).

### Create it

1. Go to <https://dash.cloudflare.com/profile/api-tokens>.
2. Click **Create Token** → **Create Custom Token** (don't use a template;
   the deploy needs both Pages:Edit and the Account Settings scope for
   the pre-flight `whoami` lookup).
3. Name: `github-actions-deploy — n3ary/branding` (so it's recognisable
   in the audit log).
4. Permissions:

   | Scope | Permission | Access |
   |---|---|---|
   | Account — Account Settings | Read | Account |
   | Account — Pages | Edit | Account |

5. Account resources: include your account (`n3ary`).
6. TTL: 1 year (rotate annually; put a reminder on the calendar).
7. Click **Continue to summary** → **Create Token**.
8. **Copy the token immediately** — Cloudflare shows it once.

### Verify it locally

```bash
export CLOUDFLARE_API_TOKEN=<paste>
# Get the account ID from the Cloudflare dashboard:
#   Workers & Pages → right sidebar → "Account ID" (copy button).
# Or run: npx wrangler@4 whoami  (uses OAuth, not the API token)
export CLOUDFLARE_ACCOUNT_ID=<from-dashboard>
npx wrangler@4 pages project list
# Should show: neary, branding, ...
```

If you see `Authentication error [code: 10000]`, the token's missing
the Account Settings:Read scope. Re-issue with the table above.

### Set it on the n3ary/branding repo

```bash
# The token is a credential — encrypted at rest, only exposed to
# workflow runs.
gh secret set CLOUDFLARE_API_TOKEN \
  --repo n3ary/branding \
  --body "<paste-the-token>"

# The account ID is treated as semi-sensitive. Set as a *secret* so
# it doesn't show in the public Variables tab. Functionally the
# same — both are exposed to the workflow as env — but keeping it
# out of the visible-to-readers tab avoids a stray screenshot or
# repo-scoped PAT leaking the org's Cloudflare account ID.
gh secret set CLOUDFLARE_ACCOUNT_ID \
  --repo n3ary/branding \
  --body "<from-dashboard>"
```

The first command writes the token to GitHub's encrypted store; the
second does the same for the account ID. Both are then exposed to the
workflow as `${{ secrets.CLOUDFLARE_API_TOKEN }}` and
`${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`.

### Rotate

The same `gh secret set` command overwrites. Re-issue the token at the
CF dashboard, then re-run the `gh secret set` line above with the new
value. No workflow changes needed.

## 2. Cloudflare Pages custom domain

The deploy ships to `branding-504.pages.dev` automatically (the
project's `*.pages.dev` alias). For `branding.n3ary.com`:

1. Cloudflare dashboard → **Workers & Pages** → `branding` → **Custom
   domains** → **Set up a custom domain**.
2. Enter `branding.n3ary.com`.
3. Cloudflare detects the existing CNAME in the `n3ary.com` zone
   (if any) or offers to create one. Accept.
4. Wait for the SSL cert to provision (~30 seconds). The custom
   domain shows **Active** when ready.

This step can only be done in the dashboard — the Pages custom-domain
API requires a token scope (`Account — Pages:Edit`) that the deploy
token already has, but the dashboard UI is simpler for a one-off.

## 3. (Optional) GitHub tokens

The workflows use GitHub's auto-provisioned `secrets.GITHUB_TOKEN` —
no manual GitHub PAT is needed for the deploy, the build, or any of
the standard operations. The `NPM_TOKEN` used in `n3ary/app` (for
installing `@n3ary/gtfs-spec` from GitHub Packages) is separate; see
[the app repo's `docs/`](https://github.com/n3ary/app/tree/main/docs)
for that setup.

If you ever need a fine-grained PAT for ad-hoc local operations
(for example, to run `gh` against the org from a CI step), create one
at <https://github.com/settings/personal-access-tokens/new> with the
minimum scopes that get the job done — typically `Contents: Read`
and `Metadata: Read`. Don't use a classic PAT; the fine-grained UI
makes it harder to over-scope by accident.

## Local development

The regen scripts run locally without any of the above. `pnpm install`
+ `pnpm run build` works out of the box — no Cloudflare or GitHub
credentials needed for local dev.

```bash
pnpm install
pnpm run build      # regenerates dist/
pnpm run check      # tsc --noEmit
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Authentication error [code: 10000]` from wrangler in CI | Token is missing Account Settings:Read | Re-issue with the permissions table above |
| `The Pages project "branding" does not exist` | Project not created yet | `npx wrangler@4 pages project create branding --production-branch main` |
| `Error: Cannot find module 'sharp'` at build time | `node_modules` not installed | `pnpm install` (or `pnpm install --no-frozen-lockfile` if the lockfile is stale) |
| `ERR_PNPM_IGNORED_BUILDS: workerd` at deploy | pnpm-workspace.yaml missing `workerd` in allowBuilds | Add it (see repo history) |
