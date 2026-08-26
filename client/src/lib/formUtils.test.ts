import { describe, expect, it } from "vitest";
import {
  clearDraft,
  DRAFT_STORAGE_KEY,
  formatDraftAge,
  readDraft,
  readRecentValues,
  rememberRecentValue,
  saveDraft,
} from "./formUtils";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("formUtils", () => {
  it("salva, lê e limpa um rascunho", () => {
    const storage = new MemoryStorage();
    const formData = { promoter: "Odara-SP", network: "Zona Sul" };

    expect(saveDraft({ reportType: "normal", formData }, storage)).toBe(true);
    expect(storage.getItem(DRAFT_STORAGE_KEY)).toContain("Odara-SP");
    expect(readDraft(storage)).toMatchObject({ reportType: "normal", formData });

    clearDraft(storage);
    expect(readDraft(storage)).toBeNull();
  });

  it("mantém os valores recentes sem duplicar e limita a lista", () => {
    const storage = new MemoryStorage();
    const key = "recent-values";

    rememberRecentValue(key, "Zona Sul", storage);
    rememberRecentValue(key, "OBA", storage);
    rememberRecentValue(key, "Zona Sul", storage);

    expect(readRecentValues(key, storage)).toEqual(["Zona Sul", "OBA"]);
  });

  it("ignora rascunhos inválidos sem quebrar o formulário", () => {
    const storage = new MemoryStorage();
    storage.setItem(DRAFT_STORAGE_KEY, "{ inválido");

    expect(readDraft(storage)).toBeNull();
  });

  it("formata a idade do rascunho para mensagens curtas", () => {
    const now = new Date("2026-08-25T15:00:00.000Z");

    expect(formatDraftAge("2026-08-25T14:59:30.000Z", now)).toBe("agora mesmo");
    expect(formatDraftAge("2026-08-25T14:58:00.000Z", now)).toBe("há 2 minutos");
    expect(formatDraftAge("2026-08-25T13:00:00.000Z", now)).toBe("há 2 horas");
  });
});
