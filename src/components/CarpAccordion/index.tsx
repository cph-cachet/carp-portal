import { AccordionDetails, Stack } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ReactNode, useState } from "react";
import {
  StyledAccordion,
  StyledTypography,
  SyledAccordionSummary,
  Title,
} from "./styles";

type Props = {
  title: string;
  description?: string | null;
  children: ReactNode;
};

const CarpAccordion = ({ title, description, children }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <StyledAccordion elevation={2} onChange={handleChange} expanded={expanded}>
      <SyledAccordionSummary
        expandIcon={
          <KeyboardArrowRightIcon
            sx={{
              transform: expanded ? "rotate(-270deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        }
      >
        <Stack direction="column" spacing="10px">
          <Title variant="h3">{title}</Title>
          {description && expanded && (
            <StyledTypography variant="h5">{description}</StyledTypography>
          )}
        </Stack>
      </SyledAccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
  );
};

export default CarpAccordion;
