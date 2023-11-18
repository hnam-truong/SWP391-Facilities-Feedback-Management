/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { MenuItem } from '@material-ui/core';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Gallery from 'react-photo-gallery';
import MDSnackbar from "components/MDSnackbar";
const StyledContainer = styled(Container)`
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  backgroundColor: '#f5f5f5',
  padding: '24px',
  
  @media (min-width: 768px) {
    padding: '48px',
  }

  @media (min-width: 1024px) {
    padding: '64px',
  }
`;
const StyledForm = styled('form')(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh', // make the form take up the full viewport height
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
}));

const StyledRow = styled(Box)(() => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '40px',
    width: '100%',
    '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
}));
const StyledSelect = styled(Select)(() => ({
    width: '100%',
    borderRadius: '12px',

    '& .MuiSelect-root': {
        padding: '16px',
        borderColor: '#ccc',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    },
    '& .MuiInputBase-input': {
        fontSize: '16px',
        color: '#333',
    },
    '& .MuiInput-underline': {
        '&:before, &:after': {
            borderBottom: 'none',
        },
        '&:hover:not(.Mui-disabled):before, &:hover:not(.Mui-disabled):after': {
            borderBottom: 'none',
        },
        '&.Mui-error:after, &.Mui-error:hover:not(.Mui-disabled):before, &.Mui-error:hover:not(.Mui-disabled):after': {
            borderBottomColor: '#f44336',
        },
    },
    '& .MuiSelect-menu': {
        maxHeight: '200px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
        animation: 'expandMenu 0.2s ease-in-out',
    },
    '& .MuiSelect-menu-list': {
        padding: '8px',
    },
    '& .MuiListItem-root:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const StyledButton = styled(Button)(() => ({
    width: '100%',
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'bg-gradient-to-r from-pink-500 to-yellow-500',
    color: '#fff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'bg-gradient-to-r from-yellow-500 to-pink-500',
        transform: 'scale(1.05)',
    },
}));

const StyledModal = styled(motion.div)(() => ({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width: '50%',
    borderRadius: '8px',
    overflow: 'hidden',
}));

const StyledImage = styled('img')(() => ({
    maxWidth: '100%',
    maxHeight: '100%',
}));

const PopUpTask = React.memo(({ task }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedFeedback, setselectedFeedback] = useState(null);

    // Add this state variable to hold the selected files
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [dateTime, setDateTime] = useState(new Date().toLocaleString());
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
    };
 
    const [images, setImages] = useState([]);
    const handleFileChange = (event) => {
        const newSelectedFiles = Array.from(event.target.files);
        if (images.length + newSelectedFiles.length > 5) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your feedback cannot have more than 5 images.',
            });
            return;
        }

        setSelectedFiles([...selectedFiles, ...newSelectedFiles]);

        const newSelectedImages = newSelectedFiles.map((file) => ({
            src: URL.createObjectURL(file),
            width: 1,
            height: 1,
        }));
        setImages([...images, ...newSelectedImages]);
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`https://localhost:7157/api/Feedbacks/Id/${task.feedbackId}`);
                const data = await response.json();
                setselectedFeedback(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (task && task.feedbackId) { // Add null check for task
            fetchFeedback();
        }
    }, [task]); // Depend on task instead of task.feedbackId



    useEffect(() => {
        if (selectedFeedback) {
            fetch(`https://localhost:7157/api/Feedbacks/GetFile?feedbackId=${selectedFeedback.feedbackId}`)
                .then(response => response.json())
                .then(data => setImages(data));
        }
    }, [selectedFeedback]);

    const onSubmit = async (data) => {
        const { respondMessage } = data;
        console.log('respondMessage:', respondMessage); // Check the value of respondMessage
        console.log('task.id:', task.id); // Check the value of task.id

        const formData = new FormData();

        formData.set('Response', respondMessage);
        selectedFiles.forEach((file) => {
            formData.append('fileCollection', file, file.name);
        });
        console.log(selectedFiles);
        if (images.length + selectedFiles.length > 5) {
            toast.error("Cannot add more than 5 images.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:7157/api/Task/UpdateTaskResponse?Id=${task.id}&Response=${encodeURIComponent(respondMessage)}`, {
                method: 'PUT',
                body: formData
            });
            const responseData = await response.json();
            console.log(responseData);
            // Notify when the report is created successfully
            setShowSuccessNotification(true);
            setShowModal(false);

        } catch (error) {
            console.error(error);
            setShowErrorNotification(true);
        }
    };


    // Cleanup the object URLs after using them
    useEffect(() => {
        return () => {
            selectedImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [selectedImages]);
    const handleImageClick = (image) => {
        setPreviewUrl(image);
        setShowModal(true);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);



    return (
        <StyledContainer sx={{
            width: '80vw', // Make the container take up 80% of the viewport width
            maxWidth: '80vw', // Limit the maximum width of the container to 80% of the viewport width
            mx: 'auto', // Center the container horizontally
            px: { xs: 2, sm: 3, md: 4 }, // Add horizontal padding that increases with the screen size
        }}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h3" fontWeight="bold" mb={4} align="center" style={{ margin: '20px 0', fontSize: '2rem' }}>Task</Typography>

                <div>
                    <Typography variant="h5" fontWeight="medium" mb={1} align="center" style={{ fontSize: '1.5rem' }}>Title</Typography>
                    <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                        {selectedFeedback && selectedFeedback.title}
                    </Typography>
                </div>
                <StyledRow>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>Campus</Typography>
                        <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {selectedFeedback && selectedFeedback.locationId}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>Room</Typography>
                        <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {selectedFeedback && selectedFeedback.locationId}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>Category</Typography>
                        <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                            {selectedFeedback && selectedFeedback.cate && selectedFeedback.cate.description}
                        </Typography>
                    </div>
                </StyledRow>
                <div>
                    <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>More Details</Typography>
                    <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                        {selectedFeedback && selectedFeedback.description}
                    </Typography>
                </div>
                <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>Response Message</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    name="respondMessage"
                    {...register('respondMessage')}
                />
                <div>
                    <Typography variant="h5" fontWeight="medium" mb={1}>Images</Typography>
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                    <Gallery photos={selectedImages} />
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>

                    <StyledButton
                        variant="contained"
                        style={{ fontSize: '1.2rem', padding: '10px 20px', marginLeft: '10px' }}
                        onClick={handleSubmit(onSubmit)} // Add this line
                    >
                        Responded Task
                    </StyledButton>             
                       </Box>
            </StyledForm>

            {showSuccessNotification && (
                <MDSnackbar
                    color="success"
                    icon="check"
                    title="Success"
                    content="Report sent successfully"
                    dateTime={new Date().toLocaleString()}
                    open={showSuccessNotification}
                    onClose={() => setShowSuccessNotification(false)}
                    close={() => setShowSuccessNotification(false)}
                />
            )}
            {showErrorNotification && (
                <MDSnackbar
                    color="error"
                    icon="warning"
                    title="Error"
                    content="An error occurred while sending the report."
                    open={showErrorNotification}
                    onClose={() => setShowErrorNotification(false)}
                    close={() => setShowErrorNotification(false)}
                />
            )}
        </StyledContainer>
    );
},

);

export default PopUpTask;