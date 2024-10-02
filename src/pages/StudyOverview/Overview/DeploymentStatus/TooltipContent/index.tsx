import { getDeploymentStatusColor } from "@Utils/utility";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";

const TooltipContent = () => {
  return (
    <Stack direction="column" spacing="8px">
      <Typography variant="h5">
        <span style={{ color: getDeploymentStatusColor("Invited") }}>
          Invited
        </span>
        : Indicates that the invited participants have not yet acted on the
        invitation.
      </Typography>
      <Typography variant="h5">
        <span style={{ color: getDeploymentStatusColor("Deploying") }}>
          Deploying
        </span>
        : Participants have started registering devices, but are remaining
        devices.
      </Typography>
      <Typography variant="h5">
        <span style={{ color: getDeploymentStatusColor("Running") }}>
          Running
        </span>
        : All the devices have been deployed and started the data collection.
      </Typography>
      <Typography variant="h5">
        <span style={{ color: getDeploymentStatusColor("Stopped") }}>
          Stopped
        </span>
        : The study deployment has been stopped and no more data will be
        collected.
      </Typography>
    </Stack>
  );
};

export default TooltipContent;
