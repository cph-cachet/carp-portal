import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParticipantGroupsAccountsAndStatus } from "@Utils/queries/participants";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ParticipantGroup } from "@carp-dk/client";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import PersonIcon from "@mui/icons-material/Person";
import GeneratedAccountLabel from "@Components/GeneratedAccountLabel";
import CarpAccordion from "@Components/CarpAccordion";
import LoadingSkeleton from "../LoadingSkeleton";
import { AccountIcon, Initials, NameContainer, RoleContainer } from "./styles";

const Participants = () => {
  const { id: studyId, deploymentId } = useParams();

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
  return (
    <CarpAccordion title="Participants">
      {group &&
        group.participants.map((p) => (
          <Stack direction="row" gap={16} key={p.participantId}>
            <Box gap="15px" display="flex" flexDirection="row">
              <AccountIcon>
                <Initials variant="h4">
                  {p.firstName === "" || p.firstName === null
                    ? p.role[0]
                    : `${p.firstName[0]}${p.lastName[0]}`}
                </Initials>
              </AccountIcon>
              <Typography variant="h6" alignContent="center">
                {p.email ?? <GeneratedAccountLabel />}
              </Typography>
            </Box>
            <NameContainer>
              {p.firstName && (
                <>
                  <PersonIcon fontSize="small" />
                  <Typography variant="h6">
                    {p.firstName} {p.lastName}
                  </Typography>
                </>
              )}
            </NameContainer>
            <RoleContainer>
              <ContactPageIcon fontSize="small" />
              <Typography
                variant="h6"
                textTransform="lowercase"
                sx={{ "::first-letter": { textTransform: "capitalize" } }}
              >
                {p.role}
              </Typography>
            </RoleContainer>
          </Stack>
        ))}
    </CarpAccordion>
  );
};

export default Participants;
