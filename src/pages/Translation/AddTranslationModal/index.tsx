import { languageLabels } from "@Assets/languageMap";
import DragAndDrop from "@Components/DragAndDrop";
import { FormLabel, Modal } from "@mui/material";
import { useCreateTranslation } from "@Utils/queries/studies";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import {
  CancelButton,
  DoneButton,
  ModalActions,
  ModalBox,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from "./styles";

interface Props {
  open: boolean;
  onClose: () => void;
}

const validationSchema = yup.object({
  language: yup.string().required("Language is required"),
  file: yup
    .mixed()
    .required("File is required")
    .test("fileSize", "File must be smaller than 8MB", (value: File) => {
      if (!value) return true;
      const size = value.size / 1024 / 1024;
      return size < 8;
    })
    .test("validJson", "Invalid JSON format", async (value: File) => {
      if (!value) return false;
      const text = await value.text();
      try {
        JSON.parse(text);
        return true;
      } catch (e) {
        return false;
      }
    }),
});

const fileTypes = ["application/json"];

const AddTranslationModal = ({ open, onClose }: Props) => {
  const { id: studyId } = useParams();
  const createTranslation = useCreateTranslation();
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      language: "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const translationString = JSON.parse(
        await (values.file as File).text(),
      ) as { [key: string]: any };
      createTranslation.mutate({
        studyId,
        translation: {
          ...translationString,
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        name: languageLabels[formik.values.language].secondary,
      });
    },
  });

  useEffect(() => {
    if (createTranslation.isSuccess) {
      onClose();
    }
  }, [createTranslation.isSuccess]);

  useEffect(() => {
    return () => {
      formik.resetForm();
    };
  }, [open]);

  const handleChange = (theFile: File) => {
    // validate file with yup, and if it passes, set it to state
    setUploading(true);
    validationSchema.fields.file
      .validate(theFile)
      .then(async () => {
        await formik.setFieldTouched("file", true);
        await formik.setFieldValue("file", theFile);
        setFileName(theFile.name);
        await formik.setFieldTouched("language", true);
      })
      .catch((err: yup.ValidationError) => {
        formik.setFieldError("file", err.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalBox sx={{ boxShadow: 24 }}>
        <ModalTitle variant="h2" id="modal-modal-title">
          Add Translation
        </ModalTitle>
        <ModalDescription variant="h5" id="modal-modal-description">
          Choose a language and upload translation file. The file must be a JSON
          file.
        </ModalDescription>
        <ModalContainer>
          <ModalContent>
            <FormLabel required>Language</FormLabel>
            <ReactFlagsSelect
              countries={[...Object.keys(languageLabels)]}
              customLabels={languageLabels}
              placeholder="Select Language"
              selected={formik.values.language}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-member-access
              onSelect={(code) => formik.setFieldValue("language", code)}
            />
            <FormLabel required>Upload Translation File</FormLabel>
            <DragAndDrop
              handleChange={handleChange}
              fileTypes={fileTypes}
              name="file"
              formik={formik}
              uploading={uploading}
              fileName={fileName}
            />
          </ModalContent>
        </ModalContainer>
        <ModalActions>
          <CancelButton variant="text" onClick={onClose}>
            Cancel
          </CancelButton>
          <DoneButton
            disabled={!formik.dirty || !formik.isValid}
            variant="contained"
            sx={{ elevation: 0 }}
            onClick={() => formik.handleSubmit()}
          >
            Add
          </DoneButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  );
};

export default AddTranslationModal;
