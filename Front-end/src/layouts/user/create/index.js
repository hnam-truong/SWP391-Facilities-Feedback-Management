/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
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

const StyledContainer = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  backgroundColor: '#f5f5f5',
  padding: '24px',
}));

const StyledForm = styled('form')(() => ({
  display: 'grid',
  gridTemplateRows: 'auto auto auto auto',
  gridGap: '16px',
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
  zIndex: 999,
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

const StyledBackButton = styled(Button)(() => ({
  position: 'absolute',
  top: '16px',
  left: '16px',
  backgroundColor: '#fff',
  color: '#1976d2',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#f5f5f5',
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
  zIndex: 1000, // Update the z-index value
}));

const StyledImage = styled('img')(() => ({
  maxWidth: '100%',
  maxHeight: '100%',
}));

const Create = React.memo(() => {
  const { register, handleSubmit, formState, setValue } = useForm();
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const [errorNotificationMessage, setErrorNotificationMessage] = useState("An error occurred while sending the report.");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

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
    const { value: campus = '' } = selectedCampus || {};
    const { value: location = '' } = selectedLocation || {};
    const { value: category = '' } = selectedCategory || {};

    const formData = new FormData();
    formData.set('Campus', campus);
    formData.set('Location', location);
    formData.set('Category', category);
    formData.set('Title', title);
    formData.set('MoreDetails', detail);
    // If selectedImages is an array of File objects
    if (selectedImages && selectedImages.length) {
      selectedImages.forEach((image) => {
        console.log('Appending file:', image); // Log file being appended
        formData.append('fileCollection', image);
      });
    }

    try {
      const response = await axios.post("https://localhost:7157/api/Feedbacks/Create", formData, {
        params: {
          userId: localStorage.getItem('userID'),
          title: title,
          description: detail,
          cateId: category,
          locatoinId: location,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },

      });

      if (response.data.responseCode === 400) {
        setErrorNotificationMessage("Type of Feedback is already exist in this location");
        setShowErrorNotification(true);
      } else if (response.data.responseCode === 200) {
        setShowSuccessNotification(true);
        setSelectedCampus(null);
        setSelectedLocation(null);
        setSelectedCategory(null);
        setTitle("");
        setDetail("");
        setSelectedImages([]);
        setPreviewUrl(null);
      } else {
        setErrorNotificationMessage("An error occurred while sending the report.");
        setShowErrorNotification(true);
      }
    } catch (error) {
      console.error(error);
      setErrorNotificationMessage("An error occurred while sending the report.");
      setShowErrorNotification(true);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (selectedImages.length + files.length > 5) {
      setShowErrorNotification(true);
      setErrorNotificationMessage("Cannot add more than 5 images.");
      return; // Do not update the state if the limit is exceeded
    }
    // If the limit is not exceeded, update the state with the new files
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleImageClick = (image) => {
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    setShowModal(true);
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCampusChange = (selectedOption) => {
    setSelectedCampus(selectedOption);

    // Enable Location selection when a Campus is chosen
    setLocationDisabled(false);
  };

  const handleTitleChange = (event) => {
    if (title === "") {
      setTitle(event.target.value.trim());
    } else {
      setTitle(event.target.value);
    }
  };

  const handleDetailChange = (event) => {
    if (detail === "") {
      setDetail(event.target.value.trim());
    } else {
      setDetail(event.target.value);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <StyledContainer>
        <StyledBackButton startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>Back</StyledBackButton>
        <Typography variant="h4" fontWeight="bold" mb={1}>CREATE NEW REPORT</Typography>
        <Typography variant="h6" fontWeight="medium" mb={3}>{dateTime}</Typography>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography variant="h6" fontWeight="medium" mb={1}>Title</Typography>
            <StyledTextField
              type="text"
              name="Title"
              label="The problem"
              inputProps={{ maxLength: 40 }}
              {...register('Title', { required: true, maxLength: 40 })}
              error={formState.errors.Title}
              helperText={formState.errors.Title && 'Title is required'}
              onChange={handleTitleChange}
              value={title}
            />
          </div>
          <StyledRow>
            <div>
              <Typography variant="h6" fontWeight="medium" mb={1} mt={2}>Campus</Typography>
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
                    borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor,
                    '&:hover': { borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor },
                  }),
                }}
              />
            </div>
            <div>
              <Typography variant="h6" fontWeight="medium" mb={1} mt={2}>Location</Typography>
              <StyledSelect
                name="Location"
                id="Location"
                options={filteredLocationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                isDisabled={locationDisabled} // Disable Location selection when locationDisabled is true
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
              <Typography variant="h6" fontWeight="medium" mb={1} mt={2}>Category</Typography>
              <StyledSelect name="Category" id="Category" options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} required isSearchable styles={{ control: (provided) => ({ ...provided, borderColor: formState.errors.Category ? '#f44336' : provided.borderColor, '&:hover': { borderColor: formState.errors.Category ? '#f44336' : provided.borderColor } }) }} />
            </div>
          </StyledRow>
          <div>
            <Typography mt={3} variant="h6" fontWeight="medium" mb={1}>More Details</Typography>
            <StyledTextField
              type="text"
              name="MoreDetails"
              label="Describe the problem"
              inputProps={{ maxLength: 300 }}
              {...register('MoreDetails', { required: true, maxLength: 300 })}
              error={formState.errors.MoreDetails}
              helperText={formState.errors.MoreDetails && 'More Details is required'}
              sx={{ height: '200px' }}
              multiline
              rows={5}
              onChange={handleDetailChange}
              value={detail}
            />
          </div>
          <div>
            <Typography variant="h6" fontWeight="medium" mb={1} mt={-2}>Images</Typography>
            <Button
              component="label"
              variant="contained"
              color='info'
              onChange={handleFileChange}
              startIcon={<CloudUploadIcon />}>
              Upload your images
              <VisuallyHiddenInput type="file" name="file" multiple />
            </Button>
            <Box mt={2} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gridGap: '16px', overflow: 'auto', maxHeight: '400px' }}>
              {selectedImages.map((selectedImage, index) => {
                const objectUrl = URL.createObjectURL(selectedImage);
                return (
                  <Box key={index} sx={{ cursor: 'pointer' }}>
                    <img onClick={() => handleImageClick(selectedImage)} src={objectUrl} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    <Button
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      variant="contained"
                      sx={{color: "#fff", backgroundColor: "#ff0000", marginBottom: '2px' }}
                    >
                      Remove
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </div>
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '16px' }}><StyledButton type="submit" variant="contained">Send Report</StyledButton></Box>
        </StyledForm>
        {showModal && (
          <StyledModal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <StyledImage src={previewUrl} alt="Preview" sx={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
          </StyledModal>
        )}
        {showSuccessNotification && (
          <MDSnackbar
            color="success"
            icon="check"
            title="Success"
            content="Report sent successfully"
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
    </DashboardLayout>
  );
});

export default Create;