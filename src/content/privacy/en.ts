// NOTE: this text is a draft that requires legal review before publication (BLUEPRINT §6.8).
// Do not state this on the page.
import { site } from '@/content/site';
import { nonBreaking } from '@/lib/text';

import type { PrivacyDocument } from './types';

export const privacyEn: PrivacyDocument = {
  updated: '14 November 2026',
  updatedIso: '2026-11-14',
  sections: [
    {
      id: 'controller',
      heading: 'Data controller',
      blocks: [
        {
          type: 'paragraph',
          text: `The controller of personal data processed in connection with the ${site.hostname} website is ${site.fullName}, with its seat in Stargard, Poland, ${site.address.line}, tax ID (NIP) ${site.taxId}.`,
        },
        {
          type: 'paragraph',
          text: `For matters concerning personal data, contact us at ${site.email}, or by phone on ${nonBreaking(site.phones[0].display)} or ${nonBreaking(site.phones[1].display)}.`,
        },
      ],
    },
    {
      id: 'scope',
      heading: 'Scope and purposes of processing',
      blocks: [
        {
          type: 'paragraph',
          text: 'The website is informational. It has no contact form, user accounts or shop. We process:',
        },
        {
          type: 'list',
          items: [
            'technical data related to visits to the website (e.g. IP address, browser type, pages visited, date and time), processed by the hosting provider in order to deliver the website and keep it secure;',
            'aggregated visit statistics, collected with Vercel Analytics in order to understand how the website is used;',
            'data you provide in telephone or email correspondence (e.g. name, email address, telephone number, content of the message), processed in order to reply to your enquiry and to discuss your project.',
          ],
        },
      ],
    },
    {
      id: 'legal-basis',
      heading: 'Legal basis',
      blocks: [
        {
          type: 'paragraph',
          text: 'We process data on the basis of Article 6(1)(f) of the GDPR (the controller’s legitimate interest: maintaining and securing the website, statistics, answering enquiries) and Article 6(1)(b) of the GDPR where contact concerns steps taken before entering into a contract at the request of the data subject.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting and analytics',
      blocks: [
        {
          type: 'paragraph',
          text: 'The website is hosted by Vercel Inc. (USA), which is also the provider of Vercel Analytics. Technical data may be processed outside the European Economic Area, including in the United States, using the mechanisms provided for in the GDPR, e.g. standard contractual clauses.',
        },
        {
          type: 'paragraph',
          text: 'Vercel Analytics is used for visit statistics and, according to the provider, does not use cookies for this purpose.',
        },
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and browser storage',
      blocks: [
        {
          type: 'paragraph',
          text: 'The website does not use its own cookies or advertising tools. In the browser’s storage (localStorage) we save only the colour theme you choose (light or dark), so that it is remembered on your next visit. This information is not sent to us or to third parties.',
        },
      ],
    },
    {
      id: 'recipients',
      heading: 'Recipients of data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Recipients of data may include IT service providers (hosting, analytics, email) acting on our behalf.',
        },
      ],
    },
    {
      id: 'retention',
      heading: 'Retention period',
      blocks: [
        // PLACEHOLDER: replace both retention periods with the periods confirmed by the client and legal review.
        {
          type: 'paragraph',
          text: 'We keep correspondence for: [to be completed].',
          placeholder: true,
        },
        {
          type: 'paragraph',
          text: 'Technical and statistical data is kept for the period set by the hosting and analytics providers: [to be completed].',
          placeholder: true,
        },
      ],
    },
    {
      id: 'rights',
      heading: 'Your rights',
      blocks: [
        {
          type: 'paragraph',
          text: `You have the right to access your data, to have it rectified or erased, to restrict or port its processing, and to object to processing based on legitimate interest. To exercise these rights, write to ${site.email} or call us.`,
        },
      ],
    },
    {
      id: 'complaint',
      heading: 'Complaint to a supervisory authority',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you believe your data is being processed unlawfully, you may lodge a complaint with the President of the Personal Data Protection Office (UODO) in Poland.',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'This policy may be updated. The current version is always available on this page, and the date of the last change is given at the top.',
        },
      ],
    },
  ],
};
