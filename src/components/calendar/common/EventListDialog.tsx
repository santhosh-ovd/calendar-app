import EventListView from "./EventListView";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const EventListDialog = (props: any) => {
  const { selectedEvents, setSelectedEvents, handleEventClick } = props;
  return (
    <Dialog open={!!selectedEvents} onClose={() => setSelectedEvents(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Events at {selectedEvents?.time}</DialogTitle>
      <DialogContent>
        <EventListView events={selectedEvents?.events ?? []} setSelectedEvents={setSelectedEvents} handleEventClick={handleEventClick} />
      </DialogContent>
    </Dialog>
  );
};

export default EventListDialog;
