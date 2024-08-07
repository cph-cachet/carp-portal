import carpApi from "@Utils/api/api";
import { useSnackbar } from "@Utils/snackbar";

import {
  CarpServiceError,
  Collection,
  MessageData,
  ResourceData,
  StudyProtocolSnapshot,
  StudyDetails,
  StudyOverview,
  StudyStatus,
  Export,
  User,
} from "@carp-dk/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./auth";

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
    queryFn: () => carpApi.studies.getOverview(),
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
      await carpApi.study.setDescription({
        studyId: params.studyId,
        studyName: params.name,
        studyDescription: params.description,
      });
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
      setSnackbarError(error.message);
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
      return carpApi.study.setDescription({
        studyId: params.studyId,
        studyName: params.name,
        studyDescription: params.description,
      });
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
      setSnackbarError(error.message);
    },
  });
};

export const useCreateStudy = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: async (params: StudyCreationParams) => {
      return carpApi.studies.create({
        ownerId: currentUser.accountId.stringRepresentation,
        name: params.name,
        description: params.description,
      });
    },
    onSuccess: () => {
      setSnackbarSuccess("Study created successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useStudyStatus = (studyId: string) => {
  return useQuery<StudyStatus, CarpServiceError, StudyStatus, any>({
    queryFn: () => carpApi.study.getStatus({ studyId }),
    queryKey: ["studyStatus", studyId],
  });
};

export const useStudyDetails = (studyId: string) => {
  return useQuery<StudyDetails, CarpServiceError, StudyDetails, any>({
    queryFn: () => carpApi.study.getDetails({ studyId }),
    queryKey: ["studyDetails", studyId],
    retry: 1,
  });
};

export const useResearchers = (studyId: string) => {
  return useQuery<User[], CarpServiceError, User[], any>({
    queryFn: async () => {
      return carpApi.study.researchers.getStudyResearchers({ studyId });
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
      protocol: StudyProtocolSnapshot;
    }) => {
      return carpApi.study.setProtocol({
        studyId: data.studyId,
        protocol: data.protocol,
      });
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
      setSnackbarError(error.message);
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
      return carpApi.study.setInvitation({
        studyId: data.studyId,
        title: data.invitationName,
        description: data.invitationDescription,
      });
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
      setSnackbarError(error.message);
    },
  });
};

export const useSetStudyLive = () => {
  const queryClient = useQueryClient();
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  return useMutation({
    mutationFn: async (studyId: string) => {
      return carpApi.study.goLive({ studyId });
    },
    onSuccess: (_, studyId) => {
      queryClient.invalidateQueries({ queryKey: ["studyStatus", studyId] });
      setSnackbarSuccess("Study is now live!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useAddResearcherToStudy = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailAddress: string) => {
      const isResearcher = await carpApi.accounts.isAccountOfRole({
        emailAddress,
        role: "RESEARCHER",
      });

      if (!isResearcher) {
        setSnackbarError("Email does not belong to a researcher.");
        return null;
      }
      return carpApi.study.researchers.addResearcherToStudy({
        studyId,
        email: emailAddress,
      });
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
      return carpApi.study.researchers.removeResearcherFromStudy({
        studyId,
        email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchers", studyId] });
      setSnackbarSuccess("Removed researcher from study!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useDeleteStudy = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  let id = '';

  return useMutation({
    mutationFn: async (studyId: string) => {
      id = studyId;
      return carpApi.study.delete({ studyId });
    },
    onSuccess: () => {
      queryClient.setQueryData(['studies'], (old: StudyOverview[]) =>
        old.filter((study) => study.studyId !== id)
      );
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      setSnackbarSuccess('Study deleted!');
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useExports = (studyId: string) => {
  return useQuery<Export[], CarpServiceError>({
    queryFn: () => carpApi.study.exports.getAll({ studyId }),
    queryKey: ["exports", studyId],
  });
};

export const useCreateSummary = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SummaryCreationParams) => {
      return carpApi.study.exports.create({
        studyId: params.studyId,
        deploymentIds: params.deploymentIds,
      });
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
      setSnackbarError(error.message);
    },
  });
};

export const useDeleteExport = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exportId: string) => {
      return carpApi.study.exports.delete({ studyId, exportId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports", studyId] });
      setSnackbarSuccess("Export deleted!");
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useDownloadSummary = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  return useMutation({
    mutationFn: async ({
      studyId,
      exportId,
    }: {
      studyId: string;
      exportId: string;
    }) => {
      const response = await carpApi.study.exports.download({
        studyId,
        exportId,
      });
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
      setSnackbarError(error.message);
    },
  });
};

const getCollectionFiles = async (collectionName: string, studyId: string) => {
  try {
    return carpApi.study.collections.getByName({
      studyId,
      collectionName,
    });
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
      return carpApi.study.collections.deleteDocumentById({
        studyId: props.studyId,
        documentId: props.announcementId,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Announcement deleted!");
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const uploadImageRequest = async (studyId: string, image: File) => {
  return carpApi.study.collections.uploadImage({ studyId, image });
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
      return carpApi.study.collections.createDocument({
        studyId: props.studyId,
        collectionName: "messages",
        document: announcement,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Announcement created!");
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useAnnouncement = (studyId: string, announcementId: string) => {
  return useQuery<MessageData, CarpServiceError>({
    queryFn: async () => {
      const response = await carpApi.study.collections.getDocumentById({
        studyId,
        documentId: announcementId,
      });
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

      return carpApi.study.collections.updateDocumentById({
        studyId: props.studyId,
        documentId: props.announcementId,
        document: announcement,
      });
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
      setSnackbarError(error.message);
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
      return carpApi.study.collections.createDocument({
        studyId: props.studyId,
        collectionName: "resources",
        document: props.resource,
        fileName: props.name,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource created!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useDeleteResource = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: { studyId: string; resourceId: string }) => {
      return carpApi.study.collections.deleteDocumentById({
        studyId: props.studyId,
        documentId: props.resourceId,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource deleted!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
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
      return carpApi.study.collections.updateDocumentById({
        studyId: props.studyId,
        documentId: props.resourceId,
        document: props.resource,
        fileName: props.name,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Resource updated!");
      queryClient.invalidateQueries({
        queryKey: ["resources", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
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
      return carpApi.study.collections.createDocument({
        studyId: props.studyId,
        collectionName: "localizations",
        document: props.translation,
        fileName: props.name,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation created!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
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
      return carpApi.study.collections.updateDocumentById({
        studyId: props.studyId,
        documentId: props.translationId,
        document: props.translation,
        fileName: props.translation.name,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation updated!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useDeleteTranslation = () => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props: { studyId: string; translationId: string }) => {
      return carpApi.study.collections.deleteDocumentById({
        studyId: props.studyId,
        documentId: props.translationId,
      });
    },
    onSuccess: (_, variables) => {
      setSnackbarSuccess("Translation deleted!");
      queryClient.invalidateQueries({
        queryKey: ["translations", variables.studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};
