import { useGenerateAnonymousAccounts } from "@Utils/queries/participants";
import { useStudyDetails } from "@Utils/queries/studies";
import { FormLabel, Grid, MenuItem, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enGB } from "date-fns/locale/en-GB";
import { useFormik } from "formik";
import { FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  CancelButton,
  DoneButton,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalTitle,
  SecondaryCellText,
  Spinner,
} from "../styles";

type Props = {
  open: boolean;
  onClose: () => void;
};

const validationSchema = yup.object({
  numberOfParticipants: yup
    .number()
    .required("Number of participants is required")
    .min(1, "Number of participants must be at least 1")
    .max(2500, "Number of participants must be at most 2500"),
  expiryDate: yup
    .date()
    .required("Expiry date is required")
    .min(
      new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      "Expiry date should be in the future",
    ),
  role: yup.string().required("Role is required"),
  redirectUri: yup
    .string()
    .test("is-url", "Redirect URI must be a valid URL", (value) => {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch {
        return false;
      }
      return true;
    })
    .required("Redirect URI is required"),
});

const AddAnonymousParticipantsContent = ({ open, onClose }: Props) => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();

  const { data: studyDetails, isLoading: isStudyDetailsLoading } =
    useStudyDetails(studyId);
  const generateAnonymousAccounts = useGenerateAnonymousAccounts(studyId);

  const addAnonymousParticipantFormik = useFormik({
    initialValues: {
      numberOfParticipants: 0,
      expiryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      role: "",
      redirectUri: "",
    },
    validationSchema,
    onSubmit: (values) => {
      generateAnonymousAccounts.mutate({
        participantRoleName: values.role,
        expirationSeconds: Math.floor(
          (values.expiryDate.getTime() - new Date().getTime()) / 1000,
        ),
        amountOfAccounts: values.numberOfParticipants,
        redirectUri: values.redirectUri.toString(),
      });
    },
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAnonymousParticipantFormik.handleSubmit();
  };

  useEffect(() => {
    return () => {
      addAnonymousParticipantFormik.resetForm();
    };
  }, [open]);

  useEffect(() => {
    if (generateAnonymousAccounts.isSuccess) {
      onClose();
      navigate(`/studies/${studyId}/export`);
    }
  }, [generateAnonymousAccounts.isSuccess]);

  if (isStudyDetailsLoading) return null;

  if (!studyDetails.protocolSnapshot) {
    return (
      <>
        <ModalTitle variant="h2" id="modal-modal-title">
          Generate participant invitation links
        </ModalTitle>
        <ModalDescription variant="h6" id="modal-modal-description">
          In order to invite anonymous participants to your study, you must set
          a protocol
        </ModalDescription>
        <ModalActions>
          <CancelButton variant="text" onClick={onClose}>
            Close
          </CancelButton>
        </ModalActions>
      </>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <ModalTitle variant="h2" id="modal-modal-title">
        Generate participant invitation links
      </ModalTitle>
      <ModalDescription variant="h6" id="modal-modal-description">
        Enter the details of how mow many accounts to generate.
      </ModalDescription>
      <ModalContent>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={4} align-item="center">
            <Grid item xs={6}>
              <FormLabel required>Number of participants (max: 1000)</FormLabel>
              <TextField
                autoFocus
                sx={{ width: "100%" }}
                error={
                  !!addAnonymousParticipantFormik.errors.numberOfParticipants
                }
                variant="outlined"
                name="numberOfParticipants"
                type="number"
                value={
                  addAnonymousParticipantFormik.values.numberOfParticipants
                }
                onChange={addAnonymousParticipantFormik.handleChange}
                helperText={
                  addAnonymousParticipantFormik.touched.numberOfParticipants &&
                  addAnonymousParticipantFormik.errors.numberOfParticipants
                }
                onBlur={addAnonymousParticipantFormik.handleBlur}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel required>Role</FormLabel>
              <TextField
                select
                sx={{ width: "100%" }}
                variant="outlined"
                id="role-select"
                name="role"
                error={!!addAnonymousParticipantFormik.errors.role}
                onBlur={addAnonymousParticipantFormik.handleBlur}
                helperText={addAnonymousParticipantFormik.errors.role}
                value={addAnonymousParticipantFormik.values.role}
                onChange={addAnonymousParticipantFormik.handleChange}
              >
                {studyDetails.protocolSnapshot.participantRoles
                  .toArray()
                  .map((participantRole) => (
                    <MenuItem
                      key={participantRole.role}
                      value={participantRole.role}
                    >
                      <SecondaryCellText variant="h5">
                        {participantRole.role}
                      </SecondaryCellText>
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <FormLabel required>Expiry date</FormLabel>
              <DatePicker
                defaultValue={addAnonymousParticipantFormik.values.expiryDate}
                name="expiryDate"
                value={addAnonymousParticipantFormik.values.expiryDate}
                onChange={(value) =>
                  addAnonymousParticipantFormik.setFieldValue(
                    "expiryDate",
                    value,
                  )
                }
                slotProps={{
                  textField: {
                    error: !!addAnonymousParticipantFormik.errors.expiryDate,
                    helperText: addAnonymousParticipantFormik.errors
                      .expiryDate as string,
                    onBlur: addAnonymousParticipantFormik.handleBlur,
                    fullWidth: true,
                  },
                }}
                disablePast
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel required>Redirect URI</FormLabel>
              <TextField
                sx={{ width: "100%" }}
                error={!!addAnonymousParticipantFormik.errors.redirectUri}
                variant="outlined"
                name="redirectUri"
                type="url"
                value={addAnonymousParticipantFormik.values.redirectUri}
                onChange={addAnonymousParticipantFormik.handleChange}
                helperText={
                  addAnonymousParticipantFormik.touched.redirectUri &&
                  addAnonymousParticipantFormik.errors.redirectUri
                }
                onBlur={addAnonymousParticipantFormik.handleBlur}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </form>
      </ModalContent>
      <ModalActions>
        <CancelButton variant="text" onClick={onClose}>
          Cancel
        </CancelButton>
        {generateAnonymousAccounts.isPending ? (
          <DoneButton variant="contained" sx={{ elevation: 0 }} type="submit">
            <Spinner size={20} />
          </DoneButton>
        ) : (
          <DoneButton
            disabled={
              !addAnonymousParticipantFormik.dirty ||
              !addAnonymousParticipantFormik.isValid
            }
            variant="contained"
            sx={{ elevation: 0 }}
            type="submit"
            onClick={() => addAnonymousParticipantFormik.handleSubmit()}
          >
            Add
          </DoneButton>
        )}
      </ModalActions>
    </LocalizationProvider>
  );
};

export default AddAnonymousParticipantsContent;
