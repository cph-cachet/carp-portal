import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import { useTranslation } from "react-i18next";
import { getUri, PageType } from "@Utils/utility";
import BasicInfo from "./BasicInfo";
import Participants from "./Participants";
import InformedConsentCard from "./InformedConsentCard";
import Devices from "./Devices";
import DataVisualizationForDeployment from "./DataVisualizationForDeployment";

const Deployment = () => {
  const { t } = useTranslation();

  const sectionName = [
    { name: "Deployments", uri: getUri(PageType.DEPLOYMENTS) },
    { name: "Deployment", uri: getUri(PageType.DEPLOYMENT) },
  ];
  const description = t("deployment:page_description");

  return (
    <StudyPageLayout>
      <StudyHeader path={sectionName} description={description} />
      <BasicInfo />
      <Participants />
      <Devices />
      <InformedConsentCard />
      <DataVisualizationForDeployment />
    </StudyPageLayout>
  );
};

export default Deployment;
