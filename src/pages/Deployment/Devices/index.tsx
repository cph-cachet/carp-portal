import CarpAccordion from "@Components/CarpAccordion";
import { SyledAccordionSummary } from "@Components/CarpAccordion/styles";
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParticipantGroupsAccountsAndStatus } from "@Utils/queries/participants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { ParticipantGroup } from "@carp-dk/client";
import { Stack } from "@mui/material";
import LoadingSkeleton from "../LoadingSkeleton";

const Devices = () => {
  const { id: studyId, deploymentId } = useParams();
  const { t } = useTranslation();

  const {
    data: statuses,
    isLoading,
    error,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const [group, setGroup] = useState<ParticipantGroup>(null);

  useEffect(() => {
    if (statuses) {
      setGroup(
        statuses.groups.find((s) => s.participantGroupId === deploymentId),
      );
    }
  }, [statuses, deploymentId]);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participants"
        error={error}
      />
    );
  }
  console.log(group);
  return (
    <CarpAccordion
      title={t("deployment:devices_card.title")}
      description={t("deployment:devices_card.description")}
    >
      <SyledAccordionSummary>
        <Stack direction="row">
          {group &&
            group.deploymentStatus.deviceStatusList.map((d) => {
              return <p>{d.device.roleName}</p>;
            })}
        </Stack>
      </SyledAccordionSummary>
    </CarpAccordion>
  );
};

export default Devices;
