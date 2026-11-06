export const dataGridStyles = {
  border: "none",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F8FAFC",
    borderBottom: "1px solid #E2E8F0",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
    color: "#334155",
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #F1F5F9",
    display: "flex",
    alignItems: "center",
  },

  "& .MuiDataGrid-row": {
    transition: "background-color 0.15s ease",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#F8FAFC",
  },

  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  "& .MuiDataGrid-toolbarContainer": {
    padding: 2,
  },
};