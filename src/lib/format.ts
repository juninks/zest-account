// Format a raw digit string as BRL currency. e.g. "1234" => "R$ 12,34"
export const formatBRLInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

// Convert masked BRL string back to a number (e.g. "R$ 12,34" => 12.34)
export const parseBRL = (masked: string): number => {
  const digits = masked.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
};
