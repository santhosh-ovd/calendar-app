import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { parseISO, format } from "date-fns";

const EventListView = (props: any) => {
  const { events, setSelectedEvents, handleEventClick } = props;

  const handleClick = (event: any) => {
    setSelectedEvents(null);
    handleEventClick(event);
  };

  const boxStyle = { display: "flex", flexDirection: "column",justifyContent: "center", gap: 0.25 };
  const style = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

  return (
      <Box margin={1}>
        {events?.map((event: any) => (
          <Box onClick={() => handleClick(event)} sx={{width: "300px", display: 'flex', direction: 'row', boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", marginTop:1 }}>
          <Box sx={{ backgroundColor: "primary.main", width: "2%",borderRadius:'5px 0 0 5px' }}></Box>
          <Box sx={{ ...boxStyle, width: "95%", padding: "4px" }}>
            <Box sx={{display: 'flex', direction: 'row', justifyContent: 'space-between',alignItems: 'center'}}>

            <Typography variant="caption" fontWeight="bold" sx={style}>
              {event?.job_id?.jobRequest_Title ?? "-"}
            </Typography>
            <Box sx={{display: 'flex', direction: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
              {/* edit icon and delete icon */}
              <IconButton>
                <EditOutlined sx={{color: "primary.main", fontSize: "16px"}} />
              </IconButton>
              <IconButton>
                <DeleteOutlined sx={{color: "red", fontSize: "16px"}} />
              </IconButton>
            </Box>
            </Box>
            <Typography variant="caption" color="inherit" sx={style}>
              {`Interviewer: ${event?.user_det?.handled_by?.firstName ?? "-"}`}
            </Typography>
            <Typography variant="caption" sx={style}>
              {format(parseISO(event.start), "h:mm a")} - {format(parseISO(event.end), "h:mm a")}
            </Typography>
          </Box>
        </Box>
        ))}
      </Box>
  );
};

export default EventListView;
