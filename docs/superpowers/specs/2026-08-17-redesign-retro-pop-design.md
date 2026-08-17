# Redesign NeoVintage — Direction « Rétro-pop assumé »

**Date :** 2026-08-17
**Branche :** `redesign`
**Statut :** validé par Sébastien (session de brainstorming avec maquettes navigateur)

## Contexte

La nav a déjà été redessinée (sticky bar accessible, pilules, modal mobile — commits `3a90cc4` et `d2045b7`). Ce document définit la direction visuelle pour le reste du site : hero, sections de la landing page et footer.

Deux contraintes non négociables :

- **Le dégradé orange→fuchsia d'origine est une exigence du client** : `--neo-orange: rgb(255, 87, 51)`, `--neo-fuchsia: #ff3e89`, `--gradient-secondary: linear-gradient(35deg, ...)`. Il ne change pas.
- **Un redesign = nouvelles structures HTML + SCSS**, pas un simple échange de couleurs.

## Décisions validées

| Sujet | Décision |
|---|---|
| Direction générale | Rétro-pop assumé : formes organiques, typo Retrograde plus présente, badges/stickers, arrondis généreux |
| Nav existante | Adaptée au rétro-pop (structure conservée, habillage réchauffé) |
| Hero | Option C : typo centrale + rangée de polaroïds inclinés |
| Rythme de page | Fond crème calme + 2 bandes dégradé « moments forts » |
| Bandes dégradé | Galerie photos et Avis clients |
| Style de cartes | Option A : sticker/BD (fond blanc, bordure noire, ombre décalée colorée) |
| Icônes | FontAwesome remplacé par `@lucide/angular` (traits fins, cohérent avec le style rétro-pop épuré) |

## Icônes : migration FontAwesome → Lucide

FontAwesome (`@fortawesome/fontawesome-free`) est retiré du projet et remplacé par `@lucide/angular`. Choix motivé par le user : traits fins et géométriques, plus cohérent avec la direction rétro-pop épurée que les icônes FontAwesome pleines.

- Retrait de `@fortawesome/fontawesome-free` de `Front/package.json` et de la ligne `node_modules/@fortawesome/fontawesome-free/css/all.min.css` dans `Front/angular.json` (`architect.build.options.styles`)
- Ajout de `@lucide/angular`
- Icônes utilisées, importées individuellement par composant (tree-shaking) :
  - `header.component.ts` (cartes bannière) : `fa-solid fa-leaf` → `LucideLeaf`, `fa-solid fa-recycle` → `LucideRecycle`, `fa-solid fa-heart` → `LucideHeart`
  - `about.component.html` (3 cartes atouts) : `fa-solid fa-check` → `LucideCheck`
  - `custom-shopping.component.html` : `fa-solid fa-cart-shopping` (paniers 20€/40€) → `LucideShoppingCart`, `fa-solid fa-cart-plus` (panier 60€) → `LucidePackagePlus`
  - `photo-gallery.component.html` : `fa-solid fa-store` → `LucideStore`
  - `reviews.component.html` : `fas fa-check-circle` → `LucideCircleCheck`, `fas fa-star` reste une étoile Unicode `★` (déjà utilisée pour la notation, pas une icône FontAwesome à proprement parler — inchangé)
  - `edit-content.component.html` (admin, hors périmètre visuel du redesign mais dépend de la lib retirée) : `fas fa-sign-out-alt` → `LucideLogOut`, `fas fa-edit` → `LucideSquarePen`
- `cards-banner` (icône passée en `@Input`) et `cards-services` : l'`@Input() icon: string` bascule d'une classe CSS FontAwesome vers un nom d'icône Lucide (ex. `'leaf'`), rendu via le binding dynamique `[lucideIcon]` sur un `<svg>`. Les icônes utilisées dynamiquement sont enregistrées une fois via `provideLucideIcons(...)` dans `app.config.ts`.

## Fondations (`Front/src/styles.scss`)

Nouveaux tokens ajoutés à `:root` (les tokens existants ne sont pas supprimés) :

- `--neo-cream: #fdf3e7` — nouveau fond de page (`--background-primary` bascule dessus)
- `--neo-ink: #2b2b2b` — traits, bordures et texte principal (remplace le noir pur)
- `--shadow-sticker-fuchsia / -orange / -yellow` : `5px 5px 0 <couleur>`
- `--radius-card: 14px`, `--radius-pill: 999px`, `--radius-arch: 60px 60px 14px 14px`

Patterns réutilisables (classes globales ou mixins SCSS) :

