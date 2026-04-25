const BOOK_CODES: Record<string, string> = {
  genesis: 'GEN', gen: 'GEN',
  exodus: 'EXO', exo: 'EXO', ex: 'EXO',
  leviticus: 'LEV', lev: 'LEV',
  numbers: 'NUM', num: 'NUM',
  deuteronomy: 'DEU', deu: 'DEU', deut: 'DEU',
  joshua: 'JOS', jos: 'JOS', josh: 'JOS',
  judges: 'JDG', jdg: 'JDG', judg: 'JDG',
  ruth: 'RUT', rut: 'RUT',
  '1 samuel': '1SA', '1sa': '1SA', '1sam': '1SA',
  '2 samuel': '2SA', '2sa': '2SA', '2sam': '2SA',
  '1 kings': '1KI', '1ki': '1KI', '1kgs': '1KI',
  '2 kings': '2KI', '2ki': '2KI', '2kgs': '2KI',
  '1 chronicles': '1CH', '1ch': '1CH', '1chr': '1CH',
  '2 chronicles': '2CH', '2ch': '2CH', '2chr': '2CH',
  ezra: 'EZR', ezr: 'EZR',
  nehemiah: 'NEH', neh: 'NEH',
  esther: 'EST', est: 'EST', esth: 'EST',
  job: 'JOB',
  psalms: 'PSA', psalm: 'PSA', psa: 'PSA', ps: 'PSA',
  proverbs: 'PRO', pro: 'PRO', prov: 'PRO',
  ecclesiastes: 'ECC', ecc: 'ECC', eccl: 'ECC',
  'song of solomon': 'SNG', 'song of songs': 'SNG', sng: 'SNG', sos: 'SNG',
  isaiah: 'ISA', isa: 'ISA',
  jeremiah: 'JER', jer: 'JER',
  lamentations: 'LAM', lam: 'LAM',
  ezekiel: 'EZK', ezk: 'EZK', ezek: 'EZK',
  daniel: 'DAN', dan: 'DAN',
  hosea: 'HOS', hos: 'HOS',
  joel: 'JOL', jol: 'JOL',
  amos: 'AMO', amo: 'AMO',
  obadiah: 'OBA', oba: 'OBA', obad: 'OBA',
  jonah: 'JON', jon: 'JON',
  micah: 'MIC', mic: 'MIC',
  nahum: 'NAH', nah: 'NAH',
  habakkuk: 'HAB', hab: 'HAB',
  zephaniah: 'ZEP', zep: 'ZEP', zeph: 'ZEP',
  haggai: 'HAG', hag: 'HAG',
  zechariah: 'ZEC', zec: 'ZEC', zech: 'ZEC',
  malachi: 'MAL', mal: 'MAL',
  matthew: 'MAT', mat: 'MAT', matt: 'MAT',
  mark: 'MRK', mrk: 'MRK', mk: 'MRK',
  luke: 'LUK', luk: 'LUK', lk: 'LUK',
  john: 'JHN', jhn: 'JHN', jn: 'JHN',
  acts: 'ACT', act: 'ACT',
  romans: 'ROM', rom: 'ROM',
  '1 corinthians': '1CO', '1co': '1CO', '1cor': '1CO',
  '2 corinthians': '2CO', '2co': '2CO', '2cor': '2CO',
  galatians: 'GAL', gal: 'GAL',
  ephesians: 'EPH', eph: 'EPH',
  philippians: 'PHP', php: 'PHP', phil: 'PHP',
  colossians: 'COL', col: 'COL',
  '1 thessalonians': '1TH', '1th': '1TH', '1thess': '1TH',
  '2 thessalonians': '2TH', '2th': '2TH', '2thess': '2TH',
  '1 timothy': '1TI', '1ti': '1TI', '1tim': '1TI',
  '2 timothy': '2TI', '2ti': '2TI', '2tim': '2TI',
  titus: 'TIT', tit: 'TIT',
  philemon: 'PHM', phm: 'PHM', phlm: 'PHM',
  hebrews: 'HEB', heb: 'HEB',
  james: 'JAS', jas: 'JAS', jam: 'JAS',
  '1 peter': '1PE', '1pe': '1PE', '1pet': '1PE',
  '2 peter': '2PE', '2pe': '2PE', '2pet': '2PE',
  '1 john': '1JN', '1jn': '1JN',
  '2 john': '2JN', '2jn': '2JN',
  '3 john': '3JN', '3jn': '3JN',
  jude: 'JUD', jud: 'JUD',
  revelation: 'REV', rev: 'REV', revelations: 'REV',
};

