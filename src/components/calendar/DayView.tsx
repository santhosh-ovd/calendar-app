import React, { useState } from "react";
import { Box, styled, Typography } from "@mui/material";
import { format, addHours, startOfDay, parseISO } from "date-fns";
import { CalendarEvent, EventGroup } from "./types";
import EventListDialog from "./common/EventListDialog";
import EventDetailDialog from "./common/EventDetailDialog";
import TwentyFourHourColumn from "./common/TwentyFourHourColumn";
import EventCell from "./common/EventCell";

const DayViewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}));

const TimeGridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  flex: 1,
  overflow: "auto",
  position: "relative",
  height: "calc(24 * 60px)", // 24 hours * 60px height per hour
}));

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

/**
 * DayView component showing events for a single day
 */
const DayView: React.FC<DayViewProps> = ({ currentDate, events }) => {
  const [selectedEvents, setSelectedEvents] = useState<EventGroup | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Generate time slots (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(currentDate), i));

  // Get events for the current day
  const todayEvents = events.filter((event) => {
    const eventDate = parseISO(event.start);
    return format(eventDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
  });

  const calculateEventPosition = (event: CalendarEvent) => {
    const startTime = parseISO(event.start);
    const endTime = parseISO(event.end);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();

    // Calculate duration in minutes, but limit it to the same day
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    const durationMinutes = Math.min(
      (endHour - startHour) * 60 + (endMinute - startMinute),
      // Limit max duration to end of day
      (24 - startHour) * 60 - startMinute
    );

    return {
      top: `${startHour * 60 + startMinute}px`,
      height: `${Math.max(durationMinutes, 30)}px`, // Minimum height of 30px
    };
  };

  // Group events by time slot
  const getEventsForTimeSlot = (eventTime: Date) => {
    return todayEvents.filter((event) => {
      const eventStart = parseISO(event.start);
      return eventStart.getHours() === eventTime.getHours();
    });
  };

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
    <DayViewContainer>
      {/* Header showing current date */}
      <Box sx={{ p: 2,borderBottom: 1,borderColor: "divider",textAlign: "center" }}>
        <Typography variant="h6">{format(currentDate, "EEEE, MMMM d, yyyy")}</Typography>
      </Box>
      {/* Body of the events */}
      <TimeGridContainer>
        <TwentyFourHourColumn timeSlots={timeSlots} />
        <EventCell timeSlots={timeSlots} getEventsForTimeSlot={getEventsForTimeSlot} calculateEventPosition={calculateEventPosition} handleMultipleEventsClick={handleMultipleEventsClick} />
      </TimeGridContainer>
      {/* Dialog for multiple events */}
      <EventListDialog selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} handleEventClick={handleEventClick} />
      {/* Event detail dialog */}
      <EventDetailDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
    </DayViewContainer>
  );
};

export default DayView;