- **Carte sticker** : fond blanc, bordure `2.5px solid var(--neo-ink)`, radius carte, ombre décalée pleine (couleur variable par carte : fuchsia, orange, jaune en alternance)
- **Pilule** : bouton/badge en radius pill ; CTA principal = fond dégradé, texte blanc
- **Titre de section** : kicker en Retrograde italique (couleur orange ou fuchsia) au-dessus d'un titre Gliker ; centré par défaut

## Nav (`burger-menu`)

Structure et accessibilité conservées telles quelles (sticky, pilules, modal mobile). Habillage seulement :

- Fond crème opaque (fin du glassmorphism translucide), trait noir fin en bas de barre
- État actif : pilule teintée orange 12% (`rgba(255, 87, 51, 0.12)`), texte orange
- Modal mobile : carte sticker (bordure noire, ombre décalée)

## Hero (`header` + `cards-banner`)

Restructuration complète du template :

- La grande photo bannière plein écran disparaît
- Titre central : « LA MODE RESPONSABLE à portée de toutes et tous » — Gliker en majeure partie, mot-clé (« RESPONSABLE ») en `--neo-orange` plein, sous-titre en Retrograde italique fuchsia
- Badge sticker au-dessus du titre (« Friperie · Seconde main » ou équivalent)
- CTA principal en pilule dégradé
- Sous le titre : rangée de 3 photos existantes (`banner1`, `friperie`, `creators`…) en polaroïds — cadre blanc, bordure noire, rotations légères alternées (-2° / +1.5° / -1°), empilées verticalement sur mobile
- Les 3 cartes-bannière (icône + titre + description) restent sous les polaroïds, converties en cartes sticker compactes

## Sections sur fond crème

### À propos (`about`)

- Image dans un cadre arche (radius arch) avec bordure noire, légèrement tournée façon sticker
- Titre de section au nouveau pattern (kicker + Gliker)
- Les 3 cartes atouts → cartes sticker, ombres alternées fuchsia/orange/jaune

### Services (`services` + `cards-services`)

- Titre de section au nouveau pattern
- Cartes services → cartes sticker, ombres alternées

### Galerie créateurs (`creators-gallery`)

- Fond crème, titre de section au nouveau pattern
- Cartes créateurs → cartes sticker

### Shopping personnalisé (`custom-shopping`)

- Fond crème, layout image + texte restructuré (image en cadre sticker/arche)
- CTA en pilule dégradé

## Moments forts — bandes dégradé

### Galerie photos (`photo-gallery`)

- Section pleine largeur au dégradé orange→fuchsia
- Titre et kicker en blanc
- Photos en cadres blancs type polaroïd/sticker posés sur le dégradé

### Avis clients (`reviews` + `review-form`)

- Section pleine largeur au dégradé orange→fuchsia, juste avant le footer
- Cartes d'avis blanches en style sticker
- Formulaire d'avis : champs sur carte blanche, bouton pilule

## Séparateurs (`separate`)

Les `app-separate` actuels sont supprimés de `landing-page.component.html` (le rythme vient désormais de l'alternance crème/dégradé). Pas de remplacement : la respiration entre sections crème est assurée par les marges verticales des sections elles-mêmes.

## Footer (`footer`)

- Fond encre (`--neo-ink`), liseré supérieur au dégradé orange→fuchsia
- Liens et icônes réseaux sociaux en pilules
- Structure des contenus conservée (liens légaux, contact, réseaux)

## Contraintes techniques

- **SSR-safe** : aucun accès direct à `window`/`document` hors guards existants (le site tourne en Angular SSR sur Vercel)
- Les animations scroll existantes (`appScrollAnimate` + `animate-fade-in`) sont conservées sur les sections
- Responsive mobile-first : polaroïds empilés, cartes en colonne, bandes dégradé pleine largeur à tous les breakpoints
- Contraste AA : sur le dégradé, texte blanc uniquement ; sur crème, texte encre
- Pages hors landing (mentions légales, politique cookies/confidentialité, admin/edit-content) : hors périmètre de ce redesign, elles héritent seulement du nouveau fond et des tokens

## Ordre d'implémentation suggéré

1. Migration icônes FontAwesome → Lucide (préalable technique, indépendant du visuel)
2. Fondations `styles.scss` (tokens + patterns)
3. Hero (header + cards-banner) — donne le ton
4. Nav réchauffée
5. À propos, Services
6. Bande galerie photos
7. Créateurs, Shopping personnalisé
8. Bande avis + formulaire
9. Footer + suppression des séparateurs
10. Passe responsive + contraste + vérification SSR/build
