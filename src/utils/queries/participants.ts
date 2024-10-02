import carpApi from "@Utils/api/api";
import { useSnackbar } from "@Utils/snackbar";
import { kotlin } from "@cachet/carp-kotlin";
import { getConfig } from "@carp-dk/authentication-react";

import carpStudiesCore from "@cachet/carp-studies-core";
import {
  CarpServiceError,
  ConsentResponse,
  ParticipantAccount,
  ParticipantGroups,
  ParticipantInfo,
  ParticipantWithRoles,
  InactiveDeployment,
} from "@carp-dk/client";
import { Statistics } from "@carp-dk/client/models/Statistics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HashMap = kotlin.collections.Map;
import dk = carpStudiesCore.dk;
import NamespacedId = dk.cachet.carp.common.application.NamespacedId;

import Participant = dk.cachet.carp.studies.application.users.Participant;

type ParticipantGroupStatus =
  dk.cachet.carp.studies.application.users.ParticipantGroupStatus;

export const useParticipants = (studyId: string) => {
  return useQuery<Participant[], CarpServiceError, Participant[], any>({
    queryFn: () => carpApi.getParticipants_CORE(studyId, getConfig()),
    queryKey: ["participantsData", studyId],
  });
};

export const useStopParticipantGroup = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deploymentId: string) =>
      carpApi.stopParticipantGroup_CORE(studyId, deploymentId, getConfig()),
    onSuccess: () => {
      setSnackbarSuccess("Deployment stopped successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantsData", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsInfo", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsStatus", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["deployments", studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useInactiveDeployments = (studyId: string, lastUpdate: number) => {
  return useQuery<InactiveDeployment[], CarpServiceError>({
    queryFn: () =>
      carpApi.getInactiveDeployments(studyId, lastUpdate, getConfig()),
    queryKey: ["inactiveDeployments", { studyId, lastUpdate }],
  });
};

export const useInviteParticipants = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantsWithRoles: ParticipantWithRoles[]) => {
      return carpApi.inviteNewParticipantGroup_CORE(
        studyId,
        participantsWithRoles,
        getConfig(),
      );
    },
    onSuccess: () => {
      setSnackbarSuccess("Participants deployed successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantsData", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsInfo", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsStatus", studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useAddParticipantByEmail = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      carpApi.addParticipantByEmailAddress_CORE(studyId, email, getConfig()),
    onSuccess: () => {
      setSnackbarSuccess("Participant added successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantsData", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsInfo", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsStatus", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsAccounts", studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

interface GenerateAnonymousAccountsParams {
  amountOfAccounts: number;
  expirationSeconds: number;
  participantRoleName: string;
  redirectUri: string;
}

export const useGenerateAnonymousAccounts = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      redirectUri,
      amountOfAccounts,
      expirationSeconds,
      participantRoleName,
    }: GenerateAnonymousAccountsParams) => {
      return carpApi.generateAnonymousAccounts({
        studyId,
        redirectUri,
        amountOfAccounts,
        expirationSeconds,
        participantRoleName,
        config: getConfig(),
      });
    },
    onSuccess: () => {
      setSnackbarSuccess(
        "Generation started, file will be available in Export page",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantsData", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsInfo", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsStatus", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsAccounts", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["exports", studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.httpResponseMessage);
    },
  });
};

export const useAddParticipants = (studyId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emails: string[]) =>
      carpApi.addParticipants(studyId, emails, getConfig()),
    onSuccess: () => {
      setSnackbarSuccess("Participant added successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantsData", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsInfo", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsStatus", studyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["participantsAccounts", studyId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useParticipantsInfo = (studyId: string) => {
  return useQuery<ParticipantInfo[], CarpServiceError>({
    queryFn: () => carpApi.getParticipantInfo(studyId, getConfig()),
    queryKey: ["participantsInfo", studyId],
  });
};

export const useParticipantsAccounts = (studyId: string) => {
  return useQuery<ParticipantAccount[], CarpServiceError>({
    queryFn: () => carpApi.getParticipantsAccounts(studyId, getConfig()),
    queryKey: ["participantsAccounts", studyId],
  });
};

export const useParticipantsStatus = (studyId: string) => {
  return useQuery<ParticipantGroupStatus[], CarpServiceError>({
    queryFn: async () =>
      carpApi.getParticipantGroupStatusList_CORE(studyId, getConfig()),
    queryKey: ["participantsStatus", studyId],
  });
};

export const useParticipantGroupsStatus = (studyId: string) => {
  return useQuery<ParticipantGroupStatus[], CarpServiceError>({
    queryFn: async () =>
      carpApi.getParticipantGroupStatusList_CORE(studyId, getConfig()),
    queryKey: ["participantsStatus", studyId],
  });
};

export const useParticipantGroupsAccountsAndStatus = (studyId: string) => {
  return useQuery<ParticipantGroups, CarpServiceError>({
    queryFn: async () =>
      carpApi.getParticipantGroupsAccountsAndStatus(studyId, getConfig()),
    queryKey: ["deployments", studyId],
  });
};

export const useStatistics = (studyId: string) => {
  const { data: participantsStatus, isLoading: participantsStatusLoading } =
    useParticipantsStatus(studyId);

  const deploymentIds: string[] = [];
  if (participantsStatus) {
    participantsStatus.forEach((ps: ParticipantGroupStatus) => {
      deploymentIds.push(ps.id.stringRepresentation);
    });
  }

  return useQuery<Statistics[], CarpServiceError, Statistics[], any>({
    queryKey: ["statistics", deploymentIds],
    queryFn: async () => {
      if (deploymentIds.length === 0) {
        return [];
      }
      return carpApi.getDeploymentStatistics(deploymentIds, getConfig());
    },
    enabled: !participantsStatusLoading && !!participantsStatus,
  });
};

export const useSetParticipantData = (deploymentId: string) => {
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      participantData: HashMap<NamespacedId, any | null>;
      role: string;
    }) => {
      return carpApi.setParticipantData_CORE(
        deploymentId,
        data.participantData,
        data.role,
        getConfig(),
      );
    },
    onSuccess: () => {
      setSnackbarSuccess("Participant data updated successfuly");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["participantData", deploymentId],
      });
    },
    onError: (error: CarpServiceError) => {
      setSnackbarError(error.message);
    },
  });
};

export const useParticipantConsent = (deploymentId: string) => {
  return useQuery<ConsentResponse[], CarpServiceError, ConsentResponse[], any>({
    queryFn: () => {
      return carpApi.getAllInformedConsent(deploymentId, getConfig());
    },
    queryKey: ["deploymentConsent", deploymentId],
  });
};
