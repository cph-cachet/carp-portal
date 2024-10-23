import { Button, Card, Divider, Typography } from "@mui/material";
import { styled } from "@Utils/theme";
import { getDeploymentStatusColor } from "@Utils/utility";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 16px",
  marginBottom: 32,
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[700]}`,
  boxShadow: "none",
}));

export const Left = styled("div")({
  display: "grid",
  gridTemplateColumns: "48px 1fr auto auto auto",
  alignItems: "center",
  gap: 16,
});

export const Right = styled("div")({
  display: "flex",
  alignItems: "center",
  "& button": {
    paddingBottom: 10,
  },
});

export const AccountIcon = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.company.isotype,
  borderRadius: "50%",
  position: "relative",
  marginRight: 8,
}));

export const Initials = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  position: "absolute",
  top: "52%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
  borderWidth: 1,
  width: 1,
  marginRight: 10,
  marginLeft: 10,
  height: 64,
}));

export const RemindersContainer = styled(Button)({
  display: "flex",
  alignItems: "center",
  gap: 4,
  textTransform: "none",
});

export const ReminderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const Name = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const Email = styled(Typography)(({ theme }) => ({
  marginLeft: 16,
  color: theme.palette.grey[500],
}));

export const SecondaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 4,
}));

export const StyledStatusDot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: getDeploymentStatusColor(status),
  flexShrink: 0,
}));

export const StyledStatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  color: getDeploymentStatusColor(status),
  textTransform: "uppercase",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: 16,
  textTransform: "none",
  padding: "px 16px",
  color: theme.palette.error.main,
  gap: 8,
  "&:disabled": {
    color: theme.palette.primary.main,
    opacity: "0.4",
  },
}));
