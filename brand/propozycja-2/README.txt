ARCHICA – PAKIET LOGO WEKTOROWEGO
Propozycja 2: Organiczny łuk
=====================================================

Ten sam układ plików, kolory i napis co w propozycji 1 (brand/propozycja-1/); zmienia się tylko
znak (sygnet). Pakiet jest generowany skryptem: node scripts/build-brand.mjs

ZAWARTOŚĆ
  svg/  – do strony internetowej (webdeveloper), edytorów graficznych
  pdf/  – do drukarni i do podglądu (CMYK, krzywe, bez fontów)
  eps/  – do drukarni, producentów gadżetów i szyldów (CMYK, krzywe)
  dxf/  – do cięcia / frezowania / grawerowania laserowego (jednostka: mm)
  podglad.png – arkusz poglądowy wszystkich wersji
  web-paths.json – dane ścieżek dla strony (używa ich src/components/ui/logo-paths-2.ts)

WARIANTY (nazwa pliku: archica-<układ>-<kolor>)
  układ:  logo   = sygnet + napis "Archica" (układ pionowy, jak na wizualizacji)
          sygnet = sam znak (np. długopisy, ikona, tłoczenie, pieczątka)
  kolor:  mech      #2C3E35  – wersja główna, na jasnych tłach
          kreda     #F5F2EB  – wersja kontrująca, na ciemnych tłach / zdjęciach
                              (UWAGA: na białym tle jest niewidoczna – tak ma być)
          bursztyn  #D9822B  – wersja akcentowa
          czarny    #000000  – jednokolorowa: grawer, tłoczenie, pieczątki, faks/xero

PALETA – bez zmian względem propozycji 1 (CMYK i Pantone orientacyjne, patrz brand/propozycja-1/README.txt)
  Głęboki Mech #2C3E35 · Kreda Wapienna #F5F2EB · Bursztynowa Ochra #D9822B ·
  Słoneczny Piasek #EAD7B7 · Zgaszona Szałwia #6E7F62

UWAGI TECHNICZNE
  * Napis "Archica" jest identyczny jak w propozycji 1 (font Inter Medium zamieniony na krzywe,
    licencja SIL OFL – wolna do użytku komercyjnego). Plików nie trzeba wiązać z żadnym fontem.
  * Rozmiar bazowy PDF/EPS/DXF: sygnet 100 mm szerokości (ok. 92,8 mm wysokości), pełne logo
    ok. 230,3 x 159,6 mm. Pliki skalują się bez utraty jakości – zmieniaj rozmiar zachowując proporcje.
  * Znak składa się z dwóch osobnych zamkniętych konturów (lewy i prawy człon) – w DXF to dwie
    polilinie. "Szczelina" między nimi to pusta przestrzeń (przy cięciu metalu człony trzeba połączyć
    mostkami/podkładem – ustali to wykonawca szyldu).
  * DXF: krzywe zapisane jako polilinie zamknięte (24 odcinki na łuk, dokładność rzędu setnych mm).
  * Minimalny rozmiar sygnetu: ok. 16 px na ekranie / ok. 6 mm w druku (szczelina ma ok. 11%
    szerokości znaku). Dla favicony użyto tego samego znaku (public/favicon-2.svg).
  * Strefa ochronna wokół logo: min. 1/4 wysokości sygnetu z każdej strony.

JAK POWSTAŁ ZNAK (ważne przed produkcją szyldu)
  * To wektorowa REKONSTRUKCJA znaku z wizualizacji klienta (brand/Image.jpg, 1024 px; znak ma na
    niej tylko ok. 50 px szerokości). Współrzędne narożników i promienie zaokrągleń zmierzono na
    obrazku z dokładnością do ułamka piksela, a następnie sprawdzono nałożeniem obrysu na oryginał.
  * Skoro oryginał jest rastrowy i mały, drobne różnice względem pierwowzoru (np. promienie
    zaokrągleń) są możliwe. Jeśli klient/grafik ma oryginalny plik wektorowy lub obraz w wyższej
    rozdzielczości, podmień współrzędne w scripts/build-brand.mjs i wygeneruj pakiet ponownie.
