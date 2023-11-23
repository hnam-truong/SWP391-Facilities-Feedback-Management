/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Gallery from 'react-photo-gallery';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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

const PopUpTask = React.memo(({ task, status }) => {

    const { handleSubmit, formState: { errors } } = useForm();
    const [selectedFeedback, setselectedFeedback] = useState(null);

    // Add this state variable to hold the selected files
    const [showModal, setShowModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [employeeResponse, setEmployeeResponse] = useState();
    const [errorNotificationMessage, setErrorNotificationMessage] = useState("An error occurred while sending the report.");
    const [images, setImages] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (selectedImages.length + files.length > 5) {
            setShowErrorNotification(true);
            setErrorNotificationMessage("Cannot add more than 5 images.");
            return;
        }
        setSelectedImages([...selectedImages, ...files]);
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
        const formData = new FormData();
        selectedImages.forEach((file) => {
            formData.append('fileCollection', file, file.name);
        });
        try {
            const response = await fetch(`https://localhost:7157/api/Task/UpdateTaskResponse?Id=${task.id}&Response=${employeeResponse}`, {
                method: 'PUT',
                body: formData
            });
            const responseData = await response.json();
            console.log(responseData);
            // Notify when the report is created successfully
            setShowSuccessNotification(true);
            setShowModal(false);

            window.location.reload();
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
        const objectUrl = URL.createObjectURL(image);
        setPreviewUrl(objectUrl);
        setShowModal(true);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    const handleResponseChange = (event) => {
        if (employeeResponse === "") {
            setEmployeeResponse(event.target.value.trim());
        } else {
            setEmployeeResponse(event.target.value);
        }
    };

    return (
        <StyledContainer sx={{
            width: '80vw', // Make the container take up 80% of the viewport width
            maxWidth: '80vw', // Limit the maximum width of the container to 80% of the viewport width
            mx: 'auto', // Center the container horizontally
            px: { xs: 2, sm: 3, md: 4 }, // Add horizontal padding that increases with the screen size
        }}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h3" fontWeight="bold" mb={4} align="center" style={{ margin: '20px 0', fontSize: '2rem' }}>Feedback Details</Typography>

                <div>
                    <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1.5rem' }}>Title</Typography>
                    <Typography variant="body1" mb={4} style={{ fontSize: '1.2rem' }}>
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
                    <Typography variant="h5" fontWeight="medium" mb={1} mt={4} style={{ fontSize: '1.5rem' }}>More Details</Typography>
                    <Typography variant="body1" style={{ fontSize: '1.2rem' }}>
                        {selectedFeedback && selectedFeedback.description}
                    </Typography>
                </div>
                {(status === "Delivered") && (
                    <>
                        <Typography variant="h5" fontWeight="medium" mb={0} mt={4} style={{ fontSize: '1.5rem' }}>Response Message</Typography>
                        <TextField
                            fullWidth
                            inputProps={{ maxLength: 100 }}
                            variant="outlined"
                            name="respondMessage"
                            required
                            value={employeeResponse}
                            onChange={handleResponseChange}
                        />
                        <div>
                            <Typography variant="h5" fontWeight="medium" mb={1} mt={4}>Images</Typography>
                            <Button
                                component="label"
                                variant="contained"
                                color='info'
                                onChange={handleFileChange}
                                startIcon={<CloudUploadIcon />}>
                                Upload your images
                                <VisuallyHiddenInput accept="image/*" type="file" name="file" multiple />
                            </Button>
                            <Gallery photos={selectedImages} />
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            {selectedImages.map((selectedImage, index) => {
                                const objectUrl = URL.createObjectURL(selectedImage);
                                return (
                                    <Box key={index} sx={{ position: 'relative', cursor: 'pointer', display: 'inline-block', marginBottom: '8px' }}>
                                        <img onClick={() => handleImageClick(selectedImage)} src={objectUrl} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                        <Button
                                            onClick={() => handleRemoveImage(index)}
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                color: "#fff",
                                                backgroundColor: "#ff0000",
                                                padding: '10px',
                                                borderRadius: '0',
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                );
                            })}
                        </div>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                            <StyledButton
                                type="submit"
                                variant="contained"
                                style={{ fontSize: '1.2rem', padding: '10px 20px', marginLeft: '10px' }}
                            >
                                Respond Task
                            </StyledButton>
                        </Box>
                    </>
                )}
                <br />
            </StyledForm>
            {showModal && (
                <StyledModal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
                    <StyledImage
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            borderRadius: '8px',
                            objectFit: 'cover', // Add this line to make the image fit within its container
                        }}
                    />
                </StyledModal>
            )}
            {showSuccessNotification && (
                <MDSnackbar
                    color="success"
                    icon="check"
                    title="Success"
                    content="Response sent successfully!"
                    dateTime=""
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
                    content={errorNotificationMessage}
                    dateTime=""
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