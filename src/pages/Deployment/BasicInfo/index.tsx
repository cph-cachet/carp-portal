import CopyButton from "@Components/Buttons/CopyButton";
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParticipantGroupsAccountsAndStatus } from "@Utils/queries/participants";
import { ParticipantGroup } from "@carp-dk/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import { formatDateTime } from "@Utils/utility";
import { Stop } from "@mui/icons-material";
import LoadingSkeleton from "../LoadingSkeleton";
import {
  Left,
  Right,
  SecondaryText,
  StyledButton,
  StyledCard,
  StyledDivider,
  StyledStatusDot,
  StyledStatusText,
} from "./styles";

const BasicInfo = () => {
  const { deploymentId, id: studyId } = useParams();

  const {
    data: participantData,
    isLoading: participantDataLoading,
    error: participantError,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const [deployment, setDeployment] = useState<ParticipantGroup | null>(null);

  useEffect(() => {
    if (!participantDataLoading && participantData && participantData.groups) {
      setDeployment(
        participantData.groups.find(
          (g) => g.participantGroupId === deploymentId,
        ),
      );
    }
  }, [participantData, participantDataLoading, deploymentId]);

  if (participantDataLoading || !deployment) return <LoadingSkeleton />;

  if (participantError)
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participant data"
        error={participantError}
      />
    );

  return (
    <StyledCard elevation={2}>
      <Left>
        <Stack direction="column" gap="8px" alignItems="center">
          <StyledStatusDot
            // eslint-disable-next-line no-underscore-dangle
            status={deployment.deploymentStatus.__type.split(".").pop()}
          />
          <StyledStatusText
            variant="h6"
            // eslint-disable-next-line no-underscore-dangle
            status={deployment.deploymentStatus.__type.split(".").pop()}
          >
            {deployment.deploymentStatus.__type.split(".").pop()}
          </StyledStatusText>
        </Stack>
        {!deployment.deploymentStatus.__type.includes("Stopped") && (
          <StyledButton variant="outlined">
            <Stop />
            Stop deployment
          </StyledButton>
        )}
      </Left>
      <Right>
        <Stack direction="column" gap="8px">
          <SecondaryText variant="h6">
            {`Created on: 
            ${formatDateTime(deployment.deploymentStatus.createdOn, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}`}
          </SecondaryText>
          {deployment.deploymentStatus.startedOn && (
            <SecondaryText variant="h6">
              {`Started on: 
            ${formatDateTime(deployment.deploymentStatus.startedOn, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}`}
            </SecondaryText>
          )}
          {deployment.deploymentStatus.stoppedOn && (
            <SecondaryText variant="h6">
              {`Stopped on: 
            ${formatDateTime(deployment.deploymentStatus.stoppedOn, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}`}
            </SecondaryText>
          )}
        </Stack>
        <StyledDivider />
        <Stack direction="column" gap="8px" alignItems="flex-end">
          <Stack direction="row" gap="8px">
            <SecondaryText variant="h6">Owner ID: {deploymentId}</SecondaryText>
            <CopyButton textToCopy={deploymentId} idType="Owner" />
          </Stack>
          <Stack direction="row" gap="8px">
            <SecondaryText variant="h6">
              Deployment ID: {deploymentId}
            </SecondaryText>
            <CopyButton textToCopy={deploymentId} idType="Deployment" />
          </Stack>
        </Stack>
      </Right>
    </StyledCard>
  );
};

export default BasicInfo;
