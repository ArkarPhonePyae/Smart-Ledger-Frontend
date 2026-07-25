# AuraPay — Angular 20 Conversion

This is a pixel-faithful Angular 20 (standalone components) conversion of the
original single-file `index2.html` prototype ("AuraPay — Modern Fintech Expense
Settler Platform"). Every visible section, class, animation, and interaction
from the original has been preserved; nothing has been redesigned.

## Getting started

```bash
npm install
npm start        # ng serve, http://localhost:4200
npm run build    # production build to dist/aurapay-angular
```

> This environment could not run `npm install` (no network access), so
> dependency versions were hand-picked to match Angular 20 / Chart.js 4 /
> lucide-angular's current stable APIs. Run `npm install` locally to fetch
> `node_modules` before serving or building.

## What changed vs. the original, and why

The original was a single HTML file using the Tailwind **CDN** script, global
`<script>` blocks for all interactivity, and manual `classList` toggling to
fake "page" switches inside one DOM. To make this a real Angular app instead
of a like-for-like copy that still relies on global scripts, the following
one-to-one translations were made — the **visual output is identical**:

| Original mechanism | Angular equivalent |
|---|---|
| Tailwind CDN + inline `tailwind.config` | `tailwindcss` installed as a build-time PostCSS plugin, `tailwind.config.js` has the exact same `primary/success/danger/warning/darkBg/lightBg` colors and `Inter` font extension |
| Global `<style>` block (glass-card, apple-shadow, scrollbar, `@keyframes modalIn`) | Copied verbatim into `src/styles.scss` |
| `data-lucide="icon-name"` + `lucide.createIcons()` | `lucide-angular` standalone icon components, registered once in `app.config.ts`, used as `<lucide-icon name="icon-name">` (same kebab-case names) |
| `switchView(viewId)` / `.view-section` show-hide | Angular Router — each view is its own routed, lazy-loaded page component under `/dashboard`, `/expenses`, `/groups`, `/friends`, `/reports`, `/admin`, `/settings`, `/profile`, `/notifications`, `/help` |
| Sidebar `nav-btn` active-state class swapping | `routerLink` + `routerLinkActive` |
| `toggleSidebarCollapse()` / `toggleMobileDrawer()` / `toggleUserDropdown()` | `UiStateService` (Angular signals) shared between `SidebarComponent` and `HeaderComponent` |
| `showToast()` + manual DOM node creation/removal | `ToastService` (signal-backed) + `ToastContainerComponent`, with Angular `:enter`/`:leave` animations replacing the original's inline opacity transition |
| `openCommandPalette()` / Ctrl+K / Escape listeners | `MainLayoutComponent` `@HostListener('window:keydown', ...)`, state in `UiStateService`, UI in `CommandPaletteComponent` |
| `openNewExpenseModal()` / `submitNewExpense()` | `NewExpenseModalComponent` (template-driven form via `FormsModule`) + `ExpenseStoreService` (prepends new expenses, same as the original's `list.prepend(item)`) |
| `new Chart(ctx, {...})` on `#dashboardChart` | `DashboardComponent` — identical Chart.js config, instantiated in `ngAfterViewInit` on a `#dashboardChart` template-ref canvas, destroyed in `ngOnDestroy` |
| `document.documentElement.classList.toggle('dark')` | `ThemeService` (signal), toggled from `HeaderComponent`; `<html>` still gets `.dark` toggled directly since Tailwind's `darkMode: 'class'` expects it on the root element |
| `.view-section` fade-in on switch (`opacity-0` removed after `20ms`) | `FadeInViewDirective`, applied to the root wrapper of every page component |

## Folder structure

```
src/
  app/
    core/services/       ThemeService, ToastService, UiStateService, ExpenseStoreService
    shared/
      components/        ToastContainer, CommandPalette, NewExpenseModal
      directives/         FadeInViewDirective
      models/             Expense, Toast
    layout/
      sidebar/            Collapsible + mobile drawer + user dropdown
      header/              Search trigger, theme toggle, notifications, new-expense button
      main-layout/        Shell that composes sidebar + header + <router-outlet> + global modals/toasts
    pages/
      dashboard/ expenses/ groups/ friends/ reports/ admin/ settings/ profile/ notifications/ help/
  styles.scss             Original global CSS, ported verbatim
  index.html
tailwind.config.js
postcss.config.js
angular.json
```

## Notes

- All images are referenced from the same Unsplash URLs as the original (no
  local assets existed in the source ZIP to migrate).
- The "counter" numbers on the dashboard (`$1,420.50`, `$340.00`, etc.) were
  static text in the original (no live count-up script was ever wired to the
  `.counter` / `data-target` markup), so they're rendered as static values
  here too — behavior is unchanged.
- The Settings tabs were visually static (only "General" ever had the active
  style) in the original; a minimal `activeTab` click handler was added so
  the tabs are real UI controls without changing default appearance.
