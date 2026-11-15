# BLUEPRINT.md — archica.pl

Instrukcja wykonawcza dla modelu kodującego (Sonnet 5.5). Wersja 1.3, 2026-11-15 (zmiany względem 1.0: §13b).
Źródło prawdy o faktach: „Specyfikacja strony Archica (wersja 1.2)". Ten dokument ją uszczegóławia i w kilku punktach świadomie zmienia (lista w §13).

---

## 0. Zasady pracy

1. Koduj etapami 1–5 (§12). Po każdym etapie zatrzymaj się, uruchom `npm run typecheck && npm run lint && npm run build`, wypisz co powstało i co odbiega od tego dokumentu. Nie zaczynaj kolejnego etapu bez potwierdzenia użytkownika.
2. Nie wymyślaj faktów o firmie (adresów, liczb, nagród, numerów, nazw projektów, lat realizacji). Wszystko, czego nie ma w §3 i §8, jest placeholderem i ma być tak oznaczone (§3.3).
3. Nie dodawaj zależności spoza listy w §1. Jeśli uważasz, że jakaś jest konieczna, zapytaj.
4. API zależne od wersji (oznaczone **[WERYFIKUJ]**) sprawdź w dokumentacji zainstalowanej wersji Next.js, zanim ich użyjesz. Jeśli repo zawiera `AGENTS.md` wygenerowany przez `create-next-app`, stosuj się do niego.
5. Server Components domyślnie. `'use client'` wolno użyć wyłącznie w plikach wymienionych w §5.
6. Żadnych tekstów na sztywno w komponentach: każdy widoczny napis i każdy `aria-label` pochodzi ze słowników (§4). Żadnych wartości HEX poza `globals.css`.
7. TypeScript `strict`, bez `any`, bez `@ts-ignore`, bez `ignoreBuildErrors`.
8. Jeśli coś w tym dokumencie jest sprzeczne albo niewykonalne w zainstalowanej wersji narzędzi, zatrzymaj się i zgłoś to, zamiast obchodzić po cichu.

Wejścia, które muszą być w repo przed etapem 1 (dostarcza użytkownik):
- `brand/` — rozpakowana paczka logo (`svg/`, `README.txt`); potrzebne są `svg/archica-logo-mech.svg` (ścieżki `#sygnet` i `#napis`) oraz `svg/archica-sygnet-mech.svg`.
- `public/images/` — 6 plików PNG o stałych nazwach: `hero-building.png`, `about-studio.png`, `portfolio-residence.png`, `portfolio-office.png`, `portfolio-interior.png`, `portfolio-pavilion.png`.

Jeżeli któregoś pliku brakuje, zgłoś to i nie generuj zamienników.

---

## 1. Stos i konfiguracja

| Element | Decyzja |
|---|---|
| Scaffold | Nowy projekt z `create-next-app@latest` (TypeScript, App Router, Tailwind, ESLint, katalog `src/`, alias `@/*`, Turbopack). Nie budujemy na szablonie v0. |
| Next.js | Najnowsze stabilne 16.x, nie niższe niż 16.4.5 (wydanie bezpieczeństwa z 3 listopada 2026). Sprawdź `npm view next version`. |
| React | 19.x zgodny z Next. |
| Tailwind CSS | 4.x, konfiguracja w CSS (`@theme`), bez `tailwind.config.*`. |
| Node | 22 LTS lub 24 (pole `engines` w `package.json`). |
| Zależności runtime | `next`, `react`, `react-dom`, `next-themes`, `@vercel/analytics`, `server-only`. Nic więcej. |
| Zależności dev | `typescript`, `@types/*`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`. |
| Świadomie pominięte | shadcn/ui, base-ui, lucide-react, framer-motion/motion, next-intl, biblioteki karuzel i lightboxów. Ikon jest 5, są własnymi komponentami SVG. |
| Skrypty | `dev`, `build`, `start`, `lint` (ESLint CLI, nie `next lint`), `typecheck` (`tsc --noEmit`), `format`, `check:placeholders` (§3.3). |

`next.config.ts`:
- `poweredByHeader: false`, `reactStrictMode: true`.
- `redirects`: `/` → `/pl`, `permanent: true`. Bez `proxy.ts`/middleware, bez wykrywania języka przeglądarki.
- `images`: `formats: ['image/avif','image/webp']`, `qualities: [75, 85]` **[WERYFIKUJ nazwę i domyślne wartości w zainstalowanej wersji]**. Żadnych `remotePatterns`. Bez `unoptimized`.
- `headers`: patrz §10.
- Nie włączaj `cacheComponents` ani funkcji eksperymentalnych.

---

## 2. Design system

### 2.1 Kierunek

Powściągliwa, typograficzna strona pracowni. Jeden wyrazisty motyw, reszta cicha:

- **Motyw przewodni: „otwór w perspektywie".** Hero odtwarza sygnet w skali strony (rama, cztery bursztynowe ukośne linie, obraz w otworze). Ten sam motyw, w ramach proporcji zdjęcia, mają jeszcze dokładnie dwa zdjęcia: „O nas" i jedno zdjęcie portfolio (slot B). Nie dodawaj ram przy pozostałych zdjęciach: motyw przestałby być wyjątkiem, a portfolio straciłoby asymetrię.
- **Budżet bursztynu.** Bursztynowe *wypełnienie* ma wyłącznie przycisk główny i skip-link. Wszędzie indziej bursztyn to cienka kreska (≤ 2 px: linie ram, podkreślenia, znacznik sekcji, piktogramy) albo mały znak (sygnet). Liczby, nagłówki i tła nie są bursztynowe. Dzięki temu przycisk główny pozostaje najmocniejszym elementem.
- **Motyw pomocniczy: „tabelka rysunkowa".** Komórki rozdzielone liniami 1 px z małą etykietą i dużą wartością, jak tabelka na rysunku architektonicznym. Występuje dokładnie w czterech miejscach: pasek danych w hero, macierz usług, dane kontaktowe, stopka.
- Bez kart z tłem i cieniem, bez ikon dekoracyjnych (wyjątek: cztery własne piktogramy usług, §6.3), bez gradientów, bez cieni, bez numeracji sekcji „01/02/03", bez strzałek doklejanych do linków, bez licznika poza paskiem danych w hero (§2.6 pkt 17), bez karuzel, bez własnego kursora. Ruch przy scrollu i stany hover są dozwolone wyłącznie w zakresie §2.6 (od wersji 1.1).
- Wyrównanie do lewej w całej stronie. Nic nie jest centrowane poza obrazem w ramie hero i stroną 404.

### 2.2 Kolory marki (jedyne źródło HEX)

| Token | HEX | Nazwa |
|---|---|---|
| `--coal` | `#1E1916` | Palony Węgiel (od wersji 1.2; wcześniej `--moss` `#2C3E35`, Głęboki Mech; pliki `-mech` w paczce logo zostają, służą tylko jako źródło geometrii) |
| `--chalk` | `#F5F2EB` | Kreda Wapienna |
| `--amber` | `#D9822B` | Bursztynowa Ochra |
| `--sand` | `#EAD7B7` | Słoneczny Piasek |
| `--sage` | `#6E7F62` | Zgaszona Szałwia |

Odcienie pochodne, **wyłącznie dla tekstu** (kontrasty policzone, WCAG AA ≥ 4,5:1):

| Token | HEX | Zastosowanie | Kontrast |
|---|---|---|---|
| `--amber-300` | `#E7A261` | tekst akcentowy na węglu | 8,08:1 |
| `--amber-700` | `#844F1A` | tekst akcentowy na kredzie i piasku | 6,03:1 / 4,78:1 |
| `--sage-300` | `#A9B79E` | tekst drugorzędny na węglu | 8,25:1 |
| `--sage-700` | `#525F4A` | tekst drugorzędny na kredzie i piasku | 6,07:1 / 4,82:1 |
| `--ink` | = `--coal` (`#1E1916`) | tekst na wypełnieniu bursztynowym | 5,95:1 |

Kontrasty kolorów oryginalnych, o których trzeba pamiętać: kreda/węgiel 15,58; węgiel/piasek 12,36; bursztyn/węgiel 5,95 (formalnie AA, ale tekst akcentowy nadal przez `--accent-text`); szałwia/węgiel 4,04 i szałwia/kreda 3,85 (tylko grafika); bursztyn/kreda 2,62 (wyłącznie dekoracja, nigdy tekst ani obrys kontrolki).

