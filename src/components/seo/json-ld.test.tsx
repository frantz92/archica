// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonLd } from './json-ld';

describe('JsonLd', () => {
  it('renders the data as a JSON-LD script', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Thing', name: 'Archica' }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script?.innerHTML ?? '')).toEqual({ '@type': 'Thing', name: 'Archica' });
  });

  it('escapes "<" so the payload cannot close the script tag', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>x' }} />);
    const html = container.querySelector('script')?.innerHTML ?? '';
    expect(html).not.toContain('<');
    expect(html).toContain('\\u003c');
    expect(JSON.parse(html)).toEqual({ name: '</script><b>x' });
  });
});
