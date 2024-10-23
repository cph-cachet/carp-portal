import DeploymentsInProgress from "./DeploymentsInProgress";
import DeploymentStatus from "./DeploymentStatus";
import InactiveDeployments from "./InactiveDeployments";
import Status from "./Status";
import StyledContainer from "./styles";

const Overview = () => {
  return (
    <StyledContainer>
      <Status />
      <DeploymentStatus />
      <DeploymentsInProgress />
      <InactiveDeployments />
    </StyledContainer>
  );
};

export default Overview;
