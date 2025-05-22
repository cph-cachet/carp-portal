import { styled } from "@Utils/theme";
import {Typography} from "@mui/material";

export const StyledContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    gridColumn: "span 2",
    paddingTop: 16,
});

export const StyledTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.dark,
    display: "flex",
    alignItems: "center",
    marginTop: -8,
    marginBottom: 32,
}));