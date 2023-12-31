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
    display: 'flex',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '40px',
    width: '100%',
    '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
    flexWrap: 'wrap',
    justifyContent: 'space-between'
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
    const [selectedLocation, setSelectedLocation] = useState(
        { label: selectedFeedback.locationId, value: selectedFeedback.locationId }
    );
    const [selectedCategory, setSelectedCategory] = useState(
        { label: selectedFeedback.cate.description, value: selectedFeedback.cateId }
    );
    const [showModal, setShowModal] = useState(false);
    const [locationOptions, setLocationOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [dateTime, setDateTime] = useState(new Date().toLocaleString());
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [filteredLocationOptions, setFilteredLocationOptions] = useState([]);
    const [locationDisabled, setLocationDisabled] = useState(true);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorNotificationMessage, setErrorNotificationMessage] = useState("");
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        const initialCampus = selectedLocation.label.startsWith('NVH') ? { value: 'NVH', label: 'NVH' } : { value: 'FPTU HCM', label: 'FPTU HCM' };
        setSelectedCampus(initialCampus);
    }, []);

    const campusOptions = useMemo(() => [{ value: 'FPTU HCM', label: 'FPTU HCM' }, { value: 'NVH', label: 'NVH' }], []);

    useEffect(() => {
        const fetchLocationOptions = async () => {
            try {
                const response = await fetch('https://localhost:7157/api/Location/GetAllLocation');
                const data = await response.json();
                const options = data.map((location) => ({ value: location.locationId, label: location.locationId }));

                const filteredOptions = selectedCampus?.value === 'NVH'
                    ? options.filter((location) => location.label.startsWith('NVH'))
                    : options.filter((location) => !location.label.startsWith('NVH'));

                setLocationOptions(options);
                setFilteredLocationOptions(filteredOptions);
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
        fetchLocationOptions();
    }, [selectedCampus]);


    useEffect(() => { if (formState.errors.file) setSelectedImages(null); }, [formState.errors.file]);

    const onSubmit = async (data) => {
        const { Title, MoreDetails } = data;
        const { value: campus = '' } = selectedCampus || {};
        const { value: location = '' } = selectedLocation || {};
        const { value: category = '' } = selectedCategory || {};

        const formData = new FormData();
        formData.set('Campus', campus);
        formData.set('Location', location);
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
                + "&locatoinId=" + location,

                { method: 'PUT', body: formData });
            const responseData = await response.json();
            console.log(responseData);
            // Notify when the report is updated successfully
            
            // If there are images to delete, call the delete API

            if (imagesToDelete.length > 0) {
                let fileNamesParameters = imagesToDelete.map(name => `fileNames=${name}`).join('&');
                const deleteUrl = `https://localhost:7157/api/Feedbacks/DeleteFiles?feedbackId=${selectedFeedback.feedbackId}&${fileNamesParameters}`;

                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
                if (!deleteResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                // const deleteResponseData = await deleteResponse.json();
                // console.log(deleteResponseData);
                console.log(imagesToDelete); // Log the imagesToDelete array after the DELETE method is run

                // Clear imagesToDelete
                setImagesToDelete([]);
                console.log(imagesToDelete); // Log the imagesToDelete array after it is cleared
            } else {
                console.log('No images to delete');
            }

            if (responseData.responseCode === 200) {
                setShowSuccessNotification(true);
                setShowModal(false);
                window.location.reload();
            } else if (responseData.responseCode === 4000){
                setShowErrorNotification(true);
                setErrorNotificationMessage("Type of Feedback is already exist in this location");
            } else {
                setShowErrorNotification(true);
                setErrorNotificationMessage("An error occurred while updating the report!");
            }

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
        let fileIndex = selectedFiles.length;
        const newSelectedFiles = Array.from(event.target.files).map(file => {
            const nameParts = file.name.split('.');
            const extension = nameParts.pop();
            const nameWithoutExtension = nameParts.join('.');
            const newName = `${nameWithoutExtension}-${++fileIndex}.${extension}`;
            console.log(newName); // Log the new file name
            return new File([file], newName, { type: file.type });
        });

        if (images.length + newSelectedFiles.length > 5) {
            setShowErrorNotification(true);
            setErrorNotificationMessage("Cannot add more than 5 images.");
            return;
        }

        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...newSelectedFiles]);

        const newSelectedImages = newSelectedFiles.map((file) => ({
            src: URL.createObjectURL(file),
            width: 1,
            height: 1,
        }));
        setImages(prevImages => [...prevImages, ...newSelectedImages]);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const handleCampusChange = (selectedOption) => {
        setSelectedCampus(selectedOption);
        setSelectedLocation(null);

        setLocationDisabled(false);
    };
    const handleRemoveImage = (imageUrl, indexToRemove) => {
        console.log(indexToRemove); // Log the index to remove

        // Only proceed if the image at indexToRemove exists
        if (images[indexToRemove]) {
            // Check if the image URL starts with the base URL of your API
            if (imageUrl.startsWith('https://localhost:7157/')) {
                // This is an API image
                // Split the URL by the '/' character and get the last element of the resulting array
                const imageNameWithExtension = imageUrl.split('/').pop();
                // Split the image name by the '.' character and get the first element of the resulting array
                const imageName = imageNameWithExtension.split('.')[0];
                console.log(imageName); // Log the image name without the extension

                // Add the removed image to imagesToDelete
                setImagesToDelete(prevImages => [...prevImages, imageName]);
            }

            const updatedImages = images.filter((_, index) => index !== indexToRemove);
            const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);

            setImages(updatedImages);
            setSelectedFiles(updatedFiles);
        }
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
                        defaultValue={selectedFeedback.title}
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
                        <Typography variant="h6" fontWeight="medium" mb={1}>Location</Typography>
                        <StyledSelect
                            name="Location"
                            id="Location"
                            options={filteredLocationOptions}
                            value={selectedLocation}
                            onChange={setSelectedLocation}

                            required
                            isSearchable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    borderColor: formState.errors.Location ? '#f44336' : provided.borderColor,
                                    '&:hover': { borderColor: formState.errors.Location ? '#f44336' : provided.borderColor },
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
                                    onClick={() => handleRemoveImage(photo.src, index)}                                >
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