/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from 'prop-types';

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
StyledContainer.propTypes = {
    children: PropTypes.node,
};
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
    // boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
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

const HelperFunction = React.memo(({ selectedFeedback }) => {
    const { register, handleSubmit, formState, setValue } = useForm();
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [roomOptions, setRoomOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [filteredRoomOptions, setFilteredRoomOptions] = useState([]);
    const [roomDisabled, setRoomDisabled] = useState(true);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [images, setImages] = useState([]);
    const [note, setNote] = useState('');
    const [errorNotificationMessage, setErrorNotificationMessage] = useState("");

    const isProcessing = selectedFeedback.status === "Processing";
    const isWaiting = selectedFeedback.status === "Waiting";
    const isResponded = selectedFeedback.status === "Responded";

    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
    };
    const [employeesOptions, setEmployeesOptions] = useState([]);

    useEffect(() => {
        const fetchEmployeeOptions = async () => {
            try {
                const response = await fetch(`https://localhost:7157/api/User/CountEmployeeTask/${selectedFeedback.cateId}`);
                const data = await response.json();
                const options = data.map((employee) => ({ value: employee.userID, label: employee.username }));

                setEmployeesOptions(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmployeeOptions();
    }, [selectedFeedback.cateId]);

    useEffect(() => {
        fetch(`https://localhost:7157/api/Feedbacks/GetFile?feedbackId=${selectedFeedback.feedbackId}`)
            .then(response => response.json())
            .then(data => setImages(data));
    }, [selectedFeedback.feedbackId]);


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

        //Đổi trạng thái feedback to Processing
        try {
            var option = {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            };
            const response = await fetch("https://localhost:7157/api/Feedbacks/AcceptFeedback?feedbackId=" + selectedFeedback.feedbackId + "&response=" + selectedFeedback.feedbackId, option);
            const data = await response.text();
            console.log("Data received:", data);
            // Handle the data received from the server
        } catch (error) {
            console.error("Error: " + error.message);
        }

        //Giao task
        try {
            const response = await fetch("https://localhost:7157/CreateTask?"
                + "FeedbackId=" + selectedFeedback.feedbackId
                + "&EmployeeId=" + selectedEmployee.value
                + "&ManagerId=" + localStorage.getItem('userID')
                + "&Note=" + note,
                { method: 'POST' });
            const responseData = await response.json();
            console.log(responseData);
            if (responseData.responseCode === 400) {
                setErrorNotificationMessage(responseData.errorMessage);
                setShowErrorNotification(true);
            } else if (responseData.responseCode === 200) {
                // Notify when the report is created successfully
                setShowSuccessNotification(true);

                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            setErrorNotificationMessage("An error occurred while sending Task.");
            setShowErrorNotification(true);
        }
    };


    const handleAcceptReport = (feedbackId, response) => {
        var option = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Processing" }),
        };
        fetch("https://localhost:7157/api/Feedbacks/AcceptFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option)
            .then((response) => { response.text() })
            .then((data) => {

            })
            .catch((error) => {
                console.error("Error: " + error.message);
            });
    }

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const Time = ({ day }) => {
        // Create a new Date object
        const date = new Date(day);

        // Format the date as DD/MM/YY
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`;

        // Format the time as HH:MM
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        return (
            <MDBox lineHeight={1} textAlign="left">
                <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                    {formattedDate}
                </MDTypography>
                <MDTypography variant="caption">
                    {formattedTime}
                </MDTypography>
            </MDBox>
        );
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
                    <Typography variant="body1" mb={3} style={{ fontSize: '1.2rem' }}><Time day={selectedFeedback.dateTime} /></Typography>
                </div>
                <div>
                    <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1.2rem' }}>Title</Typography>
                    <Typography variant="body1" mb={3} style={{ fontSize: '1.5rem' }}>{selectedFeedback.title}</Typography>
                </div>
                <StyledRow>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1rem' }}>Campus</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>
                            {selectedFeedback.locationId.startsWith('NVH') ? 'NVH' : 'FPTU HCM'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1rem' }}>Room</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.locationId}</Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} style={{ fontSize: '1rem' }}>Category</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.cate.description}</Typography>
                    </div>

                </StyledRow>
                <div>
                    <Typography variant="h5" fontWeight="medium" mt={3} mb={1} style={{ fontSize: '1.2rem' }}>More Details</Typography>
                    <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.description}</Typography>
                </div>
                <div>
                    <Typography variant="h5" fontWeight="medium" mt={3} mb={1}>Images</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '2px', overflow: 'auto', maxHeight: '400px' }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ cursor: 'pointer', width: '120px', height: '120px' }} onClick={() => handleImageClick(image)}>
                                <img key={index} src={image} alt="Preview" style={{ width: '100%', height: '100%' }} />
                            </Box>
                        ))}
                    </Box>
                </div>
                {((localStorage.getItem('userRole') == "Manager") && (isWaiting || isProcessing || isResponded)) && (
                    <div>
                        <Typography variant="h6" fontWeight="medium" mt={3} mb={1}>Assign to Employee</Typography>
                        <StyledSelect
                            name="Employee"
                            id="Employee"
                            options={employeesOptions}
                            value={selectedEmployee}
                            onChange={handleEmployeeChange} // You need to define this function
                            required
                            isSearchable
                        />
                    </div>
                )}

                {localStorage.getItem('userRole') === "Manager" && (isWaiting || isProcessing || isResponded) && (
                    <div>
                        <Typography variant="h6" fontWeight="medium" mt={2} mb={-0.5}>Note to Employee</Typography>
                        <TextField
                            required
                            fullWidth
                            id="note"
                            label="Note"
                            variant="standard"
                            value={note}
                            onChange={handleNoteChange}
                        />

                        <Typography variant="h5" fontWeight="medium" mb={1} mt={6} style={{ fontSize: '1.2rem' }}>Employee Task</Typography>
                        {selectedFeedback.tasks
                            .filter(task => task.status !== "Cancelled" && task.status !== "Removed")
                            .map((task) => (
                                <div key={task.taskId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
                                    <Typography style={{ fontSize: '1rem' }}>Manager name: {task.manager.username}</Typography>
                                    <Typography style={{ fontSize: '1rem' }}>Name: {task.employee.username}</Typography>
                                    <Typography style={{ fontSize: '1rem' }}>Status: {task.status}</Typography>
                                    <Typography style={{ fontSize: '1rem' }}>Note: {task.note}</Typography>
                                    <Typography style={{ fontSize: '1rem' }}>Response: {task.responsed}</Typography>
                                </div>
                            )
                            )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                            <StyledButton type="submit" variant="contained" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Send Task</StyledButton>
                        </Box>
                    </div>
                )}
            </StyledForm>
            {showSuccessNotification && (
                <MDSnackbar
                    color="success"
                    icon="check"
                    title="Success"
                    content="Task sent successfully"
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

export default HelperFunction;