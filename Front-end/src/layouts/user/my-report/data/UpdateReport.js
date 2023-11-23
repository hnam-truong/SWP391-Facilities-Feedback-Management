/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";
import ReactPhotoGallery from 'react-photo-gallery';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    zIndex: 1000,
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

const StyledTextField = styled(TextField)(() => ({
    width: '100%',
    borderRadius: '8px',
    '& .MuiInputBase-root': {
        padding: '16px',
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


const UpdateReport = React.memo(({ selectedFeedback }) => {

    const { register, handleSubmit, formState, setValue } = useForm();
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(
        { label: selectedFeedback.locationId, value: selectedFeedback.locationId }
    );
    const [selectedCategory, setSelectedCategory] = useState(
        { label: selectedFeedback.cate.description, value: selectedFeedback.cateId }
    );
    const [showModal, setShowModal] = useState(false);
    const [roomOptions, setRoomOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [dateTime, setDateTime] = useState(new Date().toLocaleString());
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [filteredRoomOptions, setFilteredRoomOptions] = useState([]);
    const [roomDisabled, setRoomDisabled] = useState(true);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorNotificationMessage, setErrorNotificationMessage] = useState("");

    useEffect(() => {
        const initialCampus = selectedRoom.label.startsWith('NVH') ? { value: 'NVH', label: 'NVH' } : { value: 'FPTU HCM', label: 'FPTU HCM' };
        setSelectedCampus(initialCampus);
    }, []);

    const campusOptions = useMemo(() => [{ value: 'FPTU HCM', label: 'FPTU HCM' }, { value: 'NVH', label: 'NVH' }], []);

    useEffect(() => {
        const fetchRoomOptions = async () => {
            try {
                const response = await fetch('https://localhost:7157/api/Location/GetAllLocation');
                const data = await response.json();
                const options = data.map((room) => ({ value: room.locationId, label: room.locationId }));

                const filteredOptions = selectedCampus?.value === 'NVH'
                    ? options.filter((room) => room.label.startsWith('NVH'))
                    : options.filter((room) => !room.label.startsWith('NVH'));

                setRoomOptions(options);
                setFilteredRoomOptions(filteredOptions);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCategoryOptions = async () => {
            try {
                const response = await fetch('https://localhost:7157/api/Cate/GetAllCate');
                const data = await response.json();
                const options = data.map((category) => ({ value: category.id, label: category.description }));
                setCategoryOptions(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategoryOptions();
        fetchRoomOptions();
    }, [selectedCampus]);


    useEffect(() => { if (formState.errors.file) setSelectedImages(null); }, [formState.errors.file]);

    const onSubmit = async (data) => {
        const { Title, MoreDetails } = data;
        const { value: campus = '' } = selectedCampus || {};
        const { value: room = '' } = selectedRoom || {};
        const { value: category = '' } = selectedCategory || {};

        const formData = new FormData();
        formData.set('Campus', campus);
        formData.set('Room', room);
        formData.set('Category', category);
        formData.set('Title', Title);
        formData.set('MoreDetails', MoreDetails);
        formData.set('status', 'Open');
        selectedFiles.forEach((file) => {
            formData.append('fileCollection', file, file.name);
        });

        try {
            const response = await fetch("https://localhost:7157/api/Feedbacks/Update?"
                + "feedbackId=" + selectedFeedback.feedbackId
                + "&userId=" + selectedFeedback.userId
                + "&title=" + Title
                + "&description=" + MoreDetails
                + "&cateId=" + category
                + "&locatoinId=" + room,

                { method: 'PUT', body: formData });
            const responseData = await response.json();
            console.log(responseData);
            // Notify when the report is created successfully
            setShowSuccessNotification(true);
            setShowModal(false);

            window.location.reload();
        } catch (error) {
            console.error(error);
            setShowErrorNotification(true);
            setErrorNotificationMessage("An error occurred while updating the report!");
        }
    };
    useEffect(() => {
        const apiUrl = `https://localhost:7157/api/Feedbacks/GetFile?feedbackId=${selectedFeedback.feedbackId}`;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched images:", data); // Log the fetched data to the console

                const fetchedImages = data.map((imageUrl) => ({
                    src: imageUrl, // 'imageUrl' is a URL of an image
                    width: 1,
                    height: 1,
                }));
                setImages(fetchedImages);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [selectedFeedback.feedbackId]);
    const handleFileChange = (event) => {
        const newSelectedFiles = Array.from(event.target.files);
        if (images.length + newSelectedFiles.length > 5) {
            setShowErrorNotification(true);
            setErrorNotificationMessage("Cannot add more than 5 images.");
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
        const interval = setInterval(() => {
            setDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const handleCampusChange = (selectedOption) => {
        setSelectedCampus(selectedOption);
        setSelectedRoom(null);

        setRoomDisabled(false);
    };
    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);

        setImages(updatedImages);
        setSelectedFiles(updatedFiles);
    };

    return (
        <StyledContainer sx={{
            width: '100%', // Make the container take up the full width of its parent
            maxWidth: '600px', // Limit the maximum width of the container
            mx: 'auto', // Center the container horizontally
            px: { xs: 2, sm: 3, md: 4 }, // Add horizontal padding that increases with the screen size
        }}>

            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4" fontWeight="bold" mb={4} align="center" style={{ margin: '20px 0' }}>Update Report</Typography>
                <Typography variant="h6" fontWeight="medium" mb={1}>{dateTime}</Typography>
                <div>
                    <Typography variant="h6" fontWeight="medium" mb={1}>Title</Typography>
                    <StyledTextField
                        type="text"
                        name="Title"
                        defaultValue={selectedFeedback.title.toUpperCase()}
                        inputProps={{
                            maxLength: 40,
                            style: { fontSize: '1.2rem', height: '80%' } // Increase the font size
                        }}
                        {...register('Title', { required: true, maxLength: 40 })}
                        error={formState.errors.Title}
                        helperText={formState.errors.Title && 'Title is required'}
                    />
                </div>
                <StyledRow mt={4}>
                    <div>
                        <Typography variant="h6" fontWeight="medium" mb={1}>Campus</Typography>
                        <StyledSelect
                            name="Campus"
                            id="Campus"
                            options={campusOptions}
                            value={selectedCampus}
                            onChange={handleCampusChange} // Add the onChange handler
                            required
                            isSearchable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    width: 200, // Set a fixed width
                                    borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor,
                                    '&:hover': { borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor },
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <Typography variant="h6" fontWeight="medium" mb={1}>Room</Typography>
                        <StyledSelect
                            name="Room"
                            id="Room"
                            options={filteredRoomOptions}
                            value={selectedRoom}
                            onChange={setSelectedRoom}

                            required
                            isSearchable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    borderColor: formState.errors.Room ? '#f44336' : provided.borderColor,
                                    '&:hover': { borderColor: formState.errors.Room ? '#f44336' : provided.borderColor },
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <Typography variant="h6" fontWeight="medium" mb={1}>Category</Typography>
                        <StyledSelect name="Category" id="Category" options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} required isSearchable styles={{ control: (provided) => ({ ...provided, borderColor: formState.errors.Category ? '#f44336' : provided.borderColor, '&:hover': { borderColor: formState.errors.Category ? '#f44336' : provided.borderColor } }) }} />
                    </div>
                </StyledRow>
                <div>
                    <Typography variant="h6" fontWeight="medium" mt={4} mb={1}>More Details</Typography>
                    <StyledTextField
                        type="text"
                        name="MoreDetails"
                        // label="More Details"
                        inputProps={{ maxLength: 300 }}
                        {...register('MoreDetails', { required: true, maxLength: 300 })}
                        error={formState.errors.MoreDetails}
                        helperText={formState.errors.MoreDetails && 'More Details is required'}
                        sx={{ height: '200px' }}
                        multiline
                        rows={5}
                        defaultValue={selectedFeedback.description} // Set the initial value to selectedFeedback.description

                    />
                </div>
                <div>
                    <Typography variant="h6" fontWeight="medium" mb={1}>
                        Images
                    </Typography>
                    <Button
                        sx={{ mb: '1rem' }}
                        component="label"
                        variant="contained"
                        color='info'
                        onChange={handleFileChange}
                        startIcon={<CloudUploadIcon />}>
                        Upload your images
                        <VisuallyHiddenInput type="file" name="file" multiple />
                    </Button>
                    <ReactPhotoGallery
                        photos={images}
                        renderImage={({ index, photo }) => (
                            <div key={index} style={{ margin: '10px', position: 'relative' }}>
                                <StyledImage
                                    src={photo.src}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        setPreviewUrl(photo.src); // Set the previewUrl when an image is clicked
                                        setShowModal(true);
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ color: "#fff", backgroundColor: "#ff0000", marginBottom: '2px' }}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                    }}
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    />

                </div>
                <Box
                    sx={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2px',
                        marginBottom: '16px',
                        px: { xs: 2, sm: 3, md: 4 }, // add horizontal padding that increases with the screen size
                    }}>
                    <StyledButton style={{ fontSize: '1.2rem', padding: '10px 20px', marginTop: '2rem' }} type="submit" variant="contained">Send Report</StyledButton>
                </Box>
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
                    content="Report is updated successfully"
                    // dateTime={new Date().toLocaleString()}
                    open={showSuccessNotification}
                    onClose={() => setShowSuccessNotification(false)}
                    close={() => setShowSuccessNotification(false)}
                />
            )}
            {showErrorNotification && (
                <MDSnackbar
                    color="error"
                    icon="warning"
                    dateTime=""
                    title="Error"
                    content={errorNotificationMessage}
                    open={showErrorNotification}
                    onClose={() => setShowErrorNotification(false)}
                    close={() => setShowErrorNotification(false)}
                />
            )}
        </StyledContainer>
    );
});

export default UpdateReport;