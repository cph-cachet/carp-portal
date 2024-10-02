import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { PieValueType } from "@mui/x-charts";
import ParticipantsRow from "./styles";

const DeploymentStatusLegend = ({ data }: { data: PieValueType[] }) => {
  return (
    <Stack direction="column">
      {data.map((entry) => (
        <ParticipantsRow key={entry.id}>
          <Typography variant="h3" color={entry.color} display="flex">
            {entry.value}
          </Typography>
          <Typography variant="h3" color={entry.color} display="flex">
            {`${entry.label}`}
          </Typography>
        </ParticipantsRow>
      ))}
    </Stack>
  );
};

export default DeploymentStatusLegend;
