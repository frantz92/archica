# Archica.pl

Strona Studia Architektury i Urbanistyki Archica (Stargard, od 1996 r.). Next.js 16 (App Router),
React 19, TypeScript (strict), Tailwind CSS 4. Języki: `/pl` (domyślny), `/en`, `/fr`. Hosting: SeoHost (statyczny eksport, Apache).

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

## CI/CD

Strona jest **statycznym eksportem** (`output: 'export'`): `npm run build` tworzy katalog `out/` ze zwykłymi
plikami, które workflow `deploy.yml` wysyła na hosting SeoHost na ręczne polecenie i co roku 1 stycznia (opis w sekcji
„Wdrożenie na SeoHost" niżej). Pozostałe workflow'y kontrolują jakość; pliki w `.github/workflows/`.

| Workflow                                              | Kiedy                      | Co sprawdza                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml` → **Quality gate**                           | push do `master`, każdy PR | typecheck, lint, Prettier, testy jednostkowe z progiem pokrycia 80%, build; raport pokrycia jako artefakt                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ci.yml` → **E2E** (Chromium, WebKit, mobilny Safari) | równolegle z bramką        | testy Playwright, audyt dostępności axe (WCAG 2.2 AA), zmiana języka, kotwice, brak przewijania poziomego                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ci.yml` → **Lighthouse budgets**                     | równolegle z bramką        | dostępność, best practices i SEO ≥ 95 oraz CLS < 0,02 (BLUEPRINT §11) blokują; **wydajność ≥ 95, TBT ≤ 200 ms i LCP ≤ 2,5 s są na razie ostrzeżeniami** (pierwszy przebieg na GitHubie dał LCP 3,3 s na `/en`, przyczyna jest do zbadania na raporcie z artefaktu `lighthouse`) (lokalny pomiar na obciążonym Macu nie jest wiarygodny; na PR-ach 1 pomiar `/pl` i `/en`, pełne 5 pomiarów 4 adresów robi `release-readiness`); po pierwszym pomiarze na GitHubie przełącz je na `error` w `lighthouserc.json`. Ścisłe budżety ma `lighthouserc.release.json` |
| `security.yml`                                        | push, PR, co poniedziałek  | `npm audit` (zależności produkcyjne, high i critical), CodeQL, skan sekretów (gitleaks), nagłówki bezpieczeństwa z §10 na zbudowanej stronie                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `release-readiness.yml`                               | ręcznie („Run workflow")   | go / no-go przed podpięciem domeny: placeholdery, pełna bramka, nagłówki, Lighthouse ze ścisłymi budżetami i 5 przebiegami                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Dependabot (`dependabot.yml`)                         | co poniedziałek            | tygodniowe, grupowane PR-y z aktualizacjami npm i wersji akcji; każdy przechodzi całą bramkę                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

**Jak sprawdzić wyniki:** na GitHubie zakładka _Actions_ pokazuje uruchomienia (kroki, logi, artefakty:
pokrycie, raporty Playwright i Lighthouse), a w PR sekcja _Checks_ na dole. Lokalny odpowiednik bramki jakości
to `npm run check`.

**Wymagane checki (ustawienie w GitHubie, nie da się go zapisać w kodzie):** _Settings → Branches → Add rule_
dla `master`: zaznacz _Require a pull request before merging_, _Require review from Code Owners_
(`.github/CODEOWNERS`), _Require status checks to pass before merging_ i wybierz: `Quality gate`,
`E2E (chromium)`, `E2E (webkit)`, `E2E (mobile-safari)`, `Lighthouse budgets`, `Dependency audit`,
`CodeQL`, `Secret scan`, `Security headers`. Nazwy zadań pojawią się na liście po pierwszym uruchomieniu.
Dodatkowo włącz _Dependabot alerts_ i _Secret scanning_ w _Settings → Code security_.

**Przed publikacją:** uruchom `release-readiness.yml` (zakładka _Actions → Release readiness → Run workflow_).
Dopóki w treści są placeholdery, workflow jest czerwony; zielony oznacza, że można podpinać `archica.pl`.
Pozostałe punkty listy kontrolnej poniżej (weryfikacja prawna polityki, DNS, poczta) nadal robisz ręcznie.

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
(`SITE_ENV !== 'production'`) przy zdjęciach widać plakietkę „placeholder"; na produkcji plakietek nie ma
(poza numerem uprawnień, który jest zawsze jawnie fikcyjny). Statystyki w hero (30 / 86 / 26 / 15) i cztery
realizacje w portfolio to potwierdzone dane, nie placeholdery.

| Co                                                  | Gdzie                                                    |
| --------------------------------------------------- | -------------------------------------------------------- |
| Sześć zdjęć wraz z tekstami alternatywnymi          | `public/images/`, `src/content/images.ts`, słowniki      |
| Numer uprawnień `MOCK/000/0000`                     | `src/content/site.ts` (`license`)                        |
| Okresy przechowywania danych w polityce prywatności | `src/content/privacy/{pl,en,fr}.ts` (sekcja `retention`) |

`npm run check:placeholders` wypisuje wszystkie znaczniki `PLACEHOLDER` z `src/content` i `src/i18n`
i kończy się kodem 1, jeśli którykolwiek istnieje.

## Wdrożenie na SeoHost

**Jak to działa.** `npm run build` robi kolejno: warianty obrazów WebP (`scripts/optimize-images.mjs`, bo
hosting statyczny nie ma serwera obrazów), eksport do `out/`, plik `out/.htaccess` (HTTPS, przekierowanie
`/` → `/pl/`, nagłówki bezpieczeństwa, cache, strona 404; `scripts/build-htaccess.mjs`) i usunięcie
wielomegabajtowych oryginałów zdjęć z `out/` (`scripts/prune-output.mjs`). Reguły serwera mają jedno źródło,
`scripts/lib/site-config.mjs`; używa go też lokalny serwer (`npm run start`, `scripts/static-server.mjs`),
więc testy E2E sprawdzają te same reguły, które trafiają do `.htaccess`.

**Lokalnie:** `npm run build && npm run start` (port 3000 lub `-- --port 3100`), strona pod
`http://localhost:3000/pl/`.

**Kiedy strona idzie na serwer (`.github/workflows/deploy.yml`).** Push na `master` **nie** publikuje strony.
Wdrożenie startuje tylko:

- ręcznie: _Actions → Deploy → Run workflow_ (gałąź `master`; budowanie z `SITE_ENV=production`, bez plakietek
  „placeholder"; opcja `dry_run` pokazuje, co zostałoby wysłane, nic nie wysyła),
- **1 stycznia o 00:05 UTC** (i awaryjnie 2 stycznia): przebudowa, żeby liczba „lat praktyki" i rok w stopce
  zmieniły się bez edycji kodu.

Przed ręcznym wdrożeniem upewnij się, że CI na `master` jest zielone.

**Wdrożenie z własnego komputera** (gdy GitHub Actions się zacina albo jest niedostępny): plik `.env.deploy`
w katalogu projektu (jest w `.gitignore`) z liniami `DEPLOY_HOST=...`, `DEPLOY_USER=...`, `DEPLOY_PATH=...`,
`DEPLOY_PROTOCOL=sftp`, `DEPLOY_PORT=...` i `DEPLOY_SSH_KEY_FILE=/ścieżka/do/klucza`, potem `npm run deploy`.
Wystarczy Python 3 i `sftp` z macOS (nic nie trzeba instalować). Z `DEPLOY_DRY_RUN=1` w tym pliku skrypt
tylko wypisuje, co wyśle i co usunie.

SeoHost (hosting współdzielony) przyjmuje **tylko logowanie kluczem SSH** i **tylko SFTP** (bez poleceń w
powłoce, więc bez `rsync`), na porcie z Panelu Klienta (nie 22). Klucz publiczny dodaje się w DirectAdmin
(_Funkcje zaawansowane → Klucze SSH_, potem „Autoryzacja"). Skrypt `scripts/sftp-deploy.py` wysyła wszystkie
pliki i usuwa z serwera te, których nie ma już w `out/` (poza `.well-known`, `cgi-bin`, `.ftpquota`).

**Konfiguracja w GitHubie** (_Settings → Environments → New environment → `production`_):

| Nazwa                | Rodzaj   | Wartość                                                                                               |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `DEPLOY_HOST`        | secret   | serwer FTP/SSH z panelu SeoHost                                                                       |
| `DEPLOY_USER`        | secret   | użytkownik FTP/SSH                                                                                    |
| `DEPLOY_SSH_KEY`     | secret   | klucz prywatny SSH (cały plik; SeoHost nie przyjmuje haseł). `DEPLOY_PASSWORD` tylko dla `ftps`/`ftp` |
| `DEPLOY_PATH`        | secret   | katalog strony na serwerze, np. `public_html` (nigdy `/`; zawartość katalogu jest nadpisywana)        |
| `DEPLOY_KNOWN_HOSTS` | secret   | opcjonalnie: wpis `known_hosts` serwera (przypina klucz hosta SFTP)                                   |
| `DEPLOY_PROTOCOL`    | variable | `sftp` (domyślnie; dla SeoHost), `ftps` lub `ftp`                                                     |
| `DEPLOY_PORT`        | variable | port SSH z Panelu Klienta (SeoHost: nie 22)                                                           |
| `SITE_CHECK_URL`     | variable | opcjonalnie, np. `https://archica.pl`: po wysyłce workflow sprawdza stronę, nagłówek CSP i 404        |

Bez `DEPLOY_HOST`, `DEPLOY_USER` i `DEPLOY_PATH` workflow tylko ostrzega i nic nie wysyła.

## Dwie propozycje logo

Klient wybiera między dwoma logo: **propozycja 1** (geometria, obecne) i **propozycja 2** (organiczny łuk).
Obie są w jednym kodzie; różni je tylko znak. Pliki marki: `brand/propozycja-1/` i `brand/propozycja-2/`
(SVG, PDF, EPS, DXF i podgląd; propozycję 2 generuje `node scripts/build-brand.mjs` z pomiarów obrazka
`brand/Image.jpg`). Kolory, układ i napis są wspólne.

**Wybór logo przy budowaniu strony:** `NEXT_PUBLIC_LOGO=2 npm run build` (bez zmiennej, albo `1`: propozycja 1).
Dotyczy logo w nagłówku i na stronie 404, ikony strony, ikony Apple i obrazu Open Graph. Podgląd lokalny:
`NEXT_PUBLIC_LOGO=2 npm run dev`.

**Wspólna baza, dwa wdrożenia (zamiast dwóch gałęzi):** w workflow _Deploy_ wybierasz `target`
(`production` albo `preview`) i `logo` (`1` albo `2`). Kopia `preview` idzie do osobnego katalogu (sekret
`DEPLOY_PATH_PREVIEW`, zmienna `SITE_CHECK_URL_PREVIEW`), nie jest indeksowana (`robots.txt` z `Disallow: /`,
`noindex` w nagłówkach i metadanych) i nie ma plakietek „placeholder". Dzięki temu można pokazać klientowi
obie propozycje obok siebie, a rozbieżności kodu nie ma, bo to ten sam commit.
Z komputera: `DEPLOY_ENV_FILE=.env.deploy.preview NEXT_PUBLIC_LOGO=2 npm run deploy`
(`.env.deploy.preview` to kopia `.env.deploy` z innym `DEPLOY_PATH` i linią `SITE_ENV=preview`).

**Po decyzji klienta:** ustaw w `src/components/ui/logo-assets.ts` domyślną propozycję, usuń drugą
(`brand/propozycja-N/`, `logo-paths*.ts`, `public/favicon-N.svg`, przełącznik `NEXT_PUBLIC_LOGO`) i zdecyduj,
czy zachować katalog przeglądowy.

## Lista kontrolna publikacji

- [ ] `npm run check:placeholders` nie zgłasza żadnych pozycji.
- [ ] Polityka prywatności przeszła weryfikację prawną (tekst jest projektem); zaktualizowana data zmiany.
- [ ] Domena `archica.pl` wskazuje na hosting w SeoHost, a `www.archica.pl` przekierowuje na domenę główną (robi to `.htaccess`).
- [ ] **Poczta (MX, SPF, DKIM) działa po przeniesieniu**: skrzynki skopiowane, rekordy w strefie DNS gotowe
      przed zmianą serwerów nazw.
- [ ] Test nagłówków bezpieczeństwa na wdrożeniu (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`), np. securityheaders.com.
      HSTS jest bez `includeSubDomains` i `preload`, dopóki nie potwierdzisz, że żadna subdomena
      archica.pl nie działa po HTTP.
- [ ] W konsoli przeglądarki na produkcji nie ma błędów CSP (CSP jest w `scripts/lib/site-config.mjs`,
      trafia do `.htaccess`).
- [ ] Lighthouse (mobile) ≥ 95 w każdej kategorii na `/pl`; LCP < 2,0 s, CLS < 0,02, INP < 200 ms.
- [ ] Walidacja danych strukturalnych (Schema Markup Validator / Rich Results Test) i podgląd Open Graph.
- [ ] Zdecydowano o analityce (obecnie jej nie ma; polityka prywatności mówi, że strona jej nie używa).

## Decyzje projektowe warte zapamiętania

- Brak `proxy.ts`/middleware i wykrywania języka: `/` przekierowuje na `/pl/` (301, w `.htaccess`), język zmienia się tylko
  ręcznie.
- CSP bez nonce jest świadomym wyborem (nonce wymusiłby renderowanie dynamiczne); `'unsafe-inline'` w
  `script-src` jest potrzebne dla skryptów startowych Next.js i `next-themes`.
- Strona główna i polityka prywatności mają `revalidate = 86400`, żeby liczba lat praktyki i rok w stopce
  nie zestarzały się między wdrożeniami.
- 404 jest zlokalizowane (język z `useParams`), bo `not-found.tsx` nie dostaje `params`; `global-not-found`
  jest w tej wersji Next.js eksperymentalne i nie jest używane.
