import React, { useState, useMemo, useEffect } from 'react'; // Importing necessary modules from React and other libraries
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material'; // Importing necessary components from Material UI
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { css, keyframes } from '@emotion/react';
import axios from 'axios';

// Styling the components using Material UI's styled() function
const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
});

const StyledForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: '24px',
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'fit-content',
  width: '100%',
});

const StyledSelect = styled(Select)({
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
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):after': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline.Mui-error:after': {
    borderBottomColor: '#f44336',
  },
  '& .MuiInput-underline.Mui-error:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#f44336',
  },
  '& .MuiInput-underline.Mui-error:hover:not(.Mui-disabled):after': {
    borderBottomColor: '#f44336',
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
  '& .MuiListItem-root': {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
});

const StyledTextField = styled(TextField)({
  width: '100%',
  borderRadius: '8px',
  '& .MuiInputBase-root': {
    padding: '16px',
  },
});

const StyledButton = styled(Button)({
  width: '100%',
  borderRadius: '8px',
  padding: '8px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: '#fff',
  transition: 'all 0.2s ease-in-out',
  gridColumn: 'span 2',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    transform: 'scale(1.05)',
  },
});

const StyledBackButton = styled(Button)({
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
});

const StyledModal = styled(motion.div)({
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
});

const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
});

// Creating a functional component called Create
const Create = React.memo(() => {
  // Using React hooks to manage state and form data
  const { register, handleSubmit, formState, setValue } = useForm();
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Creating options for the Select components using useMemo hook
  const campusOptions = useMemo(
    () => [
      { value: 'HITECH-PARK', label: 'HITECH-PARK' },
      // { value: 'STUDENT CULTURE HOUSE', label: 'STUDENT CULTURE HOUSE' },
    ],
    []
  );

  const roomOptions = useMemo(
    () => [
      ...Array.from({ length: 30 }, (_, i) => ({ value: `NVH_${i + 1}`, label: `NVH_${i + 1}` })),
      ...Array.from({ length: 16 }, (_, i) => ({ value: `NVH_${i + 401}`, label: `NVH_${i + 401}` })),
      ...Array.from({ length: 24 }, (_, i) => ({ value: `NVH_${i + 601}`, label: `NVH_${i + 601}` })),
      ...Array.from({ length: 13 }, (_, i) => ({ value: `P_${i + 1}`, label: `P.${i + 1}` })),
      ...Array.from({ length: 6 }, (_, i) => ({ value: `P_${i + 20}`, label: `P.${i + 20}` })),
      ...Array.from({ length: 10 }, (_, i) => ({ value: `P_${i + 30}`, label: `P.${i + 30}` })),
      ...Array.from({ length: 34 }, (_, i) => ({ value: `P_${i + 104}`, label: `P.${i + 104}` })),
      ...Array.from({ length: 32 }, (_, i) => ({ value: `P_${i + 203}`, label: `P.${i + 203}` })),
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'ELECTRICITY', label: 'ELECTRICITY' },
      { value: 'WATER', label: 'WATER' },
      { value: 'SUPPLIES', label: 'SUPPLIES' },
    ],
    []
  );

  // Clearing the previewUrl state when there's an error with the file input
  useEffect(() => {
    if (formState.errors.file) {
      setPreviewUrl(null);
    }
  }, [formState.errors.file]);


  const onSubmit = async (data) => {
    const { id, Title, MoreDetails, file } = data; // Remove the id field
    const { value: campus = '' } = selectedCampus || {};
    const { value: room = '' } = selectedRoom || {};
    const { value: category = '' } = selectedCategory || {};
  
    const formData = new FormData();
    formData.set('Campus', campus);
    formData.set('Room', room);
    formData.set('Category', category);
    formData.set('Title', Title);
    formData.set('MoreDetails', MoreDetails);
    formData.set('file', file);
    formData.set('status', 'Open');
    formData.set('priority', 'High');
    formData.set('assignedTo', '');
    formData.set('createdAt', new Date().toISOString());
    formData.set('updatedAt', new Date().toISOString());
  
    console.log(formData); // Log the formData object
  
    try {
      const response = await fetch('http://localhost:3000/issues', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  // Rendering the form using Material UI components and the styled components
  return (
    <StyledContainer>
      <StyledBackButton startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
        Back
      </StyledBackButton>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Report an Issue
      </Typography>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1} style={{ textAlign: 'center' }}>
            Campus
          </Typography>
          <StyledSelect
            name="Campus"
            id="Campus"
            options={campusOptions}
            value={selectedCampus}
            onChange={setSelectedCampus}
            required
            isSearchable
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: formState.errors.Campus ? '#f44336' : provided.borderColor,
                },
              }),
            }}
          />
        </StyledBox>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1} style={{ textAlign: 'center' }}>
            Room
          </Typography>
          <StyledSelect
            name="Room"
            id="Room"
            options={roomOptions}
            value={selectedRoom}
            onChange={setSelectedRoom}
            required
            isSearchable
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: formState.errors.Room ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: formState.errors.Room ? '#f44336' : provided.borderColor,
                },
              }),
            }}
          />
        </StyledBox>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Category
          </Typography>
          <StyledSelect
            name="Category"
            id="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            required
            isSearchable
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: formState.errors.Category ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: formState.errors.Category ? '#f44336' : provided.borderColor,
                },
              }),
            }}
          />
        </StyledBox>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Title
          </Typography>
          <StyledTextField
            type="text"
            name="Title"
            label="Title"
            {...register('Title', { required: true, maxLength: 30 })}
            error={formState.errors.Title}
            helperText={formState.errors.Title && 'Title is required'}
          />
        </StyledBox>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            More Details
          </Typography>
          <StyledTextField
            type="text"
            name="MoreDetails"
            label="More Details"
            {...register('MoreDetails', { required: true, maxLength: 30 })}
            error={formState.errors.MoreDetails}
            helperText={formState.errors.MoreDetails && 'More Details is required'}
          />
        </StyledBox>
        <StyledBox>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Upload Image/Video
          </Typography>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              setValue('file', e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            }}
            style={{ marginTop: '8px' }}
          />
          {previewUrl && (
            <StyledButton
              variant="contained"
              onClick={() => setShowModal(true)}
              style={{ marginTop: '8px' }}
            >
              View Image
            </StyledButton>
          )}
          {showModal && (
            <StyledModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowModal(false)}
            >
              <StyledImage src={previewUrl} alt="Preview" />
            </StyledModal>
          )}
        </StyledBox>
        <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <StyledButton type="submit" variant="contained">
            Send Report
          </StyledButton>
        </Box>
      </StyledForm>
    </StyledContainer>
  );
});

export default Create; // Exporting the Create component as the default export of the module