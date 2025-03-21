import { CountBadge } from "@/components/ui/CountBadge";
import { TimeSlot } from "@/components/ui/TimeSlot";
import { Box, styled, Typography, Chip } from "@mui/material";
import { format, parseISO } from "date-fns";

const EventsColumn = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const EventCell = (props: any) => {
  const { timeSlots, getEventsForTimeSlot, handleMultipleEventsClick } = props;
  const style = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  const positionStyle = {position: "absolute",height: "70px",boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",borderRadius: "10px",margin: "0 5px"};
  const boxStyle = { display: "flex", flexDirection: "column",justifyContent: "center", gap: 0.25 };

  return (
    <EventsColumn>
      {/* Events */}
      {timeSlots?.map((timeSlot: any) => {
        const eventsAtTime = getEventsForTimeSlot(timeSlot);
        const event = eventsAtTime[0];
        return (
          <TimeSlot key={timeSlot.toString()}>
            {event && (
              <Box sx={{ display: "flex", ...positionStyle, width: "20%" ,left:0}} onClick={() => handleMultipleEventsClick(eventsAtTime)}>
                <Box sx={{ backgroundColor: "primary.main", width: "5%" }}></Box>
                <Box sx={{ ...boxStyle, width: "95%", padding: "4px" }}>
                  {eventsAtTime.length > 1 && <CountBadge label={eventsAtTime.length} size="small" />}
                  <Typography variant="caption" fontWeight="bold" sx={style}>
                    {event?.job_id?.jobRequest_Title ?? "-"}
                  </Typography>
                  <Typography variant="caption" color="inherit" sx={style}>
                    {`Interviewer: ${event?.user_det?.handled_by?.firstName ?? "-"}`}
                  </Typography>
                  <Typography variant="caption" sx={style}>
                    {format(parseISO(event.start), "h:mm a")} - {format(parseISO(event.end), "h:mm a")}
                  </Typography>
                </Box>
              </Box>
            )}
          </TimeSlot>
        );
      })}
    </EventsColumn>
  );
};

export default EventCell;
