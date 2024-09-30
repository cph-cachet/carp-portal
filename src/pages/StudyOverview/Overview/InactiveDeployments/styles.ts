import { Card, Select, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@Utils/theme";

export const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  padding: 24,
  height: 580,
  borderRadius: 16,
});

export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 8,
}));

export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  borderBottomColor: theme.palette.grey[500],
  backgroundColor: theme.palette.common.white,
  borderBottomWidth: 1,
  zIndex: 0,
  paddingLeft: 0,
  paddingBottom: 0,
}));

export const SecondaryCellText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const HeaderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const StyledTableRow = styled(TableRow)({
  paddingLeft: 0,
  "&:hover": {
    backgroundColor: "#EDEDED",
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
    borderRadius: "16px",
  },
});

export const StyledTableCell = styled(TableCell)({
  paddingLeft: 0,
  paddingBottom: "8px",
  paddingTop: "8px",
  border: "none",
});

export const StyledSelect = styled(Select)({
  height: "32px",
  width: "116px",
  borderRadius: "16px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "16px",
  },
  "& .MuiSelect-select": {
    borderRadius: "16px",
  },
});
