import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useInactiveDeployments } from "@Utils/queries/participants";
import {
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/system";
import { formatDateTime } from "@Utils/utility";
import LoadingSkeleton from "../LoadingSkeleton";
import {
  HeaderTableCell,
  HeaderText,
  SecondaryCellText,
  StyledCard,
  StyledDescription,
  StyledSelect,
  StyledTableCell,
  StyledTableRow,
  StyledTitle,
} from "./styles";

const InactiveDeployments = () => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();

  const menuItems = [
    { value: 24, label: "24 h" },
    { value: 48, label: "48 h" },
    { value: 168, label: "1 week" },
    { value: 336, label: "2 weeks" },
    { value: 730, label: "1 month" },
    { value: 4380, label: "6 months" },
  ];

  const [lastUpdateTime, setLastUpdateTime] = useState<number>(
    menuItems[0].value,
  );

  const {
    data: inactiveDeployments,
    isLoading: isInactiveDeploymentsLoading,
    error: inactiveDeploymentsError,
  } = useInactiveDeployments(studyId, lastUpdateTime);

  if (isInactiveDeploymentsLoading) {
    return <LoadingSkeleton />;
  }

  if (inactiveDeploymentsError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participant deployments"
        error={inactiveDeploymentsError}
      />
    );
  }

  return (
    <StyledCard elevation={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <StyledTitle variant="h2">Inactive Deployments</StyledTitle>
        <StyledSelect
          value={lastUpdateTime}
          MenuProps={{
            PaperProps: {
              sx: {
                width: "116px",
                borderRadius: "16px",
              },
            },
          }}
          renderValue={() => {
            const selectedItem = menuItems.find(
              (item) => item.value === lastUpdateTime,
            );
            return <Typography variant="h5">{selectedItem.label}</Typography>;
          }}
          onChange={(e) => {
            setLastUpdateTime(e.target.value as unknown as number);
          }}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              <Typography variant="h5">{item.label}</Typography>
            </MenuItem>
          ))}
        </StyledSelect>
      </Stack>
      <StyledDescription variant="h6">
        The following Deployments have not uploaded any data in the timeframe
        selected. Select the Deployments ID for further information or to send a
        reminder.
      </StyledDescription>
      <TableContainer sx={{ paddingLeft: "4px", paddingRight: "16px" }}>
        <Table
          style={{ tableLayout: "fixed" }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <StyledTableRow>
              <HeaderTableCell>
                <HeaderText variant="h5">Deployment ID</HeaderText>
              </HeaderTableCell>
              <HeaderTableCell width="25%" align="center">
                <HeaderText variant="h5">Last Data</HeaderText>
              </HeaderTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {inactiveDeployments.map((participant) => (
              <StyledTableRow
                key={participant.deploymentId as unknown as string}
              >
                <StyledTableCell>
                  <SecondaryCellText variant="h5">
                    {participant.deploymentId as unknown as string}
                  </SecondaryCellText>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <SecondaryCellText variant="h5">
                    {formatDateTime(
                      participant.dateOfLastDataUpload.toString(),
                      { year: "numeric", month: "numeric", day: "numeric" },
                    )}
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

export default InactiveDeployments;
