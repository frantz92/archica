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
          text: 'Dane przetwarzamy na podstawie art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes administratora: utrzymanie i\u00A0zabezpieczenie strony, odpowiadanie na zapytania) oraz art. 6 ust. 1 lit. b RODO, gdy kontakt dotyczy działań podejmowanych przed zawarciem umowy na żądanie osoby, której dane dotyczą.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting',
      blocks: [
        {
          type: 'paragraph',
          text: 'Stronę udostępnia dostawca hostingu SeoHost sp. z\u00A0o.o., ul. Obornicka 330, 60-689 Poznań. Serwery znajdują się w\u00A0Polsce (w\u00A0polskich centrach danych). Strona nie korzysta z\u00A0narzędzi analitycznych ani z\u00A0zewnętrznych skryptów.',
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
          text: 'Odbiorcami danych mogą być dostawcy usług informatycznych (hosting, poczta elektroniczna) działający na nasze zlecenie.',
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
          text: 'Dane techniczne są przechowywane przez okres określony przez dostawcę hostingu: [do uzupełnienia].',
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
