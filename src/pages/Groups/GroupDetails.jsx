import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';

function GroupDetails() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: groupId } = useParams();
  const [group, setGroup] = useState({
    name: "",

  });

  titleHelper("Group Details", group.name);
  //Deletion Confirmation
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //CRUD Functions
  const handleGetGroup = () => {
    setLoading(true);
    http.get(`/Group/${groupId}`).then((res) => {
      if (res.status === 200) {
        setGroup(res.data);
        setLoading(false);

      }
    });
  };

  const deleteGroup = () => {
    http.delete(`/group/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/groupList");
      });
  }

  useEffect(() => {
    handleGetGroup();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }} component="form" onSubmit={formik.handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Group
          </Typography>
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Button sx={{ mt: 2 }} variant="contained" type="submit">
            Edit
          </Button>
        </Box>
      </Modal >
      <Button variant="contained" sx={{ ml: 2 }} color="error"
        onClick={deleteGroup}>
        Delete
      </Button>

      <Typography>{group.title}</Typography>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Group
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteGroup}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GroupDetails;