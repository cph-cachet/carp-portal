import { Card, Typography } from "@mui/material";
import { styled } from "@Utils/theme";
import { getStudyStatusColor } from "@Utils/utility";

export const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  padding: 24,
  height: 288,
  borderRadius: 16,
});

export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  marginTop: 8,
}));

export const Top = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  paddingBottom: 32,
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
}));

export const ProtocolData = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: 8,
}));

export const StyledLink = styled(Typography)(({ theme }) => ({
  marginTop: 24,
  color: theme.palette.primary.main,
  cursor: "pointer",
  textDecoration: "underline",
  display: "flex",
  flexDirection: "row",
  fontWeight: 600,
}));

export const StyledStatus = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  alignSelf: "flex-end",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  width: 42,
  color: getStudyStatusColor(status),
}));

export const StyledStatusDot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: getStudyStatusColor(status),
  marginBottom: 4,
}));

export const StatusName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status, theme }) => {
  let color;
  if (status === "Draft") {
    color = theme.palette.status.purple;
  } else if (status === "Ready") {
    color = theme.palette.status.yellow;
  } else {
    color = theme.palette.status.green;
  }

  return {
    color,
    textTransform: "uppercase",
    textAlign: "center",
  };
});
