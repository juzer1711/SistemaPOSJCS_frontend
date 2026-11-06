export const formatDateTime = (fecha) => {
  if (!fecha) return "";

  const date = new Date(fecha);

  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// formatMoney
export const formatMoney = (value) => {
  if (value == null) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDateForApi = (date, end = false) => {
  if (!date) return undefined;
  return end ? `${date}T23:59:59` : `${date}T00:00:00`;
};
