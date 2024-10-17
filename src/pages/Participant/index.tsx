import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import BasicInfo from "./BasicInfo";
import Deployment from "./Deployment";
import InformedConsent from "./InformedConsent";

const Participant = () => {
  const sectionName = ["Deployments", "Participant"];
  const description = "See detailed data of the Participant.";
  return (
    <StudyPageLayout>
      <StudyHeader path={sectionName} description={description} />
      <BasicInfo />
      <Deployment />
      {/*<InformedConsent />*/}
      {/* TODO: Functionality not complete, should not be in the stable release */}
      {/* <ParticipantData /> */}
    </StudyPageLayout>
  );
};

export default Participant;
