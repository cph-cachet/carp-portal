import { styled } from "@Utils/theme";
import {Card, Typography} from "@mui/material";

export const StyledContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    gridColumn: "span 2",
});

export const StyledTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.dark,
    display: "flex",
    alignItems: "center",
    marginTop: -8,
    marginBottom: 32,
}));

export const StyledCard = styled(Card)({
    display: "flex",
    flexDirection: "column",
    padding: 24,
    paddingBottom: 56,
    borderRadius: 16,
    width: "100%",
});