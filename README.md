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
npm run lint         # ESLint CLI
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
src/app/              trasy: [locale]/ (strona, polityka prywatności, 404, obraz OG), ikony, manifest, sitemap, robots
src/components/       layout/ (nagłówek, stopka), sections/ (5 sekcji), ui/ (prymitywy), providers/, seo/
src/content/          dane: site.ts, projects.ts, images.ts, privacy/{pl,en,fr}.ts
src/i18n/             config.ts, get-dictionary.ts, dictionaries/{pl,en,fr}.ts
src/lib/              metadata, dane strukturalne, kolory marki dla ikon, pomocniki
```

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

| Plik                      | Źródło (Wikimedia Commons)                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `hero-building.png`       | [Cube berlin.jpg](https://commons.wikimedia.org/wiki/File:Cube_berlin.jpg)                                           |
| `about-studio.png`        | [Model of Chochikukyo House 1.jpg](https://commons.wikimedia.org/wiki/File:Model_of_Chochikukyo_House_1.jpg)         |
| `portfolio-residence.png` | [Midcentury Modern Danbury CT.jpg](https://commons.wikimedia.org/wiki/File:Midcentury_Modern_Danbury_CT.jpg)         |
| `portfolio-office.png`    | [Regular glass facade (Unsplash).jpg](<https://commons.wikimedia.org/wiki/File:Regular_glass_facade_(Unsplash).jpg>) |
| `portfolio-interior.png`  | [Living room (Unsplash).jpg](<https://commons.wikimedia.org/wiki/File:Living_room_(Unsplash).jpg>)                   |
| `portfolio-pavilion.png`  | [Wooden pavilion, Battersea Park.jpg](https://commons.wikimedia.org/wiki/File:Wooden_pavilion,_Battersea_Park.jpg)   |

Aby je podmienić, wgraj własne pliki do `public/images/`
**pod tymi samymi nazwami** (kod nie wymaga zmian). Slot przycina zdjęcie (`object-fit: cover`),
więc plik może mieć dowolne wymiary, ale zalecane źródła to:

| Plik                      | Slot | Zalecane minimum |
| ------------------------- | ---- | ---------------- |
| `hero-building.png`       | 4:5  | 1600 × 2000 px   |
| `about-studio.png`        | 4:5  | 1600 × 2000 px   |
| `portfolio-office.png`    | 4:5  | 1600 × 2000 px   |
| `portfolio-interior.png`  | 4:5  | 1600 × 2000 px   |
| `portfolio-residence.png` | 4:3  | 2400 × 1800 px   |
| `portfolio-pavilion.png`  | 4:3  | 2400 × 1800 px   |

Po podmianie ustaw `placeholder: false` w `src/content/images.ts` (znika plakietka na podglądach),
zaktualizuj teksty alternatywne w słownikach (`hero.imageAlt`, `about.imageAlt`,
`portfolio.projects.*.imageAlt`) oraz, jeśli trzeba, `objectPosition` dla kadru. Obrazy są importowane statycznie,
więc nowy plik dostaje nowy skrót w adresie (bez problemów z pamięcią podręczną).

## Placeholdery

Każdy placeholder ma w danych `placeholder: true` i komentarz `// PLACEHOLDER:`. Na lokalnym środowisku
i na wdrożeniach podglądowych (`VERCEL_ENV !== 'production'`) przy elemencie widać plakietkę „placeholder";
na produkcji plakietek nie ma (poza numerem uprawnień, który jest zawsze jawnie fikcyjny).

| Co                                                  | Gdzie                                                    |
| --------------------------------------------------- | -------------------------------------------------------- |
| Statystyki „86 projektów" i „9 nagród"              | `src/content/projects.ts` (`stats`)                      |
| Cztery projekty portfolio                           | `src/content/projects.ts` (`projects`)                   |
| Sześć zdjęć                                         | `src/content/images.ts`, `public/images/`                |
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
