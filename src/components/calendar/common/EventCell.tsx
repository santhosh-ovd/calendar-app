import { Box, styled, Typography, Chip } from "@mui/material";
import { format, parseISO } from "date-fns";

const EventsColumn = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  height: 60,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "relative",
  display: "flex",
  alignItems: "start",
  justifyContent: "flex-end",
  paddingTop: theme.spacing(1),
}));

const EventBlock = styled(Box)(({ theme }) => ({
  position: "absolute",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "pointer",
  width: "calc(100% - 24px)",
  left: 12,
  fontSize: "0.75rem",
  boxShadow: theme.shadows[1],
  minHeight: "30px",
  maxHeight: "calc(100% - 2px)",
  "&:hover": {
    filter: "brightness(0.95)",
    boxShadow: theme.shadows[2],
  },
}));

const CountBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: "#FFD700",
  color: theme.palette.common.black,
  position: "absolute",
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  height: 20,
  minWidth: 20,
  borderRadius: "50%",
}));

const EventCell = (props: any) => {
  const { timeSlots, getEventsForTimeSlot, calculateEventPosition, handleMultipleEventsClick } = props;
  return (
    <EventsColumn>
      {/* Time grid lines */}
      {timeSlots.map((time: any) => (
        <TimeSlot key={time.toString()} />
      ))}

      {/* Events */}
      {timeSlots.map((timeSlot: any) => {
        const eventsAtTime = getEventsForTimeSlot(timeSlot);
        if (eventsAtTime.length === 0) return null;

        const event = eventsAtTime[0];
        const { top, height } = calculateEventPosition(event);

        return (
          <EventBlock
            key={event.id}
            onClick={() => handleMultipleEventsClick(eventsAtTime)}
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              top,
              height,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0.25,
            }}
          >
            {eventsAtTime.length > 1 && <CountBadge label={eventsAtTime.length} size="small" />}
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {event.job_id.jobRequest_Title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {format(parseISO(event.start), "h:mm a")} - {format(parseISO(event.end), "h:mm a")}
            </Typography>
            <Typography
              variant="caption"
              color="inherit"
              sx={{
                opacity: 0.9,
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {event.summary}
            </Typography>
          </EventBlock>
        );
      })}
    </EventsColumn>
  );
};

export default EventCell;
