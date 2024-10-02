import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useProtocols } from "@Utils/queries/protocols";
import {
  useSetStudyDetails,
  useSetStudyProtocol,
  useStudyDetails,
  useStudyStatus,
} from "@Utils/queries/studies";
import { FormLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useParams } from "react-router";
import * as yup from "yup";
import StudySetupSkeleton from "../StudySetupSkeleton";
import { Heading, StyledCard, Subheading } from "../styles";

const studyDetailsValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

const studyProtocolValidationSchema = yup.object({
  protocolId: yup.string(),
});

const StudyData = () => {
  const { id: studyId } = useParams();
  const {
    data: studyDetails,
    isLoading: studyDetailsLoading,
    error: studyDetailsError,
  } = useStudyDetails(studyId);
  const {
    data: protocols,
    isLoading: protocolsLoading,
    error: protocolsError,
  } = useProtocols();
  const {
    data: studyStatus,
    isLoading: studyStatusIsLoading,
    error: studyStatusError,
  } = useStudyStatus(studyId);
  const setStudyProtocol = useSetStudyProtocol();
  const setStudyDetails = useSetStudyDetails();

  const studyDetailsFormik = useFormik({
    initialValues: {
      name: studyDetails?.name ?? "",
      description: studyDetails?.description ?? "",
    },
    validationSchema: studyDetailsValidationSchema,
    onSubmit: (values) => {
      setStudyDetails.mutate({
        studyId,
        name: values.name,
        description: values.description,
      });
    },
  });

  const studyProtocolFormik = useFormik({
    initialValues: {
      protocolId: studyDetails?.protocolSnapshot
        ? studyDetails.protocolSnapshot.id
        : "",
    },
    validationSchema: studyProtocolValidationSchema,
    onSubmit: (values) => {
      const currentProtocol = protocols.find(
        (protocol) => protocol.id.stringRepresentation === values.protocolId,
      );
      setStudyProtocol.mutate({ studyId, protocol: currentProtocol });
    },
  });

  const handleDetailsBlur = (e) => {
    studyDetailsFormik.handleBlur(e);
    studyDetailsFormik.handleSubmit();
  };

  const handleProtocolChange = (e) => {
    studyProtocolFormik.handleChange(e);
    studyProtocolFormik.handleSubmit();
  };

  if (studyDetailsLoading || protocolsLoading || studyStatusIsLoading)
    return <StudySetupSkeleton />;

  if (studyDetailsError || protocolsError || studyStatusError) {
    return (
      <CarpErrorCardComponent
        message="An error occurred while loading study details"
        error={studyStatusError ?? studyDetailsError ?? protocolsError}
      />
    );
  }

  return (
    <StyledCard elevation={2}>
      <Heading variant="h2">Study Data</Heading>
      <Subheading variant="h6">
        In order to go live you need to fill out all the required data.
      </Subheading>
      <FormLabel required>Name</FormLabel>
      <TextField
        variant="outlined"
        fullWidth
        error={!!studyDetailsFormik.errors.name}
        name="name"
        value={studyDetailsFormik.values.name}
        onChange={studyDetailsFormik.handleChange}
        helperText={
          studyDetailsFormik.touched.name && studyDetailsFormik.errors.name
        }
        onBlur={handleDetailsBlur}
      />
      <FormLabel>Description</FormLabel>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        error={!!studyDetailsFormik.errors.description}
        name="description"
        value={studyDetailsFormik.values.description}
        onChange={studyDetailsFormik.handleChange}
        helperText={
          studyDetailsFormik.touched.description &&
          studyDetailsFormik.errors.description
        }
        onBlur={handleDetailsBlur}
      />
      <FormLabel disabled={!studyStatus.canSetStudyProtocol} required>
        Protocol
      </FormLabel>
      <Select
        disabled={!studyStatus.canSetStudyProtocol}
        variant="outlined"
        fullWidth
        error={!!studyProtocolFormik.errors.protocolId}
        name="protocolId"
        value={studyProtocolFormik.values.protocolId}
        onChange={handleProtocolChange}
      >
        {protocols?.map((protocol) => (
          <MenuItem
            key={protocol.id.stringRepresentation}
            value={protocol.id.stringRepresentation}
          >
            {protocol.name}
          </MenuItem>
        ))}
      </Select>
    </StyledCard>
  );
};

export default StudyData;
