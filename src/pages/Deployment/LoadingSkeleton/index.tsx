import { Skeleton, Typography } from "@mui/material";
import { getRandomNumber } from "@Utils/utility";
import StyledCard from "./styles";

const LoadingSkeleton = () => {
  return (
    <StyledCard elevation={2}>
      <Typography variant="h2">
        <Skeleton width={getRandomNumber(140, 276)} animation="wave" />
      </Typography>
    </StyledCard>
  );
};

export default LoadingSkeleton;