### 2.3 Tokeny semantyczne

Komponenty używają tylko tych tokenów (klasy typu `bg-bg`, `text-fg`, `border-line`). Trzy zestawy: motyw ciemny (`.dark` na `<html>`, domyślny), motyw jasny (brak klasy) oraz pas kontrastowy (klasa zakresowa `.band`, używana tylko w sekcji „O nas").

| Token | Ciemny | Jasny | `.band` w ciemnym | `.band` w jasnym |
|---|---|---|---|---|
| `--bg` | coal | chalk | sand | coal |
| `--fg` | chalk | coal | coal | chalk |
| `--fg-muted` | sage-300 | sage-700 | sage-700 | sage-300 |
| `--accent` (wypełnienia, grafika) | amber | amber | amber | amber |
| `--accent-text` | amber-300 | amber-700 | amber-700 | amber-300 |
| `--on-accent` | ink | ink | ink | ink |
| `--line` (linie podziału) | chalk 20% | coal 20% | coal 20% | chalk 20% |
| `--line-strong` (obrys kontrolek, ≥ 3:1) | chalk 45% | sage | coal 60% | chalk 45% |
| `--focus` | amber | coal | coal | amber |
| `--media-bg` (tło pod ładującym się zdjęciem) | sage | sand | sage | sage |
| `--accent-line` (cienkie kreski i znaki, ≥ 3:1) | amber | amber 65% + amber-700 | amber 40% + amber-700 | amber |
| `--surface` (drugi ton tła, klasa `.surface`) | chalk 5% na coal | coal 5% na chalk | n/d | n/d |

`--accent-line` jest bursztynem dla kresek i znaków; na jasnych tłach (kreda, piasek) jest przyciemniony domieszką `amber-700`, bo czysty bursztyn ma tam < 3:1 (obliczone: 3,43:1 na kredzie, 3,11:1 na `--surface` jasnego motywu, 3,35:1 na piasku). Nie używaj go dla tekstu (do tego `--accent-text`). Klasa `.surface` zmienia tylko `--bg`; służy do przemiennego rozróżnienia sekcji, bez nowego koloru marki. Kolejność teł na stronie głównej: hero (bazowe), Usługi (`surface`), O nas (`band`), Portfolio (bazowe), Kontakt (`surface`), stopka (bazowe). Kontrasty `--fg`, `--fg-muted`, `--accent-text` na `--surface`: ≥ 5,47:1.

Zasady:
- Linie i obrysy to oryginalne kolory marki z przezroczystością (`color-mix` albo alfa), nie nowe odcienie.
- W motywie jasnym bursztyn nie niesie informacji: jest tylko wypełnieniem przycisku głównego i zaznaczenia tekstu.
- `::selection`: tło `--amber`, tekst `--ink`.
- `color-scheme: dark` dla `.dark`, `light` w przeciwnym razie.
- `<html>` renderuje się po stronie serwera z `class="dark"`, żeby motyw ciemny był domyślny także bez JS.

### 2.4 Typografia

Jeden krój: **Inter** (zmienny), przez `next/font/google`, `subsets: ['latin','latin-ext']`, `display: 'swap'`, zmienna CSS `--font-inter`. Włącz oś optyczną (`axes: ['opsz']`) **[WERYFIKUJ dostępność; jeśli brak, pomiń]** i `font-optical-sizing: auto`. Bez kroju szeryfowego, bez kroju mono. Nie włączaj wariantów znaków (`cv11`, `ss0x`): litery mają zgadzać się z napisem w logo.

| Rola | Rozmiar | Waga | Interlinia | Tracking | Uwagi |
|---|---|---|---|---|---|
| `display` (h1 hero) | `clamp(2.5rem, 1.1rem + 5vw, 5.25rem)` | 500 | 1.04 | −0.035em | interlinia nie niższa: polskie znaki diakrytyczne |
| `h2` | `clamp(2rem, 1.3rem + 2.6vw, 3.5rem)` | 500 | 1.08 | −0.025em | |
| `h3` | `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)` | 500 | 1.2 | −0.015em | |
| `quote` | `clamp(1.75rem, 1.2rem + 2.2vw, 3rem)` | 400 | 1.15 | −0.02em | cytat w „O nas" |
| `value` (wartości w tabelkach) | `clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)` | 500 | 1.2 | −0.01em | `tabular-nums` |
| `stat` (liczby w hero) | `clamp(2.25rem, 1.6rem + 2.4vw, 3.75rem)` | 400 | 1 | −0.03em | `tabular-nums` |
| `lead` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)` | 400 | 1.5 | 0 | maks. 52ch |
| `body` | `1rem` (od 1280 px: `1.0625rem`) | 400 | 1.6 | 0 | maks. 65ch |
| `small` | `0.875rem` | 400 | 1.5 | 0 | |
| `label` | `0.75rem` | 500 | 1.3 | 0.12em | WERSALIKI; tylko eyebrow hero i etykiety w tabelkach |

Wagi w użyciu: 400 i 500. Bez 600/700 (logo jest w Medium; pogrubienia psują spójność). Wyróżnienia w tekście przez kolor `--accent-text` albo podkreślenie, nie przez pogrubienie pojedynczego słowa w nagłówku. Nagłówki w zdaniowej pisowni (nie Title Case, nie wersaliki).

### 2.5 Siatka, odstępy, promienie, linie

- Kontener: `max-width: 90rem`, `padding-inline: clamp(1.25rem, 4vw, 4rem)`.
- Siatka: 4 kolumny poniżej 768 px, 12 kolumn od 768 px. Odstęp kolumn: 1rem / 1.5rem (≥768) / 2rem (≥1280).
- Punkty łamania (domyślne Tailwind): `md` 768, `lg` 1024, `xl` 1280. „Mobile" = poniżej 768, „tablet" = 768–1023, „desktop" = od 1024.
- Skala odstępów (wielokrotności 4 px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Odstęp pionowy sekcji: `padding-block: clamp(4.5rem, 9vw, 8rem)`; odstęp nagłówka sekcji od jej treści: 3rem (mobile) / 5rem (od 1024 px), ustawiany wyłącznie w `section-header`.
- Wysokość nagłówka `--header-h`: 4rem (mobile/tablet), 5rem (desktop). `html { scroll-padding-top: var(--header-h) }`.
- Promienie: `--radius-none: 0` dla zdjęć, ram, komórek, sekcji i pasa; `--radius-sm: 0.25rem` wyłącznie dla kontrolek (przyciski, przełączniki, pierścień fokusu). Nic nie jest w pełni zaokrąglone.
- Linie: zawsze 1 px, `--line`. Brak cieni (`box-shadow` tylko jako pierścień fokusu).
- Minimalny cel dotykowy 44 × 44 px.

### 2.6 Ruch

Tokeny: `--dur-1: 150ms`, `--dur-2: 300ms`, `--dur-3: 1200ms`; `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.

Dozwolone animacje (pełna lista):
1. **Otwarcie hero** (raz, przy załadowaniu, tylko CSS): zdjęcie odsłania się przez `clip-path` od `inset(28% 36%)` do `inset(0)`, `--dur-3`, `--ease-out`, opóźnienie 150 ms; cztery ukośne linie rysują się od narożników ramy do narożników zdjęcia w 900 ms. Tekst hero **nie jest animowany** (h1 ma być widoczny w pierwszej klatce, to chroni LCP).
2. Podkreślenie linków: rysuje się od lewej przy hover/focus, `--dur-2`.
3. Przycisk główny: `transform: scale(0.98)` przy `:active`, `--dur-1`.
4. Menu mobilne: wejście przez przezroczystość i przesunięcie 8 px, `--dur-2`.
5. Zmiana motywu: przenikanie całej strony przez View Transitions API (`document.startViewTransition`), 300 ms; jeśli API nie ma, zmiana natychmiastowa. `next-themes` z `disableTransitionOnChange`.
6. Nagłówek: płynna zmiana tła i linii dolnej po przewinięciu, `--dur-2`.
7. Potwierdzenie skopiowania e-maila (zmiana etykiety na 2 s).

