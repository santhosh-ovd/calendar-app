import { styled, Chip } from "@mui/material";

export const CountBadge = styled(Chip)(({ theme }) => ({
    backgroundColor: "#FFD700",
    color: theme.palette.common.black,
    position: "absolute",
    top: theme.spacing(0.3),
    right: theme.spacing(0.3),
    height: 20,
    minWidth: 20,
    borderRadius: "50%",
    fontSize: "10px",
  }));
  