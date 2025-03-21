import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { format, startOfMonth, isSameMonth, parseISO, isSameDay, startOfWeek, addDays } from "date-fns";
import { CalendarEvent, EventGroup } from "./types";
import EventListDialog from "./common/EventListDialog";
import EventDetailDialog from "./common/EventDetailDialog";
import { CountBadge } from "../ui/CountBadge";

const MonthViewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const WeekDaysHeader = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const MonthGrid = styled(Box)(() => ({
  flex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gridAutoRows: "minmax(120px, 1fr)",
  overflow: "auto",
}));

const DayCell = styled(Box)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  position: "relative",
  overflow: "hidden",
}));

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events }) => {
  const [selectedEvents, setSelectedEvents] = useState<EventGroup | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Get all days in the month
  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);

  // Generate calendar days (6 weeks)
  const calendarDays = Array.from({ length: 42 }, (_, i) => addDays(startDate, i));

  // Fixed day names
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getEventsGroupedByTime = (day: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = parseISO(event.start);
      return isSameDay(eventDate, day);
    });

    // Group events by start time
    const groupedEvents = dayEvents.reduce((acc, event) => {
      const startTime = format(parseISO(event.start), "HH:mm");
      if (!acc[startTime]) {
        acc[startTime] = [];
      }
      acc[startTime].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return Object.entries(groupedEvents)
      .map(([time, events]) => ({
        time,
        events,
        count: events.length,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleMultipleEventsClick = (events: CalendarEvent[], date: Date) => {
    console.log(events, "events");
    if (events.length > 1) {
      setSelectedEvents({ time: format(date, "MMMM d, yyyy"), events });
    } else if (events.length === 1) {
      handleEventClick(events[0]);
    }
  };

  const style = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  const positionStyle = { position: "absolute", height: "70px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "10px", margin: "0 5px" };
  const boxStyle = { display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.25 };

  return (
    <MonthViewContainer>
      <WeekDaysHeader>
        {dayNames.map((day) => (
          <Box key={day} sx={{ p: 1, textAlign: "center", borderRight: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle2">{day}</Typography>
          </Box>
        ))}
      </WeekDaysHeader>

      <MonthGrid>
        {calendarDays.map((day) => {
          const eventGroups = getEventsGroupedByTime(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <DayCell key={day.toString()} sx={{ bgcolor: isCurrentMonth ? "background.paper" : "action.hover" }}>
              <Typography variant="body2" sx={{ color: isCurrentMonth ? "text.primary" : "text.secondary", mb: 1 }}>
                {format(day, "d")}
              </Typography>

              {eventGroups?.map((item: any) => {
                const event = item?.events[0]??{};
                return(
                <Box key={event.time} >
                  {event && <Box sx={{ display: "flex", ...positionStyle, width: "100%", left: 0 }} onClick={() => handleMultipleEventsClick(item?.events, day)}>
                    <Box sx={{ backgroundColor: "primary.main", width: "5%" }}></Box>
                    <Box sx={{ ...boxStyle, width: "95%", padding: "4px" }}>
                      {event.count > 1 && <CountBadge label={event.count} size="small" />}
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
                </Box>
              )}
              )}
            </DayCell>
          );
        })}
      </MonthGrid>

      <EventListDialog selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} handleEventClick={handleEventClick} />
      <EventDetailDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
    </MonthViewContainer>
  );
};

export default MonthView;
