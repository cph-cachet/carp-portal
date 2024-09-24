import DeploymentStatus from "./DeploymentStatus";
import DeploymentsInProgress from "./DeploymentsInProgress";
import InactiveDeployments from "./InactiveDeployments";
import Status from "./Status";
import StyledContainer from "./styles";

const Overview = () => {
  return (
    <StyledContainer>
      <Status />
      <DeploymentStatus />
      {/* <StudyDataTypes /> */}
      <InactiveDeployments />
      <DeploymentsInProgress />
      {/* <StudyData /> */}
    </StyledContainer>
  );
};

export default Overview;
