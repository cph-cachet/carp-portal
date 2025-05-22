import {useQueries, useQuery, UseQueryOptions} from "@tanstack/react-query";
import carpApi from "@Utils/api/api";
import {
    CarpServiceError,
    DataStreamSummary,
    DataStreamSummaryRequest,
} from "@carp-dk/client";

export const useDataStreamsSummary = (
    request: DataStreamSummaryRequest,
    options?: UseQueryOptions
) => {
    return useQuery<DataStreamSummary, CarpServiceError>({
        queryFn: () => carpApi.dataStreams.getDataStreamSummary(request),
        queryKey: ["dataStreamSummary", {...request}],
        enabled: options?.enabled ?? true,
    });
};

export const useDataStreamsSummaries = (
    requests: DataStreamSummaryRequest[],
    options?: UseQueryOptions
) => {
    return useQueries({
        queries: requests.map((request) => ({
            queryKey: ['dataStreamSummary', { ...request }],
            queryFn: () => carpApi.dataStreams.getDataStreamSummary(request),
            enabled: options?.enabled ?? true,
        })),
    });
};
