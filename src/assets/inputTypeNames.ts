const enUS: { [key: string]: string } = {

    sex: "Biological Sex",
    informed_consent: "Informed Consent",
    phone_number: "Phone Number",
    ssn: "Social Security Number",
    full_name: "Full Name",
    address: "Address",
    diagnosis: "Diagnosis",
};

export const getInputDataName = (key: string): string => {
    return enUS[key] || key;
}
