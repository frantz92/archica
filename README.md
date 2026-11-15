# Archica.pl

Strona Studia Architektury i Urbanistyki Archica (Stargard, od 1996 r.). Next.js 16 (App Router),
React 19, TypeScript (strict), Tailwind CSS 4. Języki: `/pl` (domyślny), `/en`, `/fr`. Hosting: Vercel.

Plan wykonawczy: [`BLUEPRINT.md`](./BLUEPRINT.md). Zasady pracy: [`CLAUDE.md`](./CLAUDE.md).

## Uruchomienie

Wymagany Node 22 LTS lub nowszy.

```bash
npm install
npm run dev          # http://localhost:3000 (przekierowanie / → /pl)
npm run typecheck    # next typegen && tsc --noEmit
npm run lint         # ESLint CLI (z regułami projektu: eqeqeq, no-console, import type)
npm run format:check # Prettier w trybie sprawdzania (CI)
npm test             # testy jednostkowe (Vitest)
npm run test:coverage # testy z raportem pokrycia i progiem 80%
npm run test:e2e      # testy E2E (Playwright) na zbudowanej stronie; najpierw `npm run build`
npm run check        # typecheck + lint + format:check + testy z pokryciem (to samo co bramka jakości w CI)
npm run build        # build produkcyjny
npm run start        # serwer na podstawie buildu
npm run format       # Prettier (z sortowaniem klas Tailwind)
npm run check:placeholders   # kontrola przed publikacją (patrz niżej)
```

Do builda nie są potrzebne żadne zmienne środowiskowe ani sekrety.

## Struktura

```
brand/                paczka logo (źródło, nie jest serwowana)
public/images/        6 zdjęć o stałych nazwach
scripts/              check-placeholders.mjs, generate-placeholder-images.mjs
test/                 wspólna infrastruktura testów: setup, atrapy API przeglądarki, stan routera
src/app/              trasy: [locale]/ (strona, polityka prywatności, 404, obraz OG), ikony, manifest, sitemap, robots
src/components/       layout/ (nagłówek, stopka), sections/ (5 sekcji), ui/ (prymitywy), providers/, seo/
src/content/          dane: site.ts, projects.ts, images.ts, privacy/{pl,en,fr}.ts
src/i18n/             config.ts, get-dictionary.ts, dictionaries/{pl,en,fr}.ts
src/lib/              metadata, dane strukturalne, nawigacja po sekcjach, język z parametrów trasy, kolory marki dla ikon, pomocniki
src/styles/           style globalne podzielone na moduły (tokens, theme, base, typography, layout, menu, hero, effects), importowane z app/globals.css
```

## Testy

Testy jednostkowe (Vitest, Testing Library, jsdom) leżą obok kodu jako `*.test.ts(x)`; wspólne atrapy
(`IntersectionObserver`, `matchMedia`, `<dialog>`, mocki `next/image` i `next/navigation`) są w `test/`.
Czysta logika działa w środowisku Node, a testy komponentów włączają jsdom komentarzem
`// @vitest-environment jsdom` na początku pliku. Pokrycie ma próg 80% (instrukcje, gałęzie, funkcje,
linie) i jest sprawdzane przez `npm run test:coverage`. Poza pokryciem zostają tylko `opengraph-image.tsx`
i `apple-icon.tsx` (generowane obrazy). Testy pilnują też treści: te same klucze w PL/EN/FR, twarde spacje
po jednoliterowych spójnikach (PL) i przed `: ; ! ?` (FR), brak zahardkodowanych danych kontaktowych.

### Testy E2E i dostępność

`e2e/*.spec.ts` (Playwright) uruchamiają zbudowaną stronę (`npm run build`, potem `npm run test:e2e`; serwer
startuje sam na porcie 3100, zmiana przez `E2E_PORT`). Sprawdzają: trzy wersje językowe (język, tytuł, H1,
sekcje, canonical, hreflang, JSON-LD, brak błędów w konsoli i naruszeń CSP), licznik w hero, strony 404,
sitemap/robots/manifest/ikony, lądowanie kotwic pod nagłówkiem, zmianę języka zawsze od góry, motyw i menu
mobilne, brak przewijania poziomego od 320 do 1440 px, mieszczenie się H1 i przycisku w 360 × 640 (BLUEPRINT §6.2),
nagłówki bezpieczeństwa z BLUEPRINT §10 oraz audyt axe (WCAG 2.2 AA) obu motywów.

