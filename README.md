# Passit — B2B distribúcia talianskych potravín

Webová prezentácia a dopytový systém pre distribútora prémiových talianskych potravín pre HoReCa segment (reštaurácie, pizzerie, hotely, catering).

## Stack

- **Framework:** [Astro](https://astro.build/) (striktný TypeScript, zero-JS default)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokeny)
- **Hosting & Runtime:** Cloudflare Workers + Static Assets
- **Validácia:** Zod (zdieľané schémy klient + server)
- **Formulár & Anti-spam:** Cloudflare Turnstile, honeypot, time-trap
- **Transakčný e-mail:** Resend (EU región)
- **Balíčkovač:** `pnpm` (iný nepoužívať)

## Požiadavky

- Node.js (verzia v `.nvmrc`)
- `pnpm` (riadené cez corepack alebo nainštalované globálne)

## Príkazy

| Účel                        | Príkaz                              |
| --------------------------- | ----------------------------------- |
| Inštalácia                  | `pnpm install --frozen-lockfile`    |
| Vývoj                       | `pnpm dev`                          |
| Prod-like lokálne           | `pnpm build && pnpm preview`        |
| Lint (s `--max-warnings 0`) | `pnpm lint`                         |
| Kontrola / oprava formátu   | `pnpm format:check` · `pnpm format` |
| Typecheck                   | `pnpm typecheck`                    |
| Unit testy                  | `pnpm test`                         |
| Kontrola `dist/`            | `pnpm check:dist`                   |
| E2E + a11y                  | `pnpm test:e2e`                     |
| Bezpečnosť API              | `pnpm test:security`                |
| Lighthouse CI               | `pnpm lhci`                         |
| Audit zraniteľností         | `pnpm audit --audit-level=high`     |

## Cloudflare Runbook

### 1. Lokálny vývoj a náhľad

Lokálny prod-like náhľad beží cez `wrangler dev` simulujúci Cloudflare Workers runtime a statické assety:

```bash
# Skopírujte šablónu premenných (necommituje sa!)
cp .dev.vars.example .dev.vars

# Spustenie prod-like buildu a náhľadu
pnpm build && pnpm preview
```

### 2. Infraštruktúra a prístupy (vykonáva vlastník)

Pre nasadzovanie cez CI je potrebné v GitHub repozitári (`Settings -> Secrets and variables -> Actions`) nastaviť secrets:

- `CLOUDFLARE_API_TOKEN`: Token s oprávnením `Workers:Edit` pre účet.
- `CLOUDFLARE_ACCOUNT_ID`: ID vášho Cloudflare účtu.

Pre staging a production prostredia sú v GitHube vytvorené Environments (`staging`, `production`).

### 3. Nastavenie Cloudflare Access pre Staging

Staging doména (`staging.passit.sk`) musí byť chránená cez Cloudflare Zero Trust / Access:

1. V Cloudflare Zero Trust prejdite do `Access -> Applications -> Add an application -> Self-hosted`.
2. Zadajte názov `Passit Staging` a doménu `staging.passit.sk`.
3. Nastavte pravidlo (Policy), napr. povoliť prístup iba e-mailom z vášho tímu cez jednorazový PIN kód (One-time PIN).
4. Pre CI behy (napr. E2E testy proti stagingu) vytvorte Service Token a vložte `CF-Access-Client-Id` a `CF-Access-Client-Secret` do GitHub Secrets.

### 4. Rollback (Návrat na predchádzajúcu verziu)

Ak sa po nasadení vyskytne problém, okamžitý rollback je možné vykonať cez Wrangler alebo Cloudflare Dashboard:

```bash
# Zoznam nasadení
pnpm wrangler deployments list --env production

# Okamžitý rollback na predchádzajúcu verziu
pnpm wrangler rollback <deployment-id> --env production
```

## Pravidlá a architektúra

- Záväzné pravidlá pre vývoj a AI agentov: [`AGENTS.md`](./AGENTS.md)
- Architektonický a fázový plán (zdroj pravdy): [`PLAN.md`](./PLAN.md)
