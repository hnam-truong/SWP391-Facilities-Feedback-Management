/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";

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
}));

const StyledImage = styled('img')(() => ({
  maxWidth: '100%',
  maxHeight: '100%',
}));

const Create = React.memo(() => {
  const { register, handleSubmit, formState, setValue } = useForm();
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    // if (selectedImages) {
    //   formData.set('image', selectedImages);
    // }
    if (selectedImages && selectedImages.length) {
      selectedImages.forEach((image, index) => {
        formData.append('fileCollection', image.file, image.file.name);
      });
    }
    try {
      const response = await fetch("https://localhost:7157/api/Feedbacks/Create?"
        + "userId=" + localStorage.getItem('userID')
        + "&title=" + Title
        + "&description=" + MoreDetails
        + "&cateId=" + category
        + "&locatoinId=" + room,

        { method: 'POST', body: formData });
      const responseData = await response.json();
      console.log(responseData);
     
      // Notify when the report is created successfully
      setShowSuccessNotification(true);

      // Clear all form data
      setSelectedCampus(null);
      setSelectedRoom(null);
      setSelectedCategory(null);
      setValue('Title', '');
      setValue('MoreDetails', '');
      // setSelectedImages([]);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      setShowErrorNotification(true);
    }
  };

  const handleFileChange = (event) => {
    const fileArray = Array.from(event.target.files).map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file)
      };
    });
    setSelectedImages((prevImages) => prevImages.concat(fileArray));
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

  const handleCampusChange = (selectedOption) => {
    setSelectedCampus(selectedOption);

    // Enable Room selection when a Campus is chosen
    setRoomDisabled(false);
  };

  return (
    <StyledContainer>
      <StyledBackButton startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>Back</StyledBackButton>
      <Typography variant="h4" fontWeight="bold" mb={4}>Report an Issue</Typography>
      <Typography variant="h6" fontWeight="medium" mb={1}>{dateTime}</Typography>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Typography variant="h6" fontWeight="medium" mb={1}>Title</Typography>
          <StyledTextField type="text" name="Title" label="Title" inputProps={{ maxLength: 40 }} {...register('Title', { required: true, maxLength: 40 })} error={formState.errors.Title} helperText={formState.errors.Title && 'Title is required'} />
        </div>
        <StyledRow>
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
              isDisabled={roomDisabled} // Disable Room selection when roomDisabled is true
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
          <Typography variant="h6" fontWeight="medium" mb={1}>More Details</Typography>
          <StyledTextField
            type="text"
            name="MoreDetails"
            label="More Details"
            inputProps={{ maxLength: 300 }}
            {...register('MoreDetails', { required: true, maxLength: 300 })}
            error={formState.errors.MoreDetails}
            helperText={formState.errors.MoreDetails && 'More Details is required'}
            sx={{ height: '200px' }}
            multiline
            rows={5}
          />
        </div>
        <div>
          <Typography variant="h6" fontWeight="medium" mb={1}>Images</Typography>
          <input type="file" name="file" onChange={handleFileChange} multiple />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gridGap: '16px', overflow: 'auto', maxHeight: '400px' }}>
            {selectedImages.map((selectedImage, index) => (
              <Box key={index} sx={{ cursor: 'pointer' }} onClick={() => handleImageClick(selectedImage)}>
                <img key={index} src={selectedImage.preview} alt="Preview" style={{ width: '100%', height: '100%' }} />
              </Box>
            ))}
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
          title="Error"
          content="An error occurred while sending the report."
          open={showErrorNotification}
          onClose={() => setShowErrorNotification(false)}
          close={() => setShowErrorNotification(false)}
        />
      )}
    </StyledContainer>
  );
});

export default Create;