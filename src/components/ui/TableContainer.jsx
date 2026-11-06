import { Paper } from "@mui/material";

export default function TableContainer({ children }) {

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        borderRadius: "20px",
        backgroundColor: "background.paper",
      }}
    >
      {children}
    </Paper>
  );
}