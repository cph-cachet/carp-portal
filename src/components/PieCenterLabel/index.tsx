import { useDrawingArea } from "@mui/x-charts";
import { StyledNumberTSpan, StyledTSpan } from "./styles";

const PieCenterLabel = ({ children }: { children: React.ReactNode }) => {
  const { width, height, left, top } = useDrawingArea();
  return (
    <text x={left + width / 2} y={top + height / 2}>
      <StyledNumberTSpan x={left + width} dy="-0.3em">
        {children}
      </StyledNumberTSpan>
      <StyledTSpan x={left + width} dy="2em">
        Deployments
      </StyledTSpan>
    </text>
  );
};
export default PieCenterLabel;
