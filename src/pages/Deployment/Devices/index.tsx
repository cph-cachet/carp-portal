import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParticipantGroupsAccountsAndStatus } from "@Utils/queries/participants";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CarpAccordion from "@Components/CarpAccordion";
import LoadingSkeleton from "../LoadingSkeleton";
import { StyledStatusDot } from "./styles";
import { t } from "i18next";
import { useStudyDetails } from "@Utils/queries/studies";
import { getDeviceIcon } from "@Utils/utility";

const Devices = () => {
  const { id: studyId, deploymentId } = useParams();

  const {
    data: study,
    isLoading: studyLoading,
    error: studyError,
  } = useStudyDetails(studyId);

  const {
    data: participantGroupsAndStatuses,
    isLoading: participantGroupsAndStatusesLoading,
    error: participantGroupsAndStatusesError,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const [devices, setDevices] = useState<
    {
      primaryDevice: { name: string; type: string; status: string };
      connections: { name: string; type: string; status: string }[];
    }[]
  >([]);

  useEffect(() => {
    if (study && participantGroupsAndStatuses) {
      const connectedDevices = study.protocolSnapshot.primaryDevices
        .toArray()
        .map((device) => {
          const connections = study.protocolSnapshot.connections
            .toArray()
            .filter((connection) => {
              return connection.connectedToRoleName === device.roleName;
            })
            .map((connection) => {
              const deviceStatus = participantGroupsAndStatuses.groups
                .find((s) => s.participantGroupId === deploymentId)
                .deploymentStatus.deviceStatusList.find(
                  (d) => d.device.roleName === connection.roleName,
                );
              return {
                name: connection.roleName,
                type: deviceStatus.device.__type,
                status: deviceStatus.__type.split(".").pop(),
              };
            });
          const deviceStatus = participantGroupsAndStatuses.groups
            .find((s) => s.participantGroupId === deploymentId)
            .deploymentStatus.deviceStatusList.find(
              (d) => d.device.roleName === device.roleName,
            );
          return {
            primaryDevice: {
              name: device.roleName,
              type: deviceStatus.device.__type,
              status: deviceStatus.__type.split(".").pop(),
            },
            connections,
          };
        });
      setDevices(connectedDevices);
    }
  }, [participantGroupsAndStatuses, deploymentId]);

  if (studyLoading || participantGroupsAndStatusesLoading)
    return <LoadingSkeleton />;

  if (studyError || participantGroupsAndStatusesError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participants"
        error={studyError ?? participantGroupsAndStatusesError}
      />
    );
  }
  console.log(devices);
  return (
    <CarpAccordion
      title={t("deployment:devices_card.title")}
      description={t("deployment:devices_card.description")}
    >
      <Stack spacing={"16px"} direction={"row"}>
        {devices &&
          devices.map(({ primaryDevice, connections }) => (
            <Stack
              key={primaryDevice.name}
              gap={"8px"}
              border={"1px solid #ABABAB"}
              borderRadius={"16px"}
              display={"flex"}
              width={"100%"}
              maxWidth={"25%"}
              padding={"16px 16px"}
            >
              <Stack
                direction={"row"}
                gap={"8px"}
                padding={"4px 0px 4px 0px"}
                display={"grid"}
                gridTemplateColumns={"18px 1fr 8px"}
              >
                {getDeviceIcon(primaryDevice.type)}
                <Typography variant="h4">{primaryDevice.name}</Typography>
                <StyledStatusDot status={primaryDevice.status} />
              </Stack>
              <Stack gap={"4px"}>
                {connections.map((connection) => {
                  return (
                    <Stack
                      key={connection.name}
                      direction={"row"}
                      gap={"8px"}
                      padding={"4px 0px 4px 24px"}
                      display={"grid"}
                      gridTemplateColumns={"18px 1fr 8px"}
                    >
                      {getDeviceIcon(connection.type)}
                      <Typography variant="h5">{connection.name}</Typography>
                      <StyledStatusDot status={connection.status} />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          ))}
      </Stack>
    </CarpAccordion>
  );
};

export default Devices;
