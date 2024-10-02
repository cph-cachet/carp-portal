/* eslint-disable no-underscore-dangle */
import CopyButton from "@Components/Buttons/CopyButton";
import DeleteConfirmationModal from "@Components/DeleteConfirmationModal";
import { useStopParticipantGroup } from "@Utils/queries/participants";
import { useCreateSummary } from "@Utils/queries/studies";
import { ParticipantGroup } from "@carp-dk/client";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Skeleton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DateTooltip from "../DateTooltip";
import ParticipantRecord from "../ParticipantRecord";
import {
  DownloadButton,
  HorizontalStatusContainer,
  IdContainer,
  MinimizeButton,
  Names,
  ParticipantsContainer,
  StopDeploymentButton,
  StyledCard,
  StyledDivider,
  StyledStatusDot,
  TopContainer,
} from "./styles";

interface Props {
  deployment: ParticipantGroup;
  openCardCount: number;
  allDeploymentCount: number;
  setOpenCardCount: (count: number) => void;
}

const DeploymentCard = ({
  deployment,
  openCardCount,
  setOpenCardCount,
  allDeploymentCount,
}: Props) => {
  const { id: studyId } = useParams();
  const stopDeployment = useStopParticipantGroup(studyId);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [openStopConfirmationModal, setOpenStopConfirmationModal] =
    useState(false);
  const createSummary = useCreateSummary();
  useEffect(() => {
    if (openCardCount === allDeploymentCount) setIsCardOpen(true);
    if (openCardCount === 0) setIsCardOpen(false);
  }, [openCardCount]);

  const handleCardToggle = (event) => {
    event.stopPropagation();
    setIsCardOpen((prevIsCardOpen) => {
      const newOpenCardCount = prevIsCardOpen
        ? openCardCount - 1
        : openCardCount + 1;
      setOpenCardCount(newOpenCardCount);
      return !prevIsCardOpen;
    });
  };

  const handleStopDeployment = () => {
    setOpenStopConfirmationModal(false);
    stopDeployment.mutate(deployment.participantGroupId);
  };
  let names = useMemo(
    () =>
      deployment.participants
        .map((participant) =>
          participant.firstName
            ? `${participant.firstName} ${participant.lastName}`
            : "",
        )
        .join(", "),
    [deployment.participants],
  );

  const createAndDownloadSummary = (event) => {
    event.stopPropagation();
    createSummary.mutate({
      studyId,
      deploymentIds: [deployment.participantGroupId],
    });
  };

  const handleStopDeploymentButtonClick = (event) => {
    event.stopPropagation();
    setOpenStopConfirmationModal(true);
  };

  const confirmationModalProps = {
    open: openStopConfirmationModal,
    onClose: () => setOpenStopConfirmationModal(false),
    onConfirm: handleStopDeployment,
    title: "Stop deployment",
    description:
      "The deployment will be permanently stopped and will no longer be running.",
    boldText: "You can not undo this action.",
    checkboxLabel: "I'm sure I want to stop it",
    actionButtonLabel: "Stop",
  };
  if (names[0] === ",") names = "";
  else if (names.length > 30) names = `${names.slice(0, 30)}...`;
  return (
    <StyledCard open={isCardOpen} elevation={2}>
      <TopContainer onClick={handleCardToggle}>
        <Names variant="h6" noWrap>
          {names && names[0].length > 0 ? names : <i>Generated deployment</i>}
        </Names>
        <StyledDivider />
        <HorizontalStatusContainer>
          <Typography variant="h6">Deployment status:</Typography>
          <StyledStatusDot
            status={deployment.deploymentStatus.__type.split(".").pop()}
          />
          <Typography variant="h6">
            {deployment.deploymentStatus.__type.split(".").pop()}
          </Typography>
          <DateTooltip
            invitedAt={deployment.deploymentStatus.createdOn}
            startedAt={
              deployment.deploymentStatus.startedOn &&
              deployment.deploymentStatus.startedOn
            }
            stoppedAt={
              deployment.deploymentStatus.stoppedOn &&
              deployment.deploymentStatus.stoppedOn
            }
          />
        </HorizontalStatusContainer>
        {deployment.deploymentStatus.stoppedOn ? (
          <div />
        ) : (
          <StopDeploymentButton
            onClick={(event) => handleStopDeploymentButtonClick(event)}
          >
            <Typography variant="h6">Stop deployment</Typography>
          </StopDeploymentButton>
        )}
        <IdContainer>
          <Typography variant="h6">
            Deployment ID: {deployment.participantGroupId}
          </Typography>
          <CopyButton
            textToCopy={deployment.participantGroupId}
            idType="Deployment"
          />
        </IdContainer>
        <StyledDivider />
        <DownloadButton onClick={(event) => createAndDownloadSummary(event)}>
          <Typography variant="h6">Export Data</Typography>
          <FileDownloadOutlinedIcon fontSize="small" />
        </DownloadButton>
        <MinimizeButton
          disableRipple
          onClick={(event) => handleCardToggle(event)}
          open={isCardOpen}
        >
          <KeyboardArrowDownRoundedIcon />
        </MinimizeButton>
      </TopContainer>
      <ParticipantsContainer>
        {isCardOpen &&
          deployment.participants.map((participant) => (
            <ParticipantRecord
              key={participant.participantId}
              deploymentId={deployment.participantGroupId}
              participantData={participant}
              participantStatus={deployment.deploymentStatus.participantStatusList.find(
                (status) => status.participantId === participant.participantId,
              )}
              deviceStatusList={deployment.deploymentStatus.deviceStatusList}
            />
          ))}
      </ParticipantsContainer>
      <DeleteConfirmationModal
        open={confirmationModalProps.open}
        title={confirmationModalProps.title}
        description={confirmationModalProps.description}
        boldText={confirmationModalProps.boldText}
        checkboxLabel={confirmationModalProps.checkboxLabel}
        actionButtonLabel={confirmationModalProps.actionButtonLabel}
        onClose={confirmationModalProps.onClose}
        onConfirm={confirmationModalProps.onConfirm}
      />
    </StyledCard>
  );
};

export const DeploymentSkeletonCard = () => {
  return (
    <StyledCard open={false} elevation={2}>
      <TopContainer>
        <Skeleton animation="wave" variant="text" width={280} height={24} />
        <StyledDivider />
        <HorizontalStatusContainer>
          <Skeleton animation="wave" variant="text" width={82} height={24} />
          <Skeleton animation="wave" variant="text" width={48} height={24} />
          <Skeleton
            animation="wave"
            variant="circular"
            width={14}
            height={14}
          />
        </HorizontalStatusContainer>
        <Skeleton animation="wave" variant="text" width={84} height={24} />
        <IdContainer>
          <Skeleton animation="wave" variant="text" width={56} height={24} />
          <Skeleton animation="wave" variant="text" width={260} height={24} />
          <Skeleton
            sx={{ ml: "2px" }}
            variant="rounded"
            animation="wave"
            width={14}
            height={19}
          />
        </IdContainer>
        <StyledDivider />
        <Skeleton
          sx={{ ml: "16px" }}
          variant="rounded"
          animation="wave"
          width={116}
          height={18}
        />
        <MinimizeButton disableRipple onClick={() => {}} open={false}>
          <KeyboardArrowDownRoundedIcon />
        </MinimizeButton>
      </TopContainer>
      <ParticipantsContainer />
    </StyledCard>
  );
};

export default DeploymentCard;
