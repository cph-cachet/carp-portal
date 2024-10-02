/* eslint-disable no-underscore-dangle */
import GeneratedAccountLabel from "@Components/GeneratedAccountLabel";
import {
  calculateDaysPassedFromDate,
  getDeviceIcon,
  getRandomNumber,
} from "@Utils/utility";
import {
  DeviceStatus,
  ParticipantData,
  ParticipantStatus,
} from "@carp-dk/client";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import PersonIcon from "@mui/icons-material/Person";
import { Skeleton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountIcon,
  Initials,
  NameContainer,
  RoleContainer,
  StatusContainer,
  StyledContainer,
  StyledStatusDot,
} from "./styles";

type Props = {
  deploymentId: string;
  participantData: ParticipantData;
  participantStatus: ParticipantStatus;
  deviceStatusList: DeviceStatus[];
};

const ParticipantRecord = ({
  deploymentId,
  participantData,
  participantStatus,
  deviceStatusList,
}: Props) => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();
  const participantRole =
    participantStatus.assignedParticipantRoles.roleNames[0];
  const participantDeviceRoleName =
    participantStatus.assignedPrimaryDeviceRoleNames[0];
  const primaryDevice = deviceStatusList.find(
    (device) => device.device.roleName === participantDeviceRoleName,
  );
  const participantDeviceType = primaryDevice.device.__type;
  const deviceStatus = primaryDevice.__type.split(".").pop();
  if (participantData.firstName === undefined) {
    participantData.firstName = "";
  }
  if (participantData.lastName === undefined) {
    participantData.lastName = "";
  }

  const lastDataUpload = useMemo(() => {
    const lastData = participantData.dateOfLastDataUpload;
    if (!lastData) {
      return "";
    }
    const elapsedDays = calculateDaysPassedFromDate(
      lastData.toString(),
    );
    if (elapsedDays === 0) {
      return "Last data: Today";
    }
    return `Last data: ${elapsedDays} day${elapsedDays > 1 ? "s" : ""} ago`;
  }, [participantData.dateOfLastDataUpload]);

  return (
    <StyledContainer
      onClick={() =>
        navigate(
          `/studies/${studyId}/participants/deployments/${deploymentId}/participants/${participantData.participantId}`,
        )
      }
    >
      <AccountIcon>
        <Initials variant="h4">
          {participantData.firstName === "" ||
          participantData.firstName === null
            ? participantRole[0]
            : `${participantData.firstName[0]}${participantData.lastName[0]}`}
        </Initials>
      </AccountIcon>
      <Typography variant="h6">
        {participantData.email ?? <GeneratedAccountLabel />}
      </Typography>
      <NameContainer>
        {participantData.firstName && (
          <>
            <PersonIcon fontSize="small" />
            <Typography variant="h6">
              {participantData.firstName} {participantData.lastName}
            </Typography>
          </>
        )}
      </NameContainer>
      <RoleContainer>
        <ContactPageIcon fontSize="small" />
        <Typography variant="h6">{participantRole}</Typography>
      </RoleContainer>
      <RoleContainer>
        {getDeviceIcon(participantDeviceType)}
        <Typography variant="h6">{participantDeviceRoleName}</Typography>
      </RoleContainer>
      <StatusContainer>
        <StyledStatusDot status={deviceStatus} />
        <Typography variant="h6">{deviceStatus}</Typography>
      </StatusContainer>
      <Typography variant="h6">{lastDataUpload}</Typography>
    </StyledContainer>
  );
};

export const ParticipantRecordSkeleton = () => {
  return (
    <StyledContainer>
      <Skeleton animation="wave" variant="circular" width={36} height={36} />
      <Skeleton
        animation="wave"
        variant="text"
        width={`${getRandomNumber(40, 80)}%`}
        height={20}
      />
      <NameContainer>
        <Skeleton animation="wave" variant="circular" width={14} height={14} />
        <Skeleton
          animation="wave"
          variant="text"
          width={getRandomNumber(50, 100)}
          height={20}
        />
      </NameContainer>
      <RoleContainer>
        <Skeleton animation="wave" variant="circular" width={14} height={14} />
        <Skeleton
          animation="wave"
          variant="text"
          width={getRandomNumber(30, 60)}
          height={20}
        />
      </RoleContainer>
      <RoleContainer>
        <Skeleton animation="wave" variant="circular" width={14} height={14} />
        <Skeleton
          animation="wave"
          variant="text"
          width={getRandomNumber(30, 60)}
          height={20}
        />
      </RoleContainer>
      <StatusContainer>
        <Skeleton
          sx={{ m: "0px 8px 0px 4px" }}
          animation="wave"
          variant="circular"
          width={20}
          height={20}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width={getRandomNumber(30, 60)}
          height={20}
        />
      </StatusContainer>
      <Skeleton animation="wave" variant="text" width={120} height={20} />
    </StyledContainer>
  );
};

export default ParticipantRecord;
