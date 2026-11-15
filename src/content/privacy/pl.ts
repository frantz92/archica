// NOTE: this text is a draft that requires legal review before publication (BLUEPRINT §6.8).
// Do not state this on the page.
import { site } from '@/content/site';
import { nonBreaking } from '@/lib/text';

import type { PrivacyDocument } from './types';

export const privacyPl: PrivacyDocument = {
  updated: '14 listopada 2026',
  updatedIso: '2026-11-14',
  sections: [
    {
      id: 'controller',
      heading: 'Administrator danych',
      blocks: [
        {
          type: 'paragraph',
          text: `Administratorem danych osobowych przetwarzanych w\u00A0związku z\u00A0działaniem strony ${site.hostname} jest ${site.fullName} z\u00A0siedzibą w\u00A0Stargardzie, ${site.address.line}, NIP ${site.taxId}.`,
        },
        {
          type: 'paragraph',
          text: `Kontakt w\u00A0sprawach dotyczących danych osobowych: ${site.email}, tel. ${nonBreaking(site.phones[0].display)} lub ${nonBreaking(site.phones[1].display)}.`,
        },
      ],
    },
    {
      id: 'scope',
      heading: 'Zakres i\u00A0cele przetwarzania',
      blocks: [
        {
          type: 'paragraph',
          text: 'Strona ma charakter informacyjny. Nie ma na niej formularza kontaktowego, kont użytkowników ani sklepu. Przetwarzamy:',
        },
        {
          type: 'list',
          items: [
            'dane techniczne związane z\u00A0odwiedzinami strony (np. adres IP, rodzaj przeglądarki, odwiedzane adresy, data i\u00A0godzina), przetwarzane przez dostawcę hostingu w\u00A0celu udostępnienia strony i\u00A0zapewnienia jej bezpieczeństwa;',
            'zagregowane statystyki odwiedzin, zbierane za pomocą Vercel Analytics w\u00A0celu poznania sposobu korzystania ze strony;',
            'dane przekazane w\u00A0korespondencji telefonicznej lub mailowej (np. imię i\u00A0nazwisko, adres e-mail, numer telefonu, treść wiadomości), przetwarzane w\u00A0celu odpowiedzi na zapytanie i\u00A0prowadzenia rozmów o\u00A0projekcie.',
          ],
        },
      ],
    },
    {
      id: 'legal-basis',
      heading: 'Podstawa prawna',
      blocks: [
        {
          type: 'paragraph',
          text: 'Dane przetwarzamy na podstawie art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes administratora: utrzymanie i\u00A0zabezpieczenie strony, statystyki, odpowiadanie na zapytania) oraz art. 6 ust. 1 lit. b RODO, gdy kontakt dotyczy działań podejmowanych przed zawarciem umowy na żądanie osoby, której dane dotyczą.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting i\u00A0analityka',
      blocks: [
        {
          type: 'paragraph',
          text: 'Stronę udostępnia Vercel Inc. (USA), która jest także dostawcą Vercel Analytics. Dane techniczne mogą być przetwarzane poza Europejskim Obszarem Gospodarczym, m.in. w\u00A0Stanach Zjednoczonych, z\u00A0zastosowaniem mechanizmów przewidzianych w\u00A0RODO, np. standardowych klauzul umownych.',
        },
        {
          type: 'paragraph',
          text: 'Vercel Analytics służy do statystyk odwiedzin i, według informacji dostawcy, nie wykorzystuje w\u00A0tym celu plików cookie.',
        },
      ],
    },
    {
      id: 'cookies',
      heading: 'Pliki cookie i\u00A0pamięć przeglądarki',
      blocks: [
        {
          type: 'paragraph',
          text: 'Strona nie używa własnych plików cookie ani narzędzi reklamowych. W\u00A0pamięci przeglądarki (localStorage) zapisujemy wyłącznie wybrany motyw kolorystyczny (jasny lub ciemny), aby zapamiętać go przy kolejnych odwiedzinach. Ta informacja nie jest wysyłana do nas ani do osób trzecich.',
        },
      ],
    },
    {
      id: 'recipients',
      heading: 'Odbiorcy danych',
      blocks: [
        {
          type: 'paragraph',
          text: 'Odbiorcami danych mogą być dostawcy usług informatycznych (hosting, analityka, poczta elektroniczna) działający na nasze zlecenie.',
        },
      ],
    },
    {
      id: 'retention',
      heading: 'Okres przechowywania',
      blocks: [
        // PLACEHOLDER: replace both retention periods with the periods confirmed by the client and legal review.
        {
          type: 'paragraph',
          text: 'Korespondencję przechowujemy przez okres: [do uzupełnienia].',
          placeholder: true,
        },
        {
          type: 'paragraph',
          text: 'Dane techniczne i\u00A0statystyczne są przechowywane przez okres określony przez dostawców hostingu i\u00A0analityki: [do uzupełnienia].',
          placeholder: true,
        },
      ],
    },
    {
      id: 'rights',
      heading: 'Twoje prawa',
      blocks: [
        {
          type: 'paragraph',
          text: `Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i\u00A0przenoszenia oraz prawo sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie. Aby skorzystać z\u00A0tych praw, napisz na ${site.email} lub zadzwoń.`,
        },
      ],
    },
    {
      id: 'complaint',
      heading: 'Skarga do organu nadzorczego',
      blocks: [
        {
          type: 'paragraph',
          text: 'Jeżeli uważasz, że dane są przetwarzane niezgodnie z\u00A0prawem, możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Zmiany polityki',
      blocks: [
        {
          type: 'paragraph',
          text: 'Polityka może być aktualizowana. Aktualna wersja jest zawsze dostępna na tej stronie, a\u00A0data ostatniej zmiany jest podana na jej początku.',
        },
      ],
    },
  ],
};
