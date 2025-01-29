import carpApi from "@Utils/api/api";
import { useSnackbar } from "@Utils/snackbar";
import carpProtocols from "@cachet/carp-protocols-core";
import carpStudies from "@cachet/carp-studies-core";
import { getConfig } from "@carp-dk/authentication-react";

import {
  CarpServiceError,
  Collection,
  Export,
  MessageData,
  ResourceData,
  StudyOverview,
  User,
  CarpFile,
} from "@carp-dk/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./auth";

type StudyProtocolSnapshotType =
  carpProtocols.dk.cachet.carp.protocols.application.StudyProtocolSnapshot;

type StudyStatus = carpStudies.dk.cachet.carp.studies.application.StudyStatus;
type StudyDetails = carpStudies.dk.cachet.carp.studies.application.StudyDetails;
type StudyDescriptionUpdateParams = {
  studyId: string;
  description: string;
  name: string;
};
type StudyDetailsUpdateParams = {
  studyId: string;
  description: string;
  name: string;
};
type StudyCreationParams = {
  description: string;
  name: string;
};
type SummaryCreationParams = {
  studyId: string;
  deploymentIds?: string[];
};

export const useStudies = () => {
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  return useQuery<StudyOverview[], CarpServiceError, StudyOverview[], any>({
    queryFn: () => carpApi.getStudiesOverview(getConfig()),
    queryKey: ["studies"],
    enabled: currentUser !== undefined && !isCurrentUserLoading,
  });
};

export const useSetStudyDescription = (
  setDescription: (description: string) => void,
  setInEdit: (inEdit: boolean) => void,
) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StudyDescriptionUpdateParams) => {
      await carpApi.setInternalDescription_CORE(
        params.studyId,
        params.name,
        params.description,
        getConfig(),
      );
      return params;
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({
        queryKey: ["studyDetails", params.studyId],
      });
      const previousValue: StudyDetails = queryClient.getQueryData([
        "studyDetails",
        params.studyId,
      ]);
      queryClient.setQueryData(["studyDetails", params.studyId], {
        ...previousValue,
        description: params.description,
      });
      return { previousValue };
    },
    onSuccess: (data) => {
      setSnackbarSuccess("Study description updated");
      setDescription(data.description);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["studyDetails", data.studyId],
      });
      setInEdit(false);
    },
    onError: (error: CarpServiceError, params, context) => {
      setSnackbarError(error.httpResponseMessage);
      queryClient.setQueryData(
        ["studyDetails", params.studyId],
        context.previousValue,
      );
      setDescription(context.previousValue.description);
    },
  });
};