W CI testy idą na Chromium, WebKit (Safari) i mobilnym Safari. Lokalnie Playwright nie pobiera własnych
przeglądarek na starszych systemach (np. macOS 12), więc bez zmiennej `CI` suite używa zainstalowanego
Google Chrome; `E2E_ALL=1` wymusza pełną macierz (wymaga przeglądarek Playwrighta).

## Edycja treści

- **Teksty widoczne na stronie** są w słownikach `src/i18n/dictionaries/`. `pl.ts` jest wzorcem:
  `en.ts` i `fr.ts` używają `satisfies Dictionary`, więc brakujący klucz zatrzymuje `npm run typecheck`
  i `npm run build`. W komponentach nie ma tekstów na sztywno.
- **Dane firmy** (adres, telefony, e-mail, NIP, godziny, rok założenia, nazwisko, domena): `src/content/site.ts`, jedyne źródło. Słowniki,
  dane strukturalne, polityka prywatności i komponenty (`ui/postal-address`, `ui/contact-links`) importują je stąd; nie przepisuj ich ręcznie.
- **Projekty w portfolio**: `src/content/projects.ts`. Pola `location` i `year` są opcjonalne; po wypełnieniu
  pojawiają się w podpisie. Pole `slug` jest przygotowane pod przyszłe podstrony projektów.
- **Polityka prywatności**: `src/content/privacy/{pl,en,fr}.ts` (lista sekcji: nagłówek + akapity/listy).
- **Typografia**: w tekstach PL używaj twardej spacji (` `) po jednoliterowych spójnikach i przyimkach;
  we FR przed `: ; ! ?` (zasady w BLUEPRINT §4.3).

## Podmiana zdjęć

Zdjęcia są teraz **tymczasowymi zdjęciami stockowymi** na licencji CC0 (domena publiczna, atrybucja nie jest
wymagana, ale podajemy źródła), przycięte do proporcji slotów. **To nie są realizacje Archiki**, więc przed
publikacją trzeba je podmienić. Poprzednie szare placeholdery da się odtworzyć skryptem
`scripts/generate-placeholder-images.mjs`.

| Plik                            | Źródło (Wikimedia Commons)                                                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-building.png`             | [Cube berlin.jpg](https://commons.wikimedia.org/wiki/File:Cube_berlin.jpg)                                                                                             |
| `about-studio.png`              | [Model of Chochikukyo House 1.jpg](https://commons.wikimedia.org/wiki/File:Model_of_Chochikukyo_House_1.jpg)                                                           |
| `portfolio-1.png` (slot A, 4:3) | [Crystal Beach 5.jpg](https://commons.wikimedia.org/wiki/File:Crystal_Beach_5.jpg)                                                                                     |
| `portfolio-2.png` (slot B, 4:5) | [Midcentury Modern Danbury CT.jpg](https://commons.wikimedia.org/wiki/File:Midcentury_Modern_Danbury_CT.jpg)                                                           |
| `portfolio-3.png` (slot C, 4:5) | [Ypacaraí lake shore in San Bernardino 190316.jpg](https://commons.wikimedia.org/wiki/File:Ypacara%C3%AD_lake_shore_in_San_Bernardino_190316.jpg)                      |
| `portfolio-4.png` (slot D, 4:3) | [Aerial view of Arinaga, 3x4 format](<https://commons.wikimedia.org/wiki/File:Aerial_view_of_Arinaga_(coastal_town_in_Gran_Canaria)_-_8_August_2020_-_3x4_format.jpg>) |

Aby je podmienić, wgraj własne pliki do `public/images/`
**pod tymi samymi nazwami** (kod nie wymaga zmian). Slot przycina zdjęcie (`object-fit: cover`),
więc plik może mieć dowolne wymiary, ale zalecane źródła to:

| Plik                       | Slot | Zalecane minimum |
| -------------------------- | ---- | ---------------- |
| `hero-building.png`        | 4:5  | 1600 × 2000 px   |
| `about-studio.png`         | 4:5  | 1600 × 2000 px   |
| `portfolio-1.png` (slot A) | 4:3  | 2400 × 1800 px   |
| `portfolio-2.png` (slot B) | 4:5  | 1600 × 2000 px   |
| `portfolio-3.png` (slot C) | 4:5  | 1600 × 2000 px   |
| `portfolio-4.png` (slot D) | 4:3  | 2400 × 1800 px   |

Po podmianie ustaw `placeholder: false` w `src/content/images.ts` (znika plakietka na podglądach),
zaktualizuj teksty alternatywne w słownikach (`hero.imageAlt`, `about.imageAlt`,
`portfolio.projects.*.imageAlt`) oraz, jeśli trzeba, `objectPosition` dla kadru. Obrazy są importowane statycznie,
więc nowy plik dostaje nowy skrót w adresie (bez problemów z pamięcią podręczną).

## Placeholdery

Każdy placeholder ma komentarz `// PLACEHOLDER:`. Na lokalnym środowisku i na wdrożeniach podglądowych
(`VERCEL_ENV !== 'production'`) przy zdjęciach widać plakietkę „placeholder"; na produkcji plakietek nie ma
(poza numerem uprawnień, który jest zawsze jawnie fikcyjny). Statystyki w hero (30 / 86 / 26 / 15) i cztery
realizacje w portfolio to potwierdzone dane, nie placeholdery.

