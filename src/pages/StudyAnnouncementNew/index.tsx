import DragAndDrop from "@Components/DragAndDrop";
import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import { useCreateAnnouncement } from "@Utils/queries/studies";
import carpCommon from "@cachet/carp-common";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import StudyAnnouncementPreview from "../../components/StudyAnnouncementPreview";
import { StyledContainer } from "../Studies/StudiesSection/styles";
import { ContainerRight, StyledButton, StyledCard } from "./styles";

const { UUID } = carpCommon.dk.cachet.carp.common.application;

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
  "image/bmp",
];

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  subTitle: yup.string(),
  message: yup.string().required("Message is required"),
  type: yup.string().required("Type is required"),
  url: yup.string().test("is-url-valid", "URL is not valid", (value) => {
    try {
      // eslint-disable-next-line no-new
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }),
  image: yup
    .mixed()
    .nullable()
    .test(
      "fileFormat",
      "File must be an image file",
      (value: File) => !value || fileTypes.includes(value.type),
    )
    .test("fileSize", "File must be smaller than 8MB", (value: File) => {
      if (!value) return true;
      const size = value.size / 1024 / 1024;
      return size < 8;
    }),
});

const StudyAnnouncementNew = () => {
  const { id: studyId } = useParams();
  const createAnnouncement = useCreateAnnouncement();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      subTitle: "",
      message: "",
      type: "",
      url: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      createAnnouncement.mutate({
        studyId,
        announcement: {
          id: UUID.Companion.randomUUID().toString(),
          title: values.title.trim(),
          subTitle: values.subTitle.trim(),
          message: values.message.trim(),
          type: values.type as "announcement" | "article" | "news",
          timestamp: new Date().toISOString(),
          image: values.image,
          url: values.url.trim(),
        },
        image: values.image,
      });
    },
  });

  const handleChange = (theFile: File) => {
    if (!theFile) {
      formik.setFieldValue("image", null);
      return;
    }
    setUploading(true);
    formik.setFieldValue("image", theFile);
    setFileName(theFile.name);
    setUploading(false);
  };

  useEffect(() => {
    if (createAnnouncement.isSuccess) {
      formik.resetForm();
      navigate(`/studies/${studyId}/announcements`);
    }
  }, [createAnnouncement.isSuccess]);

  return (
    <StudyPageLayout>
      <StudyHeader
        path={["New announcement"]}
        description="Create an announcement for this study"
      />
      <StyledContainer sx={{ flexDirection: "row" }}>
        <StyledCard elevation={2} sx={{ flex: 0.66 }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              sx={{ minWidth: 120 }}
              error={formik.touched.type && !!formik.errors.type}
            >
              <FormLabel required>Announcement type</FormLabel>
              <Select
                value={formik.values.type}
                error={formik.touched.type && !!formik.errors.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="type"
                displayEmpty
                required
              >
                <MenuItem disabled value="">
                  Choose one...
                </MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="article">Article</MenuItem>
                <MenuItem value="news">News</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <FormHelperText error>{formik.errors.type}</FormHelperText>
              )}
            </FormControl>
            <FormLabel required>Title</FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              error={formik.touched.title && !!formik.errors.title}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              helperText={formik.touched.title && formik.errors.title}
              onBlur={formik.handleBlur}
            />
            <FormLabel>Subtitle</FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              name="subTitle"
              value={formik.values.subTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormLabel>URL</FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              name="url"
              value={formik.values.url}
              error={formik.touched.url && !!formik.errors.url}
              helperText={formik.touched.url && formik.errors.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormLabel required>Message</FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              error={formik.touched.message && !!formik.errors.message}
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              helperText={formik.touched.message && formik.errors.message}
              onBlur={formik.handleBlur}
            />
            <FormLabel>Image</FormLabel>
            <DragAndDrop
              handleChange={handleChange}
              uploading={uploading}
              name="image"
              formik={formik}
              fileName={fileName}
              fileTypes={fileTypes}
            />
            <StyledButton
              variant="contained"
              onClick={() => formik.handleSubmit()}
              disabled={createAnnouncement.isPending}
            >
              {createAnnouncement.isPending ? (
                <CircularProgress size={16} />
              ) : (
                "Create announcement"
              )}
            </StyledButton>
          </form>
        </StyledCard>
        <ContainerRight>
          <Typography variant="h2" mb={2} sx={{ textAlign: "center" }}>
            Preview
          </Typography>
          <StyledCard elevation={2}>
            <StudyAnnouncementPreview
              file={formik.values.image as File}
              type={formik.values.type}
              title={formik.values.title}
              subTitle={formik.values.subTitle}
              message={formik.values.message}
              url={formik.values.url}
            />
          </StyledCard>
        </ContainerRight>
      </StyledContainer>
    </StudyPageLayout>
  );
};

export default StudyAnnouncementNew;
