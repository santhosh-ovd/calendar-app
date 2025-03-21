import React, { useState } from "react";
import { Box, styled, Typography, Chip } from "@mui/material";
import { format, addHours, startOfDay, addDays, parseISO, startOfWeek } from "date-fns";
import { CalendarEvent, EventGroup } from "./types";
import EventListDialog from "./common/EventListDialog";
import EventDetailDialog from "./common/EventDetailDialog";
import TwentyFourHourColumn from "./common/TwentyFourHourColumn";
import { TimeSlot } from "../ui/TimeSlot";
import { CountBadge } from "../ui/CountBadge";

const WeekViewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
}));

const WeekDaysHeader = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "80px repeat(7, 1fr)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  top: 0,
  zIndex: 2,
}));

const TimeGridContainer = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "80px repeat(7, 1fr)",
  flex: 1,
  overflow: "auto",
}));

const DayColumn = styled(Box)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  minWidth: 120,
}));

// const TimeSlot = styled(Box)(({ theme }) => ({
//   height: 100,
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   position: "relative",
//   display: "flex",
//   alignItems: "start",
//   justifyContent: "flex-end",
//   paddingTop: theme.spacing(1),
// }));

const EventCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    filter: "brightness(0.95)",
  },
}));

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

/**
 * WeekView component showing time grid and events
 */
const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const [selectedEvents, setSelectedEvents] = useState<EventGroup | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Always start from Sunday regardless of current date
  const startOfWeekDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));

  // Group events by time slot and day
  const getEventsForTimeSlot = (day: Date, time: Date) => {
    const eventsAtTime = events.filter((event) => {
      const eventStart = parseISO(event.start);
      const eventDay = format(eventStart, "yyyy-MM-dd");
      const eventHour = format(eventStart, "HH");
      const timeHour = format(time, "HH");
      const dayStr = format(day, "yyyy-MM-dd");

      return eventDay === dayStr && eventHour === timeHour;
    });

    if (eventsAtTime.length > 0) {
      return {
        events: eventsAtTime,
        count: eventsAtTime.length,
      };
    }

    return null;
  };

  // Generate time slots (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return addHours(startOfDay(currentDate), i);
  });

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleMultipleEventsClick = (events: CalendarEvent[]) => {
    if (events.length > 1) {
      const eventStart = parseISO(events[0].start);
      setSelectedEvents({
        time: format(eventStart, "h:mm a"),
        events,
      });
    } else if (events.length === 1) {
      handleEventClick(events[0]);
    }
  };

  return (
    <WeekViewContainer>
      {/* Week days header */}
      <WeekDaysHeader>
        <Box /> {/* Empty cell for time column */}
        {weekDays.map((day) => (
          <Box key={day.toString()} sx={{ p: 1, textAlign: "center", borderRight: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" display="block">
              {format(day, "EEE")}
            </Typography>
            <Typography variant="body2">{format(day, "d")}</Typography>
          </Box>
        ))}
      </WeekDaysHeader>

      {/* Body of the events */}
      <TimeGridContainer>
        <TwentyFourHourColumn timeSlots={timeSlots} />
        <Events weekDays={weekDays} timeSlots={timeSlots} getEventsForTimeSlot={getEventsForTimeSlot} handleMultipleEventsClick={handleMultipleEventsClick} />
      </TimeGridContainer>
      <EventListDialog selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} handleEventClick={handleEventClick} />
      <EventDetailDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
    </WeekViewContainer>
  );
};

export default WeekView;

const Events = (props: any) => {
  const { weekDays, timeSlots, getEventsForTimeSlot, handleMultipleEventsClick } = props;
  const style = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  const positionStyle = { position: "absolute", height: "58px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "5px", margin: "0 5px" };
  const boxStyle = { display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.25 };

  return (
    <>
      {weekDays.map((day: any) => (
        <DayColumn key={day.toString()}>
          {timeSlots.map((time: any) => {
            
            const eventGroup = getEventsForTimeSlot(day, time);
            const event = eventGroup?.events[0];

            return (
              <TimeSlot key={time.toString()}>
                  {eventGroup && <Box sx={{ display: "flex", width: "95%",...positionStyle,left: "0px",right: "0px"}} onClick={() => handleMultipleEventsClick(eventGroup.events)}>
                    <Box sx={{ backgroundColor: "primary.main", width: "5%" }}></Box>
                    <Box sx={{ ...boxStyle, width: "95%", padding: "4px" }}>
                      {eventGroup?.count > 1 && <CountBadge label={eventGroup.count} size="small" />}
                      <Typography variant="caption" fontWeight="bold" sx={style}>
                        {event?.job_id?.jobRequest_Title ?? "-"}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={style}>
                        {`Interviewer: ${event?.user_det?.handled_by?.firstName ?? "-"}`}
                      </Typography>
                      <Typography variant="caption" sx={style}>
                        {format(parseISO(event?.start), "h:mm a")} - {format(parseISO(event?.end), "h:mm a")}
                      </Typography>
                    </Box>
                  </Box>}
              </TimeSlot>
            );
          })}
        </DayColumn>
      ))}
    </>
  );
};
