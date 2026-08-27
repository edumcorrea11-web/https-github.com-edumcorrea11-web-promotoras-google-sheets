import { describe, expect, it } from "vitest";
import {
  getPromoterSelectValue,
  isValidPromoter,
  PROMOTER_OPTIONS,
  resolvePromoterSelection,
} from "./promoterUtils";

describe("promoterUtils", () => {
  it("mantém as seis opções fixas na ordem definida", () => {
    expect(PROMOTER_OPTIONS).toEqual([
      "Jocieli-RJ",
      "Odara-SP",
      "Camila - DF",
      "Giovanna - Chef",
      "Eduardo - Comercial",
      "Rosana - PR/SC",
    ]);
  });

  it("resolve uma promotora fixa sem apagar o nome", () => {
    expect(resolvePromoterSelection("Camila - DF")).toEqual({
      promoterOption: "Camila - DF",
      promoter: "Camila - DF",
    });
  });

  it("limpa o nome ao selecionar Outro para permitir digitação manual", () => {
    expect(resolvePromoterSelection("other")).toEqual({
      promoterOption: "other",
      promoter: "",
    });
  });

  it("recupera corretamente seleção fixa, Outro e rascunho antigo", () => {
    expect(getPromoterSelectValue("Odara-SP")).toBe("Odara-SP");
    expect(getPromoterSelectValue("", "other")).toBe("other");
    expect(getPromoterSelectValue("Pessoa eventual")).toBe("other");
  });

  it("valida o nome manual da pessoa eventual", () => {
    expect(isValidPromoter("Eduardo - Comercial")).toBe(true);
    expect(isValidPromoter("Rosana - PR/SC")).toBe(true);
    expect(isValidPromoter("  ")).toBe(false);
  });
});

