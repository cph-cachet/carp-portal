import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useLatestProtocol } from "@Utils/queries/protocols";
import { Connection } from "@Utils/types";
import { getRandomNumber } from "@Utils/utility";
import carpCommon from "@cachet/carp-common";
import { Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import DeviceDropdown from "../DeviceDropdown";
import { getInputDataName } from "@Assets/inputTypeNames";
import {
  CardTitle,
  ProtocolDescription,
  ProtocolName,
  StyledCard,
  StyledContainer,
  StyledNameCard,
} from "./styles";

type ParticipantRole =
  carpCommon.dk.cachet.carp.common.application.users.ParticipantRole;

const ProtocolNameCardSkeleton: React.FC = () => {
  return (
    <StyledNameCard elevation={2}>
      <Skeleton height={32} animation="wave" variant="text" width={70} />
      <Skeleton height={28} animation="wave" variant="text" width="83%" />
      <Skeleton height={32} animation="wave" variant="text" width={130} />
      <Skeleton animation="wave" variant="text" width="60%" />
    </StyledNameCard>
  );
};

const ProtocolCardSkeleton: React.FC = () => {
  return (
    <StyledCard elevation={2}>
      <Skeleton
        height={32}
        animation="wave"
        variant="text"
        width={`${getRandomNumber(20, 50)}%`}
      />
      {[1, 2].map(() => {
        return (
          <Skeleton
            key={uuidv4()}
            animation="wave"
            variant="text"
            width={`${getRandomNumber(40, 70)}%`}
          />
        );
      })}
    </StyledCard>
  );
};

const ProtocolCards = () => {
  const { id: protocolId } = useParams();
  const {
    data: protocol,
    isLoading: protocolLoading,
    error: protocolError,
  } = useLatestProtocol(protocolId);
  if (protocolLoading)
    return (
      <StyledContainer>
        <ProtocolNameCardSkeleton />
        <ProtocolCardSkeleton />
        <ProtocolCardSkeleton />
        <ProtocolCardSkeleton />
      </StyledContainer>
    );

  if (protocolError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading protocol"
        error={protocolError}
      />
    );
  }
  return (
    <StyledContainer>
      <StyledNameCard elevation={2}>
        <CardTitle variant="h2">Name</CardTitle>
        <ProtocolName variant="h3">{protocol.snapshot.name}</ProtocolName>
        <CardTitle variant="h2">Description</CardTitle>
        <ProtocolDescription variant="h4">
          {protocol.snapshot.description}
        </ProtocolDescription>
      </StyledNameCard>
      {protocol.snapshot.primaryDevices.size() > 0 &&
        protocol.snapshot.connections.size() > 0 && (
          <StyledCard elevation={2}>
            <CardTitle variant="h2">Devices</CardTitle>
            {protocol.snapshot.primaryDevices.toArray().map((device) => {
              return (
                <DeviceDropdown
                  connectedDevices={protocol.snapshot.connectedDevices.toArray()}
                  connections={protocol.snapshot.connections
                    .toArray()
                    .filter((connection: Connection) => {
                      return connection.connectedToRoleName === device.roleName;
                    })}
                  key={uuidv4()}
                  device={device}
                />
              );
            })}
          </StyledCard>
        )}
      {protocol.snapshot.expectedParticipantData.size() > 0 && (
        <StyledCard elevation={2}>
          <CardTitle variant="h2">Participant data</CardTitle>
          <ul>
            {protocol.snapshot.expectedParticipantData.toArray().map((data) => {
              return (
                <li key={uuidv4()}>
                  <Typography variant="h4">
                    {getInputDataName(data.attribute.inputDataType.name)}
                  </Typography>
                </li>
              );
            })}
          </ul>
        </StyledCard>
      )}
      {protocol.snapshot.participantRoles.size() > 0 && (
        <StyledCard elevation={2}>
          <CardTitle variant="h2">Participant roles</CardTitle>
          <ul>
            {protocol.snapshot.participantRoles
              .toArray()
              .map((role: ParticipantRole) => {
                return (
                  <li key={uuidv4()}>
                    <Typography variant="h4">{role.role}</Typography>
                  </li>
                );
              })}
          </ul>
        </StyledCard>
      )}
    </StyledContainer>
  );
};

export default ProtocolCards;
