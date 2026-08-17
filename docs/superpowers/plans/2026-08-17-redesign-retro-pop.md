# Redesign NeoVintage « Rétro-pop » Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the NeoVintage landing page (hero, all sections, nav, footer) into a "rétro-pop" visual identity — sticker-style cards, cream background with two full-bleed gradient bands, arch/polaroid photo framing — while replacing FontAwesome with `@lucide/angular` icons.

**Architecture:** Angular 21 standalone-components app (`Front/`). Each landing-page section is its own component with a co-located `.html`/`.scss`/`.ts`. This plan adds shared design tokens and two reusable global CSS classes (`.card-sticker`, `.pill`) to `Front/src/styles.scss`, then rewrites each component's template/styles to consume them, keeping each component's own responsive breakpoints (already established per file: 1740/1440/1250 or 1200/1024/768/600/480 depending on the file).

**Tech Stack:** Angular 21 (standalone components, SSR via `@angular/ssr` + Express), SCSS with global CSS custom properties in `:root`, `@lucide/angular` for icons (replacing `@fortawesome/fontawesome-free`).

## Global Constraints

- The orange→fuchsia gradient is a client requirement and must not change: `--neo-orange: rgb(255, 87, 51)`, `--neo-fuchsia: #ff3e89`, `--gradient-secondary: linear-gradient(35deg, var(--neo-orange), var(--neo-fuchsia))`. No task may edit these three values.
- This is a structural redesign (new HTML + SCSS), not a color-only reskin — every task below changes template markup, not just variable values.
- FontAwesome (`@fortawesome/fontawesome-free`) is fully removed from the project (`package.json`, `angular.json`) and replaced by `@lucide/angular`. No `fa-solid`/`fas fa-` classes may remain anywhere in `Front/src` after Task 1 + the section tasks that touch icons.
- SSR-safe: no direct `window`/`document` access outside the existing `isPlatformBrowser` guards already present in `photo-gallery`, `creators-gallery`, `reviews`. None of the tasks below touch that guard logic.
- **Testing approach for this plan:** this is a visual/structural redesign with no new business logic, so there are no new unit tests to write test-first. Each task's verification is: (a) `npm run build` succeeds (this also runs Angular's prerender, exercising SSR), (b) `npm test -- --watch=false --browsers=ChromeHeadless` still passes (the existing `*.component.spec.ts` smoke tests — "should create" — must keep passing unchanged), (c) a manual visual check of the touched section via `npm start` (`ng serve`) against the approved mockups from the design spec. Do not invent fabricated unit tests for CSS/markup changes.
- Run all commands from `Front/` (e.g. `cd Front` first, or prefix with the correct working directory).
- Reference spec: `docs/superpowers/specs/2026-08-17-redesign-retro-pop-design.md`.

---

## Task 1: Remove FontAwesome, install @lucide/angular, register dynamic icons

**Files:**
- Modify: `Front/package.json`
- Modify: `Front/angular.json:38`
- Modify: `Front/src/app/app.config.ts`
- Modify: `Front/src/app/components/edit-content/edit-content.component.ts`
- Modify: `Front/src/app/components/edit-content/edit-content.component.html`

**Interfaces:**
- Produces: `provideLucideIcons(LucideLeaf, LucideRecycle, LucideHeart)` registered in `appConfig.providers` — Task 4 (hero) depends on these three icons being registered for the dynamic `[lucideIcon]` binding on `app-cards-banner`.

- [ ] **Step 1: Uninstall FontAwesome and install @lucide/angular**

Run from `Front/`:
```bash
npm uninstall @fortawesome/fontawesome-free
npm install @lucide/angular
```

- [ ] **Step 2: Remove the FontAwesome stylesheet from the Angular build**

In `Front/angular.json`, inside `architect.build.options.styles`, remove the FontAwesome line so the array reads:

```json
"styles": [
  "src/styles.scss"
],
```

- [ ] **Step 3: Register the icons used dynamically by `app-cards-banner`**

Modify `Front/src/app/app.config.ts` to:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLucideIcons, LucideLeaf, LucideRecycle, LucideHeart } from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideLucideIcons(LucideLeaf, LucideRecycle, LucideHeart)
  ]
};
```

- [ ] **Step 4: Swap the two static FontAwesome icons in the admin panel (`edit-content`)**

This component is outside the visual redesign's scope, but it breaks once FontAwesome's CSS is gone, so it needs a mechanical icon swap only (no restyling).

In `Front/src/app/components/edit-content/edit-content.component.ts`, add the import and register the icons in `imports`:

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LucideLogOut, LucideSquarePen } from '@lucide/angular';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LucideLogOut, LucideSquarePen]
})
export class EditContentComponent implements OnInit {
  // ... rest of the class is unchanged
```

(Only the imports and the `@Component` decorator change — every method body stays exactly as it is today.)

In `Front/src/app/components/edit-content/edit-content.component.html`, replace lines 1-9:

```html
@if (isLoggedIn) {
  <div class="button-group">
    <button class="logout-button" (click)="logout()">
      <svg lucideLogOut></svg>
    </button>
    <button class="edit-button" (click)="isEditMode()">
      <svg lucideSquarePen></svg>
    </button>
  </div>
} @else {
  <div class="admin-trigger" (click)="handleAdminClick()" aria-hidden="true"></div>
}
```

(Rest of the file, from `@if (showLoginModal)` onward, is unchanged.)

- [ ] **Step 5: Verify no FontAwesome references remain in this task's scope**

Run:
```bash
grep -rn "fa-solid\|fas fa-\|far fa-\|fab fa-\|fortawesome" Front/src/app/components/edit-content Front/src/app/app.config.ts Front/angular.json Front/package.json
```
Expected: no matches (the rest of the codebase still has FontAwesome references at this point — that's expected, they're fixed in later tasks).

- [ ] **Step 6: Build and test**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: build succeeds; existing `edit-content.component.spec.ts` "should create" test still passes.

- [ ] **Step 7: Commit**

```bash
git add Front/package.json Front/package-lock.json Front/angular.json Front/src/app/app.config.ts Front/src/app/components/edit-content/edit-content.component.ts Front/src/app/components/edit-content/edit-content.component.html
git commit -m "chore(front): replace FontAwesome with @lucide/angular"
```

---

## Task 2: Foundational design tokens and reusable classes

**Files:**
- Modify: `Front/src/styles.scss`

**Interfaces:**
- Produces: CSS custom properties `--neo-cream`, `--neo-ink`, `--shadow-sticker-fuchsia`, `--shadow-sticker-orange`, `--shadow-sticker-yellow`, `--radius-card`, `--radius-pill`, `--radius-arch` (global, consumed by every later task). Global classes `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.icon-badge`, `.pill`, `.pill--gradient`, `.pill--light` (consumed by Tasks 5, 7-11).

- [ ] **Step 1: Add new tokens to `:root` and repoint `--background-primary`**

In `Front/src/styles.scss`, modify the `:root` block:

```scss
:root {
  /* Couleurs principales de la palette Neo Vintage */
  --neo-peach: rgb(246, 180, 167);
  --neo-pink: #f16c82;
  --neo-orange: rgb(255, 87, 51);
  --neo-fuchsia: #ff3e89;
  --neo-yellow: #ffd700;
  --neo-cream: #fdf3e7;
  --neo-ink: #2b2b2b;

  /* Couleurs de texte */
  --text-primary: #000000;
  --text-secondary: #ffffff;
  --text-tertiary: #333333;
  --text-stars: #838383;

  /* Couleurs de fond */
  --background-primary: var(--neo-cream);
  --background-secondary: var(--neo-peach);
  --background-tertiary: #f0f0f0;

  /* Couleurs des boutons */
  --button-color: var(--neo-pink);
  --button-color-hover: var(--neo-fuchsia);

  /* Variables additionnelles */
  --accent-color: var(--neo-fuchsia);
  --gradient-primary: linear-gradient(
    180deg,
    var(--neo-pink),
    var(--neo-peach)
  );
  --gradient-secondary: linear-gradient(
    35deg,
    var(--neo-orange),
    var(--neo-fuchsia)
  );

  /* Ombres et rayons "sticker" (rétro-pop) */
  --shadow-sticker-fuchsia: 5px 5px 0 var(--neo-fuchsia);
  --shadow-sticker-orange: 5px 5px 0 var(--neo-orange);
  --shadow-sticker-yellow: 5px 5px 0 var(--neo-yellow);
  --radius-card: 14px;
  --radius-pill: 999px;
  --radius-arch: 60px 60px 14px 14px;

  /* Polices de caractères */
  --font-heading: "Gliker", sans-serif;
  --font-body: "OpenSans", cursive;
  --font-decorative: "Retrograde", sans-serif;
}
```

- [ ] **Step 2: Add the shared sticker-card, icon-badge and pill classes**

At the end of `Front/src/styles.scss` (after the existing `.success-message` rule, before the commented-out fade-in animation block), add:

```scss
.card-sticker {
  background: #ffffff;
  border: 2.5px solid var(--neo-ink);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sticker-fuchsia);
}

.card-sticker--orange {
  box-shadow: var(--shadow-sticker-orange);
}

.card-sticker--yellow {
  box-shadow: var(--shadow-sticker-yellow);
}

.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-secondary);
  color: var(--text-secondary);
  margin-bottom: 12px;

  svg {
    width: 20px;
    height: 20px;
  }
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.pill--gradient {
  background: var(--gradient-secondary);
  color: var(--text-secondary);
}

.pill--light {
  background: #ffffff;
  color: var(--neo-fuchsia);
}
```

- [ ] **Step 3: Build to confirm SCSS compiles**

