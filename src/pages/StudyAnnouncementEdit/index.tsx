import StudyPageLayout from "@Components/Layout/StudyPageLayout";
import StudyHeader from "@Components/StudyHeader";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import DragAndDrop from "@Components/DragAndDrop";
import StudyAnnouncementPreview from "@Components/StudyAnnouncementPreview";
import { useAnnouncement, useUpdateAnnouncement } from "@Utils/queries/studies";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { StyledButton, StyledCard, StyledContainer } from "./styles";

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
  "image/bmp",
];

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  subTitle: yup.string(),
  message: yup.string().required("Message is required"),
  type: yup.string().required("Type is required"),
  url: yup.string().test("is-url-valid", "URL is not valid", (value) => {
    try {
      // eslint-disable-next-line no-new
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  }),
  image: yup
    .mixed()
    .nullable()
    .test("fileFormat", "File must be an image file", (value: File) => {
      if (typeof value === "string") return true;
      return !value || fileTypes.includes(value.type);
    })
    .test("fileSize", "File must be smaller than 8MB", (value: File) => {
      if (typeof value === "string") return true;
      if (!value) return true;
      const size = value.size / 1024 / 1024;
      return size < 8;
    }),
});

const StudyAnnouncementEdit = () => {
  const { id: studyId } = useParams();
  const { annId: studyAnnouncementId } = useParams();
  const {
    data: announcement,
    isFetched,
    isLoading,
  } = useAnnouncement(studyId, studyAnnouncementId);
  const updateAnnouncement = useUpdateAnnouncement();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      subTitle: "",
      message: "",
      type: "",
      image: null,
      url: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let newImage: File;
      if (values.image && typeof values.image !== "string") {
        newImage = values.image as File;
      }

      updateAnnouncement.mutate({
        studyId,
        announcementId: studyAnnouncementId,
        announcement: {
          id: studyAnnouncementId,
          title: values.title.trim(),
          subTitle: values.subTitle.trim(),
          message: values.message.trim(),
          type: values.type as "announcement" | "article" | "news",
          timestamp: new Date().toISOString(),
          image: values.image,
          url: values.url,
        },
        newImage,
      });
    },
  });

  useEffect(() => {
    if (announcement) {
      formik.setValues({
        title: announcement.title,
        subTitle: announcement.subTitle,
        message: announcement.message,
        type: announcement.type,
        image: announcement.image,
        url: announcement.url,
      });
    }
  }, [isFetched]);

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
    if (updateAnnouncement.isSuccess) {
      formik.resetForm();
      navigate(`/studies/${studyId}/announcements`);
    }
  }, [updateAnnouncement.isSuccess]);

  return (
    <StudyPageLayout>
      <StudyHeader
        path={["Edit announcement"]}
        description="Edit an announcement for this study"
      />
      <StyledContainer>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <StyledCard elevation={2} sx={{ flex: 2 }}>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
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
                    <MenuItem value="">
                      <em>Choose one...</em>
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
                <FormLabel>
                  Image (leave as is to keep existing image)
                </FormLabel>
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
                  disabled={formik.isSubmitting}
                >
                  {updateAnnouncement.isPending ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Edit announcement"
                  )}
                </StyledButton>
              </form>
            </StyledCard>
            <StyledCard elevation={2} sx={{ flex: 1 }}>
              <StudyAnnouncementPreview
                file={(formik.values.image as File) || announcement?.image}
                type={formik.values.type}
                title={formik.values.title}
                subTitle={formik.values.subTitle}
                message={formik.values.message}
                url={formik.values.url}
              />
            </StyledCard>
          </>
        )}
      </StyledContainer>
    </StudyPageLayout>
  );
};

export default StudyAnnouncementEdit;
