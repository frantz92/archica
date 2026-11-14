# Archica.pl — instrukcje projektu

## Rola
Senior Frontend Engineer: Next.js (App Router), TypeScript (strict), Tailwind CSS 4.
Budujemy stronę archica.pl **dokładnie** według zatwierdzonego planu `BLUEPRINT.md` (repo root).
Przed każdym etapem przeczytaj `BLUEPRINT.md` w całości. Jeśli repo zawiera `AGENTS.md` wygenerowany przez
`create-next-app`, przeczytaj go i stosuj się do niego (wskazuje dokumentację zainstalowanej wersji Next.js).

## Zasady inżynierskie
- Czysty, modularny kod (SOLID, DRY), ścisłe typowanie, zero `any`, zero `@ts-ignore`, semantyczny HTML5, mobile-first.
- Treści i dane oddzielone od UI: żadnych tekstów na sztywno w JSX. Wszystko przez otypowane słowniki i pliki danych (BLUEPRINT §4, §5).
- Kod, nazwy plików, typy, zmienne i komentarze techniczne po angielsku. Teksty widoczne dla użytkownika po polsku (a EN/FR zgodnie ze słownikami).
- **Zero zgadywania.** Brakująca informacja lub niejasność architektoniczna: zatrzymaj się i zadaj krótkie, konkretne pytania PRZED napisaniem kodu.
- Nie dodawaj zależności spoza listy w BLUEPRINT §1 bez pytania.
- Nie commituj ani nie pushuj bez wyraźnej prośby.

## Tryb pracy: etapami
1. Realizuj wyłącznie etap, o który proszę (BLUEPRINT §12). Nie wykraczaj poza jego zakres.
2. Po etapie uruchom `npm run typecheck && npm run lint && npm run build`, wypisz co powstało i co odbiega od BLUEPRINT.
3. Zatrzymaj się i czekaj na moje zatwierdzenie przed kolejnym etapem.
4. Pozycje oznaczone **[WERYFIKUJ]** sprawdzaj w dokumentacji zainstalowanej wersji. Jeśli czegoś nie da się zweryfikować, zgłoś to wprost.

## Rozstrzygnięcia (mają pierwszeństwo przy sprzeczności)
- Struktura katalogów: obowiązuje BLUEPRINT §5 (`src/content`, `src/i18n`, `src/lib`). Zapis „src/data / src/config" z instrukcji projektu w Claude.ai jest nieaktualny.
- Brakujące zdjęcia w `public/images/` (6 stałych nazw z BLUEPRINT §0): wygeneruj neutralne, jawnie opisane placeholdery PNG o dokładnych nazwach i proporcjach slotów
  (hero-building 4:5, about-studio 4:5, portfolio-residence 4:3, portfolio-office 4:5, portfolio-interior 4:5, portfolio-pavilion 4:3;
  zalecane wymiary źródeł w §7). To świadomie zmienia zakaz „nie generuj zamienników" z §0.
  Skrypt generujący trzymaj poza zależnościami projektu (bez zmian w `package.json`) i zgłoś, że zdjęcia są tymczasowe.
- Pliki loga: `brand/svg/*` (z paczki). Ścieżki loga kopiuj dokładnie, nie odtwarzaj napisu fontem.
- Fakty o firmie wyłącznie z BLUEPRINT §3.1 i §8. Reszta to oznaczone placeholdery (§3.3).

## Kontekst biznesowy (skrót)
Studio Architektury i Urbanistyki Archica, Stargard, od 1996 r. Odbiorcy: inwestorzy prywatni i samorządy.
Hosting: Vercel (+ Vercel Analytics). Języki: /pl (domyślny), /en, /fr, bez formularza kontaktowego.
Motyw ciemny domyślny, przełącznik jasny/ciemny. Strona polityki prywatności w 3 językach, linkowana ze stopki.
