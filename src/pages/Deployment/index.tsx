import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import BasicInfo from "./BasicInfo";
import Participants from "./Participants";

const Deployment = () => {
  const sectionName = ["Deployments", "Deployment"];
  const description =
    "See the detailed data of the Deployment. Select the participant for further individual data.";
  return (
    <StudyPageLayout>
      <StudyHeader path={sectionName} description={description} />
      <BasicInfo />
      <Participants />
      {/* <InformedConsent /> */}
    </StudyPageLayout>
  );
};

export default Deployment;
