import { format, parseISO } from "date-fns";
import { Box, Typography, Dialog, DialogTitle, DialogContent, Button, styled, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

const FileButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  }
}));

interface EventDetailDialogProps {
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
}

const EventDetailDialog: React.FC<EventDetailDialogProps> = ({ selectedEvent, setSelectedEvent }) => {
  if (!selectedEvent) return null;

  return (
    <Dialog 
      open={!!selectedEvent} 
      onClose={() => setSelectedEvent(null)} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        
        <IconButton 
          size="small" 
          onClick={() => setSelectedEvent(null)}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
        <Box>
          <DetailRow>
        <Typography variant="body2">
          Interview With: {selectedEvent.user_det.candidate.candidate_firstName}
        </Typography>
          </DetailRow>
          <DetailRow>
            <Typography variant="body2">
              Position: {selectedEvent.job_id.jobRequest_Title}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography variant="body2">
              Created By: -
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography variant="body2">
              Interview Date: {format(parseISO(selectedEvent.start), "dd MMM yyyy")}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography variant="body2">
              Interview Time: {format(parseISO(selectedEvent.start), "hh:mm a")} - {format(parseISO(selectedEvent.end), "hh:mm a")}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography variant="body2">
              Interview Via: Google Meet
            </Typography>
          </DetailRow>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FileButton
              startIcon={<VisibilityIcon />}
              endIcon={<FileDownloadIcon />}
              fullWidth
              variant="outlined"
              disableElevation
            >
              Resume.docx
            </FileButton>

            <FileButton
              startIcon={<VisibilityIcon />}
              endIcon={<FileDownloadIcon />}
              fullWidth
              variant="outlined"
              disableElevation
            >
              Aadhardcard
            </FileButton>
          </Box>
        </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
            {/* Image Icon  with google meet icon logo*/}
            <img src="https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png" alt="Google Logo" />
            {selectedEvent.link && (
            <Box sx={{ mt: 2 }}>
              <Button 
                href={selectedEvent.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                JOIN
              </Button>
            </Box>
          )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
