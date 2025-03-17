import React, { useState } from "react";
import { Box, Typography, styled, Chip } from "@mui/material";
import { format, startOfMonth, isSameMonth, parseISO, isSameDay, startOfWeek, addDays } from "date-fns";
import { CalendarEvent, EventGroup } from "./types";
import EventListDialog from "./common/EventListDialog";
import EventDetailDialog from "./common/EventDetailDialog";

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

const MonthGrid = styled(Box)(({ theme }) => ({
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

const EventBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  fontSize: "0.75rem",
  cursor: "pointer",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  "&:hover": {
    filter: "brightness(0.95)",
  },
}));

const CountBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: "#FFD700",
  color: theme.palette.common.black,
  height: 20,
  minWidth: 20,
  marginLeft: theme.spacing(1),
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
    if (events.length > 1) {
      setSelectedEvents({ time: format(date, "MMMM d, yyyy"), events });
    } else if (events.length === 1) {
      handleEventClick(events[0]);
    }
  };

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
          console.log(eventGroups,'eeeeee');

          return (
            <DayCell key={day.toString()} sx={{ bgcolor: isCurrentMonth ? "background.paper" : "action.hover" }}>
              <Typography variant="body2" sx={{ color: isCurrentMonth ? "text.primary" : "text.secondary", mb: 1 }} >
                {format(day, "d")}
              </Typography>

              {eventGroups.slice(0, 3).map((group) => (
                <EventBlock key={group.time} onClick={() => handleMultipleEventsClick(group.events, day)} sx={{ position: "relative" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {format(parseISO(group.events[0].start), "h:mm a")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {group.events[0].job_id.jobRequest_Title}
                    </Typography>
                    {group.count > 1 && (
                      <CountBadge
                        label={group.count}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          height: 16,
                          minWidth: 16,
                          fontSize: "0.65rem",
                        }}
                      />
                    )}
                  </Box>
                </EventBlock>
              ))}

              {eventGroups.length > 3 && (
                <Box sx={{ textAlign: "right", mt: 0.5 }}>
                  <CountBadge
                    label={`+${eventGroups.length - 3} more`}
                    size="small"
                    onClick={() =>
                      handleMultipleEventsClick(
                        eventGroups.slice(3).flatMap((g) => g.events),
                        day
                      )
                    }
                  />
                </Box>
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
