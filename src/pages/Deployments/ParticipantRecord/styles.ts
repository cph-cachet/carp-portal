import { Button, Typography } from "@mui/material";
import { styled } from "@Utils/theme";
import { getDeviceStatusColor } from "@Utils/utility";

export const StyledContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "40px 6fr 5fr 4fr 4fr 2fr 4fr",
  overflow: "hidden",
  alignItems: "center",
  columnGap: 12,
  textDecoration: "none",
  color: "inherit",
  padding: "12px 16px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

export const NameContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

export const RoleContainer = styled("div")({
  alignItems: "center",
  display: "flex",
  gap: 6,
});

export const StatusContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

export const ActivityDataContainer = styled("div")({
  gridArea: "graph",
  display: "flex",
  justifyContent: "space-between",
  gap: 46,
  marginTop: 26,
  width: "100%",
});

export const MinimizeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  minWidth: 36,
  color: theme.palette.grey[700],
  transition: theme.transitions.create("transform", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  transform: open ? "rotateX(180deg)" : "rotateX(0deg)",
  "& svg": {
    fontSize: 36,
  },
  "&:hover": {
    backgroundColor: "inherit",
  },
}));

export const AccountIcon = styled("div")(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.company.isotype,
  borderRadius: "50%",
  position: "relative",
}));

export const Initials = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  position: "absolute",
  top: "52%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

export const StyledStatusDot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: getDeviceStatusColor(status),
}));