import { styled } from "@Utils/theme";

const ParticipantsRow = styled("div")({
  paddingBottom: 10,
  marginBottom: 0,
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  gap: 8,
  alignItems: "end",
});

export default ParticipantsRow;
