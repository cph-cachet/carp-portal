import { Accordion, AccordionSummary, Typography } from "@mui/material";
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

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 0,
}));
