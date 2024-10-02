import ecgHeartIcon from "@Assets/images/ecg_heart.png";
import { Day, Record } from "@Components/RecentDataChart";
import { customPalette as palette } from "@Utils/theme";
import carpCommon from "@cachet/carp-common";
import { kotlinx } from "@cachet/carp-kotlinx-serialization";
import carpProtocols from "@cachet/carp-protocols-core";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import CloudIcon from "@mui/icons-material/Cloud";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import HearingRoundedIcon from "@mui/icons-material/HearingRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PublicIcon from "@mui/icons-material/Public";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import WatchRoundedIcon from "@mui/icons-material/WatchRounded";

import getSerializer = kotlinx.serialization.getSerializer;
import DefaultSerializer = carpCommon.dk.cachet.carp.common.infrastructure.serialization.JSON;

type StudyProtocolSnapshotType =
  carpProtocols.dk.cachet.carp.protocols.application.StudyProtocolSnapshot;
const { StudyProtocolSnapshot } =
  carpProtocols.dk.cachet.carp.protocols.application;

type Json = kotlinx.serialization.json.Json;
const dataLegendColors = {
  activity: "#245B78",
  airquality: "#B26101",
  ambientlight: "#374953",
  batterystate: "#BA1A1A",
  coverage: "#D6E8F4",
  deviceinformation: "#67587A",
  freememory: "#76777A",
  location: "#D61D41",
  screenevent: "#A61A41",
  stepcount: "#A7517A",
  triggeredtask: "#1A111A",
};

export const calculateDaysPassedFromDate = (dateString: string) => {
  const givenDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysPassed;
};

export const formatDateTime = (
  dateString: number | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
) => {
  const date = new Date(dateString);
  return `${date.toLocaleString("en-GB", options)}`;
};

export const formatDate = (dateString: number | string) => {
  const date = new Date(dateString);
  let formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  if (date.getFullYear() !== new Date().getFullYear()) {
    const year = date.toLocaleString("en-US", { year: "numeric" });
    formattedDate += ` ${year}`;
  }
  return formattedDate;
};

export const msToDays = (ms: number) => Math.floor(ms / (1000 * 60 * 60 * 24));

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getDeviceIcon = (deviceType: string, isBlue?: boolean) => {
  switch (deviceType) {
    case "dk.cachet.carp.common.application.devices.Button":
      return (
        <RadioButtonCheckedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.EmbracePlus":
      return (
        <WatchRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.Sens":
      return (
        <TimelineRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.HealthService":
      return (
        <HealthAndSafetyRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.MovesenseDevice":
      return (
        <img src={ecgHeartIcon} width="20px" height="20px" alt="heart icon" />
      );
    case "dk.cachet.carp.common.application.devices.Smartphone":
      return <SmartphoneIcon color="inherit" fontSize="small" />;
    case "dk.cachet.carp.common.application.devices.PersonalComputer":
      return (
        <ComputerRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.LocationService":
      return (
        <LocationOnIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.WeatherService":
      return (
        <CloudIcon color={isBlue ? "primary" : "inherit"} fontSize="small" />
      );
    case "dk.cachet.carp.common.application.devices.AirQualityService":
      return (
        <AirRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.ESenseDevice":
      return (
        <HearingRoundedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.PolarDevice":
      return (
        <MonitorHeartOutlinedIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
    case "dk.cachet.carp.common.application.devices.WebBrowser":
      return (
        <PublicIcon color={isBlue ? "primary" : "inherit"} fontSize="small" />
      );
    default:
      return (
        <DeviceHubIcon
          color={isBlue ? "primary" : "inherit"}
          fontSize="small"
        />
      );
  }
};

export const getDataColor = (dataType: string) => {
  switch (dataType) {
    case "activity":
      return dataLegendColors.activity;
    case "airquality":
      return dataLegendColors.airquality;
    case "ambientlight":
      return dataLegendColors.ambientlight;
    case "batterystate":
      return dataLegendColors.batterystate;
    case "coverage":
      return dataLegendColors.coverage;
    case "deviceinformation":
      return dataLegendColors.deviceinformation;
    case "freememory":
      return dataLegendColors.freememory;
    case "location":
      return dataLegendColors.location;
    case "screenevent":
      return dataLegendColors.screenevent;
    case "stepcount":
      return dataLegendColors.stepcount;
    case "triggeredtask":
      return dataLegendColors.triggeredtask;
    default:
      return "#000000";
  }
};

export const getDeviceStatusColor = (deviceStatus: string) => {
  switch (deviceStatus) {
    case "Registered":
      return palette.status.yellow;
    case "Unregistered":
      return palette.status.purple;
    case "Deployed":
      return palette.status.green;
    case "NeedsRedeployment":
      return palette.status.red;
    default:
      return "#000000";
  }
};

export const getDeploymentStatusColor = (deploymentStatus: string) => {
  switch (deploymentStatus) {
    case "Invited":
      return palette.status.yellow;
    case "Running":
      return palette.status.green;
    case "Stopped":
      return palette.status.grey;
    case "Deploying":
      return palette.status.blue;
    default:
      return "#000000";
  }
};

export const getSummaryStatusColor = (deploymentStatus: string) => {
  switch (deploymentStatus) {
    case "AVAILABLE":
      return palette.status.green;
    case "IN_PROGRESS":
      return palette.status.yellow;
    case "ERROR":
      return palette.status.red;
    default:
      return "#000000";
  }
};

export const getStudyStatusColor = (studyStatus: string) => {
  switch (studyStatus) {
    case "Ready":
      return palette.status.yellow;
    case "Live":
      return palette.status.green;
    case "Draft":
      return palette.status.purple;
    default:
      return "#000000";
  }
};

export const getMaxDatapoints = (days?: Day[]): number => {
  if (!days) return 0;
  return Math.max(
    ...days.map((day) =>
      day.data.reduce((a: number, b: Record) => a + b.numberOfDatapoints, 0),
    ),
  );
};

export const downloadProtocolAsJSONFile = (
  protocol: StudyProtocolSnapshotType,
) => {
  const json: Json = DefaultSerializer;
  const serializer = getSerializer(StudyProtocolSnapshot);
  const jsonToDownload = json.encodeToString(serializer, protocol);
  const file = new Blob([jsonToDownload], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `${protocol.name}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getParticipantDataName = (dataType: string) => {
  switch (dataType) {
    case "dk.cachet.carp.input.sex":
      return "Biological sex";
    case "dk.cachet.carp.input.consent":
      return "Informed Consent";
    case "dk.cachet.carp.input.name":
      return "Full name";
    case "dk.cachet.carp.input.address":
      return "Full address";
    case "dk.cachet.carp.input.diagnosis":
      return "Diagnosis (ICD-11)";
    case "dk.cachet.carp.input.ssn":
      return "Social Security Number";
    default:
      return "";
  }
};
