import {styled} from "@Utils/theme";
import {Button, Card, Typography} from "@mui/material";
import {ChevronLeft} from "@mui/icons-material";

export const StyledCard = styled(Card)({
    display: "flex",
    flexDirection: "column",
    padding: 24,
    paddingBottom: 56,
    borderRadius: 16,
    width: "100%",
});

interface StyledTitleProps {
    customcolor?: string;
}

export const StyledTitle = styled(Typography)<StyledTitleProps>(({theme, customcolor}) => ({
    color: customcolor || theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    gap: 8,
}));

export const StyledDescription = styled(Typography)(({theme}) => ({
    color: theme.palette.text.secondary,
    marginTop: 4,
}));

export const StyledControlButton = styled(Button)({
    alignSelf: "center",
    width: 36,
    minWidth: 0,
    color: 'black',
});

export const FlexRowBetween = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
})

export const ChevronUp = styled(ChevronLeft)({
    transform: "rotate(90deg)",
})
