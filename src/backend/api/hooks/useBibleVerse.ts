import { useEffect, useState } from 'react';
import {
  fetchBibleVerseText,
  parseBibleReference,
} from '../bibleApi';

type BibleVerseState = {
  verseText: string | null;
  actualTranslation: string | null;
  isLoading: boolean;
};

export function useBibleVerse(reference: string | undefined): BibleVerseState {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [actualTranslation, setActualTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!reference) return;

    const parsed = parseBibleReference(reference.trim());
    if (!parsed) return;

    let cancelled = false;
    setIsLoading(true);
    setVerseText(null);
    setActualTranslation(null);

    fetchBibleVerseText(parsed).then(result => {
      if (!cancelled) {
        setVerseText(result?.text ?? null);
        setActualTranslation(result?.translation ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return { verseText, actualTranslation, isLoading };
}
