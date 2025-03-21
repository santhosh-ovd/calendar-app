import { Box, styled } from "@mui/material";

export const TimeSlot = styled(Box)(({ theme }) => ({
    height: 100,
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: "relative",
    display: "flex",
    alignItems: "start",
    justifyContent: "flex-end",
    paddingTop: theme.spacing(1),
  }));