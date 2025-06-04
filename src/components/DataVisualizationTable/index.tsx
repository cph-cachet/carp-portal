import * as React from 'react';
import {
    BulletPoint, StyledClearIcon,
    StyledControlButton,
    StyledLabel, Table,
    TableBody,
    TableBodyCell,
    TableBodyCenterCellsWrapper,
    TableBodyLeftMostCell, TableBodyRightmostCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableHeadCenterCellsWrapper,
    TableHeadLeftmostCell,
    TableHeadRightmostCell
} from "@Components/DataVisualizationTable/styles";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

interface StackedBarChartForDataStreamsSummaryProps {
    legend: any[];
    data: any[];
    handleLeftButtonClick: () => void;
    isToDateSetToTheCurrentDay: boolean;
    handleRightButtonClick: () => void;
}

const DataVisualizationTable = ({
                             legend, data, handleLeftButtonClick, isToDateSetToTheCurrentDay, handleRightButtonClick,
                         }: StackedBarChartForDataStreamsSummaryProps) => {

    return (
        <Table>
            <TableHead>
                <TableHeadLeftmostCell>
                    <StyledControlButton onClick={() => handleLeftButtonClick()}>
                        <ChevronLeft></ChevronLeft>
                    </StyledControlButton>
                </TableHeadLeftmostCell>
                <TableHeadCenterCellsWrapper>
                    {data.map((item, index) => (
                        <TableHeadCell key={index}>
                            {item.dayOfWeek} <br/> {item.date}
                        </TableHeadCell>
                    ))}
                </TableHeadCenterCellsWrapper>
                <TableHeadRightmostCell>
                    <StyledControlButton disabled={isToDateSetToTheCurrentDay}
                                         onClick={() => handleRightButtonClick()}>
                        <ChevronRight></ChevronRight>
                    </StyledControlButton>
                </TableHeadRightmostCell>
            </TableHead>
            <TableBody>
                {legend.map(((i) => (
                    <TableBodyRow key={i.label}>
                        <TableBodyLeftMostCell>
                            <BulletPoint style={{backgroundColor: i.color}}></BulletPoint>
                            <StyledLabel>{i.label}</StyledLabel>
                        </TableBodyLeftMostCell>
                        <TableBodyCenterCellsWrapper>
                            {data.map((item, index) => (
                                <TableBodyCell key={index}>
                                    {item[i.label] ? <StyledLabel>{item[i.label]}</StyledLabel> :
                                        <StyledClearIcon/>}
                                </TableBodyCell>
                            ))}
                        </TableBodyCenterCellsWrapper>
                        <TableBodyRightmostCell/>
                    </TableBodyRow>
                )))}
            </TableBody>
        </Table>
    )
};

export default DataVisualizationTable;