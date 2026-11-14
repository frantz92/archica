import { PlaceholderBadge } from '@/components/ui/placeholder-badge';
import type { PrivacyDocument } from '@/content/privacy/types';

interface PrivacyDocumentViewProps {
  document: PrivacyDocument;
  placeholderLabel: string;
}

/** Renders a structured privacy policy: sections with an h2 and paragraphs or lists. */
export function PrivacyDocumentView({ document, placeholderLabel }: PrivacyDocumentViewProps) {
  return (
    <div className="grid gap-12">
      {document.sections.map((section) => {
        const headingId = `privacy-${section.id}`;
        return (
          <section key={section.id} aria-labelledby={headingId} className="grid gap-4">
            <h2 id={headingId} className="type-h3">
              {section.heading}
            </h2>
            {section.blocks.map((block, index) =>
              block.type === 'list' ? (
                <ul key={index} className="grid type-body list-disc gap-2 pl-6">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={index} className="type-body">
                  {block.text}
                  {block.placeholder ? (
                    <PlaceholderBadge label={placeholderLabel} className="ml-2 align-middle" />
                  ) : null}
                </p>
              ),
            )}
          </section>
        );
      })}
    </div>
  );
}