Dodatkowe animacje od wersji 1.1 (wdrażane w etapie C; zasada: tylko CSS, tylko `opacity`/`transform`/`clip-path`, 0 kB JS, wszystko w `@media (prefers-reduced-motion: no-preference)`, bez wsparcia przeglądarki lub bez JS obowiązuje stan końcowy):
8. **Pojawianie się treści przy scrollu** (`animation-timeline: view()` w `@supports`; klasa `.reveal`): nagłówki sekcji, komórki usług, tekst „O nas" i jego tabelka, podpisy projektów, komórki kontaktu. Przezroczystość 0→1 i przesunięcie 16 px→0 na początku wejścia w ekran; sąsiednie komórki w rzędzie z przesunięciem fazy. Tekst hero nie jest animowany. Wsparcie: Chrome 115+, Safari 26+, Firefox 159+ (**[WERYFIKUJ]** przed publikacją na realnych przeglądarkach); wszędzie indziej obowiązuje stan końcowy.
9. **Rysowanie linii**: górna i dolna linia `title-block` (o ile ma `reveal`) i macierzy usług rysują się od lewej (`scaleX`; klasa `.rule-draw`). Linie wykonane jako pseudoelementy `.rule-y`. Nie dotyczy hero ani stopki: tam strona nie przewija się dalej i linia zostałaby narysowana w połowie.
10. **Odsłanianie zdjęć** w „O nas" i portfolio: `clip-path` `inset(6%)`→`inset(0)` i skala zdjęcia 1.08→1 (klasa `.reveal-media`).
11. **Hero**: wartości paska danych wchodzą po otwarciu ramy (opóźnienie 900–1140 ms, czas, nie scroll); zdjęcie przesuwa się o 5% przy wyjeżdżaniu z ekranu (powiększone o 10%, żeby nie odsłonić krawędzi).
12. **Hover** (tylko `@media (hover: hover)`; podkreślenia linków w kolorze `--accent-line`): komórki usług (tło +4% `--fg`, bursztynowa linia rysuje się wzdłuż górnej krawędzi), projekty w portfolio (zdjęcie 1→1.03 w 700 ms, bursztynowa linia pod podpisem), przycisk główny (`brightness(1.1)`, uniesienie o 1 px), linki tekstowe (bursztynowa linia rysuje się nad stałym podkreśleniem), linki nawigacji i stopki (linia w kolorze tekstu; aktywna sekcja ma linię bursztynową), przyciski-ikony (tło `--line`). Podkreślenie linku leży na samym tekście, a strefa kliknięcia ma min. 44 px.
13. **Menu mobilne**: linki wchodzą kolejno (od 80 ms, co 40 ms); zamknięcie animowane tak jak otwarcie (`transition-behavior: allow-discrete`). Etykieta przycisku „Skopiuj e-mail" przenika przy zmianie na „Skopiowano". Obrót ikony motywu został pominięty: odpalałby się też przy każdym załadowaniu strony.
14. **Znacznik sekcji**: bursztynowa kreska 48 × 2 px nad h2 każdej sekcji; rysuje się od lewej przy scrollu (`.section-mark`).
15. **Ramy zdjęć** (komponent `framed-media`): w hero kreski ramy rysują się raz przy ładowaniu; w „O nas" i portfolio rosną od narożników ramy, gdy rama wjeżdża w ekran (`.frame-scroll`, `.frame-line`).
16. **Piktogramy usług** rysują swoje kreski, gdy kafelek wjeżdża w ekran (`.service-cell`, `.service-icon`; `pathLength` 1, `stroke-dashoffset`).
17. **Licznik w hero** (`count-up`, jedyny kliencki element ruchu): liczby w pasku danych wjeżdżają od dołu (900 ms) i liczą od 0 do wartości (1,4 s) raz, gdy są w połowie widoczne; start z opóźnieniem 700/800/900 ms. Wartość końcowa jest w HTML i w kopii dla czytników ekranu; przy `prefers-reduced-motion` brak animacji; bez JS krótka zasłona CSS (700 ms) i wartość końcowa.

`@media (prefers-reduced-motion: reduce)`: wszystkie powyższe wyłączone (stan końcowy od razu), `scroll-behavior: auto`. Płynne przewijanie do kotwic tylko bez tej preferencji.

### 2.7 Logo

Komponent `Logo` renderuje SVG inline. Sygnet ma `fill: var(--accent-line)` (bursztyn; na jasnych tłach lekko przyciemniony), napis `fill="currentColor"` (kolor z `--fg`), więc jeden komponent obsługuje oba motywy. Nie używaj plików `-kreda`/`-mech` jako `<img>`; ikona strony, ikona Apple i obraz Open Graph pozostają w kolorach z §8. Warianty:

| Wariant | Geometria | Użycie |
|---|---|---|
| `mark` | `viewBox="0 0 100 100"`, ścieżka sygnetu (niżej) | stopka mobilna, 404, ikona apple |
| `horizontal` | `viewBox="0 0 358.3 100"`: sygnet w (0,0) + ścieżka `#napis` z `brand/svg/archica-logo-mech.svg` w `<g transform="translate(128 -92.5)">` | nagłówek |
| `stacked` | `viewBox="0 0 230.3 166.789"`, obie ścieżki 1:1 z `archica-logo-mech.svg` | stopka desktop, obraz Open Graph |

Ścieżka sygnetu (z `archica-sygnet-mech.svg`, nie modyfikuj):
`M3.164 0L96.836 0L58.836 31L41.164 31ZM96.836 100L3.164 100L41.164 69L58.836 69ZM0 97.419L0 2.581L21 19.713L21 80.287ZM25 22.976L38 33.581L38 66.419L25 77.024ZM100 2.581L100 97.419L79 80.287L79 19.713ZM75 77.024L62 66.419L62 33.581L75 22.976Z`

Ścieżkę `#napis` skopiuj dokładnie z pliku; nie odtwarzaj napisu fontem.

Zasady: sygnet nigdy mniejszy niż 24 px (w nagłówku 28 px mobile, 32 px desktop); pole ochronne ≥ 1/4 wysokości sygnetu; logo ma dostępną nazwę „Archica" (`role="img"` + `<title>`), w nagłówku jest linkiem do `/{locale}`.

Sygnet uproszczony do małych rozmiarów (favicon), `viewBox="0 0 100 100"`:
`M11 0H89L64 28H36ZM11 100H89L64 72H36ZM0 9V91L28 66V34ZM100 9V91L72 66V34Z`

---

## 3. Dane i treści

### 3.1 Dane firmy (`src/content/site.ts`) — fakty, nie zmieniaj

| Pole | Wartość |
|---|---|
| Pełna nazwa | Studio Architektury i Urbanistyki Archica |
| Marka | Archica |
| Założycielka | mgr arch. Małgorzata Wojtaś-Frankowska |
| Rok założenia | 1996 |
| NIP | 8541544655 |
| Telefony | +48 91 578-37-63 (`tel:+48915783763`), +48 601-916-096 (`tel:+48601916096`) |
| E-mail | archica@archica.pl |
| Adres | ul. Czarnieckiego 25a, 73-110 Stargard |
| Godziny | poniedziałek–piątek, 08:00–16:00 |
| Domena | https://archica.pl |
| Link do mapy | `https://www.google.com/maps/search/?api=1&query=ul.+Czarnieckiego+25a%2C+73-110+Stargard` |
| Numer uprawnień | `MOCK/000/0000` — placeholder widoczny na stronie, z komentarzem `TODO` |

