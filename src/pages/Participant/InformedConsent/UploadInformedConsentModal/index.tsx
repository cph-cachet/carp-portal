import DragAndDrop from "@Components/DragAndDrop";
import { Modal } from "@mui/material";
import { useFormik } from "formik";
import { useCreateFile } from "@Utils/queries/studies";
import { useParams } from "react-router";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import {
  ModalBox,
  ModalTitle,
  ModalDescription,
  ModalContainer,
  ModalContent,
  ModalActions,
  CancelButton,
  DoneButton,
} from "./styles";

type Props = {
  open: boolean;
  onClose: () => void;
};

const fileTypes = ["application/pdf", "image/"];

const consentSchema = yup.object({
  file: yup
    .mixed()
    .required("Required")
    .test("fileSize", "File must be smaller than 20MB", (value: File) => {
      if (!value) return true;
      const size = value.size / 1024 / 1024;
      return size < 20;
    })
    .test("fileType", "Invalid file type", (value: File) => {
      if (!value) return true;
      if (value.type === "application/pdf") return true;
      return value.type.startsWith("image/");
    }),
});

const UploadInformedConsentModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { participantId, id: studyId } = useParams();

  const uploading = false;
  const createFile = useCreateFile();

  const addInformedConsentFormik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: consentSchema,
    onSubmit: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append(
        "metadata",
        JSON.stringify({
          "content-type": file.type,
          "document-type": "informed_consent",
          "participant-id": participantId,
        }),
      );
      await createFile.mutateAsync({
        studyId,
        formData,
      });
      addInformedConsentFormik.resetForm();
      onClose();
    },
  });

  const closeModal = () => {
    addInformedConsentFormik.resetForm();
    onClose();
  };

  const handleChange = (file: File) => {
    addInformedConsentFormik.setFieldValue("file", file);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={onClose}
    >
      <ModalBox sx={{ boxShadow: 24 }}>
        <ModalTitle variant="h2" id="modal-modal-title">
          {t("participant:informed_consent.upload.title")}
        </ModalTitle>
        <ModalDescription variant="h5" id="modal-modal-description">
          {t("participant:informed_consent.upload.description")}
        </ModalDescription>
        <ModalContainer>
          <ModalContent fixHeight>
            <DragAndDrop
              handleChange={handleChange}
              fileTypes={fileTypes}
              name="file"
              formik={addInformedConsentFormik as any}
              uploading={uploading}
              fileName={addInformedConsentFormik.values.file?.name}
            />
          </ModalContent>
        </ModalContainer>
        <ModalActions>
          <CancelButton variant="text" onClick={closeModal}>
            {t("common:cancel")}
          </CancelButton>
          <DoneButton
            disabled={
              !addInformedConsentFormik.dirty ||
              !addInformedConsentFormik.isValid
            }
            variant="contained"
            sx={{ elevation: 0 }}
            onClick={() => addInformedConsentFormik.handleSubmit()}
          >
            {t("common:add")}
          </DoneButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  );
};

export default UploadInformedConsentModal;