```bash
cd Front
npm run build
```
Expected: build succeeds with no SCSS errors. The site will look unchanged at this point (new tokens/classes aren't consumed by any template yet) except that the page background is now cream instead of `#f8f9fa` — confirm this with `npm start` and a quick look at any page.

- [ ] **Step 4: Commit**

```bash
git add Front/src/styles.scss
git commit -m "style(front): add retro-pop design tokens and sticker/pill utility classes"
```

---

## Task 3: Nav re-skin

**Files:**
- Modify: `Front/src/app/components/burger-menu/burger-menu.component.scss`

No HTML/TS changes — the nav's structure and accessibility behavior (from the earlier redesign commits) are kept as-is; only the color/material treatment changes from glassmorphism to the cream/ink rétro-pop look.

- [ ] **Step 1: Replace the glass background with a solid cream bar**

In `Front/src/app/components/burger-menu/burger-menu.component.scss`, replace lines 1-13:

```scss
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 40px;
  background-color: var(--neo-cream);
  border-bottom: 2px solid var(--neo-ink);
  z-index: 100;
```

- [ ] **Step 2: Give the mobile menu card a sticker border + decal shadow instead of a soft shadow**

Replace the `&-card` rule inside the `@media (max-width: 1024px)` block:

```scss
      &-card {
        position: relative;
        display: block;
        width: min(360px, 100%);
        max-height: 80vh;
        overflow-y: auto;
        padding: 48px 40px;
        border-radius: 24px;
        background: var(--gradient-secondary);
        border: 3px solid var(--neo-ink);
        box-shadow: 8px 8px 0 var(--neo-ink);
        transform: scale(0.94);
        transition: transform 0.25s ease;
      }
```

(The rest of the file — hamburger button, menu list, active states, mobile overlay scrim — is unchanged.)

- [ ] **Step 2: Build and visual check**

```bash
cd Front
npm run build
npm start
```
Open the dev server, confirm: nav bar is cream with a black bottom border (not translucent), the active link pill and hover states still read clearly on cream, and on a narrow viewport (<1024px) the mobile menu card shows a black border and offset black shadow instead of a soft drop shadow.

- [ ] **Step 3: Commit**

```bash
git add Front/src/app/components/burger-menu/burger-menu.component.scss
git commit -m "style(front): re-skin nav from glassmorphism to retro-pop cream/ink"
```

---

## Task 4: Hero restructure (header + cards-banner)

**Files:**
- Modify: `Front/src/app/components/header/header.component.html`
- Modify: `Front/src/app/components/header/header.component.scss`
- Modify: `Front/src/app/components/header/header.component.ts`
- Modify: `Front/src/app/components/cards-banner/cards-banner.component.html`
- Modify: `Front/src/app/components/cards-banner/cards-banner.component.scss`
- Modify: `Front/src/app/components/cards-banner/cards-banner.component.ts`

**Interfaces:**
- Consumes: `provideLucideIcons(LucideLeaf, LucideRecycle, LucideHeart)` from Task 1; `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.icon-badge`, `.pill`, `.pill--gradient` from Task 2.
- Produces: `CardsBannerComponent` gains `@Input() accent: 'fuchsia' | 'orange' | 'yellow' = 'fuchsia'` and its existing `@Input() icon: string` now holds a kebab-case Lucide icon name (e.g. `'leaf'`) instead of a FontAwesome class string.

- [ ] **Step 1: Replace `cards-banner.component.ts`**

```typescript
import { Component, Input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-cards-banner',
  imports: [LucideDynamicIcon],
  templateUrl: './cards-banner.component.html',
  styleUrl: './cards-banner.component.scss'
})
export class CardsBannerComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() accent: 'fuchsia' | 'orange' | 'yellow' = 'fuchsia';
}
```

- [ ] **Step 2: Replace `cards-banner.component.html`**

```html
<div
  class="card card-sticker"
  [class.card-sticker--orange]="accent === 'orange'"
  [class.card-sticker--yellow]="accent === 'yellow'"
>
  <div class="icon-badge">
    <svg [lucideIcon]="icon"></svg>
  </div>
  <h2 class="card-title">{{ title }}</h2>
  <p class="card-description">{{ description }}</p>
</div>

<div class="round">
  <div class="round-icon">
    <svg [lucideIcon]="icon"></svg>
  </div>
  <h2 class="round-title">{{ title }}</h2>
</div>
```

- [ ] **Step 3: Replace `cards-banner.component.scss`**

```scss
.card {
  width: 300px;
  padding: 24px;
  text-align: left;
  transition: transform 0.3s ease;

  .card-title {
    font-size: 1.3rem;
    margin: 4px 0 10px;
    color: var(--text-primary);
  }

  .card-description {
    font-size: 0.95rem;
    color: var(--text-tertiary);
    line-height: 1.4;
  }
}

.round {
  display: none;
}

@media screen and (max-width: 768px) {
  .card {
    display: none;
  }
  .round {
    display: flex;
    flex-direction: column;
    align-items: center;
    .round-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: var(--gradient-secondary);
      margin: 0 auto;

      svg {
        width: 32px;
        height: 32px;
        color: var(--text-secondary);
      }
    }
    .round-title {
      font-size: 1.2rem;
      margin: 12px 0 0;
      text-align: center;
      color: var(--text-primary);
    }
  }
}
```

- [ ] **Step 4: Replace `header.component.ts`**

```typescript
import { Component } from '@angular/core';
import { CardsBannerComponent } from '../cards-banner/cards-banner.component';

@Component({
  selector: 'app-header',
  imports: [CardsBannerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cards = [
    {
      icon: 'leaf',
      accent: 'fuchsia' as const,
      title: 'Mode Responsable',
      description:
        'Nos vêtements et accessoires de seconde main sont sélectionnés avec soin pour réduire l\'impact environnemental et sensibiliser à la fast fashion.'
    },
    {
      icon: 'recycle',
      accent: 'orange' as const,
      title: 'Économie Circulaire',
      description:
        'Donnez une nouvelle vie à des vêtements et accessoires uniques. Ensemble, promouvons une économie durable qui encourage le réemploi et valorise le partage.'
    },
    {
      icon: 'heart',
      accent: 'yellow' as const,
      title: 'Confiance et Solidarité',
      description:
        'Neo Vintage est plus qu\'une boutique. C\'est un espace chaleureux, où chacun peut s\'exprimer, échanger et retrouver confiance en soi grâce à la mode.'
    }
  ];
}
```

- [ ] **Step 5: Replace `header.component.html`**

```html
<section class="hero-container" id="banner">
  <span class="hero-badge">Friperie · Seconde main</span>

  <h1 class="hero-title">
    LA MODE <span class="hero-title-accent">RESPONSABLE</span>
  </h1>
  <p class="hero-subtitle">à portée de toutes et tous</p>

  <a class="pill pill--gradient hero-cta" href="#about">Découvrir la boutique</a>

  <div class="hero-polaroids">
    <img src="assets/images/friperie-1920w.webp" alt="Vêtements de la friperie Neo Vintage" class="hero-polaroid hero-polaroid--1" loading="lazy" />
    <img src="assets/images/banner1.webp" alt="Une femme avec un chapeau et un poncho coloré regarde l'objectif" class="hero-polaroid hero-polaroid--2" loading="lazy" />
    <img src="assets/images/creators-1920w.webp" alt="Créations artisanales mises en avant par Neo Vintage" class="hero-polaroid hero-polaroid--3" loading="lazy" />
  </div>
</section>

<div class="card-container">
  @for (card of cards; track $index) {
  <app-cards-banner
    [icon]="card.icon"
    [accent]="card.accent"
    [title]="card.title"
    [description]="card.description"
  >
  </app-cards-banner>
  }
</div>
```

- [ ] **Step 6: Replace `header.component.scss`**

```scss
.hero-container {
  position: relative;
  width: 100%;
  padding: 90px 20px 60px;
  text-align: center;
  background: var(--neo-cream);
  display: flex;
  flex-direction: column;
  align-items: center;

  .hero-badge {
    display: inline-block;
    font-family: var(--font-decorative);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--neo-fuchsia);
    border: 1.5px solid var(--neo-fuchsia);
    border-radius: var(--radius-pill);
    padding: 4px 16px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 3.5rem;
    line-height: 1.1;
    max-width: 900px;

    .hero-title-accent {
      color: var(--neo-orange);
    }
  }

  .hero-subtitle {
    font-family: var(--font-decorative);
    font-style: italic;
    font-size: 1.5rem;
    color: var(--neo-fuchsia);
    margin: 10px 0 30px;
  }

  .hero-cta {
    margin-bottom: 60px;
  }

  .hero-polaroids {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 24px;
    width: 100%;
    max-width: 900px;

    .hero-polaroid {
      width: 220px;
      height: 280px;
      object-fit: cover;
      background: #ffffff;
      border: 3px solid var(--neo-ink);
      border-radius: 10px;
      padding: 10px 10px 24px;
      box-shadow: 6px 6px 0 rgba(43, 43, 43, 0.15);

      &--1 {
        transform: rotate(-4deg);
      }
      &--2 {
        transform: rotate(2deg);
        width: 240px;
        height: 300px;
      }
      &--3 {
        transform: rotate(-2deg);
      }
    }
  }
}

.card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  padding: 0 20px 100px;
}

@media screen and (max-width: 1024px) {
  .hero-container {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-polaroids {
      .hero-polaroid {
        width: 160px;
        height: 210px;
        &--2 {
          width: 175px;
          height: 225px;
        }
      }
    }
  }
  .card-container {
    gap: 24px;
    padding: 0 20px 60px;
  }
}

@media screen and (max-width: 768px) {
  .hero-container {
    padding: 70px 16px 40px;
    .hero-title {
      font-size: 2rem;
    }
    .hero-subtitle {
      font-size: 1.2rem;
    }
    .hero-polaroids {
      flex-wrap: wrap;
      gap: 16px;
      .hero-polaroid {
        width: 130px;
        height: 170px;
        &--2 {
          width: 140px;
          height: 180px;
        }
      }
    }
  }
}

@media screen and (max-width: 425px) {
  .hero-container {
    .hero-title {
      font-size: 1.6rem;
    }
  }
  .card-container {
    gap: 20px;
  }
}
```

- [ ] **Step 7: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm in the browser: the hero shows the badge, centered title with the orange word, italic fuchsia subtitle, gradient pill CTA, and three rotated polaroid photos; below it the three sticker cards (fuchsia/orange/yellow shadows) render with the leaf/recycle/heart icons. Check the `<768px` breakpoint shows the compact round-icon layout instead of the full cards.

- [ ] **Step 8: Commit**

```bash
git add Front/src/app/components/header Front/src/app/components/cards-banner
git commit -m "feat(front): rebuild hero as retro-pop polaroid layout with sticker cards"
```

---

## Task 5: About section restructure

**Files:**
- Modify: `Front/src/app/components/about/about.component.html`
- Modify: `Front/src/app/components/about/about.component.scss`
- Modify: `Front/src/app/components/about/about.component.ts`

**Interfaces:**
- Consumes: `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.icon-badge` from Task 2.

- [ ] **Step 1: Replace `about.component.ts`**

```typescript
import { Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-about',
  imports: [LucideCheck],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
```

- [ ] **Step 2: Replace `about.component.html`**

```html
<section class="about-container" id="about">
  <div class="about-image">
    <img
      src="assets/images/about.webp"
      alt="Emmanuelle devant un mur coloré"
      loading="lazy"
    />
  </div>

  <div class="about-content">
    <span class="about-kicker">Qui sommes-nous</span>

    <h2 class="about-subtitle">Découvrez notre univers vintage</h2>

    <p class="about-text">
      Nous vous proposons une sélection unique de vêtements et accessoires de
      seconde main à petit prix. <br />
      Notre mission : sensibiliser à la fast fashion, promouvoir l'économie
      circulaire et offrir à chacun la possibilité de s'habiller avec style tout
      en respectant la planète. <br />
      Plus qu'un lieu de shopping, c'est un espace d'échange et de solidarité,
      pensé pour permettre à chacun de s'exprimer et de retrouver confiance en
      soi. <br />
      Ensemble, célébrons la mode autrement : plus responsable, plus accessible,
      et plus humaine.
    </p>

    <div class="about-cards">
      <div class="about-card card-sticker">
        <div class="icon-badge">
          <svg lucideCheck></svg>
        </div>
        <h4>Des trésors intemporels</h4>
        <p>
          Chaque vêtement et accessoire raconte une histoire. Minutieusement
          choisis, ils allient style rétro et qualité, pour que chacun trouve la
          pièce qui lui correspond.
        </p>
      </div>

      <div class="about-card card-sticker card-sticker--orange">
        <div class="icon-badge">
          <svg lucideCheck></svg>
        </div>
        <h4>Un engagement pour la planète</h4>
        <p>
          Nous valorisons la mode durable en donnant une seconde vie à des
          vêtements de qualité. Notre boutique est un lieu d'échange et de
          solidarité, pour consommer la mode autrement.
        </p>
      </div>

      <div class="about-card card-sticker card-sticker--yellow">
        <div class="icon-badge">
          <svg lucideCheck></svg>
        </div>
        <h4>Un espace convivial, plus qu'une friperie</h4>
        <p>
          Chez Neo Vintage, nous imaginons un lieu d'échange, de solidarité et
          de bienveillance. Pour nous, chaque vêtement peut être bien plus qu'un
          simple objet : il a le pouvoir de redonner confiance et d'inspirer
          ceux qui en ont besoin.
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace `about.component.scss`**

```scss
.about-container {
  padding: 70px 0 120px 0;
  display: flex;
  background: var(--neo-cream);

  .about-image {
    width: 50%;
    display: flex;
    justify-content: center;

    img {
      margin: auto;
      width: 65%;
      max-height: 80%;
      border-radius: var(--radius-arch);
      border: 3px solid var(--neo-ink);
      object-fit: cover;
      object-position: right 50%;
      transform: rotate(-2deg);
    }
  }

  .about-content {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .about-kicker {
      display: block;
      font-family: var(--font-decorative);
      font-style: italic;
      font-size: 18px;
      color: var(--neo-fuchsia);
      padding-bottom: 6px;
      text-align: left;
    }

    .about-subtitle {
      font-size: 40px;
      padding-bottom: 10px;
      text-align: left;
    }

    .about-text {
      width: 80%;
      font-size: 16px;
      text-align-last: left;
      color: var(--text-tertiary);
      margin-bottom: 30px;
      line-height: 1.4;
    }

    .about-cards {
      display: flex;
      gap: 30px;
      justify-content: center;
      flex-direction: column;
      width: 70%;

      .about-card {
        padding: 24px;
        width: 100%;

        h4 {
          font-size: 18px;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        p {
          font-size: 16px;
          color: var(--text-tertiary);
          line-height: 1.4;
        }
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .about-container {
    .about-image {
      align-items: center;
    }

    .about-content {
      padding-right: 20px;

      .about-text {
        width: 90%;
      }

      .about-cards {
        width: 90%;
        .about-card {
          h4 {
            font-size: 16px;
          }

          p {
            font-size: 15px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .about-container {
    flex-direction: column;
    padding: 50px 50px 80px;

    .about-image {
      width: 100%;
      margin-bottom: 50px;
      img {
        height: 400px;
        object-position: right 10%;
      }
    }

    .about-content {
      width: 100%;
      padding: 0;
      align-items: center;

      .about-kicker,
      .about-subtitle {
        text-align: center;
      }

      .about-text {
        width: 80%;
      }

      .about-cards {
        width: 80%;
        .about-card {
          h4 {
            font-size: 14px;
          }

          p {
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .about-container {
    padding: 40px 20px 60px;

    .about-image {
      img {
        height: 300px;
      }
    }

    .about-content {
      .about-subtitle {
        text-align: center;
      }

      .about-text {
        width: 90%;
      }

      .about-cards {
        width: 90%;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .about-container {
    padding: 30px 20px 50px;

    .about-image {
      img {
        height: 300px;
      }
    }

    .about-content {
      .about-subtitle {
        font-size: 20px;
      }

      .about-text {
        width: 100%;
      }

      .about-cards {
        width: 100%;
      }
    }
  }
}
```

- [ ] **Step 4: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: the about photo is inside a rotated, black-bordered arch frame; the three atout cards render as white sticker cards with alternating fuchsia/orange/yellow shadows and a check icon badge.

- [ ] **Step 5: Commit**

```bash
git add Front/src/app/components/about
git commit -m "style(front): restyle About section with arch photo frame and sticker cards"
```

---

## Task 6: Services + cards-services restructure

**Files:**
- Modify: `Front/src/app/components/services/services.component.html`
- Modify: `Front/src/app/components/services/services.component.scss`
- Modify: `Front/src/app/components/services/services.component.ts`
- Modify: `Front/src/app/components/cards-services/cards-services.component.html`
- Modify: `Front/src/app/components/cards-services/cards-services.component.scss`
- Modify: `Front/src/app/components/cards-services/cards-services.component.ts`

**Interfaces:**
- Consumes: `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.pill`, `.pill--gradient` from Task 2.
- Produces: `CardsServicesComponent` gains `@Input() accent: 'fuchsia' | 'orange' | 'yellow' = 'fuchsia'`.

- [ ] **Step 1: Replace `services.component.ts`**

```typescript
import { Component } from '@angular/core';
import { CardsServicesComponent } from "../cards-services/cards-services.component";

@Component({
  selector: 'app-services',
  imports: [CardsServicesComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services = [
    {
      image: 'assets/images/friperie-1920w.webp',
      srcset: `
        assets/images/friperie-480w.webp 480w,
        assets/images/friperie-768w.webp 768w,
        assets/images/friperie-1920w.webp 1920w
      `,
      title: 'Friperie en ligne',
      description: 'Découvrez une sélection de vêtements vintage.',
      link: 'photos',
      accent: 'fuchsia' as const,
    },
    {
      image: 'assets/images/creators-1920w.webp',
      srcset: `
        assets/images/creators-480w.webp 480w,
        assets/images/creators-768w.webp 768w,
        assets/images/creators-1920w.webp 1920w
      `,
      title: 'Créateurs',
      description: 'Découvrez des créations uniques et artisanales.',
      link: 'creators',
      accent: 'orange' as const,
    },
    {
      image: 'assets/images/cart-1920w.webp',
      srcset: `
        assets/images/cart-480w.webp 480w,
        assets/images/cart-768w.webp 768w,
        assets/images/cart-1920w.webp 1920w
      `,
      title: 'Panier personnalisé',
      description: 'Composez votre propre sélection.',
      link: 'custom-shopping',
      accent: 'yellow' as const,
    },
  ];
}
```

- [ ] **Step 2: Replace `services.component.html`**

```html
<section class="services-container" id="services">
  <span class="services-kicker">Services Proposés</span>
  <h2 class="services-subtitle">Découvrez nos services les plus demandés</h2>
  <p class="services-text">Explorez une friperie unique, découvrez le talent de créateurs passionnés, et composez votre panier personnalisé pour une expérience shopping sur mesure.</p>
  <div class="services-content">
    @for (service of services; track $index) {
      <app-cards-services
        [image]="service.image"
        [srcset]="service.srcset"
        [title]="service.title"
        [description]="service.description"
        [link]="service.link"
        [accent]="service.accent"
      ></app-cards-services>
    }
  </div>
</section>
```

- [ ] **Step 3: Replace `services.component.scss`**

```scss
.services-container {
  background: var(--neo-cream);
  padding: 120px;

  .services-kicker {
    display: block;
    text-align: center;
    font-family: var(--font-decorative);
    font-style: italic;
    font-size: 18px;
    color: var(--neo-fuchsia);
    padding-bottom: 10px;
  }
  .services-subtitle {
    text-align: center;
    font-size: 40px;
    font-weight: 800;
    line-height: 1.4;
    color: var(--text-primary);
    margin: 0 auto;
    padding-bottom: 10px;
  }
  .services-text {
    width: 50%;
    text-align: center;
    font-size: 16px;
    color: var(--text-tertiary);
    margin: 0 auto 25px;
  }
  .services-content {
    display: flex;
    justify-content: center;
    gap: 8%;
    flex-wrap: wrap;
    height: fit-content;
  }
}

@media screen and (max-width: 1740px) {
  .services-container {
    padding: 100px;
  }
}

@media screen and (max-width: 1440px) {
  .services-container {
    padding: 80px;
  }
}

@media screen and (max-width: 1024px) {
  .services-container {
    padding: 60px;
    .services-text {
      width: 80%;
    }
    .services-content {
      gap: 5%;
      flex-direction: column;
      align-items: center;
    }
  }
}

@media screen and (max-width: 768px) {
  .services-container {
    padding: 40px;
    .services-kicker {
      font-size: 16px;
    }
    .services-subtitle {
      font-size: 32px;
    }
    .services-text {
      width: 100%;
    }
  }
}

@media screen and (max-width: 480px) {
  .services-container {
    padding: 20px;
    .services-kicker {
      font-size: 14px;
    }
    .services-subtitle {
      font-size: 28px;
    }
  }
}
```

- [ ] **Step 4: Replace `cards-services.component.ts`**

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-services',
  imports: [],
  templateUrl: './cards-services.component.html',
  styleUrl: './cards-services.component.scss'
})
export class CardsServicesComponent {
  @Input() image: string = '';
  @Input() srcset: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() link: string = '';
  @Input() accent: 'fuchsia' | 'orange' | 'yellow' = 'fuchsia';

  handleLinkClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollTo(sectionId);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
```

- [ ] **Step 5: Replace `cards-services.component.html`**

```html
<div
  class="card card-sticker"
  [class.card-sticker--orange]="accent === 'orange'"
  [class.card-sticker--yellow]="accent === 'yellow'"
>
  <img
    [src]="image"
    [srcset]="srcset"
    alt="{{ title }}"
    class="card-image"
    sizes="(max-width: 768px) 100vw, 50vw"
    loading="lazy"
  />
  <h3 class="card-title">{{ title }}</h3>
  <p class="card-description">{{ description }}</p>
  <a
    class="pill pill--gradient card-link"
    (click)="handleLinkClick($event, link)"
    href="#{{ link }}"
  >
    Voir plus
  </a>
</div>
```

- [ ] **Step 6: Replace `cards-services.component.scss`**

```scss
.card {
  text-align: center;
  transition: transform 0.3s ease;
  height: 550px;
  padding: 20px;
  overflow: hidden;

  .card-image {
    width: 100%;
    max-width: 400px;
    height: 260px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  .card-title {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  .card-description {
    font-size: 1rem;
    color: var(--text-tertiary);
    margin-bottom: 15px;
    height: 45px;
  }

  .card-link {
    width: fit-content;
    margin: 0 auto;
  }
}

@media screen and (max-width: 1740px) {
  .card {
    width: 300px;
    .card-image {
      width: 260px;
      height: 220px;
    }
  }
}

@media screen and (max-width: 1250px) {
  .card {
    width: 250px;
    .card-image {
      width: 210px;
      height: 180px;
    }
  }
}

@media screen and (max-width: 1024px) {
  .card {
    width: 400px;
    .card-image {
      width: 360px;
      height: 240px;
    }
  }
}

@media screen and (max-width: 768px) {
  .card {
    width: 300px;
    .card-image {
      width: 260px;
      height: 200px;
    }
  }
}
```

- [ ] **Step 7: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: services section is on cream (no longer full gradient), the three service cards are white sticker cards with alternating shadow colors and a gradient "Voir plus" pill.

- [ ] **Step 8: Commit**

```bash
git add Front/src/app/components/services Front/src/app/components/cards-services
git commit -m "style(front): move Services to cream background with sticker cards"
```

---

## Task 7: Photo gallery → gradient band

**Files:**
- Modify: `Front/src/app/components/photo-gallery/photo-gallery.component.html`
- Modify: `Front/src/app/components/photo-gallery/photo-gallery.component.scss`
- Modify: `Front/src/app/components/photo-gallery/photo-gallery.component.ts`

- [ ] **Step 1: Modify `photo-gallery.component.ts` imports**

In `Front/src/app/components/photo-gallery/photo-gallery.component.ts`, add the Lucide import and register it:

```typescript
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { EditContentComponent } from '../edit-content/edit-content.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LucideStore } from '@lucide/angular';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  imports: [FormsModule, EditContentComponent, LucideStore],
  standalone: true,
  providers: [provideAnimations()],
  animations: [
    // ... unchanged, keep both existing triggers exactly as they are
```

(Everything below `animations: [` and the entire class body is unchanged — only the `import` line and the `imports` array entry are new.)

- [ ] **Step 2: Replace `photo-gallery.component.html`**

```html
<div class="gallery-container" id="photos">
  <div class="gallery-content">
    <span class="gallery-kicker">Pièces mises à l'honneur</span>
    <h2 class="gallery-subtitle">Friperie en ligne</h2>
    <p class="gallery-text">
      Découvrez une sélection unique de vêtements et accessoires de seconde main, choisis avec soin pour allier style, qualité et écoresponsabilité.
      Une manière simple et accessible de consommer autrement, depuis chez vous !
    </p>

    <div class="gallery-cards">
      <div class="gallery-card">
        <h4>
          <svg lucideStore></svg>
          Visitez notre boutique Vinted
        </h4>
        <p>
          Découvrez encore plus d'articles exclusifs sur notre page Vinted. Une collection variée pour compléter votre style avec des pièces uniques.
        </p>
      </div>

      <div class="gallery-vinted">
        <a href="https://www.vinted.fr/member/11729892" target="_blank" rel="noopener noreferrer" class="pill pill--light vinted-link">
          <span class="new-badge">Nouveau</span>
          Accéder à la boutique Vinted
        </a>

        <div class="legacy-stats">
          <div class="stats-card">
            <h3>Nos avis Vinted au 17/08/2026</h3>
            <div class="rating-display">
              <span class="rating">5.0</span>
              <div class="stars">
                @for (star of [1,2,3,4,5]; track $index) {
                  <span class="star">⭐</span>
                }
              </div>
              <span class="total-reviews">1591 avis vérifiés (707 évaluations membres, 884 automatiques)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="gallery-images">
    <div class="main-photo">
      <img
        [@crossFadeZoom]="selectedPhoto?.url"
        [src]="selectedPhoto?.url"
        [alt]="selectedPhoto?.title"
        loading="lazy"/>
        <p>{{ selectedPhoto?.title }}</p>
      </div>

      <div class="thumbnails">
        @for (photo of getThumbnails(); track photo) {
          <div
            class="thumbnail"
            (click)="selectPhoto(photo)">
            <img
              [@crossFadeZoomInv]="photo.url"
              [src]="photo.url"
              [alt]="photo.title"
              loading="lazy"/>
            </div>
          }
        </div>
      </div>
    </div>

    <app-edit-content
      [photos]="photos"
      (photosChange)="loadPhotos()"
    ></app-edit-content>
```

(This preserves the original file's exact tag nesting/closing structure — do not "fix" the indentation, just apply the class/kicker/icon changes shown.)

- [ ] **Step 3: Replace `photo-gallery.component.scss`**

```scss
.gallery-container {
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
  padding: 120px 40px;
  background: var(--gradient-secondary);

  .gallery-content {
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10px;
    .gallery-kicker {
      display: block;
      font-family: var(--font-decorative);
      font-style: italic;
      font-size: 18px;
      padding-bottom: 10px;
      color: #ffffff;
      text-align-last: left;
    }
    .gallery-subtitle {
      font-size: 40px;
      padding-bottom: 10px;
      text-align-last: left;
      color: #ffffff;
    }
    .gallery-text {
      font-size: 16px;
      text-align-last: left;
      color: #ffffff;
      opacity: 0.9;
      margin-bottom: 30px;
      line-height: 1.4;
    }
    .gallery-cards {
      display: flex;
      justify-content: center;
      flex-direction: column;
      overflow: hidden;
      gap: 25px;

      .gallery-vinted {
        display: flex;
        flex-direction: column-reverse;
        gap: 20px;

        .legacy-stats {
          border-radius: 8px;
          margin: auto;
          width: 80%;

          .stats-card {
            display: flex;
            flex-direction: column;
            align-items: center;

            h3 {
              font-family: 'OpenSans', sans-serif;
              font-weight: 700;
              letter-spacing: 0;
              color: #ffffff;
            }

            .rating-display {
              display: flex;
              align-items: center;
              justify-content: center;
              width: fit-content;
              gap: 20px;

              .rating {
                font-size: 24px;
                font-weight: bold;
                color: #ffffff;
              }

              .stars {
                color: var(--neo-yellow);

                .star {
                  font-size: 18px;
                }
              }

              .total-reviews {
                color: #ffffff;
                opacity: 0.85;
              }
            }
          }
        }

        .vinted-link {
          width: 50%;
          position: relative;
          margin: auto;

          .new-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: var(--neo-ink);
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 50px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        }
      }

      .gallery-card {
        background: #ffffff;
        border: 2.5px solid var(--neo-ink);
        border-radius: var(--radius-card);
        box-shadow: var(--shadow-sticker-yellow);
        padding: 30px;
        width: 100%;

        h4 {
          font-size: 18px;
          margin-bottom: 10px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;

          svg {
            width: 22px;
            height: 22px;
            color: var(--neo-orange);
          }
        }

        p {
          margin-left: 32px;
          font-size: 16px;
          color: var(--text-tertiary);
          line-height: 1.4;
        }
      }
    }
  }

  .gallery-images {
    width: 40%;
    height: 500px;
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border: 3px solid var(--neo-ink);
    border-radius: 20px;

    .main-photo {
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 400px;
        height: 400px;
        object-fit: contain;
      }
      animation: crossFade 0.4s ease-out;

      p {
        font-size: 16px;
        color: var(--text-primary);
        margin-top: 10px;
        font-style: italic;
        font-weight: 600;
        text-align: center;
      }
    }


    .thumbnails {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 32px;
      width: 200px;
      height: 500px;

      .thumbnail {
        cursor: pointer;
        position: relative;
        height: 120px;
        width: 120px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 12px;
        border: 2px solid var(--neo-ink);
        overflow: hidden;

        &:hover {
          transform: scale(1.1);
        }

        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }
    }
  }
}

@keyframes crossFade {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media screen and (max-width: 1440px) {
  .gallery-container {
    padding: 80px 20px;
    .gallery-images {
      height: 400px;
      overflow: hidden;
      .main-photo {
        img {
          width: 300px;
          height: 300px;
        }
      }
      .thumbnails {
        height: 400px;
        .thumbnail {
          height: 100px;
          width: 100px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .gallery-container {
    .gallery-content {
      .gallery-cards {
        .gallery-vinted {
          .legacy-stats {
            .stats-card {
              h3 {
                font-size: 18px;
              }
              .rating-display {
                .rating {
                  font-size: 20px;
                }
                .stars {
                  .star {
                    font-size: 16px;
                  }
                }
                .total-reviews {
                  font-size: 14px;
                }
              }
            }
          }
          .vinted-link {
            font-size: 14px;
            .new-badge {
              font-size: 8px;
              padding: 2px 4px;
            }
          }
        }
        .gallery-card {
          h4 {
            font-size: 16px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .gallery-images {
      .main-photo {
        img {
          width: 250px;
          height: 250px;
        }
        p {
          font-size: 14px;
        }
      }
      .thumbnails {
        width: 150px;
        .thumbnail {
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .gallery-container {
    padding: 60px 20px;
    flex-direction: column;
    .gallery-content {
      width: 80%;
      .gallery-cards {
        .gallery-vinted {
          .legacy-stats {
            .stats-card {
              h3 {
                font-size: 16px;
              }
              .rating-display {
                .rating {
                  font-size: 18px;
                }
                .stars {
                  .star {
                    font-size: 14px;
                  }
                }
                .total-reviews {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
    .gallery-images {
      width: 80%;
      height: 500px;
      .main-photo {
        img {
          width: 400px;
          height: 400px;
        }
        p {
          font-size: 16px;
        }
      }
      .thumbnails {
        width: 300px;
        height: 500px;
        gap: 50px;
        .thumbnail {
          height: 100px;
          width: 100px;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .gallery-container {
    padding: 40px 20px;
    .gallery-images {
      flex-direction: column;
      justify-content: space-between;
      gap: 0;
      width: 90%;
      .main-photo {
        height: 350px;
        flex-direction: column-reverse;
        img {
          width: 300px;
          height: 300px;
        }
        p {
          font-size: 20px;
          width: 100%;
          overflow: hidden;
        }
      }
      .thumbnails {
        flex-direction: row;
        width: 100%;
        height: 150px;
        gap: 10%;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .gallery-container {
    padding: 50px 20px;
    .gallery-content {
      width: 100%;
      .gallery-cards {
        .gallery-vinted {
          .legacy-stats {
            .stats-card {
              .rating-display {
                .rating {
                  font-size: 16px;
                }
                .stars {
                  .star {
                    font-size: 12px;
                  }
                }
                .total-reviews {
                  font-size: 10px;
                }
              }
            }
          }
          .vinted-link {
            width: 80%;
            .new-badge {
              font-size: 4px;
              padding: 2px 4px;
            }
          }
        }
        .gallery-card {
          h4 {
            font-size: 14px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .gallery-images {
      width: 100%;
      .main-photo {
        img {
          width: 250px;
          height: 250px;
        }
        p {
          font-size: 16px;
        }
      }
      .thumbnails {
        gap: 5%;
        .thumbnail {
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}
```

- [ ] **Step 4: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: the whole section is now a full-width orange→fuchsia band with white text; the photo viewer sits in a white, black-bordered box; the Vinted promo card is a white sticker card with a store icon; the "Accéder à la boutique Vinted" link is a white pill with fuchsia text.

- [ ] **Step 5: Commit**

```bash
git add Front/src/app/components/photo-gallery
git commit -m "style(front): turn Photo Gallery into a full-bleed gradient band"
```

---

## Task 8: Creators gallery restructure

**Files:**
- Modify: `Front/src/app/components/creators-gallery/creators-gallery.component.html`
- Modify: `Front/src/app/components/creators-gallery/creators-gallery.component.scss`

**Interfaces:**
- Consumes: `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.pill`, `.pill--gradient` from Task 2.

- [ ] **Step 1: Replace `creators-gallery.component.html`**

```html
<div class="creators-container" id="creators">
  <div class="creators-content">
    <span class="creators-kicker">Les créateurs et créatrices du mois</span>
    <h2 class="creators-subtitle">Découvrez des créations uniques et artisanales.</h2>
    <p class="creators-text">
      Nous mettons en lumière des créateurs, artisans et artistes locaux, en proposant leurs œuvres et créations.
      Soutenez le savoir-faire et la créativité tout en découvrant des pièces uniques et originales.
    </p>
  </div>

  <div class="creators-grid">
    @for (creator of creators; track creator; let i = $index) {
      <div class="creator-card card-sticker" [class.card-sticker--orange]="i % 3 === 1" [class.card-sticker--yellow]="i % 3 === 2">
        <img [src]="creator.image" [alt]="creator.title" loading="lazy"/>
        <div class="creator-info">
          <h3>{{creator.title}}</h3>
          <p>{{creator.subtitle}}</p>
          <a [href]="creator.url" target="_blank" rel="noopener noreferrer" class="pill pill--gradient">
            Découvrir la boutique
          </a>
        </div>
      </div>
    }
  </div>
</div>

<app-edit-content
  [creators]="creators"
  (creatorsChange)="loadCreators()"
></app-edit-content>
```

- [ ] **Step 2: Replace `creators-gallery.component.scss`**

```scss
.creators-container {
  width: 85%;
  margin: 0 auto;
  padding: 120px 0;
  background: var(--neo-cream);
 }

 .creators-content {
  text-align: center;
  margin-bottom: 40px;

  .creators-kicker {
    display: block;
    font-family: var(--font-decorative);
    font-style: italic;
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--neo-fuchsia);
  }

  .creators-subtitle {
    font-size: 40px;
    margin-bottom: 20px;
  }

  .creators-text {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    color: var(--text-tertiary);
  }
 }

 .creators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  padding: 20px 0;

  .creator-card {
    overflow: hidden;
    transition: transform 0.3s ease;

    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-bottom: 2.5px solid var(--neo-ink);
    }

    .creator-info {
      padding: 20px;
      text-align: center;

      h3 {
        font-size: 1.4rem;
        margin-bottom: 10px;
        color: var(--text-primary);
      }

      p {
        color: var(--text-tertiary);
        margin-bottom: 15px;
        line-height: 1.4;
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .creators-container {
    padding: 80px 0;
  }
}

@media screen and (max-width: 1024px) {
  .creators-container {
    width: 80%;
    padding: 60px 0;
  }
}

@media screen and (max-width: 768px) {
  .creators-container {
    width: 90%;
    padding: 40px 0;
  }
}

@media screen and (max-width: 480px) {
  .creators-container {
    width: 100%;
    padding: 50px 20px;
  }
}
```

- [ ] **Step 3: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: creator cards are white sticker cards with alternating shadow colors on cream background, and the CTA link is a gradient pill.

- [ ] **Step 4: Commit**

```bash
git add Front/src/app/components/creators-gallery
git commit -m "style(front): restyle Creators gallery cards as retro-pop stickers"
```

---

## Task 9: Custom shopping restructure

**Files:**
- Modify: `Front/src/app/components/custom-shopping/custom-shopping.component.html`
- Modify: `Front/src/app/components/custom-shopping/custom-shopping.component.scss`
- Modify: `Front/src/app/components/custom-shopping/custom-shopping.component.ts`

**Interfaces:**
- Consumes: `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.icon-badge` from Task 2.

- [ ] **Step 1: Replace `custom-shopping.component.ts`**

```typescript
import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { LucideShoppingCart, LucidePackagePlus } from '@lucide/angular';

@Component({
  selector: 'app-custom-shopping',
  imports: [CarouselComponent, LucideShoppingCart, LucidePackagePlus],
  templateUrl: './custom-shopping.component.html',
  styleUrl: './custom-shopping.component.scss'
})
export class CustomShoppingComponent {
  public slides = [
    {
      src: 'assets/images/moodboard1-1920w.webp',
      srcset: `
        assets/images/moodboard1-480w.webp 480w,
        assets/images/moodboard1-768w.webp 768w,
        assets/images/moodboard1-1920w.webp 1920w
      `,
    },
    {
      src: 'assets/images/moodboard2-1920w.webp',
      srcset: `
        assets/images/moodboard2-480w.webp 480w,
        assets/images/moodboard2-768w.webp 768w,
        assets/images/moodboard2-1920w.webp 1920w
      `,
    },
    {
      src: 'assets/images/moodboard3-1920w.webp',
      srcset: `
        assets/images/moodboard3-480w.webp 480w,
        assets/images/moodboard3-768w.webp 768w,
        assets/images/moodboard3-1920w.webp 1920w
      `,
    }
  ];
}
```

- [ ] **Step 2: Replace `custom-shopping.component.html`**

```html
<section class="custom-shopping-container" id="custom-shopping">
  <div class="carousel-container">
    <app-carousel [slides]="slides"></app-carousel>
  </div>

  <div class="custom-shopping-content">
    <span class="custom-shopping-kicker">Shopping personnalisé</span>

    <h2 class="custom-shopping-subtitle">Votre style sur-mesure</h2>

    <p class="custom-shopping-text">
      Vous avez une idée précise de ce que vous voulez, mais pas le temps ou les moyens de le trouver ? <br>
      Confiez-nous votre recherche !<br>
      Envoyez-nous votre moodboard ou vos inspirations, ainsi que vos préférences (taille, couleurs, styles) et nous dénicherons pour vous des pièces de seconde main adaptées à vos envies.<br>
      Un service sur-mesure pour un dressing éthique et stylé, sans effort !<br>
      Premier contact par mail:
      <a href="mailto:neovintage.friperie@gmail.com">neovintage.friperie&#64;gmail.com</a>
    </p>

    <div class="custom-shopping-cards">
      <div class="custom-shopping-card card-sticker">
        <div class="icon-badge">
          <svg lucideShoppingCart></svg>
        </div>
        <h4>
          Panier à 20€ *
        </h4>
        <p>
          Une tenue
        </p>
        <p>
          Un accessoire
        </p>
      </div>

      <div class="custom-shopping-card card-sticker card-sticker--orange">
        <div class="icon-badge">
          <svg lucideShoppingCart></svg>
        </div>
        <h4>
          Panier à 40€ *
        </h4>
        <p>
          Deux tenues
        </p>
        <p>
          Un accessoire
        </p>
      </div>

      <div class="custom-shopping-card card-sticker card-sticker--yellow">
        <div class="icon-badge">
          <svg lucidePackagePlus></svg>
        </div>
        <h4>
          Panier à 60€ *
        </h4>
        <p>
          Deux tenues
        </p>
        <p>
          Un accessoire
        </p>
        <p>
          Une veste,
          un manteau ou
          une paire de chaussures
        </p>
      </div>
    </div>
    <p class="price-text">* Le prix de base peut varier en fonction des matériaux utilisés et de la rareté des pièces.</p>
  </div>
</section>
```

- [ ] **Step 3: Replace `custom-shopping.component.scss`**

```scss
.custom-shopping-container {
  padding: 120px 0;
  margin: 0 auto;
  display: flex;
  gap: 100px;
  width: 85%;
  background: var(--neo-cream);

  .carousel-container {
    display: block;
    height: 600px;
    width: 30%;
  }

  .custom-shopping-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    width: 70%;

    .price-text {
      font-size: 14px;
      color: var(--text-stars);
      text-align: center;
    }

    .custom-shopping-kicker {
      display: block;
      font-family: var(--font-decorative);
      font-style: italic;
      font-size: 18px;
      color: var(--neo-fuchsia);
      text-align: left;
    }

    .custom-shopping-subtitle {
      font-size: 40px;
      color: var(--text-primary);
      text-align: left;
    }

    .custom-shopping-text {
      font-size: 16px;
      color: var(--text-tertiary);
      line-height: 1.4;
      margin-bottom: 30px;
      text-align: left;
    }

    .custom-shopping-cards {
      display: flex;
      gap: 30px;
      justify-content: center;

      .custom-shopping-card {
        padding: 30px;
        flex: 1;
        max-width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        h4 {
          font-size: 18px;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          color: var(--text-tertiary);
          line-height: 1.4;
        }
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .custom-shopping-container {
    padding: 80px 0;
    .custom-shopping-content {
      .custom-shopping-cards {
        .custom-shopping-card {
          padding: 20px;
          h4 {
            font-size: 16px;
          }
          p {
            font-size: 15px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .custom-shopping-container {
    gap: 50px;
  }
}

@media screen and (max-width: 1024px) {
  .custom-shopping-container {
    width: 80%;
    flex-direction: column-reverse;
    .carousel-container {
      height: 500px;
      width: 100%;
    }
    .custom-shopping-content {
      width: 100%;
    }
  }
}

@media screen and (max-width: 768px) {
  .custom-shopping-container {
    width: 90%;
    padding: 40px 0;
  }
}

@media screen and (max-width: 600px) {
  .custom-shopping-container {
    .custom-shopping-content {
      .custom-shopping-cards {
        flex-direction: column;
        gap: 20px;
        .custom-shopping-card {
          padding: 20px;
          max-width: 100%;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .custom-shopping-container {
    width: 100%;
    padding: 50px 20px;
  }
}
```

- [ ] **Step 4: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: cream background, three sticker pricing cards with alternating shadows and shopping-cart/package-plus icons.

- [ ] **Step 5: Commit**

```bash
git add Front/src/app/components/custom-shopping
git commit -m "style(front): restyle Custom Shopping pricing cards as retro-pop stickers"
```

---

## Task 10: Reviews + review-form restructure

**Files:**
- Modify: `Front/src/app/components/reviews/reviews.component.html`
- Modify: `Front/src/app/components/reviews/reviews.component.scss`
- Modify: `Front/src/app/components/reviews/reviews.component.ts`
- Modify: `Front/src/app/components/review-form/review-form.component.html`
- Modify: `Front/src/app/components/review-form/review-form.component.scss`

**Interfaces:**
- Consumes: `.card-sticker`, `.card-sticker--orange`, `.card-sticker--yellow`, `.pill`, `.pill--gradient`, `.pill--light` from Task 2.

- [ ] **Step 1: Modify `reviews.component.ts` imports**

```typescript
import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';
import { ReviewFormComponent } from "../review-form/review-form.component";
import { LucideCircleCheck, LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [CommonModule, ReviewFormComponent, LucideCircleCheck, LucideStar]
})
export class ReviewsComponent implements OnInit {
  // ... rest of the class is unchanged
```

(Only the import line and `imports` array change; every method body stays exactly as it is today.)

- [ ] **Step 2: Replace `reviews.component.html`**

```html
<div class="reviews-container" id="reviews">
  <div class="current-reviews">

    <div class="ratings-summary">
      <div class="average-rating">
        <span class="rating-kicker">Notre réputation</span>
        <h2 class="rating-subtitle">Avis clients vérifiés</h2>
        <p class="rating-description">
          Découvrez ce que notre communauté pense de nos services et de nos produits. Chaque avis est vérifié pour garantir son authenticité.
        </p>

        <div class="rating-stats">
          <span class="big-rating">{{ averageRating.toFixed(1) }}</span>
          <div class="rating-details">
            <div class="stars">
              @for (star of [1,2,3,4,5]; track $index) {
                <span
                  [class.filled]="star <= averageRating"
                  class="star">★
                </span>
              }
            </div>
            <span class="total-count">Basé sur {{ reviews.length }} avis</span>
          </div>
        </div>

        <div class="rating-highlights">
          <div class="highlight-item">
            <svg lucideCircleCheck></svg>
            <span>100% des avis sont vérifiés</span>
          </div>
          <div class="highlight-item">
            <svg lucideStar></svg>
            <span>{{ getPositiveReviewsPercentage() }}% d'avis positifs</span>
          </div>
        </div>

        <div class="review-cta">
          <p class="review-prompt">Vous avez acheté chez nous ? Partagez votre expérience !</p>
          <app-review-form></app-review-form>
        </div>
      </div>
    </div>

    <div class="reviews-carousel">
      <button (click)="previous()" [disabled]="currentStartIndex === 0" class="carousel-button">
        <span class="button-icon">◀</span>
      </button>

      <div class="reviews-list">
        @for (review of visibleReviews; track $index) {
          <div class="review-card card-sticker" [class.card-sticker--orange]="$index % 3 === 1" [class.card-sticker--yellow]="$index % 3 === 2">
            <div class="review-content">
              <div class="review-header">
                <span class="author">{{ review.authorInitials }}</span>
                <div class="rating-stars">
                  @for (star of [1,2,3,4,5]; track $index) {
                    <span
                      [class.filled]="star <= review.rating"
                      class="star">★
                    </span>
                  }
                </div>
              </div>
              <span class="review-date">{{ review.date | date:'dd/MM/yyyy' }}</span>
              <div class="product-name">
                Article : {{ review.productName }}
              </div>
              @if (review.comment.length > 100) {
                <p class="review-comment">{{ review.comment | slice: 0:100 }}...</p>
                <button (click)="openModal(review)" class="read-more">Lire la suite</button>
              } @else {
                <p class="review-comment">{{ review.comment }}</p>
              }
            </div>
            @if (review.verified) {
              <div class="verified-badge">
                ✓ Achat vérifié
              </div>}
          </div>
        }
      </div>

      <button (click)="next()" [disabled]="currentStartIndex + maxDisplayed >= reviews.length" class="carousel-button">
        <span class="button-icon">▶</span>
      </button>
    </div>

    <div class="legal-notice">
      * Ces avis sont collectés et publiés conformément aux lois en vigueur sur les avis en ligne.
      Chaque avis est vérifié et publié avec le consentement de son auteur.
    </div>

  </div>
</div>

@if (selectedReview) {
  <div class="modal-overlay" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <button class="close-modal" (click)="closeModal()">×</button>
      <h2>{{ selectedReview.productName }}</h2>
      <div class="review-rating">
        <div class="rating-stars">
          @for (star of [1,2,3,4,5]; track $index) {
            <span
              [class.filled]="star <= selectedReview.rating"
              class="star">★
            </span>
          }
        </div>
      </div>
      <p class="review-comment">{{ selectedReview.comment }}</p>
      <div class="review-author">
        <span>{{ selectedReview.authorInitials }}</span>
      </div>
      <div class="review-date">
        <span>{{ selectedReview.date | date: 'dd/MM/yyyy' }}</span>
      </div>
    </div>
  </div>
}
```

- [ ] **Step 3: Replace `reviews.component.scss`**

```scss
.reviews-container {
  width: 100%;
  margin: 0 auto;
  padding: 120px 40px 60px;
  background: var(--gradient-secondary);

  .current-reviews {

    .ratings-summary {
      border-radius: 15px;

      .average-rating {
        text-align: center;

        .rating-kicker {
          display: block;
          font-family: var(--font-decorative);
          font-style: italic;
          color: #ffffff;
          font-size: 18px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .rating-subtitle {
          font-size: 40px;
          padding-bottom: 10px;
          color: #ffffff;
        }

        .rating-description {
          color: #ffffff;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .rating-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;

          .big-rating {
            font-size: 3.5rem;
            font-weight: bold;
            color: #ffffff;
          }

          .rating-details {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;

            .stars {
              display: flex;
              gap: 5px;

              .star {
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.4);

                &.filled {
                  color: var(--neo-yellow);
                }
              }
            }

            .total-count {
              color: #ffffff;
              opacity: 0.9;
              font-size: 0.9rem;
            }
          }
        }

        .rating-highlights {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 30px;

          .highlight-item {
            display: flex;
            align-items: center;
            gap: 10px;

            svg {
              width: 20px;
              height: 20px;
              color: #ffffff;
            }

            span {
              color: #ffffff;
            }
          }
        }

        .review-cta {
          margin: 40px auto 20px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          width: 50%;

          .review-prompt {
            color: #ffffff;
            margin-bottom: 20px;
            font-size: 1.1rem;
          }
        }
      }
    }
    .reviews-carousel {
      display: flex;
      align-items: center;
      gap: 10px;

      .carousel-button {
        width: 60px;
        height: 60px;
        background: #ffffff;
        color: var(--neo-orange);
        border: 2.5px solid var(--neo-ink);
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        padding: 10px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        &:disabled {
          visibility: hidden;
        }
        &:hover:not(:disabled) {
          transform: translateY(-2px);
        }
      }

      .reviews-list {
        display: flex;
        justify-content: center;
        gap: 20px;
        overflow: hidden;
        flex-wrap: wrap;

        .review-card {
          flex: 1;
          max-width: calc(100% / 4 - 20px);
          padding: 20px;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .review-content {
            overflow: hidden;
            .review-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 15px;
              margin-bottom: 10px;

              .author {
                font-weight: bold;
                color: var(--text-primary);

              }

              .rating-stars {
                .star {
                  font-size: 18px;
                  color: var(--background-tertiary);

                  &.filled {
                    color: var(--neo-yellow);
                  }
                }
              }
            }

            .review-date {
              color: var(--text-tertiary);
              font-size: 0.9em;
            }

            .product-name {
              height: 40px;
              color: var(--text-tertiary);
              margin: 10px 0;
              font-size: 0.9em;
              overflow: hidden;
            }

            .review-comment {
              margin: 10px 0;
              line-height: 1.5;
              color: var(--text-primary);
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .read-more {
              background: none;
              border: none;
              color: var(--neo-orange);
              cursor: pointer;
              font-size: 0.9rem;
              margin-top: 5px;
              text-decoration: underline;
              padding: 0;

              &:hover {
                color: var(--neo-fuchsia);
              }
            }
          }

          .verified-badge {
            color: var(--neo-orange);
            font-size: 0.9em;
            margin-top: 10px;
            overflow: hidden;
          }
        }
      }
    }

    .legal-notice {
      margin: 30px 0 0;
      border-radius: 8px;
      font-size: 0.9em;
      color: #ffffff;
      opacity: 0.85;
      text-align: center;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  .modal-content {
    background: var(--neo-cream);
    border: 3px solid var(--neo-ink);
    border-radius: 10px;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    position: relative;
    .close-modal {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-primary);

      &:hover {
        color: var(--neo-orange);
      }
    }
    .review-comment {
      margin: 20px 0;
      line-height: 1.6;
    }

    .review-author,
    .review-date,
    .review-rating {
      margin: 10px 0;
      color: var(--text-stars);
    }

    .review-rating {
      .rating-stars {
        color: var(--neo-yellow);
      }
    }
  }
}


@media screen and (max-width: 1440px) {
  .reviews-container {
    padding: 80px 20px;
    .current-reviews {
      .reviews-carousel {
        .reviews-list {
          gap: 15px;
          .review-card {
            height: 350px;
            max-width: calc(100% / 3 - 15px);
          }
        }
      }
      .ratings-summary {
        .average-rating {
          .review-cta {
            width: 70%;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .reviews-container {
    width: 100%;
    padding: 60px 20px;
    .current-reviews {
      .reviews-carousel {
        .reviews-list {
          gap: 15px;
          .review-card {
            height: 350px;
            max-width: calc(100% / 2 - 15px);
          }
        }
      }
      .ratings-summary {
        .average-rating {
          .review-cta {
            width: 100%;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .reviews-container {
    padding: 40px 20px;
    .current-reviews {
      .reviews-carousel {
        .carousel-button {
          width: 44px;
          height: 44px;
          font-size: 16px;
        }
        .reviews-list {
          gap: 15px;
          .review-card {
            height: 350px;
            max-width: calc(100% / 1);
          }
        }
      }
      .ratings-summary {
        .rating-highlights {
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .reviews-container {
    padding: 50px 20px;
    .current-reviews {
      .reviews-carousel {
        .carousel-button {
          width: 44px;
          height: 44px;
          font-size: 16px;
        }
      }
      .legal-notice {
        margin: 30px 0 0;
      }
    }
  }
}
```

- [ ] **Step 4: Replace `review-form.component.html`**

```html
<div class="add-review-button">
  <button (click)="showForm = !showForm" class="pill pill--light">
    {{ showForm ? 'Fermer' : 'Laisser un avis' }}
  </button>
</div>

@if (showForm) {
  <div class="review-form-container card-sticker">
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
      <h3>Donnez votre avis</h3>

      <div class="form-group">
        <label>Note *</label>
        <div class="rating-input">
          @for (star of [5,4,3,2,1]; track $index) {
            <span
              (click)="selectRating(star)"
              [class.filled]="star <= reviewForm.get('rating')?.value"
              class="star clickable">★
            </span>
          }
        </div>
        @if (reviewForm.get('rating')?.errors?.['required'] && reviewForm.get('rating')?.touched) {
          <div class="error-message">
            Veuillez donner une note
          </div>
        }
      </div>

      <div class="form-group">
        <label>Initiales *</label>
        <input type="text" formControlName="authorInitials" maxlength="3" placeholder="Ex: A.B.">
        @if (reviewForm.get('authorInitials')?.errors?.['required'] && reviewForm.get('authorInitials')?.touched) {
          <div class="error-message">
            Les initiales sont requises
          </div>
        }
      </div>

      <div class="form-group">
        <label>Produit acheté *</label>
        <input type="text" formControlName="productName" placeholder="Nom du produit">
        @if (reviewForm.get('productName')?.errors?.['required'] && reviewForm.get('productName')?.touched) {
        <div class="error-message">
          Le nom du produit est requis
        </div>
        }
      </div>

      <div class="form-group">
        <label>Votre commentaire *</label>
        <textarea formControlName="comment" rows="4" placeholder="Partagez votre expérience d'achat"></textarea>
        @if (reviewForm.get('comment')?.errors?.['required'] && reviewForm.get('comment')?.touched) {
          <div class="error-message">
            Un commentaire est requis
          </div>
        }
      </div>

      <div class="form-group checkbox">
        <label>
          <input type="checkbox" formControlName="consent">
          J'accepte que mon avis soit publié sur ce site *
        </label>
        @if (reviewForm.get('consent')?.errors?.['required'] && reviewForm.get('consent')?.touched) {
          <div class="error-message">
            Vous devez accepter la publication de votre avis
          </div>
        }
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="!reviewForm.valid || isSubmitting" class="pill pill--gradient form-submit">
          {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis' }}
        </button>
      </div>

      @if (submitSuccess) {
        <div class="success-message">
          Merci ! Votre avis a été envoyé avec succès.
        </div>
      }
    </form>
  </div>
}
```

- [ ] **Step 5: Replace `review-form.component.scss`**

```scss
.add-review-button {
  text-align: center;
  margin: 20px 0;
}

.review-form-container {
  margin: 20px auto;
  padding: 24px;
  max-width: 500px;

  h3 {
    color: var(--text-primary);
  }

  .review-form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-weight: bold;
        color: var(--text-primary);

      }

      input,
      textarea {
        padding: 10px;
        border: 1px solid var(--background-tertiary);
        border-radius: 8px;
        font-size: 14px;

        color: var(--text-tertiary);

        &::placeholder {
          color: var(--text-tertiary);
        }
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .rating-input {
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      gap: 8px;

      .star {
        font-size: 24px;
        cursor: pointer;
        transition: color 0.2s;
        color: var(--text-stars);

        &.clickable:hover,
        &.clickable:hover ~ .clickable,
        &.filled {
          color: var(--neo-orange);
        }
      }
    }

    .checkbox {
      flex-direction: column;
      align-items: center;
      justify-content: center;

      label {
        display: flex;
        align-items: center;
        gap: 10px;
        input {
          width: 20px;
          height: 20px;
        }
      }
    }

    .form-actions {
      margin-top: 20px;
      display: flex;
      justify-content: center;

      .form-submit {
        width: 100%;

        &:disabled {
          background: var(--background-tertiary);
          color: var(--text-tertiary);
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .review-form-container {
    width: 80%;
  }
}

@media screen and (max-width: 768px) {
  .review-form-container {
    width: 90%;
    .review-form {
      .form-group.checkbox {
        label {
          font-size: 0.8rem;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .review-form-container {
    width: 100%;
  }
}
```

- [ ] **Step 6: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: reviews section is a full-width gradient band with white text, review cards are white stickers with alternating shadows, the "Laisser un avis" pill is white/fuchsia, and the expanded review form is a white sticker card with a gradient submit pill.

- [ ] **Step 7: Commit**

```bash
git add Front/src/app/components/reviews Front/src/app/components/review-form
git commit -m "style(front): turn Reviews into a gradient band with sticker review cards"
```

---

## Task 11: Footer restructure

**Files:**
- Modify: `Front/src/app/components/footer/footer.component.scss`

No HTML/TS changes — only the background and social-icon treatment change.

- [ ] **Step 1: Replace `footer.component.scss`**

```scss
.footer-container {
  width: 100%;
  padding: 4rem 2rem;
  background: var(--neo-ink);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-secondary);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .footer-main {
      display: flex;
      justify-content: space-between;
      gap: 8rem;
      flex-wrap: wrap;

      .footer-text-container {
        flex: 1;
        min-width: 300px;
        text-align: center;

        .footer-title {
          color: #ffffff;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .footer-text {
          color: #ffffff;
          line-height: 1.8;
          font-size: 1.1rem;
          opacity: 0.85;
          word-wrap: break-word;

          .footer-text-link {
            color: var(--neo-yellow);
            text-decoration: none;
            transition: opacity 0.3s ease;
            font-size: 28px;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        .social-media-container {
          display: flex;
          gap: 1.5rem;
          margin: 1rem auto 0;
          flex-wrap: wrap;
          justify-content: center;
          overflow: visible;

          .social-media-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: var(--radius-pill);
            background: rgba(255, 255, 255, 0.1);
            text-decoration: none;
            transition: transform 0.3s ease, background-color 0.3s ease;

            &:hover {
              transform: translateY(-5px);
              background: var(--gradient-secondary);
            }

            .social-media-icon {
              width: 32px;
              height: 32px;
              object-fit: contain;
            }
          }
        }
      }
    }

    .footer-legal {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

      .legal-links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;

        a {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;
          opacity: 0.8;
          transition: opacity 0.3s ease;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .footer-container {
    padding: 4rem 1rem;

    .footer-content {
      .footer-main {
        gap: 4rem;

        .footer-text-container {
          .footer-title {
            font-size: 1.6rem;
          }

          .footer-text {
            font-size: 1rem;
            .footer-text-link {
              font-size: 24px;
            }
          }

          .social-media-container {
            gap: 1rem;

            .social-media-link {
              width: 52px;
              height: 52px;

              .social-media-icon {
                width: 26px;
                height: 26px;
              }
            }
          }
        }
      }

      .footer-legal {
        .legal-links {
          gap: 1rem;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .footer-container {
    padding: 4rem 1rem;

    .footer-content {
      .footer-main {
        flex-direction: column;
        gap: 4rem;

        .footer-text-container {
          .footer-title {
            font-size: 1.4rem;
          }

          .footer-text {
            font-size: 0.9rem;
            .footer-text-link {
              font-size: 20px;
            }
          }

          .social-media-container {
            gap: 0.75rem;

            .social-media-link {
              width: 48px;
              height: 48px;

              .social-media-icon {
                width: 22px;
                height: 22px;
              }
            }
          }
        }
      }

      .footer-legal {
        .legal-links {
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
  }
}
```

- [ ] **Step 2: Build, test and visual check**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```
Confirm: footer background is dark ink with a thin gradient liseré at the top edge, social icons sit in subtle translucent circles that turn into the gradient on hover.

- [ ] **Step 3: Commit**

```bash
git add Front/src/app/components/footer/footer.component.scss
git commit -m "style(front): restyle footer with ink background and pill social icons"
```

---

## Task 12: Remove separators and clean up dead code

**Files:**
- Modify: `Front/src/app/pages/landing-page/landing-page.component.html`
- Modify: `Front/src/app/pages/landing-page/landing-page.component.ts`
- Delete: `Front/src/app/components/separate/separate.component.ts`
- Delete: `Front/src/app/components/separate/separate.component.html`
- Delete: `Front/src/app/components/separate/separate.component.scss`
- Delete: `Front/src/app/components/separate/separate.component.spec.ts`

`app-separate` is used only inside `landing-page.component.html`, so the component can be deleted entirely rather than left orphaned.

- [ ] **Step 1: Replace `landing-page.component.html`**

```html
<app-about appScrollAnimate [animationClass]="'animate-fade-in'"></app-about>
<app-services appScrollAnimate [animationClass]="'animate-fade-in'"></app-services>
<app-photo-gallery appScrollAnimate [animationClass]="'animate-fade-in'"></app-photo-gallery>
<app-creators-gallery appScrollAnimate [animationClass]="'animate-fade-in'"></app-creators-gallery>
<app-custom-shopping appScrollAnimate [animationClass]="'animate-fade-in'"></app-custom-shopping>
<app-reviews appScrollAnimate [animationClass]="'animate-fade-in'"></app-reviews>
```

- [ ] **Step 2: Replace `landing-page.component.ts`**

```typescript
import { Component } from '@angular/core';
import { AboutComponent } from "../../components/about/about.component";
import { CreatorsGalleryComponent } from "../../components/creators-gallery/creators-gallery.component";
import { CustomShoppingComponent } from "../../components/custom-shopping/custom-shopping.component";
import { PhotoGalleryComponent } from "../../components/photo-gallery/photo-gallery.component";
import { ReviewsComponent } from "../../components/reviews/reviews.component";
import { ServicesComponent } from "../../components/services/services.component";
import { ScrollAnimateDirective } from '../../shared/scroll-animate.directive';

@Component({
  selector: 'app-landing-page',
  imports: [
    ServicesComponent,
    AboutComponent,
    PhotoGalleryComponent,
    CreatorsGalleryComponent,
    CustomShoppingComponent,
    ReviewsComponent,
    ScrollAnimateDirective
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
```

- [ ] **Step 3: Delete the `separate` component directory**

```bash
git rm -r Front/src/app/components/separate
```

- [ ] **Step 4: Build and test**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: build succeeds with no unresolved-import errors for `SeparateComponent`; the Angular test runner no longer picks up `separate.component.spec.ts` (it's deleted) and every remaining spec still passes.

- [ ] **Step 5: Commit**

```bash
git add Front/src/app/pages/landing-page
git commit -m "chore(front): remove separator component, rhythm now comes from section backgrounds"
```

---

## Task 13: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Confirm no FontAwesome or app-separate references remain anywhere**

```bash
grep -rn "fa-solid\|fas fa-\|far fa-\|fab fa-\|fortawesome" Front/src
grep -rn "app-separate\|SeparateComponent" Front/src
```
Expected: no matches for either command.

- [ ] **Step 2: Full build (includes SSR prerender) and full test suite**

```bash
cd Front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: both succeed with zero errors/failures. `npm run build` exercises `prerender: true` from `angular.json`, which is the SSR safety check — a `window`/`document` misuse in a section would throw during prerender.

- [ ] **Step 3: Responsive check across breakpoints**

```bash
npm start
```
In the browser dev tools, check the full page at these widths, since they're the breakpoints already used across the touched files: 1920px, 1440px, 1024px, 768px, 480px, 375px. Confirm at each: no horizontal scrollbar, hero polaroids/cards wrap sensibly, gradient bands (photo gallery, reviews) stay full-bleed, nav collapses to the hamburger/modal below 1024px.

- [ ] **Step 4: Contrast check on the two gradient bands**

In the photo-gallery and reviews sections, confirm every text element sitting directly on the orange→fuchsia gradient is white (`#ffffff`) or near-white — not `var(--text-tertiary)` or `var(--neo-orange)`, which were the cream-background colors and would be low-contrast on the gradient. Cross-reference against Task 7 and Task 10's SCSS above; if you find a leftover dark-on-gradient rule, fix it there.

- [ ] **Step 5: Commit only if Step 4 required fixes**

If Step 4 found and fixed a contrast issue:
```bash
git add -u
git commit -m "fix(front): correct text contrast on gradient bands"
```
If no fixes were needed, skip this step (nothing to commit for a pass-only verification task).

---

**End of plan.** Once all 13 tasks are checked off, the `redesign` branch should be ready for a final look together before merging to `master`.
