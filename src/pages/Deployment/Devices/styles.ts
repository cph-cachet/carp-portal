import { styled } from "@Utils/theme";
import { getDeviceStatusColor } from "@Utils/utility";

export const StyledStatusDot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: getDeviceStatusColor(status),
  marginLeft: 6,
  flexShrink: 0,
  alignSelf: "center",
}));
