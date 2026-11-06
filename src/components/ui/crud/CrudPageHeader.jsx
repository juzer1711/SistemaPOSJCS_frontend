import { AddRounded } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import styles from "./CrudComponents.module.css";

export default function CrudPageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionDisabled = false,
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <Typography component="h1" variant="h5" className={styles.pageTitle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography component="p" variant="body2" className={styles.pageSubtitle}>
            {subtitle}
          </Typography>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </Button>
      )}
    </header>
  );
}
