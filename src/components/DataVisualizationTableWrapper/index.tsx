import {
    StyledCard,
    StyledTitle,
    StyledDescription,
    StyledControlButton,
    FlexRowBetween,
    ChevronUp,
} from "./styles";
import {Skeleton, Box} from "@mui/material";
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import {
    mapDataToChartData,
    taskLabelColors,
    toUTCDate
} from "@Components/DataVisualizationTable/helper";
import React from "react";
import {LocalDate} from "@js-joda/core";
import {useDataStreamsSummary} from "@Utils/queries/dataStreams";
import {DataStreamScope, DataStreamSummaryRequest, DataStreamType} from "@carp-dk/client";
import DataVisualizationTable from "@Components/DataVisualizationTable";

export interface StackedBarChartWrapperProps {
    deploymentId?: string;
    headingColor: string;
    participantId?: string;
    scope: DataStreamScope;
    studyId: string;
    subtitle: string;
    title: string;
    type: DataStreamType;
    legend: Object[];
}

const DataVisualizationTableWrapper = (props: StackedBarChartWrapperProps) => {
    const [toDate, setToDate] = React.useState(LocalDate.now());
    const fromDate = toDate.minusDays(14)

    const dataStreamSummaryRequest: DataStreamSummaryRequest = {
        study_id: props.studyId,
        deployment_id: props.deploymentId,
        participant_id: props.participantId,
        scope: props.scope,
        type: props.type,
        from: toUTCDate(fromDate.atStartOfDay()).toISOString(),
        to: toUTCDate(toDate.atTime(23, 59, 59, 999_000_000)).toISOString(),
    }

    const {data, isLoading, error,} = useDataStreamsSummary(dataStreamSummaryRequest);

    const isToDateSetToTheCurrentDay = toDate.equals(LocalDate.now());

    function handleLeftButtonClick() {
        setToDate(prev => prev.minusDays(14));
    }

    function handleRightButtonClick() {
        if (isToDateSetToTheCurrentDay) return;

        const newToDate = toDate.plusDays(14);
        const today = LocalDate.now();

        setToDate(newToDate.isAfter(today) ? today : newToDate);
    }

    if (error) {
        return (
            <CarpErrorCardComponent
                message={"An error occurred while loading " + props.title + " tasks"}
                error={error}
            />
        )
    }

    if (isLoading) {
        return (
            <StyledCard>
                <FlexRowBetween>
                    <StyledTitle variant="h2" customcolor={taskLabelColors[props.title]}>
                        {props.title}
                    </StyledTitle>
                    <StyledControlButton>
                        <ChevronUp></ChevronUp>
                    </StyledControlButton>
                </FlexRowBetween>
                <StyledDescription variant="h6">
                    {props.subtitle}
                </StyledDescription>
                <Skeleton variant="rectangular" height={'200px'} animation="wave"/>
            </StyledCard>
        );
    }

    const {mappedData} = mapDataToChartData(data);

    return (
        <StyledCard>
            <StyledTitle variant="h2" customcolor={taskLabelColors[props.title]}>
                {props.title}
            </StyledTitle>
            <StyledDescription variant="h6">
                {props.subtitle}
            </StyledDescription>

            <DataVisualizationTable data={mappedData}
                                    handleLeftButtonClick={handleLeftButtonClick}
                                    handleRightButtonClick={handleRightButtonClick}
                                    legend={props.legend}
                                    isToDateSetToTheCurrentDay={isToDateSetToTheCurrentDay}
            />


        </StyledCard>
    );
};

export default DataVisualizationTableWrapper;