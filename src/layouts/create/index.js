import React, { useState } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  borderRadius: '8px',
  '& .MuiSelect-root': {
    padding: '16px',
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
  width: '50%',
  borderRadius: '8px',
  padding: '8px',
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const StyledBackButton = styled(Button)({
  position: 'absolute',
  top: '16px',
  left: '16px',
  backgroundColor: '#fff',
  color: '#1976d2',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledModal = styled(Box)({
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
});

const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
});

function Create() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const campusOptions = [
    { value: 'HITECH-PARK', label: 'HITECH-PARK' },
    { value: 'STUDENT CULTURE HOUSE', label: 'STUDENT CULTURE HOUSE' },
  ];

  const roomOptions = [
    ...Array.from({ length: 30 }, (_, i) => ({ value: `NVH_${i + 1}`, label: `NVH_${i + 1}` })),
    ...Array.from({ length: 16 }, (_, i) => ({ value: `NVH_${i + 401}`, label: `NVH_${i + 401}` })),
    ...Array.from({ length: 24 }, (_, i) => ({ value: `NVH_${i + 601}`, label: `NVH_${i + 601}` })),
    ...Array.from({ length: 13 }, (_, i) => ({ value: `P_${i + 1}`, label: `P_${i + 1}` })),
    ...Array.from({ length: 6 }, (_, i) => ({ value: `P_${i + 20}`, label: `P_${i + 20}` })),
    ...Array.from({ length: 10 }, (_, i) => ({ value: `P_${i + 30}`, label: `P_${i + 30}` })),
    ...Array.from({ length: 34 }, (_, i) => ({ value: `P_${i + 104}`, label: `P_${i + 104}` })),
    ...Array.from({ length: 32 }, (_, i) => ({ value: `P_${i + 203}`, label: `P_${i + 203}` })),
  ];

  const categoryOptions = [
    { value: 'ELECTRICITY', label: 'ELECTRICITY' },
    { value: 'WATER', label: 'WATER' },
    { value: 'SUPPLIES', label: 'SUPPLIES' },
  ];

  const onSubmit = (data) => {
    const campus = selectedCampus ? selectedCampus.name : '';
    const room = selectedRoom ? selectedRoom.name : '';
    const category = selectedCategory ? selectedCategory.name : '';
    console.log({ ...data, Campus: campus, Room: room, Category: category });
  };

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
                borderColor: errors.Campus ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: errors.Campus ? '#f44336' : provided.borderColor,
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
                borderColor: errors.Room ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: errors.Room ? '#f44336' : provided.borderColor,
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
                borderColor: errors.Category ? '#f44336' : provided.borderColor,
                '&:hover': {
                  borderColor: errors.Category ? '#f44336' : provided.borderColor,
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
            {...register('Title')}
            required
            maxLength="30"
            error={errors.Title}
            helperText={errors.Title && 'Title is required'}
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
            {...register('MoreDetails')}
            required
            maxLength="30"
            error={errors.MoreDetails}
            helperText={errors.MoreDetails && 'More Details is required'}
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
            <StyledModal onClick={() => setShowModal(false)}>
              <StyledImage src={previewUrl} alt="Preview" />
            </StyledModal>
          )}
        </StyledBox>
        <StyledBox style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <StyledButton type="submit" variant="contained" fullWidth>
            Send Report
          </StyledButton>
        </StyledBox>
      </StyledForm>
    </StyledContainer>
  );
}

export default Create;