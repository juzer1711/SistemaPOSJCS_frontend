import { Paper } from "@mui/material";

export default function ManagementToolbar({ children }) {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "20px",
        backgroundColor: "background.paper",
      }}
    >
      {children}
    </Paper>
  );
}