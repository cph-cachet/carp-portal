/* eslint-disable no-underscore-dangle */
import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParams } from "react-router-dom";
import CarpAccordion from "@Components/CarpAccordion";
import { Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { ParticipantData } from "@carp-dk/client";
import {
  useGetParticipantData,
  useParticipantGroupsAccountsAndStatus,
} from "@Utils/queries/participants";
import { useEffect, useState } from "react";
import { InformedConsent } from "@carp-dk/client/models/InputDataTypes";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { convertICToReactPdf, formatDateTime } from "@Utils/utility";
import { pdf } from "@react-pdf/renderer";
import {
  DownloadButton,
  LastUploadText,
  NameContainer,
  NotRegistedText,
  Right,
  StyledStack,
} from "./styles";
import LoadingSkeleton from "../LoadingSkeleton";

const InformedConsentCard = () => {
  const { t } = useTranslation();
  const { id: studyId, deploymentId } = useParams();

  const {
    data: statuses,
    isLoading: statusesLoading,
    error: statusesError,
  } = useParticipantGroupsAccountsAndStatus(studyId);

  const {
    data: participantData,
    isLoading: participatnDataLoading,
    error: participantDataError,
  } = useGetParticipantData(deploymentId);
  const [consents, setConsents] =
    useState<{ participant: ParticipantData; consent: InformedConsent }[]>();

  const downloadPdf = async (consent: InformedConsent) => {
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

  useEffect(() => {
    if (statuses && participantData) {
      const participantGroup = statuses.groups.find(
        (s) => s.participantGroupId === deploymentId,
      );
      const commonConsent = participantData.common.values
        ?.toArray()
        .find((v) => {
          if (!v) return false;
          return ((v as any).__type as string).includes("informed_consent");
        });
      const roleConsents = (participantData.roles as any as Array<any>).map(
        (v) => {
          const c =
            v.data[
              Object.keys(v.data).find((key) => {
                return key.includes("informed_consent");
              })
            ];
          return { v, c };
        },
      );

      const participantsWithConsent = participantGroup.participants.map((p) => {
        const consent = roleConsents.find((rc) =>
          p.role.localeCompare(rc.v.roleName),
        );
        if (consent) return { participant: p, consent: consent.c };
        if (commonConsent) return { participant: p, consent: commonConsent };
        return { participant: p, consent: null };
      });
      setConsents(participantsWithConsent);
    }
  }, [statuses, deploymentId, participantData]);

  if (participatnDataLoading || statusesLoading) return <LoadingSkeleton />;

  if (participantDataError || statusesError) {
    return (
      <CarpErrorCardComponent
        message={t("error:informed_consents")}
        error={participantDataError ?? statusesError}
      />
    );
  }

  if (!consents) return null;

  return (
    <CarpAccordion title={t("deployment:informed_consents_card.title")}>
      <Stack gap="16px">
        {consents.map(({ participant, consent }) => {
          return (
            <StyledStack key={participant.participantId} direction="row">
              <Stack direction="row" gap="4px">
                <PersonIcon fontSize="small" />
                <NameContainer>
                  {(participant.firstName && participant.lastName && (
                    <Typography variant="h4">{`${participant.firstName} ${participant.lastName}`}</Typography>
                  )) || (
                    <Typography variant="h4">
                      {participant.participantId}
                    </Typography>
                  )}
                </NameContainer>
              </Stack>
              {consent && (
                <Right>
                  <i>
                    <LastUploadText variant="h5">
                      {t("common:last_uploaded", {
                        date: formatDateTime(
                          consent.signedTimestamp.toString(),
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          },
                        ),
                      })}
                    </LastUploadText>
                  </i>
                  <DownloadButton onClick={() => downloadPdf(consent)}>
                    <FileDownloadOutlinedIcon />
                    <Typography variant="h6">
                      {t("common:export_data")}
                    </Typography>
                  </DownloadButton>
                </Right>
              )}
              {!consent && (
                <NotRegistedText variant="h6">
                  {t("deployment:informed_consents_card.not_registered")}
                </NotRegistedText>
              )}
            </StyledStack>
          );
        })}
      </Stack>
    </CarpAccordion>
  );
};

export default InformedConsentCard;
