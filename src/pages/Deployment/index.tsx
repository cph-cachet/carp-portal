import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import BasicInfo from "./BasicInfo";
import InformedConsent from "./InformedConsent";

const Deployment = () => {
  const sectionName = ["Deployments", "Deployment"];
  const description =
    "See the detailed data of the Deployment. Select the participant for further individual data.";
  return (
    <StudyPageLayout>
      <StudyHeader path={sectionName} description={description} />
      <BasicInfo />
      <InformedConsent />
    </StudyPageLayout>
  );
};

export default Deployment;
