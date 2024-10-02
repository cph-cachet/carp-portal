import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useStudyDetails, useStudyStatus } from "@Utils/queries/studies";
import { formatDateTime } from "@Utils/utility";
import kotlinx from "@cachet/carp-kotlinx-datetime";
import carpStudies from "@cachet/carp-studies-core";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LoadingSkeleton from "../LoadingSkeleton";
import {
  ProtocolData,
  StatusName,
  StyledCard,
  StyledDescription,
  StyledLink,
  StyledStatus,
  StyledStatusDot,
  StyledTitle,
  Top,
} from "./styles";
import StudyStatus = carpStudies.dk.cachet.carp.studies.application.StudyStatus;
// HACK toEpochMilliseconds is not a function if Insant is not imported
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Instant = kotlinx.datetime.Instant;

const Status = () => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();
  let currentStudyStatus: "Draft" | "Ready" | "Live" = "Draft";
  const {
    data: studyStatus,
    isLoading: studyStatusIsLoading,
    error: studyStatusError,
  } = useStudyStatus(studyId);
  const {
    data: studyDetails,
    isLoading: studyDetailsIsLoading,
    error: studyDetailsError,
  } = useStudyDetails(studyId);
  if (studyStatusIsLoading || studyDetailsIsLoading) return <LoadingSkeleton />;
  if (studyStatus instanceof StudyStatus.Configuring) {
    if (studyStatus.canGoLive) {
      currentStudyStatus = "Ready";
    } else {
      currentStudyStatus = "Draft";
    }
  } else {
    currentStudyStatus = "Live";
  }

  if (studyStatusError || studyDetailsError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading study status"
        error={studyStatusError ?? studyDetailsError}
      />
    );
  }

  return (
    <StyledCard elevation={2}>
      <Top>
        <div>
          <StyledTitle variant="h2">Status</StyledTitle>
          <StyledDescription variant="h6">
            {`Created on ${formatDateTime(studyDetails.createdOn.toEpochMilliseconds())}`}
          </StyledDescription>
        </div>
        <StyledStatus status={currentStudyStatus}>
          <StyledStatusDot status={currentStudyStatus} />
          <StatusName variant="h6" status={currentStudyStatus}>
            {currentStudyStatus}
          </StatusName>
        </StyledStatus>
      </Top>
      {studyDetails.protocolSnapshot && (
        <div>
          <ProtocolData variant="h4">
            Study Protocol: {studyDetails.protocolSnapshot.name}
          </ProtocolData>
          <Typography variant="h6">
            {studyDetails.protocolSnapshot.description}
          </Typography>
          <StyledLink
            variant="h6"
            onClick={() => {
              navigate("/protocols");
            }}
          >
            See detailed information in Study Settings
            <LinkIcon
              sx={{
                marginLeft: "0.1rem",
                fontSize: "1rem",
              }}
            />
          </StyledLink>
        </div>
      )}
    </StyledCard>
  );
};

export default Status;
