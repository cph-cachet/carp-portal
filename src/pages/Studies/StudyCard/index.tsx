import { formatDateTime, getRandomNumber } from "@Utils/utility";
import { StudyOverview } from "@carp-dk/client";
import { Grow, Skeleton } from "@mui/material";
import {
  Bottom,
  CardDescription,
  CardTitle,
  CardWrapper,
  CreationText,
  InfoContainer,
  StatusDotContainer,
  StyledCard,
  StyledStatusDot,
} from "./styles";

interface Props {
  onClick: () => void;
  study?: StudyOverview;
  status?: "Live" | "Ready" | "Draft";
  description?: string;
}

const StudyCard = ({ onClick, study, status, description }: Props) => {
  return (
    <Grow in mountOnEnter unmountOnExit>
      <CardWrapper elevation={2} onClick={onClick}>
        <StyledCard>
          <StatusDotContainer>
            <StyledStatusDot status={status} />
          </StatusDotContainer>
          <InfoContainer>
            <CardTitle variant="h2">{study.name}</CardTitle>
            <CardDescription variant="body2">{description}</CardDescription>
            <Bottom>
              <CreationText variant="h5">
                {formatDateTime(study.createdOn.toString())}
              </CreationText>
              {/* TODO: Add real owner name after backend supports it */}
              {/* <CreationText variant="h5">Jakob</CreationText> */}
            </Bottom>
          </InfoContainer>
        </StyledCard>
      </CardWrapper>
    </Grow>
  );
};

export const SkeletonCard = () => {
  return (
    <Grow in mountOnEnter unmountOnExit>
      <CardWrapper elevation={2}>
        <StyledCard>
          <StatusDotContainer skeleton>
            <Skeleton
              width="20px"
              height="20px"
              animation="wave"
              variant="circular"
            />
          </StatusDotContainer>
          <InfoContainer>
            <CardTitle variant="h2">
              <Skeleton
                animation="wave"
                width={`${getRandomNumber(50, 90)}%`}
              />
            </CardTitle>
            <CardDescription variant="body2">
              <Skeleton
                width={`${getRandomNumber(40, 60)}%`}
                variant="rounded"
                animation="wave"
              />
            </CardDescription>
            <Bottom>
              <CreationText variant="h5">
                <Skeleton
                  width={`${getRandomNumber(40, 70)}%`}
                  animation="wave"
                />
              </CreationText>
              <CreationText variant="h5">
                <Skeleton
                  width={`${getRandomNumber(30, 70)}%`}
                  animation="wave"
                />
              </CreationText>
            </Bottom>
          </InfoContainer>
        </StyledCard>
      </CardWrapper>
    </Grow>
  );
};

export default StudyCard;
