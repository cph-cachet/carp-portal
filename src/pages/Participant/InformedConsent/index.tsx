/* eslint-disable no-underscore-dangle */
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { convertICToReactPdf, formatDateTime } from "@Utils/utility";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetParticipantData,
  useParticipantGroupsAccountsAndStatus,
} from "@Utils/queries/participants";
import { pdf } from "@react-pdf/renderer";
import { useDownloadFile, useGetFiles } from "@Utils/queries/studies";
import { CarpFile } from "@carp-dk/client/models/CarpFile";
import { useTranslation } from "react-i18next";
import LoadingSkeleton from "../LoadingSkeleton";
import {
  ActionButton,
  LastUploadText,
  Right,
  StyledCard,
  StyledDivider,
  Title,
} from "./styles";
import UploadInformedConsentModal from "./UploadInformedConsentModal";

const InformedConsent = () => {
  const { t } = useTranslation();
  const { participantId, deploymentId, id: studyId } = useParams();

  const {
    data: participantData,
    isLoading,
    error,
  } = useGetParticipantData(deploymentId);
  const [consent, setConsent] = useState(null);
  const {
    data: participantGroupStatus,
    isLoading: participantGroupStatusLoading,
    error: participantGroupStatusError,
  } = useParticipantGroupsAccountsAndStatus(studyId);
  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = useGetFiles(studyId);
  const [consentFile, setConsentFile] = useState<CarpFile>(null);
  const downloadFileMutation = useDownloadFile(studyId);

  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    setOpen(false);
  };

  const downloadPdf = async () => {
    const blob = await pdf(
      await convertICToReactPdf(JSON.parse(consent.consent)),
    ).toBlob();
    const a = document.createElement("a");
    a.download = "informedConsent.pdf";
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const downloadFile = async () => {
    await downloadFileMutation.mutateAsync(consentFile);
  };

  useEffect(() => {
    if (files) {
      const c = files
        .sort((a, b) => {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        })
        .find((f) => {
          return (
            f.metadata["document-type"] === "informed_consent" &&
            f.metadata["participant-id"] === participantId
          );
        });
      if (c) {
        setConsentFile(c);
      }
    }
  }, [files]);

  useEffect(() => {
    if (!isLoading && !participantGroupStatusLoading) {
      const participant = participantGroupStatus.groups
        .find((g) => g.participantGroupId === deploymentId)
        .deploymentStatus.participantStatusList.find(
          (p) => p.participantId === participantId,
        );

      if (participantData.common.keys) {
        const consentData = participantData.common.values
          .toArray()
          .find((v) =>
            (v as unknown as any)?.__type.includes("informed_consent"),
          );
        setConsent(consentData);
      }

      const participantRoleData = (
        participantData.roles as any as Array<any>
      ).find(
        (v) => v.roleName === participant.assignedParticipantRoles.roleNames[0],
      );
      if (participantRoleData) {
        const roleConsent = Object.values(participantRoleData.data).find(
          (value) =>
            (value as unknown as any)?.__type.includes("informed_consent"),
        );
        setConsent(roleConsent);
      }
    }
  }, [participantGroupStatus, participantData]);

  const dateOfLastUpdateForParticipantData = useMemo(() => {
    if (consent) {
      return t("participant:informed_consent.participant_data_upload_date", {
        date: formatDateTime(consent.signedTimestamp, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      });
    }
    return t("participant:informed_consent.data_not_found");
  }, [consent]);

  const dateOfLastUpdateForUploadedFile = useMemo(() => {
    if (consentFile) {
      return t("participant:informed_consent.file_upload_date", {
        date: formatDateTime(consentFile.created_at, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      });
    }
    return t("participant:informed_consent.file_not_found");
  }, [consentFile]);

  if (isLoading || filesLoading || participantGroupStatusLoading)
    return <LoadingSkeleton />;

  if (error || participantGroupStatusError || filesError) {
    return (
      <CarpErrorCardComponent
        message={t("error:informed_consents")}
        error={error ?? participantGroupStatusError ?? filesError}
      />
    );
  }

  return (
    <>
      <UploadInformedConsentModal open={open} onClose={onModalClose} />
      <StyledCard elevation={2}>
        <Title variant="h3">{t("participant:informed_consent.title")}</Title>
        <Right>
          <Stack direction="column" alignItems="flex-start">
            <Stack
              display="grid"
              direction="row"
              alignItems="center"
              gridTemplateColumns="310px 20px 100px 100px"
            >
              <LastUploadText variant="h6" textAlign="end">
                {dateOfLastUpdateForUploadedFile}
              </LastUploadText>
              <StyledDivider />
              <ActionButton onClick={() => setOpen(true)}>
                <Typography variant="h6">{t("common:upload")}</Typography>
                <FileUploadOutlinedIcon fontSize="small" />
              </ActionButton>
              {consentFile && (
                <ActionButton onClick={() => downloadFile()}>
                  <Typography variant="h6">{t("common:download")}</Typography>
                  <FileDownloadOutlinedIcon fontSize="small" />
                </ActionButton>
              )}
            </Stack>
            <Stack
              display="grid"
              direction="row"
              alignItems="center"
              gridTemplateColumns="310px 20px 100px 100px"
            >
              <LastUploadText variant="h6" textAlign="end">
                {dateOfLastUpdateForParticipantData}
              </LastUploadText>
              {consent && <StyledDivider />}
              {consent && (
                <ActionButton onClick={() => downloadPdf()}>
                  <Typography variant="h6">{t("common:export")}</Typography>
                  <FileDownloadOutlinedIcon fontSize="small" />
                </ActionButton>
              )}
            </Stack>
          </Stack>
        </Right>
      </StyledCard>
    </>
  );
};

export default InformedConsent;
