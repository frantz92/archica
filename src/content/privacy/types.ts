export type PrivacyBlock =
  | { readonly type: 'paragraph'; readonly text: string; readonly placeholder?: true }
  | { readonly type: 'list'; readonly items: readonly string[] };

export interface PrivacySection {
  readonly id: string;
  readonly heading: string;
  readonly blocks: readonly PrivacyBlock[];
}

export interface PrivacyDocument {
  /** Human-readable date of the last update, in the document's language. */
  readonly updated: string;
  /** Machine-readable date (ISO 8601) for the <time> element. */
  readonly updatedIso: string;
  readonly sections: readonly PrivacySection[];
}
