# Gitignore Cleanup + Angular 20 + Vulnerability Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove tracked secrets and node_modules from git, upgrade Angular 19→20, and resolve all 33 front-end vulnerabilities.

**Architecture:** Three independent tasks run in order — gitignore first (security critical), Angular upgrade second, vulnerability check last (most vulns will be resolved by the upgrade itself).

**Tech Stack:** Angular 20, Angular CLI 20, Node.js/Express, git

---

## Files to Create / Modify

- Create: `.gitignore` (root — does not exist)
- Modify: `Front/.gitignore` — add `.env`
- Modify: `Front/package.json` — Angular version bumps (via `ng update`)
- Modify: `Front/package-lock.json` — idem
- Modify: `Front/angular.json` — may be patched by `ng update`
- Modify: `Front/tsconfig*.json` — may be patched by `ng update`
- Modify: `Front/src/**` — any breaking-change migrations applied by `ng update`

---

## Task 1 — Fix gitignore & Remove Tracked Secrets + node_modules

> **Security note:** The credentials in `Back/.env` (MongoDB password + JWT secret) are now in git history. After this task they will no longer be tracked, but the history still exposes them. **Rotate those credentials after this task.**

**Files:**
- Create: `.gitignore`
- Modify: `Front/.gitignore`

- [ ] **Step 1: Create a root `.gitignore`**

  Create `.gitignore` at the repository root with this exact content:

  ```gitignore
  # Environment secrets
  .env
  .env.*
  !.env.example

  # Node dependencies
  node_modules/

  # Build outputs
  dist/
  build/
  out-tsc/

  # OS
  .DS_Store
  Thumbs.db
  ```

- [ ] **Step 2: Add `.env` to `Front/.gitignore`**

  In `Front/.gitignore`, add after the `# Miscellaneous` section:

  ```
  # Environment
  .env
  .env.*
  !.env.example
  ```

- [ ] **Step 3: Untrack `Back/.env` and `Front/.env`**

  ```bash
  git rm --cached Back/.env
  git rm --cached Front/.env
  ```

  Expected output:
  ```
  rm 'Back/.env'
  rm 'Front/.env'
  ```

- [ ] **Step 4: Untrack `Back/node_modules` (1730 files)**

  ```bash
  git rm --cached -r Back/node_modules
  ```

  This will take ~10–30 seconds and produce ~1730 lines of `rm 'Back/node_modules/...'`. That's expected.

- [ ] **Step 5: Verify nothing sensitive is still tracked**

  ```bash
  git ls-files | grep -E "\.env|node_modules"
  ```

  Expected output: empty (no results).

- [ ] **Step 6: Commit**

  ```bash
  git add .gitignore Front/.gitignore
  git commit -m "fix: remove tracked .env and node_modules, add proper gitignore rules"
  ```

- [ ] **Step 7: Rotate compromised credentials (MANUAL)**

  The git history still contains `Back/.env`. You MUST:
  1. Go to MongoDB Atlas → Database Access → change the password for user `sebastiendechand`
  2. Generate a new JWT secret (e.g., `openssl rand -hex 64`)
  3. Update `Back/.env` locally with the new values
  4. Update the environment variables in Railway.app dashboard to match

  Do NOT commit the new `.env` — it is now gitignored.

---

## Task 2 — Upgrade Angular 19 → 20

**Files:**
- Modify: `Front/package.json`, `Front/package-lock.json`
- Modify: `Front/angular.json` (auto-patched by ng update)
- Modify: `Front/tsconfig*.json` (auto-patched)
- Modify: `Front/src/**` (auto-migrated by ng update schematics)

- [ ] **Step 1: Run `ng update` for Angular 20**

  ```bash
  cd Front
  npx ng update @angular/core@20 @angular/cli@20 --allow-dirty
  ```

  `ng update` runs migration schematics automatically. Watch the output — it will list which files it touched. If it asks questions, accept the defaults.

  Expected: success with a list of migrated files. If it fails with a peer dependency error, proceed to Step 2 instead.

