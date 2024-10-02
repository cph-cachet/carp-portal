import { styled } from "@Utils/theme";

export const StyledTSpan = styled("tspan")(({ theme }) => ({
  fill: theme.palette.text.primary,
  font: theme.typography.fontFamily,
  fontWeight: 600,
  lineHeight: "16px",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 12,
}));

export const StyledNumberTSpan = styled("tspan")(({ theme }) => ({
  fill: theme.palette.text.primary,
  font: theme.typography.fontFamily,
  fontWeight: 600,
  lineHeight: "32px",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 24,
}));
