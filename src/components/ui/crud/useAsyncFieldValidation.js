import { useEffect, useState } from "react";

// Optional asynchronous validation; results are tied to the exact value checked.
export default function useAsyncFieldValidation({ fields, values, open, editing }) {
  const [results, setResults] = useState({});
  const [attempt, setAttempt] = useState(0);
  const activeFields = fields.filter((field) => field.validateAsync && !(editing && field.disabledWhenEditing));

  const valueKey = JSON.stringify(Object.fromEntries(activeFields.map((field) => [field.name, values[field.name]])));

  useEffect(() => {
    if (!open) {
      setResults({});
      return;
    }
    const checkedValues = JSON.parse(valueKey);
    const controller = new AbortController();
    setResults({});
    const timeout = setTimeout(() => {
      for (const field of fields) {
        if (!field.validateAsync || (editing && field.disabledWhenEditing)) continue;
        const value = String(checkedValues[field.name] ?? "");
        if (!value || (field.maxLength && value.length > field.maxLength)
          || (field.pattern && !field.pattern.test(value))) continue;
        setResults((current) => ({ ...current, [field.name]: { value, status: "pending" } }));
        Promise.resolve().then(() => field.validateAsync(value, { signal: controller.signal }))
          .then((error) => {
            if (controller.signal.aborted) return;
            setResults((current) => ({ ...current, [field.name]: { value, status: error ? "invalid" : "valid", error } }));
          })
          .catch(() => {
            if (controller.signal.aborted) return;
            setResults((current) => ({ ...current, [field.name]: {
              value, status: "error", error: "No fue posible verificar este valor. Reintenta.",
            } }));
          });
      }
    }, 350);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [fields, valueKey, open, editing, attempt]);

  const states = Object.fromEntries(activeFields.map((field) => {
    const value = String(values[field.name] ?? "");
    const result = results[field.name];
    const validFormat = value && (!field.maxLength || value.length <= field.maxLength)
      && (!field.pattern || field.pattern.test(value));
    return [field.name, !validFormat
      ? (value ? { status: "invalid", error: field.patternMessage || "El formato no es válido." } : null)
      : result?.value === value ? result : { status: "pending" }];
  }));

  return {
    states,
    blocked: activeFields.some((field) => (field.required || String(values[field.name] ?? "").trim())
      && states[field.name]?.status !== "valid"),
    retry: () => setAttempt((current) => current + 1),
  };
}