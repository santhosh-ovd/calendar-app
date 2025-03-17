import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import CalendarHeader from './Header';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import { ViewType } from './types';
import eventss from '@/util/event.json';

const CalendarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: theme.palette.background.default
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

/**
 * Main Google Calendar component that manages the layout and state
 */
const GoogleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');

  // Transform the events to ensure proper date handling
  const transformedEvents: any = eventss.map(event => ({
    ...event,
    score: event.score || {} // Ensure score is always an object
  }));

  const renderView = () => {
    switch (view) {
      case 'day':
        return <DayView currentDate={currentDate} events={transformedEvents} />;
      case 'week':
        return <WeekView currentDate={currentDate} events={transformedEvents} />;
      case 'month':
        return <MonthView currentDate={currentDate} events={transformedEvents} />;
      default:
        return <WeekView currentDate={currentDate} events={transformedEvents} />;
    }
  };

  return (
    <CalendarContainer>
      <MainContent>
        <CalendarHeader  currentDate={currentDate} view={view} onViewChange={setView} onDateChange={setCurrentDate} />
        {renderView()}
      </MainContent>
    </CalendarContainer>
  );
};

export default GoogleCalendar;