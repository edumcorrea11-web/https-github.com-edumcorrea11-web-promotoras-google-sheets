export type FormDataState = Record<string, string>;

export type StoredDraft = {
  reportType: string;
  formData: FormDataState;
  savedAt: string;
};

export const DRAFT_STORAGE_KEY = "bridor-visit-draft-v1";
export const RECENT_PROMOTERS_KEY = "bridor-recent-promoters-v1";
export const RECENT_NETWORKS_KEY = "bridor-recent-networks-v1";
export const RECENT_STORES_KEY = "bridor-recent-stores-v1";
export const MAX_RECENT_VALUES = 8;

function getDefaultStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function readDraft(storage: Storage | undefined = getDefaultStorage()): StoredDraft | null {
  if (!storage) return null;

  try {
    const raw = storage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (!parsed || typeof parsed !== "object" || typeof parsed.reportType !== "string" || !parsed.formData) {
      return null;
    }

    return {
      reportType: parsed.reportType,
      formData: parsed.formData as FormDataState,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveDraft(
  draft: Omit<StoredDraft, "savedAt">,
  storage: Storage | undefined = getDefaultStorage(),
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(storage: Storage | undefined = getDefaultStorage()): void {
  storage?.removeItem(DRAFT_STORAGE_KEY);
}

export function readRecentValues(
  key: string,
  storage: Storage | undefined = getDefaultStorage(),
): string[] {
  if (!storage) return [];

  try {
    const raw = storage.getItem(key);
    const values = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(values)) return [];
    return values.filter((value): value is string => typeof value === "string").slice(0, MAX_RECENT_VALUES);
  } catch {
    return [];
  }
}

export function rememberRecentValue(
  key: string,
  value: string,
  storage: Storage | undefined = getDefaultStorage(),
): string[] {
  const normalized = value.trim();
  if (!normalized || !storage) return readRecentValues(key, storage);

  const values = [normalized, ...readRecentValues(key, storage).filter((item) => item !== normalized)].slice(
    0,
    MAX_RECENT_VALUES,
  );

  try {
    storage.setItem(key, JSON.stringify(values));
  } catch {
    // O formulário continua funcionando mesmo se o armazenamento local estiver indisponível.
  }

  return values;
}

export function formatDraftAge(savedAt: string, now = new Date()): string {
  const savedDate = new Date(savedAt);
  if (Number.isNaN(savedDate.getTime())) return "rascunho salvo anteriormente";

  const minutes = Math.max(0, Math.floor((now.getTime() - savedDate.getTime()) / 60000));
  if (minutes < 1) return "agora mesmo";
  if (minutes === 1) return "há 1 minuto";
  if (minutes < 60) return `há ${minutes} minutos`;

  const hours = Math.round(minutes / 60);
  return hours === 1 ? "há 1 hora" : `há ${hours} horas`;
}
