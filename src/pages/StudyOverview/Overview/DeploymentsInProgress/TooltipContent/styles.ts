import { styled } from "@mui/system";
import { getDeviceStatusColor } from "@Utils/utility";

const StyledStatusDot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  width: 8,
  height: 8,
  minWidth: 8,
  borderRadius: "50%",
  backgroundColor: getDeviceStatusColor(status),
}));

export default StyledStatusDot;
