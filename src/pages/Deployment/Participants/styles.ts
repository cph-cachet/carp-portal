import { Stack, Typography } from "@mui/material";
import { styled } from "@Utils/theme";

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: "0",
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

export const NameContainer = styled(Stack)({
  alignItems: "center",
  gap: 6,
});

export const RoleContainer = styled(Stack)({
  alignItems: "center",
  gap: 6,
});
