/* eslint-disable no-underscore-dangle */
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParticipantGroupsAccountsAndStatus } from "@Utils/queries/participants";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/system";
import LoadingSkeleton from "../LoadingSkeleton";
import {
  HeaderTableCell,
  HeaderText,
  SecondaryCellText,
  StyledCard,
  StyledDescription,
  StyledStatusDot,
  StyledTableCell,
  StyledTableRow,
  StyledTitle,
  StyledTooltip,
} from "./styles";
import TooltipContent from "./TooltipContent";

const DeploymentsInProgress = () => {
  const { id: studyId } = useParams();
  const {
    data: deploymentsAccountAndStatus,
    isLoading: isDeploymentsAccountAndStatusLoading,
    error: deploymentsAccountAndStatusError,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const [deploymentProgress, setDeploymentProgress] = useState<
    {
      deploymentId: string;
      devices: any[];
    }[]
  >([]);

  useEffect(() => {
    if (
      deploymentsAccountAndStatus?.groups !== undefined &&
      deploymentsAccountAndStatus?.groups.length !== 0
    ) {
      const deployments = deploymentsAccountAndStatus.groups
        .filter((g) => !g.deploymentStatus.__type.includes("Stopped"))
        .map((g) => {
          const devices = g.deploymentStatus.deviceStatusList.filter(
            (dl) => dl.device.isPrimaryDevice,
          );
          return { deploymentId: g.participantGroupId, devices };
        })
        .flat();
      setDeploymentProgress(deployments);
    }
  }, [deploymentsAccountAndStatus]);

  if (isDeploymentsAccountAndStatusLoading) {
    return <LoadingSkeleton />;
  }

  if (deploymentsAccountAndStatusError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participants"
        error={deploymentsAccountAndStatusError}
      />
    );
  }

  return (
    <StyledCard elevation={2}>
      <StyledTitle variant="h2">
        Deployments in Progress
        <StyledTooltip
          title={TooltipContent()}
          placement="right-start"
          componentsProps={{
            tooltip: {
              sx: {
                color: "text.primary",
                backgroundColor: "#FFF",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              },
            },
          }}
        >
          <InfoOutlinedIcon />
        </StyledTooltip>
      </StyledTitle>
      <StyledDescription variant="h6">
        The status of the master devices, for each Deployment. Select the
        Deployment ID for further information.
      </StyledDescription>
      <TableContainer sx={{ paddingLeft: "4px", paddingRight: "16px" }}>
        <Table
          style={{ tableLayout: "fixed" }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <StyledTableRow>
              <HeaderTableCell width="150px">
                <HeaderText variant="h5">Deployment ID</HeaderText>
              </HeaderTableCell>
              <HeaderTableCell>
                <HeaderText variant="h5">Device Registration</HeaderText>
              </HeaderTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {deploymentProgress.map((g) => (
              <StyledTableRow key={g.deploymentId}>
                <StyledTableCell align="center">
                  <SecondaryCellText variant="h5">
                    {`... ${g.deploymentId.slice(-4)}`}
                  </SecondaryCellText>
                </StyledTableCell>
                <StyledTableCell>
                  <SecondaryCellText variant="h5" noWrap>
                    {g.devices.map((d) => (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        key={d.device}
                      >
                        <StyledStatusDot status={d.__type.split(".").pop()} />
                        <Typography variant="h6">
                          {d.device.roleName}
                        </Typography>
                      </Stack>
                    ))}
                  </SecondaryCellText>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledCard>
  );
};

export default DeploymentsInProgress;
