import { Button, Card, Divider, Typography } from "@mui/material";
import { styled } from "@Utils/theme";

export const StyledCard = styled(Card)({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px",
  marginBottom: 32,
  borderRadius: 8,
});

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const Right = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[500],
  borderWidth: 1,
  width: 1,
  marginRight: 16,
  marginLeft: 16,
  height: 20,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textTransform: "none",
  gap: 4,
}));

export const LastUploadText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
}));
