import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useStudies } from "@Utils/queries/studies";
import { StudyOverview } from "@carp-dk/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyActionCard from "../StudyActionCard";
import { CardsContainer, StyledContainer, Title } from "./styles";
// import { Spinner } from '@Components/StudyHeader/styles';
import StudyCard, { SkeletonCard } from "../StudyCard";

import CreateStudyModal from "./CreateStudyModal";

type StudiesProps = {
  isAdmin: boolean;
};

const StudiesSection = ({ isAdmin }: StudiesProps) => {
  const {
    data: studies,
    isLoading: studiesLoading,
    error: studiesError,
  } = useStudies();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const selectStudyHandler = (studyId: string) => {
    navigate(`/studies/${studyId}/overview`);
  };

  const openCreateStudyModal = () => {
    setModalOpen(true);
  };

  const closeCreateStudyModal = () => {
    setModalOpen(false);
  };

  const inviteResearcherHandler = () => {
    // navigate('/inviteResearcher');
  };

  const getStudyStatus = (study: StudyOverview) => {
    if (study.canDeployToParticipants) {
      return "Live";
    }
    if (study.studyProtocolId) {
      return "Ready";
    }
    return "Draft";
  };

  if (studiesError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading studies"
        error={studiesError}
      />
    );
  }

  return (
    <StyledContainer>
      <Title variant="h2">Your CARP studies</Title>
      <CardsContainer>
        <StudyActionCard
          actionText={isAdmin ? "Invite Researcher" : "Add study"}
          onClick={isAdmin ? inviteResearcherHandler : openCreateStudyModal}
        />
        {studiesLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          studies &&
          studies
            .sort((a, b) =>
              a.createdOn <
              b.createdOn
                ? 1
                : -1,
            )
            .map((study: StudyOverview) => {
              return (
                <StudyCard
                  key={study.studyId}
                  study={study}
                  description={study.description}
                  status={getStudyStatus(study)}
                  onClick={() => selectStudyHandler(study.studyId)}
                />
              );
            })
        )}
      </CardsContainer>
      <CreateStudyModal onClose={closeCreateStudyModal} open={modalOpen} />
    </StyledContainer>
  );
};

export default StudiesSection;
