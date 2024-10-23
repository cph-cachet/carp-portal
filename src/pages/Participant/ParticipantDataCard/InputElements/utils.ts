/* eslint-disable no-underscore-dangle */
import * as yup from "yup";
import carpStudies from "@cachet/carp-studies-core";
import carpDeployments from "@cachet/carp-deployments-core";
import { useFormik } from "formik";
import { UseMutationResult } from "@tanstack/react-query";
import ddk = carpDeployments.dk;
import sdk = carpStudies.dk;
import ExpectedParticipantData = sdk.cachet.carp.common.application.users.ExpectedParticipantData;
import Data = ddk.cachet.carp.common.application.data.Data;

const phoneNumberValidationSchema = yup
  .object({
    phone_number: yup.object({
      countryCode: yup.string(),
      icoCode: yup.string().notRequired(),
      number: yup.string(),
    }),
  })
  .test(
    "conditional-required",
    "Country code is required when number is set",
    (value, schema) => {
      const {
        phone_number: { countryCode, number },
      } = value;

      if (number && !countryCode) {
        return schema.createError({
          path: "phone_number.countryCode",
          message: "Country code is required when number is set",
        });
      }

      if (countryCode && !number) {
        return schema.createError({
          path: "phone_number.number",
          message: "Number is required when country code is set",
        });
      }

      return true;
    },
  );

const ssnValidationSchema = yup
  .object({
    ssn: yup.object({
      country: yup.string(),
      socialSecurityNumber: yup.string(),
    }),
  })
  .test(
    "conditional-required",
    "Country code is required when number is set",
    (value, schema) => {
      const {
        ssn: { country, socialSecurityNumber },
      } = value;

      if (socialSecurityNumber && !country) {
        return schema.createError({
          path: "ssn.country",
          message: "Country is required when social security number is set",
        });
      }

      if (country && !socialSecurityNumber) {
        return schema.createError({
          path: "ssn.socialSecurityNumber",
          message: "Social Security Number is required when country is set",
        });
      }

      return true;
    },
  );

const fullNameValidationSchema = yup.object({
  full_name: yup.object({
    firstName: yup.string().notRequired(),
    middleName: yup.string().notRequired(),
    lastName: yup.string().notRequired(),
  }),
});

const addressValidationSchema = yup.object({
  address: yup.object({
    address1: yup.string().notRequired(),
    address2: yup.string().notRequired(),
    street: yup.string().notRequired(),
    city: yup.string().notRequired(),
    postalCode: yup.string().notRequired(),
    country: yup.string().notRequired(),
  }),
});

const diagnosisValidationSchema = yup
  .object({
    diagnosis: yup.object({
      effectiveDate: yup.date().notRequired(),
      diagnosis: yup.string().notRequired(),
      icd11Code: yup.string(),
      conclusion: yup.string().notRequired(),
    }),
  })
  .test(
    "conditional-required",
    "ICD11 code is required when other diagnosis fields are set",
    (value, schema) => {
      const {
        diagnosis: { effectiveDate, diagnosis, icd11Code, conclusion },
      } = value;

      if ((effectiveDate || diagnosis || conclusion) && !icd11Code) {
        return schema.createError({
          path: "diagnosis.icd11Code",
          message: "ICD11 code is required when other diagnosis fields are set",
        });
      }

      return true;
    },
  );

const getParticipantDataFormik = (
  participantData: ExpectedParticipantData[] | undefined,
  startingData: Data[],
  setParticipantData: UseMutationResult<any, unknown, any, unknown>,
  role: string,
  setEditing: (boolean) => void,
) => {
  let validationSchema = yup.object({});

  const initialValues = {
    phone_number: {
      __type: "",
      countryCode: "",
      icoCode: "",
      number: "",
    },
    sex: {
      __type: "",
      value: "",
    },
    full_name: {
      firstName: "",
      lastName: "",
      middleName: "",
    },
    address: {
      __type: "",
      address1: "",
      address2: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    diagnosis: {
      __type: "",
      effectiveDate: null,
      diagnosis: "",
      icd11Code: "",
      conclusion: "",
    },
    ssn: {
      __type: "",
      country: "",
      socialSecurityNumber: "",
    },
  };

  if (participantData && participantData.length !== 0) {
    participantData.forEach((data) => {
      if (data.attribute.inputDataType.name === "informed_consent") return;
      initialValues[data.attribute.inputDataType.name].__type = `${
        data.attribute.inputDataType.namespace
      }.${data.attribute.inputDataType.name}`;

      switch (data.attribute.inputDataType.name) {
        case "sex":
          break;
        case "full_name":
          validationSchema = validationSchema.concat(fullNameValidationSchema);
          break;
        case "phone_number":
          validationSchema = validationSchema.concat(
            phoneNumberValidationSchema,
          );
          break;
        case "ssn":
          validationSchema = validationSchema.concat(ssnValidationSchema);
          break;
        case "address":
          validationSchema = validationSchema.concat(addressValidationSchema);
          break;
        case "diagnosis":
          validationSchema = validationSchema.concat(diagnosisValidationSchema);
          break;
        default:
          break;
      }
    });
  }

  startingData?.forEach((data) => {
    initialValues[((data as any).__type as string).split(".").pop()] = {
      ...data,
    };
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const newParticipantData = {};
      Object.values(values).forEach((value) => {
        if (Object.entries(value).every(([k, v]) => k === "__type" || !v)) {
          newParticipantData[(value as any).__type] = null;
        } else {
          newParticipantData[(value as any).__type] = value;
        }
      });
      await setParticipantData.mutateAsync({
        participantData: newParticipantData,
        role,
      });
      setEditing(false);
    },
  });
  return formik;
};

export default getParticipantDataFormik;