`src/content/site.ts` jest **jedynym** miejscem, w którym te fakty występują. Zawiera też pola pochodne: `hours` (dni tygodnia w nazwach schema.org, `opens`, `closes` w formacie `HH:MM`), `hostname` (`archica.pl`), `address.line` (adres w jednej linii). Słowniki, dane strukturalne, polityka prywatności i komponenty importują je stąd; ręczne przepisywanie numeru telefonu, adresu, godzin, NIP, roku założenia, nazwiska, pełnej nazwy firmy czy nazwy domeny poza `site.ts` jest błędem (wyjątek: odmienione formy w zdaniach, np. „w Stargardzie"). Zapis godzin we francuskim słowniku (`08h00`) powstaje z `site.hours` przez zamianę `:` na `h`.

Lata praktyki liczone na serwerze: `bieżący rok − 1996` (w 2026 r. daje 30). Strona główna ma `export const revalidate = 86400`, żeby liczba i rok w stopce nie zestarzały się między wdrożeniami **[WERYFIKUJ, że konfiguracja segmentu działa w zainstalowanej wersji]**.

### 3.2 Portfolio (`src/content/projects.ts`) — wszystko placeholder

| Kolejność | Plik | Tytuł (taki sam w PL/EN/FR) | Kategoria (tłumaczona) | Slot |
|---|---|---|---|---|
| 1 | `portfolio-residence.png` | Rezydencja Brzozowa | dom prywatny | A |
| 2 | `portfolio-office.png` | Biura Meridian | komercyjne | B |
| 3 | `portfolio-interior.png` | Wnętrze Linden | architektura wnętrz | C |
| 4 | `portfolio-pavilion.png` | Pawilon Grove | przestrzeń publiczna | D |

Model projektu ma pola opcjonalne `location` i `year` (na razie puste, nie wypełniaj) oraz `placeholder: true`. Nazwy własne projektów nie są tłumaczone.

### 3.3 Placeholdery

Placeholderami są: statystyki „86 projektów" i „9 nagród", cztery projekty portfolio, sześć zdjęć, numer uprawnień, okresy przechowywania danych w polityce prywatności.

- Każdy ma w danych `placeholder: true` i komentarz `// PLACEHOLDER:` z opisem, co podmienić.
- Na wdrożeniach podglądowych (`VERCEL_ENV !== 'production'`) i lokalnie przy elemencie widać małą plakietkę „placeholder". Na produkcji plakietek nie ma, poza numerem uprawnień, który zawsze jest jawnie fikcyjny.
- `npm run check:placeholders` (`scripts/check-placeholders.mjs`): wypisuje wszystkie znaczniki `PLACEHOLDER` z `src/content` i `src/i18n`, kończy się kodem 1, jeśli jakiś istnieje. Nie jest częścią `build`; służy jako kontrola przed publikacją.

### 3.4 Teksty

Teksty PL zatwierdzone przez użytkownika 2026-11-14 (sekcja Usługi i lead hero pochodzą od użytkownika). Jeżeli użytkownik dostarczy inne teksty, mają pierwszeństwo. EN i FR tłumaczysz z PL według zasad w §4.3, poza pozycjami podanymi niżej w trzech językach.

| Klucz | PL | EN | FR |
|---|---|---|---|
| Nawigacja | Usługi · O nas · Portfolio · Kontakt | Services · About · Portfolio · Contact | Services · À propos · Portfolio · Contact |
| Eyebrow hero | Studio Architektury i Urbanistyki | Architecture and Urban Planning Studio | Atelier d'architecture et d'urbanisme |
| H1 | Projekt, wnętrza, nadzór. Jedna pracownia. | Design, interiors, supervision. One studio. | Conception, intérieurs, suivi de chantier. Un seul atelier. |
| Przycisk główny | Omów swój projekt | Discuss your project | Présentez-nous votre projet |
| Link drugorzędny | Zobacz projekty | See our projects | Voir les projets |
| H2 usługi | Usługi | Services | Services |
| H2 o nas | Wiesz, z kim pracujesz | Know who you are working with | Vous savez avec qui vous travaillez |
| H2 portfolio | Wybrane projekty | Selected projects | Projets sélectionnés |
| H2 kontakt | Masz działkę albo pomysł? Porozmawiajmy. | Got a plot or an idea? Let’s talk. | Un terrain ou une idée ? Parlons-en. |
| Etykiety tabelki kontaktu | Telefon · E-mail · Adres · Godziny pracy | Phone · Email · Address · Opening hours | Téléphone · E-mail · Adresse · Horaires |
| Statystyki | rok/lata/lat praktyki (odmiana przez `Intl.PluralRules`) · projektów · nagród · siedziba pracowni | year/years in practice · projects · awards · studio location | an/ans de pratique · projets · prix · siège de l’atelier |
| Cytat | „Każdy projekt zaczyna się od działki, nie od szkicownika." | “Every project starts with the site, not the sketchbook.” | « Chaque projet commence par le site, pas par le carnet de croquis. » |
| Podpis cytatu | mgr arch. Małgorzata Wojtaś-Frankowska, założycielka pracowni | Małgorzata Wojtaś-Frankowska, architect and founder | Małgorzata Wojtaś-Frankowska, architecte et fondatrice |
| `<title>` | Archica — pracownia architektoniczna w Stargardzie | Archica — architecture studio in Stargard, Poland | Archica — atelier d’architecture à Stargard, Pologne |

(Kropki środkowe w tabeli tylko oddzielają osobne napisy; nie trafiają na stronę.)

Teksty PL do przetłumaczenia:

- **Lead hero:** „Od pierwszego szkicu do odbioru inwestycji prowadzimy każdy etap projektu."
- **Lead usług:** brak (sekcja ma tylko nagłówek i cztery komórki).
- **Usługi** (tytuł / opis; bez wiersza „dla kogo"):
  1. Projektowanie architektoniczne / „Od koncepcji do dokumentacji wykonawczej dla domów prywatnych, biur i budynków publicznych."
  2. Architektura wnętrz / „Planowanie przestrzeni dopasowane do sposobu życia."
  3. Planowanie urbanistyczne / „Koncepcje zagospodarowania terenu respektujące kontekst i społeczność."
  4. Nadzór inwestorski / „Nadzór na budowie, aby realizacja odpowiadała projektowi."

  Źródło: tekst dostarczony przez użytkownika. Użytkownik wykluczył frazy z jego pierwotnej wersji, których pracownia nie potwierdziła (doradztwo materiałowe, projekt oświetlenia, strategie inwestycyjne, koordynacja z wykonawcami); nie wracaj do nich bez potwierdzenia. Pozwolenia i uzgodnienia nie są opisane jako usługa, więc nie obiecuj ich w hero ani w opisie meta.
- **O nas, akapit 1:** „Archica to kilkuosobowa pracownia, którą od początku prowadzi jej założycielka. Za projektem stoi więc konkretna osoba, a nie anonimowy zespół."
- **O nas, akapit 2:** „Projekt prowadzą te same osoby od pierwszej wizyty na działce po nadzór na budowie. Niczego nie trzeba tłumaczyć dwa razy."
- **O nas, tabelka:** Rok założenia: 1996; Siedziba: Stargard; Klienci: inwestorzy prywatni i samorządy.
- **Lead portfolio:** „Projekty różnej skali: od domu jednorodzinnego po przestrzeń publiczną." Portfolio zawiera wizualizacje, więc nagłówek brzmi „Wybrane projekty", nie „realizacje".
- **Lead kontaktu:** „Zadzwoń lub napisz. Powiemy, od czego zacząć." (godziny są wyłącznie w komórce „Godziny pracy").
- **Opis meta:** „Pracownia architektury i urbanistyki w Stargardzie, od 1996 roku. Projektowanie architektoniczne, architektura wnętrz, planowanie urbanistyczne i nadzór inwestorski."
- **404:** „Tej strony nie ma w projekcie" / „Adres mógł się zmienić albo wkradła się literówka."
- **Teksty alternatywne zdjęć:** opisowe, neutralne, bez nazw fikcyjnych projektów poza ich tytułem (np. „Wizualizacja: Rezydencja Brzozowa, widok od ogrodu" dopasuj do faktycznej zawartości pliku). Zdjęcie w „O nas": opis tego, co widać.

Zakazane w treści: wzmianki o biurach w hero i „O nas", superlatywy („najlepsi", „wiodący"), obietnice terminów i cen.

---

## 4. Języki i routing

### 4.1 Adresy

| Adres | Zawartość |
|---|---|
| `/` | przekierowanie 308 na `/pl` |
| `/pl`, `/en`, `/fr` | strona główna (jedna strona, sekcje jako kotwice) |
| `/pl/privacy`, `/en/privacy`, `/fr/privacy` | polityka prywatności |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generowane |

Identyfikatory kotwic takie same we wszystkich językach: `top`, `services`, `about`, `portfolio`, `contact`.

Segment `[locale]`: `generateStaticParams` zwraca `pl`, `en`, `fr`; `dynamicParams = false`; `params` jest `Promise` (await). Wszystkie strony generowane statycznie. Layout główny (`<html>`, `<body>`) leży w `app/[locale]/layout.tsx`; nie twórz `app/layout.tsx`. Globalne 404 dla adresów spoza `[locale]`: użyj `global-not-found` **[WERYFIKUJ, czy jest stabilne w zainstalowanej wersji; jeśli nie, zostaw domyślne 404 i zgłoś]**.

### 4.2 Słowniki

Bez biblioteki i18n. `src/i18n/dictionaries/pl.ts` jest wzorcem; typ `Dictionary = typeof pl`; `en.ts` i `fr.ts` deklarują `satisfies Dictionary`, więc brakujący klucz zatrzymuje build. `getDictionary(locale)` jest `server-only`. Komponenty klienckie dostają gotowe napisy przez propsy.

Przestrzenie nazw słownika: `meta`, `a11y`, `nav`, `hero`, `services`, `about`, `portfolio`, `contact`, `footer`, `privacy`, `notFound`, `common` (m.in. „placeholder", „skopiowano", „otwiera się w nowej karcie").

### 4.3 Zasady tłumaczeń i typografii

- PL: cudzysłowy „…", półpauza z odstępami w zakresach słownych, zakresy liczbowe z półpauzą bez spacji (08:00–16:00), twarda spacja po jednoliterowych spójnikach i przyimkach (a, i, o, u, w, z).
- EN (brytyjski): cudzysłowy “…”, apostrof ’.
- FR: guillemets « … » z twardą spacją wewnątrz, twarda spacja przed `: ; ! ?`, apostrof ’.
- Nazwy własne (Archica, Stargard, tytuły projektów, pełna nazwa firmy w stopce i danych strukturalnych) zostają po polsku we wszystkich wersjach.
- Adres w formacie polskim we wszystkich wersjach. Telefony zawsze z prefiksem +48.
- Godziny: PL „pon.–pt. 08:00–16:00", EN „Mon–Fri 08:00–16:00", FR „lun.–ven. 08h00–16h00".
- Po przetłumaczeniu przeczytaj każdą wersję w całości: żadnych resztek szablonu (Warszawa, 9:00–17:00, „Résidence Birchwood").

---

## 5. Struktura projektu i podział Server/Client

```
brand/                         paczka logo (źródło, nie serwowana)
public/images/                 6 zdjęć o stałych nazwach
scripts/check-placeholders.mjs
src/
  app/
    globals.css                tokeny (§2), @theme, style bazowe
    [locale]/
      layout.tsx               S  <html lang>, font, ThemeProvider, SkipLink, Header, <main>, Footer, Analytics, JSON-LD
      page.tsx                 S  składa sekcje; revalidate
      privacy/page.tsx         S
      not-found.tsx            S
      opengraph-image.tsx      S  ImageResponse (§8)
    icon.svg                      sygnet uproszczony
    apple-icon.tsx             S  ImageResponse 180×180
    manifest.ts  robots.ts  sitemap.ts
  components/
    layout/
      header.tsx               S  struktura nagłówka, przekazuje napisy
      header-shell.tsx         C  stan „przewinięto" jako data-atrybut
      nav-links.tsx            C  aktywna sekcja (IntersectionObserver)
      mobile-menu.tsx          C  natywny <dialog>
      language-switcher.tsx    C  usePathname, zachowuje ścieżkę i kotwicę
      theme-toggle.tsx         C
      footer.tsx               S
      skip-link.tsx            S
    sections/
      hero.tsx  services.tsx  about.tsx  portfolio.tsx  contact.tsx      S
    ui/
      container.tsx  section.tsx  section-header.tsx  section-mark.tsx  logo.tsx  icons.tsx  button-link.tsx
      framed-media.tsx  service-icons.tsx
      text-link.tsx  title-block.tsx  media.tsx  placeholder-badge.tsx
      postal-address.tsx  contact-links.tsx (PhoneLinks, EmailLink)      S
      copy-button.tsx          C
      count-up.tsx             C
    providers/theme-provider.tsx   C
    seo/json-ld.tsx            S
  content/
    site.ts  projects.ts  images.ts  privacy/{pl,en,fr}.ts
  i18n/
    config.ts  get-dictionary.ts  dictionaries/{pl,en,fr}.ts
  lib/
    metadata.ts  years.ts  cn.ts
```

S = Server Component, C = Client Component. Plików `C` jest dziewięć (osiem z tej listy, w tym `ui/count-up.tsx`, oraz `layout/not-found-content.tsx`, który czyta język z `useParams`) i ta lista jest zamknięta. Sekcje nie zawierają żadnego JS klienckiego poza `copy-button` w kontakcie.

Uwagi:
- `framed-media.tsx` składa ramę z bursztynowymi przekątnymi i zdjęciem w otworze (hero, „O nas", portfolio slot B); `service-icons.tsx` zawiera cztery piktogramy usług (klucze = `services.items[].id`); `section-mark.tsx` to bursztynowy znacznik nad h2; `count-up.tsx` to licznik liczb w hero.
- `postal-address.tsx` i `contact-links.tsx` renderują adres, telefony i e-mail wyłącznie z `site.ts`. Używają ich kontakt, stopka i (jako slot `contact` przekazany z serwera) menu mobilne; nie wolno przepisywać tych danych w JSX. `section-header.tsx` to wspólny nagłówek sekcji (h2 po lewej, opcjonalny lead po prawej).
- `header-shell.tsx` owija dzieci renderowane na serwerze i tylko przełącza `data-scrolled`; nie renderuje treści samodzielnie.
- `theme-toggle.tsx` pokazuje ikonę słońca/księżyca przez CSS zależny od klasy `.dark` (bez stanu `mounted`, bez migotania). `<html>` ma `suppressHydrationWarning`.
- `ThemeProvider`: `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `themes={['dark','light']}`, `storageKey="archica-theme"`, `disableTransitionOnChange`.
- `title-block.tsx` to wspólny prymityw „tabelki rysunkowej": lista definicji (`<dl>`) z komórkami rozdzielonymi `--line`, etykieta w stylu `label`, wartość w stylu `value` albo `stat`.
- `icons.tsx`: pięć ikon SVG (menu, zamknij, słońce, księżyc, kopiuj), `aria-hidden`, obrys 1,5 px, `currentColor`.

---

## 6. Sekcje

### 6.1 Nagłówek (stały, `position: fixed`, pełna szerokość)

- Zawartość, desktop: po lewej `Logo horizontal`; po prawej kolejno nawigacja (Usługi, O nas, Portfolio, Kontakt), przełącznik języka (`PL EN FR` jako trzy linki tekstowe, bez flag i bez listy rozwijanej), przełącznik motywu (przycisk-ikona).
- Nie ma pozycji „Start": do góry strony prowadzi logo.
- Stan na górze strony: tło przezroczyste, bez linii. Po przewinięciu o 24 px: tło `--bg` 88% + `backdrop-filter: blur(12px)`, linia dolna `--line`. Nagłówek nie chowa się przy przewijaniu.
- Aktywna sekcja: link z `aria-current="true"` i podkreśleniem 1 px. Na `/privacy` linki prowadzą do `/{locale}#sekcja` i żaden nie jest aktywny.
- Przełącznik języka: linki do tej samej ścieżki w innym języku, z zachowaniem kotwicy; atrybuty `lang` i `hrefLang`; bieżący język ma `aria-current="true"` i kolor `--fg`, pozostałe `--fg-muted`.
- Przełącznik motywu: `aria-label` opisuje akcję („Włącz motyw jasny" / „Włącz motyw ciemny").
- Mobile i tablet (poniżej 1024 px): logo + przycisk menu. Nawigacja, języki i motyw są w menu.
- Menu mobilne: natywny `<dialog>` otwierany `showModal()`, na cały ekran, tło `--bg`. Zawartość: przycisk zamknięcia u góry po prawej; cztery linki w stylu `h2` jeden pod drugim; pod linią: oba telefony i e-mail; na dole w jednym wierszu języki i przełącznik motywu. Zamknięcie: przycisk, Esc, kliknięcie linku. Po zamknięciu fokus wraca na przycisk menu.

### 6.2 Hero (`#top`)

Zawartość: eyebrow, h1, lead, przycisk główny (→ `#contact`), link drugorzędny (→ `#portfolio`), rama z obrazem `hero-building.png`, pasek danych.

Desktop:
- `min-height: 100svh`, treść zaczyna się pod nagłówkiem. Siatka 12 kolumn.
- Kolumny 1–6: eyebrow, h1, lead, akcje; blok wyrównany do dołu obszaru nad paskiem danych.
- Kolumny 7–12: **rama**. Kwadrat (`aspect-ratio: 1`), obrys 1 px `--line`, wysokość ograniczona do `min(szerokość kolumny, 68svh)` (komponent `framed-media`). W środku obraz 4:5 zajmujący 68% szerokości i 84% wysokości ramy (odsunięcie 16% z boków, 8% z góry i dołu). Cztery linie 1,25 px w kolorze `--accent-line` łączą narożniki ramy z narożnikami obrazu (SVG na całą ramę, `preserveAspectRatio="none"`, `vector-effect: non-scaling-stroke`, `aria-hidden`).
- Pasek danych na dole sekcji, pełna szerokość kontenera, `title-block` w 4 komórkach: (1) `{lata}` z etykietą „rok/lata/lat praktyki" (odmiana wg liczby); (2) 86 z etykietą „projektów" (placeholder); (3) 9 z etykietą „nagród" (placeholder); (4) „Stargard" z etykietą „siedziba pracowni". Wartości w stylu `stat`, etykiety `label`.
- Animacja otwarcia: §2.6 pkt 1.

Tablet: jak desktop, ale tekst w kolumnach 1–12 nad ramą; rama w kolumnach 3–10; pasek danych 4 komórki.

Mobile:
- Kolejność: eyebrow, h1, lead, akcje (przycisk na pełną szerokość, link pod nim), rama na pełną szerokość kontenera, pasek danych jako siatka 2 × 2.
- H1 i przycisk główny muszą mieścić się w pierwszym ekranie 360 × 640.

Przycisk główny: wypełnienie `--accent`, tekst `--on-accent`, styl `body` 500, wysokość 3rem, `--radius-sm`. Link drugorzędny: tekst `--fg` z podkreśleniem 1 px.

### 6.3 Usługi (`#services`)

- Nagłówek sekcji (`section-header`): bursztynowy znacznik (§2.6 pkt 14) i h2, bez leadu i bez etykiety tekstowej. Wspólny komponent z leadem w kolumnach 7–12 jest używany w portfolio i kontakcie.
- Macierz 2 × 2 (`title-block`): linia nad i pod macierzą, jedna linia pionowa i jedna pozioma w środku; bez obrysu po bokach, bez numerów. Tło sekcji: `surface`. Nad h3 piktogram 40 px (§2.6 pkt 16, własny rysunek techniczny: obrys 1,5 px, bez wypełnień, kolor `--accent-line`); jedyne ikony na stronie poza przyciskami interfejsu.
- Komórka: `padding: clamp(1.5rem, 3vw, 3rem)`, `min-height: 18rem` (desktop), układ kolumnowy: h3 u góry, opis (`body`, maks. 42ch) pod nim. Bez wiersza „dla kogo".
- Komórki nie są linkami (bez `cursor: pointer`), ale mają dyskretny hover z §2.6 pkt 12.
- Tablet: 2 × 2. Mobile: jedna kolumna, cztery wiersze rozdzielone liniami, `min-height` zniesione.
- Semantyka: `<ul>` z czterema `<li>`, w każdym `<h3>`.

### 6.4 O nas (`#about`) — pas kontrastowy

- Sekcja ma klasę `.band` (§2.3): w motywie ciemnym tło piaskowe i tekst węgiel, w jasnym tło węgiel i tekst kreda. Pas na pełną szerokość okna.
- Desktop: zdjęcie `about-studio.png` w ramie `framed-media` (rama 4:5 w kolumnach 1–5, odsunięcie zdjęcia 10%). Tekst w kolumnach 7–12: h2, cytat (`<figure>` z `<blockquote>` w stylu `quote` i `<figcaption>` z podpisem w stylu `small`), dwa akapity, na dole `title-block` z trzema wierszami (etykieta: wartość): „Rok założenia": 1996; „Siedziba": Stargard; „Klienci": inwestorzy prywatni i samorządy (nazwisko założycielki występuje raz, w podpisie cytatu).
- Cudzysłowy są częścią tekstu cytatu (ze słownika), nie dekoracją graficzną. Bez wielkiego ozdobnego znaku cudzysłowu.
- Mobile: h2, zdjęcie (pełna szerokość kontenera, 4:5), cytat, akapity, tabelka.

### 6.5 Portfolio (`#portfolio`)

- Nagłówek sekcji (`section-header`): h2 i lead.
- Desktop, układ asymetryczny na siatce 12 kolumn (cztery sloty):
  - A: kolumny 1–7, proporcje 4:3.
  - B: kolumny 9–12, proporcje 4:5, odsunięty w dół o 6rem względem A; jedyny slot portfolio w ramie `framed-media` (odsunięcie zdjęcia 12%).
  - C: kolumny 1–4, proporcje 4:5.
  - D: kolumny 6–12, proporcje 4:3, odsunięty w dół o 6rem względem C.
  - Odstęp pionowy między wierszami: 6rem.
- Każdy projekt to `<figure>`: zdjęcie, pod nim `<figcaption>` w dwóch liniach: tytuł (`h3`) i kategoria (`small`, `--fg-muted`). Jeżeli `location` lub `year` są wypełnione, trafiają do drugiej linii po przecinku.
- Projekty nie są linkami: bez `cursor: pointer` i bez nakładki; dyskretny hover z §2.6 pkt 12 (lekkie powiększenie zdjęcia i linia pod podpisem).
- Tablet: dwie równe kolumny, wszystkie zdjęcia 4:5, bez odsunięć. Mobile: jedna kolumna, proporcje ze slotów, odstęp 3rem.
- Model danych i komponent mają być gotowe na przyszłe podstrony projektów (pole `slug`), ale podstron teraz nie tworzymy.

### 6.6 Kontakt (`#contact`)

- Nagłówek sekcji (`section-header`): h2 i lead. Lead nie powtarza godzin pracy.
- `title-block` w 4 komórkach (desktop: jeden wiersz; tablet: 2 × 2; mobile: jedna kolumna):
  1. Telefon — dwa linki `tel:` jeden pod drugim, styl `value`.
  2. E-mail — link `mailto:` w stylu `value` i pod nim przycisk tekstowy „Skopiuj e-mail" (`copy-button`; po kliknięciu etykieta „Skopiowano" na 2 s, komunikat w `aria-live="polite"`).
  3. Adres — `<address>` w dwóch liniach, pod nim link „Zobacz w Mapach Google" (nowa karta, `rel="noopener noreferrer"`, ukryty tekst „otwiera się w nowej karcie").
  4. Godziny pracy — dni i godziny w dwóch liniach.
- Bez formularza, bez osadzonej mapy, bez ikon w komórkach.

### 6.7 Stopka

- Tło bazowe (Kontakt tuż nad nią ma `surface`), górny odstęp 3rem; sekcja Kontakt ma krótszy dolny odstęp (`section-y-tight-end`). Linia górna `--line`. Desktop, trzy kolumny: (1) `Logo stacked`, sygnet ok. 72 px; (2) Dane firmy: pełna nazwa, NIP, numer uprawnień (mock, z dopiskiem „do uzupełnienia"); (3) Nawigacja: cztery sekcje, Polityka prywatności. Dane kontaktowe nie powtarzają się w stopce (są w sekcji Kontakt tuż nad nią i w menu mobilnym).
- Wiersz dolny: „© {rok} Archica" po lewej (pełna nazwa firmy jest w kolumnie „Dane firmy"); link „Wróć na górę" po prawej.
- Mobile: kolumny jedna pod drugą, `Logo mark` zamiast `stacked`.

### 6.8 Polityka prywatności (`/{locale}/privacy`)

- Układ: h1, data aktualizacji, treść w jednej kolumnie (maks. 68ch) w kolumnach 1–8 na desktopie; sekcje z `<h2>`.
- Treść z `src/content/privacy/{locale}.ts` jako struktura (lista sekcji: nagłówek + akapity/listy), renderowana jednym komponentem.
- Zakres: administrator danych (dane z §3.1), hosting i analityka Vercel (możliwe przetwarzanie poza EOG, m.in. w USA), brak formularza, brak własnych plików cookie, kontakt telefoniczny i mailowy, prawa osób, których dane dotyczą, prawo skargi do Prezesa UODO.
- Okresy przechowywania korespondencji: jawny placeholder „[do uzupełnienia]" z flagą `placeholder`.
- Na górze pliku komentarz: tekst jest projektem wymagającym weryfikacji prawnej. Nie dodawaj tej informacji na stronie.

### 6.9 Strona 404

`Logo mark` 96 px, h1 „Nie znaleziono strony", jedno zdanie, link do strony głównej. Wyśrodkowane w pionie i poziomie.

---

## 7. Obrazy

- Zdjęcia importowane statycznie w `src/content/images.ts` (z `public/images/…`), żeby `next/image` znał wymiary, generował `blurDataURL` i nadawał adresom skrót treści (podmiana pliku o tej samej nazwie nie zostanie zatrzymana w pamięci podręcznej).
- Komponent `media.tsx`: kontener z `aspect-ratio` slotu, tło `--media-bg`, w środku `next/image` z `fill`, `object-fit: cover`, `placeholder="blur"`. Dzięki temu użytkownik może podmienić plik o dowolnych wymiarach bez zmiany kodu. Opcjonalne `objectPosition` per zdjęcie w `images.ts`.
- `sizes`:

| Slot | `sizes` |
|---|---|
| hero | `(min-width: 1024px) 33vw, (min-width: 768px) 46vw, 68vw` |
| o nas | `(min-width: 1024px) 38vw, 100vw` |
| portfolio A, D | `(min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw` |
| portfolio B, C | `(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw` |

- Hero: ładowanie priorytetowe (`preload`, a jeśli zainstalowana wersja go nie ma, `priority`) **[WERYFIKUJ]**, `quality={85}`. Pozostałe zdjęcia leniwie, `quality` domyślne.
- W `README.md` opisz podmianę zdjęć i zalecane wymiary źródeł: sloty 4:5 co najmniej 1600 × 2000 px, sloty 4:3 co najmniej 2400 × 1800 px, nazwy plików bez zmian.

---

## 8. SEO

- `generateMetadata` w layoucie i na stronach, przez pomocnik `lib/metadata.ts`: `metadataBase: https://archica.pl`, tłumaczone `title` i `description`, szablon tytułu podstron `%s — Archica`.
- `alternates.canonical`: własny adres strony. `alternates.languages`: `pl`, `en`, `fr` oraz `x-default` → wersja `/pl`. To samo dla `/privacy`.
- Open Graph: `type: website`, `siteName: Archica`, `locale` (`pl_PL`, `en_GB`, `fr_FR`) i `alternateLocale`; Twitter `summary_large_image`.
- `opengraph-image.tsx`: 1200 × 630, tło węgiel, pośrodku `Logo stacked` w kolorze kredy (same ścieżki wektorowe, bez tekstu z fontu), `alt` ze słownika.
- `sitemap.ts`: 6 adresów, każdy z `alternates.languages`. `robots.ts`: zezwól na wszystko, wskaż mapę strony.
- Ikony: `app/icon.svg` z sygnetem uproszczonym (§2.7), wypełnienie węgiel, a w `@media (prefers-color-scheme: dark)` kreda; `apple-icon.tsx`: 180 × 180, tło węgiel, pełny sygnet w kolorze kredy na 60% szerokości. Usuń `favicon.ico` ze scaffoldu.
- `manifest.ts`: `name` (pełna nazwa), `short_name: Archica`, `theme_color` i `background_color` `#1E1916`, ikony jak wyżej. `viewport.themeColor`: `#1E1916`.
- JSON-LD w layoucie (`json-ld.tsx`), typ `ProfessionalService`: `name`, `legalName`, `url`, `logo`, `image`, `telephone` (oba), `email`, `address` (`PostalAddress`: `streetAddress` „ul. Czarnieckiego 25a", `postalCode` „73-110", `addressLocality` „Stargard", `addressCountry` „PL"), `openingHoursSpecification` (pon.–pt., 08:00–16:00), `foundingDate` „1996", `founder` (`Person`), `vatID` „PL8541544655", `knowsLanguage` [`pl`, `en`, `fr`]. Bez współrzędnych geograficznych, bez ocen, bez danych placeholderowych.
- Jeden `<h1>` na stronę; sekcje to `<section aria-labelledby>` z `<h2>`; elementy list z `<h3>`.

---

## 9. Dostępność (WCAG 2.2 AA)

- Pierwszy element w `<body>`: link „Przejdź do treści" widoczny po sfokusowaniu.
- Landmarki: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`; etykiety ze słownika.
- `<html lang>` zgodny z językiem strony; linki do innych wersji językowych z `lang`.
- Fokus: `:focus-visible` z obrysem 2 px `--focus` i odstępem 2 px na każdym elemencie interaktywnym; nigdy `outline: none` bez zamiennika. Fokus nie może chować się pod stałym nagłówkiem (`scroll-padding-top`).
- Kolory tekstu wyłącznie z par opisanych w §2.2–2.3. Bursztyn i szałwia w oryginalnych odcieniach nie są kolorem tekstu.
- Pełna obsługa z klawiatury: kolejność zgodna z układem; menu mobilne zatrzymuje fokus (natywny `<dialog>`) i zwraca go po zamknięciu.
- Treść czytelna i funkcjonalna przy szerokości 320 px i przy powiększeniu tekstu do 200%, bez przewijania poziomego.
- Zdjęcia z tekstem alternatywnym ze słownika; grafiki dekoracyjne (linie ramy, ikony) z `aria-hidden`.
- Animacje zgodnie z §2.6, z obsługą `prefers-reduced-motion`.
- Numery telefonów jako linki `tel:`; godziny i adres jako tekst, nie obraz.

---

## 10. Bezpieczeństwo i wdrożenie

Nagłówki (w `next.config.ts`, dla wszystkich ścieżek):

| Nagłówek | Wartość |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000` (bez `includeSubDomains` i `preload`, dopóki użytkownik nie potwierdzi, że żadna subdomena archica.pl nie działa po HTTP) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `X-Frame-Options` | `DENY` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

- CSP bez nonce jest świadomym wyborem: nonce wymusiłby renderowanie dynamiczne każdej strony, a strona nie ma formularzy, danych użytkownika ani skryptów zewnętrznych. `'unsafe-inline'` w `script-src` jest potrzebne dla skryptów startowych Next.js i `next-themes`.
- W trybie deweloperskim dopuść dodatkowo `'unsafe-eval'` i źródła skryptu debugowego Vercel Analytics. Na wdrożeniach podglądowych dopuść `https://vercel.live` (pasek narzędzi Vercel) albo nie nakładaj tam CSP. Produkcja dostaje wersję z tabeli.
- Vercel Analytics: komponent `<Analytics />` z `@vercel/analytics/next` w layoucie. Bez innych skryptów zewnętrznych, bez osadzonych map, bez fontów z CDN.
- Linki zewnętrzne: `rel="noopener noreferrer"`. Brak sekretów i zmiennych środowiskowych wymaganych do builda.
- `README.md` zawiera listę kontrolną publikacji: `npm run check:placeholders`; weryfikacja prawna polityki prywatności; podpięcie domeny archica.pl i przekierowanie `www` → domena główna; **rekordy poczty (MX, SPF, DKIM) pozostają bez zmian** (dodajemy tylko rekordy wskazane przez Vercel, nie przenosimy serwerów nazw); test nagłówków; Lighthouse.

---

## 11. Budżety jakości

- Lighthouse (mobile) ≥ 95 w każdej kategorii na `/pl`.
- LCP < 2,0 s (4G, średni telefon), CLS < 0,02, INP < 200 ms.
- Własny JS kliencki (ponad środowisko Next/React): do 15 kB gzip.
- Zero błędów i ostrzeżeń w konsoli, zero ostrzeżeń hydracji.
- `typecheck`, `lint`, `build` bez błędów i ostrzeżeń.

---

## 12. Kolejność wdrażania

### Etap 1 — Fundament
Zakres: scaffold i zależności (§1); `next.config.ts` z przekierowaniem, obrazami i nagłówkami; `globals.css` z tokenami (§2.2–2.6) i stylami bazowymi; font; `i18n/config.ts`, typ słownika, trzy słowniki z kompletem kluczy i treści (§3.4, §4.3); `content/site.ts`, `projects.ts`, `images.ts`; `[locale]/layout.tsx` z `ThemeProvider`; `Logo` (trzy warianty), `icons`, `Container`, `Section`, `title-block`, `media`, `button-link`, `text-link`; tymczasowa strona główna pokazująca tokeny, typografię i logo w obu motywach.
Gotowe, gdy: `/` przekierowuje na `/pl`; `/pl`, `/en`, `/fr` budują się statycznie z poprawnym `lang`; nieznany język daje 404; motyw ciemny jest domyślny przy pierwszej wizycie (także bez JS), wybór jest zapamiętywany, brak migotania; usunięcie klucza z `fr.ts` zatrzymuje `typecheck`.

### Etap 2 — Szkielet strony
Zakres: `SkipLink`, nagłówek w wersji desktop i mobile (§6.1) z nawigacją, przełącznikiem języka, przełącznikiem motywu i menu `<dialog>`; stopka (§6.7); strona 404 (§6.9).
Gotowe, gdy: cały szkielet da się obsłużyć klawiaturą; przełącznik języka zachowuje ścieżkę i kotwicę; menu zatrzymuje i zwraca fokus; nagłówek zmienia stan po przewinięciu; układ poprawny przy 320, 768, 1024 i 1440 px.

### Etap 3 — Sekcje
Zakres: Hero, Usługi, O nas, Portfolio, Kontakt (§6.2–6.6) z pełną treścią w trzech językach i zdjęciami (§7); plakietki placeholderów (§3.3); `copy-button`. Bez animacji otwarcia hero (stan końcowy na stałe).
Gotowe, gdy: każda sekcja zgadza się z opisem dla desktopu, tabletu i mobile; aktywna sekcja podświetla się w nawigacji; żaden tekst nie pochodzi spoza słowników; kontrasty zgodne z §2; brak przewijania poziomego przy 320 px.

### Etap 4 — Podstrona, SEO, ikony
Zakres: polityka prywatności w trzech językach (§6.8); metadane, `hreflang`, canonical, Open Graph, `sitemap`, `robots`, `manifest`, JSON-LD (§8); `icon.svg`, `apple-icon`, obraz Open Graph.
Gotowe, gdy: każda z 6 stron ma poprawne `title`, `description`, canonical i komplet `hreflang` z `x-default`; JSON-LD przechodzi walidację schema.org; mapa strony zawiera 6 adresów; ikona czytelna przy 16 px.

### Etap 5 — Ruch, jakość, publikacja
Zakres: animacje z §2.6 (otwarcie hero, linki, motyw, menu) z `prefers-reduced-motion`; przegląd dostępności (§9) z klawiaturą i czytnikiem ekranu; pomiar budżetów (§11); weryfikacja nagłówków (§10) na wdrożeniu podglądowym; `scripts/check-placeholders.mjs`; `README.md` (uruchomienie, edycja treści, podmiana zdjęć, lista placeholderów, lista kontrolna publikacji).
Gotowe, gdy: budżety z §11 spełnione; `check:placeholders` wypisuje dokładnie pozycje z §3.3; raport końcowy wymienia wszystkie pozycje **[WERYFIKUJ]** z informacją, jak zostały rozstrzygnięte.

---

## 13. Świadome odstępstwa od Specyfikacji 1.2

Użytkownik może każde z nich cofnąć przed etapem 1; wtedy obowiązuje zapis ze specyfikacji.

| # | Specyfikacja 1.2 | Blueprint | Powód |
|---|---|---|---|
| 1 | Budowa na szablonie v0 (shadcn/base-ui, lucide) | Nowy scaffold, minimalny zestaw zależności | szablon wymagał pięciu poprawek konfiguracyjnych i niesie nieużywany kod |
| 2 | Next.js 16.3.3 | najnowsze 16.x, min. 16.4.5 | poprawki bezpieczeństwa |
| 3 | Nawigacja z pozycją „Start" | bez „Start" | tę rolę pełni logo |
| 4 | Portfolio w siatce 2 × 2 | układ asymetryczny, cztery sloty | równe kafle to najbardziej szablonowy element strony |
| 5 | Etykiety wersalikami (ogólnie) | wersaliki tylko w eyebrow hero i etykietach tabelek | eyebrow nad każdym nagłówkiem to znak rozpoznawczy szablonów |
| 6 | Promień 0,25 rem (ogólnie) | 0,25 rem tylko dla kontrolek; zdjęcia, ramy i komórki bez zaokrągleń | sygnet ma ostre narożniki |
| 7 | Odcienie pochodne tylko dla tekstu | bez zmian, plus linie jako kolory marki z przezroczystością | linii podziału nie da się uzyskać inaczej |
| 8 | Logo z paczki (układ pionowy, sygnet) | dodatkowy układ poziomy do nagłówka i sygnet uproszczony do favicony | układ pionowy nie mieści się w nagłówku; README paczki zaleca uproszczenie dla 16 px |
| 9 | Hero ze zdjęciem (bez opisu kompozycji) | zdjęcie w ramie odtwarzającej sygnet | motyw marki; źródła 1024 px nie wytrzymają pełnego ekranu |

### 13b. Zmiany względem BLUEPRINT 1.0 (wersja 1.1)

Zatwierdzone przez użytkownika 2026-11-14. Przy sprzeczności z §6.3 i §6.5 („bez stanu hover", „bez powiększenia przy hover") i z dawnym zakazem animacji przy scrollu w §2.1 obowiązuje §2.6 w wersji 1.1.

| # | Wersja 1.0 | Wersja 1.1 | Powód | Etap |
|---|---|---|---|---|
| 10 | Brak animacji przy scrollu, brak hover na komórkach i projektach | Ruch i hover z §2.6 pkt 8–13, wyłącznie CSS (wdrożone) | strona była zbyt surowa | C |
| 11 | Godziny pracy ręcznie w JSON-LD i słownikach | `site.hours` jako jedyne źródło | duplikaty | A |
| 12 | Fakty firmowe (rok, miasto, nazwisko, pełna nazwa, domena) wpisane w słownikach | Słowniki interpolują `site` | duplikaty | A |
| 13 | Adres, telefony i e-mail w JSX trzech komponentów | `postal-address`, `contact-links`, slot `contact` w menu | duplikaty | A |
| 14 | `link-underline` bez widocznego hover | podkreślenie stałe, nad nim rysuje się linia w kolorze akcentu | błąd (hover nie działał) | A |
| 15 | Usługi: 4 komórki (domy, obiekty publiczne, urbanistyka, formalności), „dla kogo", lead | Usługi: 4 komórki wg tekstu użytkownika (projektowanie architektoniczne, wnętrza, urbanistyka, nadzór inwestorski), bez „dla kogo" i bez leadu; „formalności" znikają też z hero i opisu meta | tekst dostarczony przez użytkownika | B |
| 16 | Statystyki 86 i 9 (placeholdery), odmiana „lat praktyki" na sztywno; H1 „Architektura, która zaczyna się od miejsca." | statystyki nadal placeholderami; odmiana liczebnika przez `Intl.PluralRules`; nowy H1, lead hero od użytkownika, „Wybrane projekty" zamiast „realizacji" | błąd językowy od 2028 r.; portfolio to wizualizacje | B |
| 17 | Odstęp pionowy sekcji `clamp(5rem, 12vw, 11rem)`; stopka w 4 kolumnach z danymi kontaktowymi; linie `--line` 16% | stopka w 3 kolumnach bez powtórzenia danych kontaktowych; odstęp `clamp(4.5rem, 9vw, 8rem)`; linie 20%; jednolity `section-header`; cienka linia między Portfolio a Kontaktem; lead hero w kolorze `--fg`; `text-wrap: balance`/`pretty` | rytm, duplikat kontaktu, czytelność | B/C |
| 18 | Kolor bazowy: Głęboki Mech `#2C3E35` (`--moss`) | Palony Węgiel `#1E1916` (`--coal`); `--ink` = `--coal`; kontrasty przeliczone (§2.2), wszystkie pary ≥ AA | próba kolorystyczna na życzenie użytkownika; powrót = podmiana jednej wartości i nazwy tokenu | kolor |
| 19 | Sekcje na jednym tle; bursztyn tylko na przycisku; liczby statyczne; sygnet w kolorze tekstu | Przemienny `surface`; znacznik sekcji; bursztynowe kreski ram, podkreśleń i sygnet (`--accent-line`); ramy zdjęć w 3 miejscach; 4 piktogramy usług; licznik w hero; budżet bursztynu (§2.1) | więcej detalu i dynamiki bez osłabienia przycisku głównego | D |
