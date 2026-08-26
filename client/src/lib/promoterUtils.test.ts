import { describe, expect, it } from "vitest";
import {
  getPromoterSelectValue,
  isValidPromoter,
  PROMOTER_OPTIONS,
  resolvePromoterSelection,
} from "./promoterUtils";

describe("promoterUtils", () => {
  it("mantém as cinco opções fixas na ordem definida", () => {
    expect(PROMOTER_OPTIONS).toEqual([
      "Jocieli-RJ",
      "Odara-SP",
      "Camila - SP",
      "Giovanna - Chef",
      "Eduardo - Comercial",
    ]);
  });

  it("resolve uma promotora fixa sem apagar o nome", () => {
    expect(resolvePromoterSelection("Camila - SP")).toEqual({
      promoterOption: "Camila - SP",
      promoter: "Camila - SP",
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
    expect(isValidPromoter("  ")).toBe(false);
  });
});

