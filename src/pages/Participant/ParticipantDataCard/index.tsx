import {
  useGetParticipantData,
  useParticipantGroupsAccountsAndStatus,
  useSetParticipantData,
} from "@Utils/queries/participants";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudyDetails } from "@Utils/queries/studies";
import { CarpInputDataTypes, ParticipantStatus, cdk } from "@carp-dk/client";
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import getInputDataName from "@Assets/inputTypeNames";
import {
  EditButton,
  Left,
  Right,
  StyledCard,
  StyledDescription,
  StyledDivider,
  Title,
  Top,
} from "./styles";
import getInputElement from "./InputElements/selector";
import SelectOne = cdk.cachet.carp.common.application.data.input.elements.SelectOne;
import LoadingSkeleton from "../LoadingSkeleton";
import getParticipantDataFormik from "./InputElements/utils";

const ParticipantDataCard = () => {
  const [editing, setEditing] = useState(false);
  const { participantId, id: studyId, deploymentId } = useParams();
  const {
    data: study,
    isLoading: studyLoading,
    error: studyError,
  } = useStudyDetails(studyId);
  const {
    data: participantGroupStatus,
    isLoading: participantGroupStatusLoading,
    error: participantGroupStatusError,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const setParticipantData = useSetParticipantData(deploymentId);
  const {
    data: participantData,
    isLoading: participantDataLoading,
    error: participantDataError,
  } = useGetParticipantData(deploymentId);

  const [participant, setParticipant] = useState<ParticipantStatus | null>(
    null,
  );
  const initalValues = useMemo(() => {
    const iv = [];
    if (!participantData || !participant) return iv;
    if (
      participantData?.roles &&
      participantData?.roles[participant?.assignedParticipantRoles.roleNames[0]]
    ) {
      Object.entries(
        participantData?.roles[
          participant?.assignedParticipantRoles.roleNames[0]
        ],
      ).forEach(([key, value]) => {
        iv.push({ [key]: value });
      });
    }

    if (participantData?.common) {
      if (Object.entries(participantData?.common).length !== 0) {
        iv.push(Object.fromEntries(Object.entries(participantData?.common)));
      }
    }
    return iv;
  }, [participantData, participant]);

  useEffect(() => {
    if (participantGroupStatus) {
      setParticipant(
        participantGroupStatus.groups
          .find((g) => g.participantGroupId === deploymentId)
          .deploymentStatus.participantStatusList.find(
            (p) => p.participantId === participantId,
          ),
      );
    }
  }, [participantGroupStatus]);

  const participantDataFromik = getParticipantDataFormik(
    study?.protocolSnapshot.expectedParticipantData
      ? study?.protocolSnapshot.expectedParticipantData.toArray()
      : [],
    initalValues,
    setParticipantData,
    participant?.assignedParticipantRoles.roleNames[0],
    setEditing,
  );

  if (studyLoading || participantDataLoading || participantGroupStatusLoading) {
    return <LoadingSkeleton />;
  }

  if (studyError || participantDataError || participantGroupStatusError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading participant data"
        error={
          studyError ?? participantDataError ?? participantGroupStatusError
        }
      />
    );
  }

  if (
    study?.protocolSnapshot.expectedParticipantData.toArray().length === 0 ||
    (study?.protocolSnapshot.expectedParticipantData.toArray().length === 1 &&
      study?.protocolSnapshot.expectedParticipantData.toArray()[0].inputDataType
        .name === "informed_consent")
  ) {
    return null;
  }

  return (
    <StyledCard elevation={2}>
      <Top>
        <Left>
          <Title variant="h3">Participant Data</Title>
          <StyledDescription variant="h5">
            Required fields are only applied if the section has any field set.
          </StyledDescription>
        </Left>
        <Right>
          <StyledDivider />
          <EditButton onClick={() => setEditing(true)}>
            <Typography variant="h6">Edit Data</Typography>
            <EditIcon fontSize="small" />
          </EditButton>
        </Right>
      </Top>
      <FormControl>
        <Stack gap={2}>
          {study?.protocolSnapshot.expectedParticipantData
            .toArray()
            .map((data) => {
              if (data.inputDataType.name === "informed_consent") return null;
              return (
                <Stack
                  direction="column"
                  gap={1}
                  alignItems="left"
                  key={data.inputDataType.name}
                  border="1px solid"
                  borderColor="#ABABAB"
                  borderRadius={2}
                  padding={2}
                >
                  <Title variant="h4" paddingBottom={2}>
                    {getInputDataName(data.inputDataType.name)}
                  </Title>
                  {CarpInputDataTypes.inputElements.get(data.inputDataType) &&
                    CarpInputDataTypes.inputElements.get(
                      data.inputDataType,
                    ) instanceof SelectOne && (
                      <FormControl>
                        <InputLabel
                          id={`${data.inputDataType.name}Label`}
                          required
                        >
                          {getInputDataName(data.inputDataType.name)}
                        </InputLabel>
                        <Select
                          disabled={!editing}
                          required
                          name={`${data.inputDataType.name}.value`}
                          value={participantDataFromik.values.sex.value ?? ""}
                          onChange={participantDataFromik.handleChange}
                          onBlur={participantDataFromik.handleBlur}
                          label={getInputDataName(data.inputDataType.name)}
                          labelId={`${data.inputDataType.name}Label`}
                        >
                          <MenuItem id="None" key="None" value={null}>
                            Clear
                          </MenuItem>
                          <Divider />
                          {(
                            CarpInputDataTypes.inputElements.get(
                              data.inputDataType,
                            ) as SelectOne
                          ).options
                            .toArray()
                            .map((option) => (
                              <MenuItem id={option} value={option} key={option}>
                                {option}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  {!CarpInputDataTypes.inputElements.get(data.inputDataType) &&
                    data.inputDataType.name &&
                    data.inputDataType.name !== "informed_consent" &&
                    getInputElement(
                      data.inputDataType.name,
                      participantDataFromik,
                      editing,
                    )}
                </Stack>
              );
            })}
          <Button
            sx={{ display: editing ? "block" : "none" }}
            type="submit"
            variant="contained"
            onClick={participantDataFromik.submitForm}
          >
            Submit
          </Button>
        </Stack>
      </FormControl>
    </StyledCard>
  );
};

export default ParticipantDataCard;
