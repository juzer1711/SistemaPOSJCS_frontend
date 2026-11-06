import { Box, Typography } from "@mui/material";

export default function PageHeader({
  title,
  subtitle,
}) {

  return (
    <Box
      sx={{
        mb: 3,
      }}
    >

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}

    </Box>
  );
}