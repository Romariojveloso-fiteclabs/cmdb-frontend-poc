import inventoryMarkdown from '../content/inventory/no-more-ransom-malwarebazaar.md?raw';

export type InventoryMatchStatus = 'confirmed' | 'not-confirmed';
export type InventoryPresence = 'confirmed' | 'absent' | 'not-confirmed';

export interface MalwareBazaarMatch {
  label: string;
  kind: 'signature' | 'tag';
  url: string;
  count: number;
  countLabel: string;
}

export interface InventoryRecord {
  name: string;
  noMoreRansomEntries: string[];
  malwareBazaarStatus: InventoryMatchStatus;
  malwareBazaarMatches: MalwareBazaarMatch[];
  theZooStatus: InventoryPresence;
  theZooEntry?: string;
  documentedFamilyKey?: string;
}

export const INVENTORY_META = {
  collectedAt: '28 de agosto de 2026',
  updatedAt: '2 de setembro de 2026',
  summary: {
    noMoreRansomRecords: 183,
    malwareBazaarConfirmedRecords: 64,
    consolidatedConfirmedFamilies: 57,
    unconfirmedRecords: 119,
    confirmedInAllSources: 4
  },
  sources: [
    { label: 'No More Ransom', url: 'https://www.nomoreransom.org/pt/decryption-tools.html' },
    { label: 'MalwareBazaar', url: 'https://bazaar.abuse.ch/' },
    { label: 'The Zoo', url: 'https://github.com/ytisf/theZoo/tree/master/malware/Binaries' },
    { label: 'Caatinga Malware DB', url: 'https://github.com/UFPE-Seguranca-Ofensiva/caatinga-malware-db' }
  ]
} as const;

function sectionBetween(start: string, end?: string): string {
  const startIndex = inventoryMarkdown.indexOf(start);
  if (startIndex === -1) return '';

  const contentStart = startIndex + start.length;
  const endIndex = end ? inventoryMarkdown.indexOf(end, contentStart) : -1;
  return inventoryMarkdown.slice(contentStart, endIndex === -1 ? undefined : endIndex);
}

function parseDetailedSection(markdown: string, status: InventoryMatchStatus): InventoryRecord[] {
  return markdown
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const [headingLine = '', ...bodyLines] = block.split('\n');
      const body = bodyLines.join('\n');
      const name = headingLine.replace(/\s+—\s+.*$/, '').trim();

      const noMoreRansomPart = body.split(/^\- MalwareBazaar/m)[0] ?? '';
      const noMoreRansomEntries = [...noMoreRansomPart.matchAll(/`([^`]+)`/g)].map((match) => match[1]);

      const malwareBazaarMatches = [...body.matchAll(
        /^\- MalwareBazaar \[x\] — (assinatura|etiqueta) \[`([^`]+)`\]\(([^)]+)\): \*\*([^*]+)\*\*/gm
      )].map((match): MalwareBazaarMatch => ({
        kind: match[1] === 'etiqueta' ? 'tag' : 'signature',
        label: match[2],
        url: match[3],
        count: Number(match[4].replace(/[^0-9]/g, '')),
        countLabel: match[4]
      }));

      const zooMatch = body.match(/^\- The Zoo \[x\] — `([^`]+)`/m);
      const zooAbsent = /^\- The Zoo \[ \]/m.test(body);

      return {
        name,
        noMoreRansomEntries,
        malwareBazaarStatus: status,
        malwareBazaarMatches,
        theZooStatus: zooMatch ? 'confirmed' : zooAbsent ? 'absent' : 'not-confirmed',
        theZooEntry: zooMatch?.[1]
      };
    });
}

const reportFiles = import.meta.glob('/src/content/docs/reports/*/*.md');
const NON_FAMILY_REPORT_DIRECTORIES = new Set(['mockups']);

export const DOCUMENTED_REPORT_FAMILY_KEYS = Array.from(new Set(
  Object.keys(reportFiles)
    .map((path) => path.match(/\/reports\/([^/]+)\//)?.[1])
    .filter((key): key is string => typeof key === 'string' && !NON_FAMILY_REPORT_DIRECTORIES.has(key))
));

function normalizeFamilyName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en')
    .replace(/\b(?:ransomware|ransom)\b/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function findDocumentedFamilyKey(record: InventoryRecord): string | undefined {
  const inventoryNames = [
    record.name,
    ...record.noMoreRansomEntries,
    ...record.malwareBazaarMatches.map((match) => match.label)
  ].flatMap((name) => name.split(/\s+(?:\/|aka)\s+/i));

  const normalizedNames = new Set(inventoryNames.map(normalizeFamilyName).filter(Boolean));
  return DOCUMENTED_REPORT_FAMILY_KEYS.find((key) => normalizedNames.has(normalizeFamilyName(key)));
}

const confirmedSection = sectionBetween(
  '## Famílias confirmadas no MalwareBazaar',
  '## Famílias presentes no No More Ransom e no The Zoo, mas não confirmadas no MalwareBazaar'
);

const zooOnlySection = sectionBetween(
  '## Famílias presentes no No More Ransom e no The Zoo, mas não confirmadas no MalwareBazaar',
  '## Demais registros sem confirmação no MalwareBazaar'
);

const remainingSection = sectionBetween(
  '## Demais registros sem confirmação no MalwareBazaar',
  '## Observação metodológica'
);

const remainingRecords: InventoryRecord[] = [...remainingSection.matchAll(
  /^\- `([^`]+)` — MalwareBazaar \[\?\]/gm
)].map((match) => ({
  name: match[1].replace(/ Ransom$/, ''),
  noMoreRansomEntries: [match[1]],
  malwareBazaarStatus: 'not-confirmed',
  malwareBazaarMatches: [],
  theZooStatus: 'absent'
}));

const parsedInventoryRecords: InventoryRecord[] = [
  ...parseDetailedSection(confirmedSection, 'confirmed'),
  ...parseDetailedSection(zooOnlySection, 'not-confirmed'),
  ...remainingRecords
];

const documentedInventoryRecords: InventoryRecord[] = parsedInventoryRecords.map((record) => ({
  ...record,
  documentedFamilyKey: findDocumentedFamilyKey(record)
}));

const documentedKeysInInventory = new Set(
  documentedInventoryRecords
    .map((record) => record.documentedFamilyKey)
    .filter((key): key is string => Boolean(key))
);

const reportOnlyRecords: InventoryRecord[] = DOCUMENTED_REPORT_FAMILY_KEYS
  .filter((key) => !documentedKeysInInventory.has(key))
  .map((key) => ({
    name: key
      .split(/[-_]/)
      .map((part) => part.charAt(0).toLocaleUpperCase('en') + part.slice(1))
      .join(' '),
    noMoreRansomEntries: [],
    malwareBazaarStatus: 'not-confirmed',
    malwareBazaarMatches: [],
    theZooStatus: 'not-confirmed',
    documentedFamilyKey: key
  }));

export const INVENTORY_RECORDS: InventoryRecord[] = [
  ...documentedInventoryRecords,
  ...reportOnlyRecords
];

export const INVENTORY_SOURCE_REGISTRATION_COUNT = INVENTORY_RECORDS.reduce(
  (total, record) => total + record.noMoreRansomEntries.length,
  0
);
