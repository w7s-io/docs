import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

type SearchDocument = {
  type?: 'docs' | 'blog';
  title: string;
  description: string;
  path: string;
  headings: string[];
  content: string;
};

type SearchData = {
  documents?: SearchDocument[];
};

type SearchResult = SearchDocument & {
  score: number;
  snippet: string;
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 2);

const scoreDocument = (doc: SearchDocument, terms: string[]) => {
  const title = doc.title.toLowerCase();
  const description = doc.description.toLowerCase();
  const headings = doc.headings.join(' ').toLowerCase();
  const content = doc.content.toLowerCase();
  const haystack = `${title} ${description} ${headings} ${content}`;

  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    if (title.includes(term)) score += 40;
    if (headings.includes(term)) score += 18;
    if (description.includes(term)) score += 12;
    if (content.includes(term)) score += 3;
  }
  return score;
};

const snippetFor = (doc: SearchDocument, terms: string[]) => {
  const source = doc.description || doc.content;
  const lower = source.toLowerCase();
  const firstMatch = terms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatch === undefined) return source.slice(0, 180);
  const start = Math.max(0, firstMatch - 70);
  const end = Math.min(source.length, firstMatch + 150);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < source.length ? '...' : '';
  return `${prefix}${source.slice(start, end).trim()}${suffix}`;
};

const typeLabelFor = (doc: SearchDocument) => (doc.type === 'blog' ? 'Blog' : 'Docs');

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="w7s-search-icon" viewBox="0 0 20 20">
      <path
        d="m14.2 14.2 3.1 3.1m-1.7-8.5a6.8 6.8 0 1 1-13.6 0 6.8 6.8 0 0 1 13.6 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function SearchBar(): React.ReactNode {
  const data = usePluginData('w7s-local-search') as SearchData | undefined;
  const documents = data?.documents ?? [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const terms = tokenize(query);
    if (terms.length === 0) return documents.slice(0, 6).map((doc) => ({
      ...doc,
      score: 1,
      snippet: doc.description || doc.content.slice(0, 180)
    }));

    return documents
      .map((doc) => ({
        ...doc,
        score: scoreDocument(doc, terms),
        snippet: snippetFor(doc, terms)
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 8);
  }, [documents, query]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (isEditableTarget(event.target)) return;
      if (event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button className="w7s-search-button" type="button" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span>Search</span>
      </button>

      {open && (
        <div className="w7s-search-overlay" onMouseDown={() => setOpen(false)}>
          <section
            aria-modal="true"
            aria-label="Search docs and blog"
            className="w7s-search-panel"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="w7s-search-input-wrap">
              <SearchIcon />
              <input
                ref={inputRef}
                aria-label="Search docs and blog"
                className="w7s-search-input"
                placeholder="Search docs and blog"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                aria-label="Close search"
                className="w7s-search-close"
                type="button"
                onClick={() => setOpen(false)}>
                <svg aria-hidden="true" viewBox="0 0 20 20">
                  <path
                    d="m5 5 10 10M15 5 5 15"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>

            <div className="w7s-search-results">
              {results.length > 0 ? (
                results.map((result) => (
                  <Link
                    className="w7s-search-result"
                    key={result.path}
                    to={result.path}
                    onClick={() => setOpen(false)}>
                    <span className="w7s-search-result-header">
                      <span className="w7s-search-result-title">{result.title}</span>
                      <span className="w7s-search-result-type">{typeLabelFor(result)}</span>
                    </span>
                    <span className="w7s-search-result-snippet">{result.snippet}</span>
                    {result.headings[0] && (
                      <span className="w7s-search-result-meta">{result.headings[0]}</span>
                    )}
                  </Link>
                ))
              ) : (
                <div className="w7s-search-empty">No matching docs or blog posts</div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
