import {
  Button,
  Card,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { styled } from "@Utils/theme";

export const StyledAccordion = styled(Accordion)(({ expanded }) => ({
  padding: "10px 24px",
  marginBottom: 32,
  borderRadius: expanded ? 16 : 8,
  transition: "border-radius 0.2s ease-in-out",
  "::before": {
    display: "none",
  },
  ":last-of-type": {
    borderRadius: expanded ? 16 : 8,
  },
}));

export const SyledAccordionSummary = styled(AccordionSummary)({
  padding: "0",
  borderRadius: 16,
});

export const StyledCard = styled(Card)({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px",
  marginBottom: 32,
  borderRadius: 16,
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
  marginRight: 8,
  marginLeft: 16,
  height: 20,
}));

export const AccountIcon = styled("div")(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.company.isotype,
  borderRadius: "50%",
  position: "relative",
}));

export const NameContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

export const DownloadButton = styled(Button)(({ theme }) => ({
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