export type ParsedBibleReference = {
  bookCode: string;
  bookUrlName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  translation: string;
};

const BIBLE_API_BASE = 'https://bible.helloao.org/api';
const BIBLE_API_COM_BASE = 'https://bible-api.com';

// Translations available on bible-api.com (public domain) but NOT on helloao.org
const BIBLE_API_COM_MAP: Record<string, string> = {
  KJV: 'kjv',
  ASV: 'asv',
  YLT: 'ylt',
  WEB: 'web',
  BBE: 'bbe',
  DARBY: 'darby',
};

export function parseBibleReference(
  text: string,
): ParsedBibleReference | null {
  // Remove everything after an em dash (already-resolved verse text appended by our extractor)
  const stripped = text.split(/\s*[–—-]\s*/)[0].trim();

  // Strip trailing translation code like "KJV", "BSB", "NIV", "NKJV"
  const withoutTranslation = stripped.replace(/\s+[A-Z]{2,6}$/, '').trim();
  const translationMatch = stripped.match(/\s+([A-Z]{2,6})$/);
  const translation = translationMatch ? translationMatch[1] : 'BSB';

  const match = withoutTranslation.match(
    /^((?:\d\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):(\d+)(?:-(\d+))?$/,
  );

  if (!match) return null;

  const bookName = match[1].trim().toLowerCase();
  const bookCode = BOOK_CODES[bookName];
  if (!bookCode) return null;

  // URL-friendly book name for bible-api.com (e.g. "2 peter" → "2+peter")
  const bookUrlName = bookName.replace(/\s+/g, '+');

  return {
    bookCode,
    bookUrlName,
    chapter: parseInt(match[2], 10),
    verseStart: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : parseInt(match[3], 10),
    translation,
  };
}

export function isBareBibleReference(text: string): boolean {
  return parseBibleReference(text) !== null;
}

export type FetchedVerse = {
  text: string;
  translation: string;
};

async function fetchFromBibleApiCom(
  ref: ParsedBibleReference,
  translationId: string,
): Promise<FetchedVerse | null> {
  try {
    const verseRange =
      ref.verseStart === ref.verseEnd
        ? `${ref.verseStart}`
        : `${ref.verseStart}-${ref.verseEnd}`;
    const url = `${BIBLE_API_COM_BASE}/${ref.bookUrlName}+${ref.chapter}:${verseRange}?translation=${translationId}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const verses: any[] = data?.verses ?? [];
    const text = verses
      .map((v: any) => (v.text ?? '').trim())
      .join(' ')
      .trim();

    if (text.length > 0) {
      return { text, translation: translationId.toUpperCase() };
    }
  } catch {
    // fall through
  }
  return null;
}

async function fetchFromHelloao(
  ref: ParsedBibleReference,
  translationCode: string,
): Promise<FetchedVerse | null> {
  try {
    const url = `${BIBLE_API_BASE}/${translationCode}/${ref.bookCode}/${ref.chapter}.json`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const content: any[] = data?.chapter?.content ?? [];
    const lines: string[] = [];

    for (const item of content) {
      if (item?.type !== 'verse') continue;
      if (item.number < ref.verseStart) continue;
      if (item.number > ref.verseEnd) break;

      const parts: string[] = (item.content ?? []).flatMap((c: any) => {
        if (typeof c === 'string') return [c];
        if (c?.text) return [c.text];
        return [];
      });
      lines.push(parts.join('').trim());
    }

    if (lines.length > 0) {
      return { text: lines.join(' ').trim(), translation: translationCode };
    }
  } catch {
    // fall through
  }
  return null;
}

export async function fetchBibleVerseText(
  ref: ParsedBibleReference,
): Promise<FetchedVerse | null> {
  const { translation } = ref;

  // 1. Try the requested translation on helloao.org (covers BSB and others they host)
  if (translation !== 'BSB') {
    const helloaoResult = await fetchFromHelloao(ref, translation);
    if (helloaoResult) return helloaoResult;
  }

  // 2. Try bible-api.com for public-domain translations they carry (KJV, ASV, YLT, etc.)
  const bibleApiComId = BIBLE_API_COM_MAP[translation];
  if (bibleApiComId) {
    const bibleApiComResult = await fetchFromBibleApiCom(ref, bibleApiComId);
    if (bibleApiComResult) return bibleApiComResult;
  }

  // 3. Fall back to BSB on helloao.org
  return fetchFromHelloao(ref, 'BSB');
}
