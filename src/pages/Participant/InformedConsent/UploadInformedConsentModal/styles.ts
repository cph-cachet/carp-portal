import { Box, Button, Typography } from "@mui/material";
import { styled } from "@Utils/theme";

export const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  backgroundColor: theme.palette.common.white,
  borderRadius: 16,
  padding: 36,
  maxWidth: 1100,
}));

export const ModalTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: 16,
}));

export const ModalDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: 36,
}));

export const ModalContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: 36,
});

export const ModalContent = styled("div", {
  shouldForwardProp: (prop) => prop !== "fixHeight",
})<{ fixHeight?: boolean }>(({ fixHeight }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  "& > *:last-child": {
    flex: "1 0",
  },
  "& > *:last-child > div": {
    height: fixHeight ? "100%" : 150,
  },
}));

export const TextFieldLabel = styled("label")(({ theme }) => ({
  marginTop: 12,
  color: theme.palette.secondary.dark,
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.h4.fontWeight,
  lineHeight: theme.typography.h4.lineHeight,
}));

export const ModalActions = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: 8,
  marginTop: 24,
  width: "100%",
  justifyContent: "flex-end",
});

export const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: "none",
  padding: "8px 24px",
  borderRadius: 16,
}));

export const DoneButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textTransform: "none",
  padding: "8px 24px",
  borderRadius: 16,
}));