export const useSetStudyDetails = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StudyDetailsUpdateParams) => {
      return carpApi.setInternalDescription_CORE(
        params.studyId,
        params.name,
        params.description,
        getConfig(),
      );
    },
    onSuccess: (_, data: StudyDetailsUpdateParams) => {
      setSnackbarSuccess("Updated study details!");
      queryClient.invalidateQueries({
        queryKey: ["studyDetails", data.studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studyStatus", data.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useCreateStudy = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: async (params: StudyCreationParams) => {
      return carpApi.createStudy_CORE(
        currentUser.accountId.stringRepresentation,
        params.name,
        params.description,
        getConfig(),
      );
    },
    onSuccess: () => {
      setSnackbarSuccess("Study created successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useStudyStatus = (studyId: string) => {
  return useQuery<StudyStatus, CarpServiceError, StudyStatus, any>({
    queryFn: () => carpApi.getStudyStatus_CORE(studyId, getConfig()),
    queryKey: ["studyStatus", studyId],
  });
};

export const useStudyDetails = (studyId: string) => {
  return useQuery<StudyDetails, CarpServiceError, StudyDetails, any>({
    queryFn: () => carpApi.getStudyDetails_CORE(studyId, getConfig()),
    queryKey: ["studyDetails", studyId],
    retry: 1,
  });
};

export const useResearchers = (studyId: string) => {
  return useQuery<User[], CarpServiceError, User[], any>({
    queryFn: async () => {
      return carpApi.getResearchersForStudy(studyId, getConfig());
    },
    queryKey: ["researchers", studyId],
  });
};

export const useSetStudyProtocol = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studyId: string;
      protocol: StudyProtocolSnapshotType;
    }) => {
      return carpApi.setProtocol_CORE(data.studyId, data.protocol, getConfig());
    },
    onSuccess: (_, data) => {
      setSnackbarSuccess("Updated protocol!");
      queryClient.invalidateQueries({
        queryKey: ["studyDetails", data.studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studyStatus", data.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useSetStudyInvitation = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studyId: string;
      invitationName: string;
      invitationDescription: string;
    }) => {
      return carpApi.setInvitation_CORE(
        data.studyId,
        data.invitationName,
        data.invitationDescription,
        getConfig(),
      );
    },
    onSuccess: (_, data) => {
      setSnackbarSuccess("Updated study invitation details!");
      queryClient.invalidateQueries({
        queryKey: ["studyDetails", data.studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studyStatus", data.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useSetStudyLive = () => {
  const queryClient = useQueryClient();
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  return useMutation({
    mutationFn: async (studyId: string) => {
      return carpApi.goLive_CORE(studyId, getConfig());
    },
    onSuccess: (_, studyId) => {
      queryClient.invalidateQueries({ queryKey: ["studyStatus", studyId] });
      setSnackbarSuccess("Study is now live!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useAddResearcherToStudy = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const isResearcher = await carpApi.isAccountOfRole(
        email,
        "RESEARCHER",
        getConfig(),
      );

      if (!isResearcher) {
        setSnackbarError("Email does not belong to a researcher.");
        return null;
      }
      return carpApi.addResearcherToStudy(studyId, email, getConfig());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchers", studyId] });
      setSnackbarSuccess("Added researcher to study!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useRemoveResearcherFromStudy = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      return carpApi.removeResearchersFromStudy(studyId, email, getConfig());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchers", studyId] });
      setSnackbarSuccess("Removed researcher from study!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useDeleteStudy = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  let id = "";

  return useMutation({
    mutationFn: async (studyId: string) => {
      id = studyId;
      return carpApi.deleteStudy_CORE(studyId, getConfig());
    },
    onSuccess: () => {
      queryClient.setQueryData(["studies"], (old: StudyOverview[]) =>
        old.filter((study) => study.studyId !== id),
      );
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      setSnackbarSuccess("Study deleted!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useExports = (studyId: string) => {
  return useQuery<Export[], CarpServiceError>({
    queryFn: () => carpApi.pollExports(studyId, getConfig()),
    queryKey: ["exports", studyId],
  });
};

export const useCreateSummary = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SummaryCreationParams) => {
      return carpApi.createSummary(
        params.studyId,
        params.deploymentIds,
        getConfig(),
      );
    },
    onSuccess: (response, variables) => {
      const { id } = response;
      const existingSummary = (
        queryClient.getQueryData(["exports", variables.studyId]) as Export[]
      )?.find((summary) => summary.id === id);

      if (existingSummary) {
        setSnackbarError("Wait until creating a new export");
      } else {
        setSnackbarSuccess("Export data initiated!");
      }
    },
    onSettled: (_, _2, params) => {
      queryClient.invalidateQueries({
        queryKey: ["exports", params.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useDeleteExport = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (summaryId: string) => {
      return carpApi.deleteExport(studyId, summaryId, getConfig());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports", studyId] });
      setSnackbarSuccess("Export deleted!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useDownloadSummary = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  return useMutation({
    mutationFn: async ({
      studyId,
      summaryId,
    }: {
      studyId: string;
      summaryId: string;
    }) => {
      const response = await carpApi.downloadExport(
        studyId,
        summaryId,
        getConfig(),
      );
      // @ts-ignore: idk
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      link.setAttribute("download", response.filename);
      document.body.appendChild(link);
      return link.click();
    },
    onSuccess: () => {
      setSnackbarSuccess("Export will start shortly");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

const getCollectionFiles = async (collectionName: string, studyId: string) => {
  try {
    return await carpApi.getCollectionByName(
      collectionName,
      studyId,
      getConfig(),
    );
  } catch {
    return { documents: [] } as Collection;
  }
};

export const useStudyAnnouncements = (studyId: string) => {
  return useQuery<Collection, CarpServiceError, Collection, any>({
    queryFn: async () => getCollectionFiles("messages", studyId),
    retry: 0,
    queryKey: ["announcements", studyId],
  });
};

export const useDeleteStudyAnnouncement = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: { studyId: string; announcementId: string }) => {
      return carpApi.deleteDocumentById(
        props.studyId,
        props.announcementId,
        getConfig(),
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Announcement deleted!");
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const uploadImageRequest = async (studyId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", new Blob([file]), file.name);
  return carpApi.uploadImageToStudy(studyId, formData, getConfig());
};

export const useCreateAnnouncement = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      announcement: MessageData;
      image?: File;
    }) => {
      let announcement = { ...props.announcement };
      if (props.image) {
        try {
          const imageUrl = await uploadImageRequest(props.studyId, props.image);
          announcement = { ...announcement, image: imageUrl };
        } catch (error) {
          setSnackbarError("Error uploading image");
          throw error;
        }
      }
      return carpApi.createDocumentInCollection(
        "messages",
        props.studyId,
        announcement,
        getConfig(),
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Announcement created!");
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useAnnouncement = (studyId: string, announcementId: string) => {
  return useQuery<MessageData, CarpServiceError>({
    queryFn: async () => {
      const response = await carpApi.getDocumentById(
        studyId,
        announcementId,
        getConfig(),
      );
      return response.data as MessageData;
    },
    queryKey: ["announcements", studyId, announcementId],
  });
};

export const useUpdateAnnouncement = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      announcementId: string;
      announcement: MessageData;
      newImage?: File;
    }) => {
      let announcement = { ...props.announcement };
      if (props.newImage) {
        try {
          const imageUrl = await uploadImageRequest(
            props.studyId,
            props.newImage,
          );
          announcement = { ...announcement, image: imageUrl };
        } catch (error) {
          setSnackbarError("Error uploading image");
          throw error;
        }
      }

      return carpApi.updateDocumentById(
        props.studyId,
        props.announcementId,
        announcement,
        getConfig(),
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Announcement updated!");
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.studyId],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "announcements",
          variables.studyId,
          variables.announcementId,
        ],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useStudyResources = (studyId: string) => {
  return useQuery<Collection, CarpServiceError>({
    queryFn: async () => getCollectionFiles("resources", studyId),
    retry: 0,
    queryKey: ["resources", studyId],
  });
};

export const useCreateResource = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      name: string;
      resource: ResourceData;
    }) => {
      return carpApi.createDocumentInCollection(
        "resources",
        props.studyId,
        props.resource,
        getConfig(),
        props.name,
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource created!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useDeleteResource = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: { studyId: string; resourceId: string }) => {
      return carpApi.deleteDocumentById(
        props.studyId,
        props.resourceId,
        getConfig(),
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource deleted!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useUpdateResource = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      resourceId: string;
      resource: ResourceData;
      name: string;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return carpApi.updateDocumentById(
        props.studyId,
        props.resourceId,
        props.resource,
        getConfig(),
        props.name,
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource updated!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useStudyTranslations = (studyId: string) => {
  return useQuery<Collection, CarpServiceError>({
    queryFn: async () => getCollectionFiles("localizations", studyId),
    retry: 0,
    queryKey: ["translations", studyId],
  });
};

export const useCreateTranslation = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      name: string;
      translation: ResourceData;
    }) => {
      return carpApi.createDocumentInCollection(
        "localizations",
        props.studyId,
        props.translation,
        getConfig(),
        props.name,
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation created!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useUpdateTranslation = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: {
      studyId: string;
      translationId: string;
      translation: ResourceData;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return carpApi.updateDocumentById(
        props.studyId,
        props.translationId,
        props.translation,
        getConfig(),
        props.translation.name,
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation updated!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useDeleteTranslation = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props: { studyId: string; translationId: string }) => {
      return carpApi.deleteDocumentById(
        props.studyId,
        props.translationId,
        getConfig(),
      );
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation deleted!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useCreateFile = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: { studyId: string; formData: FormData }) => {
      return carpApi.createFile(props.studyId, props.formData, getConfig());
    },
    onSuccess: () => {
      setSnackbarSuccess("File uploaded!");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useGetFiles = (studyId: string) => {
  return useQuery<CarpFile[], CarpServiceError>({
    queryFn: async () => carpApi.getFiles(studyId, getConfig()),
    queryKey: ["files"],
  });
};

export const useGetOneFile = (studyId: string, fileId: number) => {
  return useQuery<CarpFile, CarpServiceError>({
    queryFn: async () => carpApi.getFile(studyId, fileId, getConfig()),
    queryKey: ["file", fileId],
  });
};

export const useDownloadFile = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  return useMutation({
    mutationFn: async (file: CarpFile) => {
      const response = await carpApi.downloadFile(
        studyId,
        file.id,
        getConfig(),
      );
      const blob = new Blob([response], {
        type: file.metadata["content-type"],
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.original_name);
      document.body.appendChild(link);
      return link.click();
    },
    onSuccess: () => {
      setSnackbarSuccess("File will start downloading shortly");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};
