import { Box, Typography } from "@mui/material";

export default function FormSection({
  title,
  children,
  mb = 3.5,
}) {

  return (
    <Box sx={{ mb }}>

      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "primary.main",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {children}

    </Box>
  );
}