- [ ] **Step 2: (Only if Step 1 fails) Force-update the packages**

  ```bash
  cd Front
  npx ng update @angular/core@20 @angular/cli@20 --force
  ```

- [ ] **Step 3: Verify the installed version**

  ```bash
  cd Front
  npx ng version
  ```

  Expected: `Angular: 20.x.x` and `Angular CLI: 20.x.x` in the output.

- [ ] **Step 4: Build to surface compilation errors**

  ```bash
  cd Front
  npm run build
  ```

  If the build succeeds with no errors, skip to Step 8.

  If there are TypeScript errors, proceed to Step 5.

- [ ] **Step 5: Fix `localStorage` SSR guards if flagged**

  Angular 20 tightens SSR checks. If you see errors like `localStorage is not defined`, add platform guards in `Front/src/app/services/auth.service.ts`:

  Current code at line 13:
  ```typescript
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  ```

  Replace the constructor and field with:
  ```typescript
  import { Inject, PLATFORM_ID } from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';

  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    this.tokenSubject = new BehaviorSubject<string | null>(token);
  }
  ```

  Also update `logout()` and `login()` to guard:
  ```typescript
  login(credentials: AdminCredentials): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
        }
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
  }
  ```

- [ ] **Step 6: Fix any other breaking changes reported by the build**

  Angular 20 breaking changes most likely to appear:
  - `EventEmitter` stricter typing → add explicit type params where needed
  - Removed deprecated `ComponentFactoryResolver` → use `createComponent` directly
  - `ModuleWithProviders` import changes

  For each error, read the message and fix the minimal change. The TypeScript error message will include the file path and line number.

- [ ] **Step 7: Re-run build until clean**

  ```bash
  cd Front
  npm run build
  ```

  Expected: `Build at: ... - Hash: ... - Time: ...ms` with no errors.

- [ ] **Step 8: Run tests**

  ```bash
  cd Front
  npm test -- --watch=false --browsers=ChromeHeadless
  ```

  Expected: all existing tests pass. If tests fail due to Angular 20 testing API changes (e.g., `TestBed` config), fix them — the patterns are the same as the component code fixes above.

- [ ] **Step 9: Commit**

  ```bash
  cd ..
  git add Front/
  git commit -m "feat: upgrade Angular 19 to 20"
  ```

---

## Task 3 — Verify and Fix Remaining Front-end Vulnerabilities

**Files:**
- Modify: `Front/package.json`, `Front/package-lock.json` (if any remain)

- [ ] **Step 1: Run `npm audit` after the Angular 20 upgrade**

  ```bash
  cd Front
  npm audit
  ```

  Expected: 0 vulnerabilities (the 33 Angular 19-era vulns are resolved by the v20 packages).

  If vulnerabilities remain, proceed to Step 2.

- [ ] **Step 2: (Only if vulns remain) Apply safe automatic fixes**

  ```bash
  cd Front
  npm audit fix
  ```

  Re-run `npm audit` to confirm the count dropped.

- [ ] **Step 3: (Only for remaining high/critical) Review and fix manually**

  For each remaining high or critical vulnerability shown by `npm audit`:
  - Read the advisory URL from the output
  - If the fix is a minor/patch version bump with no API changes, update directly:
    ```bash
    npm install <package>@<fixed-version>
    ```
  - Re-run `npm run build` to confirm no regressions.

- [ ] **Step 4: Final build + audit confirmation**

  ```bash
  cd Front
  npm run build && npm audit
  ```

  Expected: clean build, 0 high/critical vulnerabilities.

- [ ] **Step 5: Commit if packages were changed**

  ```bash
  cd ..
  git add Front/package.json Front/package-lock.json
  git commit -m "fix: resolve remaining front-end npm vulnerabilities"
  ```
