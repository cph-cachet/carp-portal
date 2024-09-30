import CarpErrorCardComponent from "@Components/CarpErrorCardComponent";
import { useParams } from "react-router-dom";
import CarpAccordion from "@Components/CarpAccordion";
import { Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { ConsentResponse } from "@carp-dk/client";
import { useGetParticipantData } from "@Utils/queries/participants";
import LoadingSkeleton from "../LoadingSkeleton";
import { DownloadButton, NameContainer } from "./styles";

interface FileInfo {
  data: string;
  fileName: string;
  fileType: string;
}

const InformedConsent = () => {
  const { deploymentId } = useParams(); // need to somehow get the role
  const { t } = useTranslation();

  const {
    data: consents,
    isLoading,
    error,
  } = useGetParticipantData(deploymentId);

  const downloadFile = ({ data, fileName, fileType }: FileInfo) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToJson = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    consent: ConsentResponse,
  ) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(consent),
      fileName: "informedConsent.json",
      fileType: "text/json",
    });
  };

  // const dateOfLastUpdate = useMemo(() => {
  //   if (consent) {
  //     return `Last Updated: ${formatDateTime(consent.updated_at, {
  //       year: "numeric",
  //       month: "numeric",
  //       day: "numeric",
  //     })}`;
  //   }
  //   return "Informed consent not found";
  // }, [consent]);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <CarpErrorCardComponent
        message={t("error.informed_consents")}
        error={error}
      />
    );
  }
  console.log(consents);
  return (
    <CarpAccordion title={t("deployment:informed_consents_card.title")}>
      {consents &&
        consents.map((c) => {
          return (
            <>
              <NameContainer>
                {c.created_by && (
                  <>
                    <PersonIcon fontSize="small" />
                    <Typography variant="h6">{c.created_by}</Typography>
                  </>
                )}
              </NameContainer>
              <>
                <i>
                  <Typography variant="h6">
                    {t("common:last_uploaded", { date: c.updated_at })}
                  </Typography>
                </i>
                <DownloadButton onClick={(e) => exportToJson(e, c)}>
                  <Typography variant="h6">
                    {t("common:export_data")}
                  </Typography>
                </DownloadButton>
              </>
            </>
          );
        })}
    </CarpAccordion>
  );
};

export default InformedConsent;
