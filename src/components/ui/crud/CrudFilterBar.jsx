import { ClearRounded, SearchRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Tooltip, MenuItem } from "@mui/material";
import styles from "./CrudComponents.module.css";

export default function CrudFilterBar({
  fields,
  values,
  onChange,
  onClear,
  clearLabel = "Limpiar filtros",
}) {
  const hasFilters = fields.some(({ name, defaultValue = "" }) => (values[name] ?? "") !== defaultValue);

  return (
    <div className={styles.filterBar} role="search" aria-label="Filtros de búsqueda">
      {fields.map(({ name, label, placeholder, options, defaultValue, ...inputProps }) => (
        <TextField
          key={name}
          className={styles.filterField}
          size="small"
          label={label}
          placeholder={placeholder}
          value={values[name] ?? ""}
          select={Boolean(options)}
          onChange={(event) => onChange(name, event.target.value)}
          InputProps={options ? undefined : {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
          }}
          inputProps={{ ...(options ? {} : { "aria-label": label }), ...inputProps }}
        >
          {options?.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
        </TextField>
      ))}
      <Tooltip title={clearLabel}>
        <span>
          <IconButton
            className={styles.clearFilters}
            aria-label={clearLabel}
            onClick={onClear}
            disabled={!hasFilters}
          >
            <ClearRounded />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
}
