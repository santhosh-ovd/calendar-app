import { Box, styled, Typography } from "@mui/material";
import { format } from "date-fns";

const TimeColumn = styled(Box)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  position: "sticky",
  left: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  height: 120,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "relative",
  display: "flex",
  alignItems: "start",
  justifyContent: "flex-end",
  paddingTop: theme.spacing(1),
}));

const TwentyFourHourColumn = (props: any) => {
  const { timeSlots } = props;
  
  return (
    <TimeColumn>
      {timeSlots.map((time: any) => (
        <TimeSlot key={time.toString()}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.75rem",
              paddingRight: 2,
            }}
          >
            {format(time, "h a")}
          </Typography>
        </TimeSlot>
      ))}
    </TimeColumn>
  );
};

export default TwentyFourHourColumn;
