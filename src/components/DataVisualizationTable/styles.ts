import {customPalette, styled} from "@Utils/theme";
import {Button, Card} from "@mui/material";
import {Clear} from "@mui/icons-material";

export const StyledCard = styled(Card)({
    display: "flex",
    flexDirection: "column",
    padding: 24,
    paddingBottom: 56,
    borderRadius: 16,
    width: "100%",
});

export const Table = styled("div")({
    display: "flex",
    flexDirection: "column",
})

export const TableHead = styled("div")({
    display: "flex",
    flexDirection: "row",
    height: 70,
    backgroundColor: customPalette.drawer.active,
    borderRadius: '10px 10px 0 0',
    flexGrow: 1,
    alignItems: "center",
})

export const TableHeadLeftmostCell = styled("div")({
    display: "flex",
    width: 270,
    justifyContent: "flex-end",
});

export const TableHeadCenterCellsWrapper = styled("div")({
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-around",
});

export const TableHeadCell = styled("div")({
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "20px",
    color: customPalette.primary.dark,
    textAlign: "center",
});

export const TableHeadRightmostCell = styled("div")({
    width: 36,
});

export const TableBody = styled("div")({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    paddingTop: 16,
})

export const TableBodyRow = styled("div")({
    display: "flex",
    flexDirection: "row",
    height: 40,
    borderBottom: `1px solid ${customPalette.grey["200"]}`,
})

export const TableBodyLeftMostCell = styled("div")({
    display: "flex",
    width: 270,
    gap: 10,
    alignItems: "center",
})

export const TableBodyCenterCellsWrapper = styled(TableHeadCenterCellsWrapper)({});

export const TableBodyRightmostCell = styled(TableHeadRightmostCell)({});

export const TableBodyCell = styled("div")({
    display: "flex",
    alignItems: "center",
    textAlign: "center",
});

export const StyledControlButton = styled(Button)({
    alignSelf: "center",
    width: 36,
    minWidth: 0,
    color: 'black',
});

export const StyledLabel = styled("span")({
    fontSize: 14,
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "20px",
    color: customPalette.primary.dark,
});

export const BulletPoint = styled('div')({
    width: 15,
    height: 15,
    borderRadius: '50%',
    flexShrink: 0,
});

export const StyledClearIcon = styled(Clear)({
    color: customPalette.error.main,
    width: 15,
    height: 15,
});