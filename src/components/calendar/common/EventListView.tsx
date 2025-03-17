import { List, ListItem, ListItemText } from "@mui/material";

const EventListView = (props: any) => {
  const { events, setSelectedEvents, handleEventClick } = props;

  const handleClick = (event: any) => {
    setSelectedEvents(null);
    handleEventClick(event);
  };

  return (
      <List>
        {events?.map((event: any) => (
          <ListItem key={event.id} onClick={() => handleClick(event)} sx={{ cursor: "pointer", border: "1px solid skyblue", marginTop:2 }}>
            <ListItemText
              primary={event.job_id.jobRequest_Title}
              secondary={
                <>
                  Interviewer: {event.user_det.handled_by.firstName}
                  <br />
                  Candidate: {event.user_det.candidate.candidate_firstName}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
  );
};

export default EventListView;
