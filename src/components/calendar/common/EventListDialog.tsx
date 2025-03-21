import EventListView from "./EventListView";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

const EventListDialog = (props: any) => {
  const { selectedEvents, setSelectedEvents, handleEventClick } = props;
  return (
    <Dialog open={!!selectedEvents} onClose={() => setSelectedEvents(null)} maxWidth="sm">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingX: 2, marginY:0 }}>
        <Typography variant="h6">Meetings</Typography>
        <IconButton onClick={() => setSelectedEvents(null)}> x </IconButton>
      </Box>
        <EventListView events={selectedEvents?.events ?? []} setSelectedEvents={setSelectedEvents} handleEventClick={handleEventClick} />
    </Dialog>
  );
};

export default EventListDialog;
