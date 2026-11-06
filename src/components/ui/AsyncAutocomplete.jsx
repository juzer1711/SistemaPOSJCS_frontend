import { useEffect, useRef, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";

/** Selector paginado; el servidor filtra y el valor seleccionado conserva su etiqueta. */
export default function AsyncAutocomplete({ label, value, onChange, loadOptions, getOptionLabel, getOptionKey, disabled }) {
  const loadingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => { setQuery(search); setPage(0); }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    loadingRef.current = true;
    setLoading(true);
    setError("");
    if (page === 0) setOptions([]);
    loadOptions({ search: query, page, size: 20, signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        setOptions((current) => page === 0 ? response.content : [...current, ...response.content]);
        setHasMore(!response.last);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || "No fue posible cargar las opciones.");
      })
      .finally(() => { if (!controller.signal.aborted) { loadingRef.current = false; setLoading(false); } });
    return () => controller.abort();
  }, [open, query, page, loadOptions, attempt]);

  const shownOptions = value && !options.some((option) => getOptionKey(option) === getOptionKey(value))
    ? [value, ...options] : options;

  return (
    <Autocomplete
      fullWidth open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
      value={value} onChange={(_, next) => { onChange(next); setSearch(""); }}
      onInputChange={(_, next, reason) => {
        if (reason === "input" || reason === "clear") setSearch(next);
      }}
      options={shownOptions} filterOptions={(items) => items}
      getOptionLabel={getOptionLabel} getOptionKey={getOptionKey}
      isOptionEqualToValue={(option, selected) => getOptionKey(option) === getOptionKey(selected)}
      disabled={disabled} loading={loading} loadingText="Cargando opciones…"
      noOptionsText={error || "No se encontraron opciones"}
      ListboxProps={{ onScroll: (event) => {
        const list = event.currentTarget;
        if (!loadingRef.current && !error && hasMore && list.scrollTop + list.clientHeight >= list.scrollHeight - 12) {
          loadingRef.current = true;
          setPage((current) => current + 1);
        }
      } }}
      renderInput={(params) => (
        <TextField {...params} label={label} error={Boolean(error)}
          helperText={error ? <>{error} <Button size="small" onClick={() => setAttempt((current) => current + 1)}>Reintentar</Button></> : " "}
        />
      )}
    />
  );
}