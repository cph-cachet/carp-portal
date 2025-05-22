import DeploymentsInProgress from "./DeploymentsInProgress";
import DeploymentStatus from "./DeploymentStatus";
import InactiveDeployments from "./InactiveDeployments";
import Status from "./Status";
import StyledContainer from "./styles";
import DataVisualizationForStudy from "./DataVisualizationForStudy";

const Overview = () => {
  return (
    <StyledContainer>
      <Status />
      <DeploymentStatus />
      <DeploymentsInProgress />
      <InactiveDeployments />
      <DataVisualizationForStudy />
    </StyledContainer>
  );
};

export default Overview;