| Co                                                  | Gdzie                                                    |
| --------------------------------------------------- | -------------------------------------------------------- |
| Sześć zdjęć wraz z tekstami alternatywnymi          | `public/images/`, `src/content/images.ts`, słowniki      |
| Numer uprawnień `MOCK/000/0000`                     | `src/content/site.ts` (`license`)                        |
| Okresy przechowywania danych w polityce prywatności | `src/content/privacy/{pl,en,fr}.ts` (sekcja `retention`) |

`npm run check:placeholders` wypisuje wszystkie znaczniki `PLACEHOLDER` z `src/content` i `src/i18n`
i kończy się kodem 1, jeśli którykolwiek istnieje.

## Lista kontrolna publikacji

- [ ] `npm run check:placeholders` nie zgłasza żadnych pozycji.
- [ ] Polityka prywatności przeszła weryfikację prawną (tekst jest projektem); zaktualizowana data zmiany.
- [ ] Domena `archica.pl` podpięta w Vercel, a `www.archica.pl` przekierowuje na domenę główną.
- [ ] **Rekordy poczty (MX, SPF, DKIM) pozostają bez zmian.** Dodajemy tylko rekordy wskazane przez Vercel;
      nie przenosimy serwerów nazw.
- [ ] Test nagłówków bezpieczeństwa na wdrożeniu (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`), np. securityheaders.com.
      HSTS jest bez `includeSubDomains` i `preload`, dopóki nie potwierdzisz, że żadna subdomena
      archica.pl nie działa po HTTP.
- [ ] Na wdrożeniu podglądowym nie ma błędów CSP w konsoli (podgląd dopuszcza `vercel.live`); na produkcji
      obowiązuje CSP z `next.config.ts`.
- [ ] Lighthouse (mobile) ≥ 95 w każdej kategorii na `/pl`; LCP < 2,0 s, CLS < 0,02, INP < 200 ms.
- [ ] Walidacja danych strukturalnych (Schema Markup Validator / Rich Results Test) i podgląd Open Graph.
- [ ] Vercel Analytics włączone w projekcie Vercel.

## Decyzje projektowe warte zapamiętania

- Brak `proxy.ts`/middleware i wykrywania języka: `/` przekierowuje na `/pl` (308), język zmienia się tylko
  ręcznie.
- CSP bez nonce jest świadomym wyborem (nonce wymusiłby renderowanie dynamiczne); `'unsafe-inline'` w
  `script-src` jest potrzebne dla skryptów startowych Next.js i `next-themes`.
- Strona główna i polityka prywatności mają `revalidate = 86400`, żeby liczba lat praktyki i rok w stopce
  nie zestarzały się między wdrożeniami.
- 404 jest zlokalizowane (język z `useParams`), bo `not-found.tsx` nie dostaje `params`; `global-not-found`
  jest w tej wersji Next.js eksperymentalne i nie jest używane.
