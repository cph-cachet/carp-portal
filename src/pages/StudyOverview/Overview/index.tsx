import DeploymentStatus from "./DeploymentStatus";
import DeviceDeploymentStatus from "./DeviceDeploymentStatus";
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
      <DeviceDeploymentStatus />
      {/* <StudyData /> */}
    </StyledContainer>
  );
};

export default Overview;
