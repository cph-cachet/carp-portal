import {DataStreamSummary} from "../../../../carp-client-ts/src";
import {LocalDateTime} from "@js-joda/core";
import {StackedBarChartWrapperProps} from "@Components/DataVisualizationTableWrapper";
import {DataStreamType} from "../../../../carp-client-ts/src/shared/models/dataStream";
import {StudyProtocolSnapshot} from "@carp-dk/client";

export const taskLabelColors = {
    "Survey": "#3A82F7",
    "Cognitive": "#B25FEA",
    "Health": "#EB4B62",
    "Audio": "#67CE67",
    "Image": "#228B89",
    "Video": "#81CFFA"
}

export const colors = [
    "#8A9251", // Olive green
    "#679C91", // Desaturated teal
    "#4B9BBE", // Sky blue
    "#377895", // Steel blue
    "#2E5F7D", // Dark blue-gray
    "#254765", // Charcoal navy
    "#1C314E", // Deep indigo
    "#131D37"  // Midnight blue
];

export const chartConfigs: Partial<StackedBarChartWrapperProps>[] = [
    {
        title: "Survey",
        subtitle: "Number of Survey tasks done by this participant.",
        type: "survey",
        headingColor: '#3A82F7'
    },
    {
        title: "Cognitive",
        subtitle: "Number of Cognitive tasks done by this participant.",
        type: "cognition",
        headingColor: '#B25FEA'
    },
    {
        title: "Health",
        subtitle: "Number of Health tasks done by this participant.",
        type: "health",
        headingColor: '#EB4B62'
    },
    {
        title: "Audio",
        subtitle: "Number of Audio tasks done by this participant.",
        type: "audio",
        headingColor: '#67CE67'
    },
    {
        title: "Image/Video",
        subtitle: "Number of Image/Video tasks done by this participant.",
        type: "image",
        headingColor: '#228B89'
    },
    {
        title: "Sensing",
        subtitle: "Number of Sensing tasks done by this participant.",
        type: "sensing",
        headingColor: '#186537'
    },
]

export function toUTCDate(localDateTime: LocalDateTime): Date {
    return new Date(Date.UTC(
        localDateTime.year(),
        localDateTime.monthValue() - 1,
        localDateTime.dayOfMonth(),
        localDateTime.hour(),
        localDateTime.minute(),
        localDateTime.second(),
        Math.floor(localDateTime.nano() / 1_000_000)
    ));
}

export function fancyDateFromISOString(isoString: string): string {
    const year = isoString.substring(0, 4);
    const month = isoString.substring(5, 7);
    const day = isoString.substring(8, 10);

    return `${day}/${month}/${year}`;
}

function generateDateRange(startISO: string, endISO: string): string[] {
    const dates: string[] = [];

    const current = new Date(startISO);
    const end = new Date(endISO);

    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

export function mapDataToChartData(dataStreamSummary: DataStreamSummary) {
    let isThereAnyData = false;

    const uniqueTasks = Array.from(new Set(dataStreamSummary.data.map(item => item.task)));

    const groupedData = dataStreamSummary.data.reduce((acc, {date, task, quantity}) => {
        const day = date.split('T')[0];

        if (!acc[day]) {
            acc[day] = {date: day};
            uniqueTasks.forEach(t => acc[day][t] = 0); // initialize all tasks with 0
        }

        acc[day][task] = quantity;
        return acc;
    }, {} as Record<string, Record<string, any>>);

    const dates = generateDateRange(
        dataStreamSummary.from,
        dataStreamSummary.to
    );

    const mappedData = dates.map(day => {
        if (groupedData[day]) {
            isThereAnyData = true;
            return groupedData[day];
        }

        const empty = {date: day};
        uniqueTasks.forEach(task => empty[task] = 0);
        return empty;
    });

    const mappedDataWithFancyDates = mappedData.map((item) => {
        //example of date now 2024-01-01
        const month = item.date.substring(5, 7);
        const day = item.date.substring(8, 10);
        return {
            ...item,
            date: `${day}/${month}`,
            dayOfWeek: new Date(item.date).toLocaleString('en-US', {weekday: 'short'}),
        }
    })

    return {mappedData: mappedDataWithFancyDates, isThereAnyData};
}

export function getListOfTasksFromProtocolSnapshot(protocolSnapshot: StudyProtocolSnapshot): Object[] {
    return protocolSnapshot.tasks['g4_1']['h4_1'].filter(x => x?.['u21_1'] != null).map(x => JSON.parse(x['u21_1']));
}

export function getUniqueTaskTypesFromProtocolSnapshot(protocolSnapshot: StudyProtocolSnapshot): string[] {
    let tasks = getListOfTasksFromProtocolSnapshot(protocolSnapshot);
    let uniqueTaskTypes = new Set<string>(tasks.map((task: any) => task.type));

    uniqueTaskTypes.delete("one_time_sensing");
    uniqueTaskTypes.delete("informed_consent");
    uniqueTaskTypes.delete("video");

    return Array.from(uniqueTaskTypes);
}

export function getLegend(type: DataStreamType, tasks: Object[]): { label: string, color: string }[] {
    let tasksOfType = tasks.filter((task: any) => task.type === type);
    return tasksOfType.map((task: any, index) => {
        return {
            label: task.title,
            color: colors[index % colors.length], // 🎨 assign color cyclically
            stack: 'stack',
            labelMarkType: 'circle',
            dataKey: task.title,
        }
    });
}



