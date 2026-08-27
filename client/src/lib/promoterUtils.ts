export const PROMOTER_OPTIONS = [
  "Jocieli-RJ",
  "Odara-SP",
  "Camila - DF",
  "Giovanna - Chef",
  "Eduardo - Comercial",
  "Rosana - PR/SC",
] as const;

export const getPromoterSelectValue = (promoter: string, promoterOption?: string) => {
  if (promoterOption === "other") return "other";
  if (PROMOTER_OPTIONS.includes(promoter as (typeof PROMOTER_OPTIONS)[number])) return promoter;
  return promoter ? "other" : "";
};

export const resolvePromoterSelection = (value: string) => ({
  promoterOption: value,
  promoter: value === "other" ? "" : value,
});

export const isValidPromoter = (promoter: string) => promoter.trim().length > 0;

export type PromoterOption = (typeof PROMOTER_OPTIONS)[number];

