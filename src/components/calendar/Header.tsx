import React from "react";
import { Box, Button, ButtonGroup, IconButton, Typography, styled } from "@mui/material";
import { ChevronLeft, ChevronRight, Today, ViewDay, ViewWeek, ViewModule, ViewAgenda, Add } from "@mui/icons-material";
import { ViewType } from "../types";
import { format, addDays, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1),
  display: "flex",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

interface HeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
}

/**
 * Calendar header component with navigation and view controls
 */
const CalendarHeader: React.FC<HeaderProps> = ({ currentDate, view, onViewChange, onDateChange }) => {
  const handleToday = () => onDateChange(new Date());

  const handlePrevious = () => {
    switch (view) {
      case "day":
        onDateChange(addDays(currentDate, -1));
        break;
      case "week":
        onDateChange(addDays(currentDate, -7));
        break;
      case "month":
        onDateChange(addMonths(currentDate, -1));
        break;
      default:
        onDateChange(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    switch (view) {
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
      case "week":
        onDateChange(addDays(currentDate, 7));
        break;
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
      default:
        onDateChange(addDays(currentDate, 7));
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week": {
        const start = startOfWeek(currentDate);
        const end = endOfWeek(currentDate);
        return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      }
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <Box>
      <HeaderContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">Your Todo's</Typography>
        </Box>

        <Box sx={{ ml: "auto" }}>
          <Button size="small" fullWidth variant="contained" startIcon={<Add />} sx={{ mb: 2 }}>
            Create
          </Button>
        </Box>
      </HeaderContainer>

      <HeaderContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="contained" startIcon={<Today />} onClick={handleToday}>
            Today
          </Button>

          <ButtonGroup size="small">
            <IconButton onClick={handlePrevious}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ChevronRight />
            </IconButton>
          </ButtonGroup>

          <Typography variant="h6">{getHeaderTitle()}</Typography>
        </Box>

        <Box sx={{ ml: "auto" }}>
          <ButtonGroup>
            <Button onClick={() => onViewChange("day")} variant={view === "day" ? "contained" : "outlined"}>
              Day
            </Button>
            <Button onClick={() => onViewChange("week")} variant={view === "week" ? "contained" : "outlined"}>
              Week
            </Button>
            <Button onClick={() => onViewChange("month")} variant={view === "month" ? "contained" : "outlined"}>
              Month
            </Button>
          </ButtonGroup>
        </Box>
      </HeaderContainer>
    </Box>
  );
};

export default CalendarHeader;
