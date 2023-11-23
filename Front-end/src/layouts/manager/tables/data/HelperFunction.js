/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MDSnackbar from "components/MDSnackbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from 'prop-types';
import Gallery from 'react-photo-gallery';

const StyledContainer = styled(Container)`
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  backgroundColor: '#f5f5f5',
  padding: '24px',
  @media (min-width: 768px) {
    padding: '24px',
  }

  @media (min-width: 1024px) {
    padding: '64px',
  }
`;
StyledContainer.propTypes = {
    children: PropTypes.node,
};
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
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    // boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    // boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
}));

const StyledRow3 = styled(Box)(() => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '40px',
    width: '100%',
    '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
}));

const StyledRow2 = styled(Box)(() => ({
    display: 'grid',
    gridTemplateColumns: '1fr 2.3fr',
    gridGap: '40px',
    width: '100%',
    '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 2.3fr',
    },
}));


const StyledButton = styled(Button)(() => ({
    width: '100%',
    borderRadius: '8px',
    padding: '8px',
    background: '(45deg, #6BCD9B 30%, #70D6BB 90%)',
    color: '#fff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        background: '(45deg, #6BCD9B 30%, #70D6BB 90%)',
        transform: 'scale(1.05)',
    },
}));

const StyledRejectButton = styled(Button)(() => ({
    width: '100%',
    borderRadius: '8px',
    padding: '8px',
    background: 'linear-gradient(45deg, #dc3545 30%, #c82333 90%)',
    color: '#fff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        background: 'linear-gradient(45deg, #c82333 30%, #dc3545 90%)',
        transform: 'scale(1.05)',
    },
}));

const StyledCancelButton = styled(Button)(() => ({
    width: '100%',
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'black',
    color: '#fff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'black',
        transform: 'scale(1.05)',
    },
}));

const StyledCloseButton = styled(Button)(() => ({
    width: '100%',
    borderRadius: '8px',
    padding: '8px',
    background: ' linear-gradient(to right, #4BCA81, #239B56)',
    color: '#fff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        background: ' linear-gradient(to right, #4BCA81, #239B56)',
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

const HelperFunction = React.memo(({ selectedFeedback, action }) => {
    const { handleSubmit } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [images, setImages] = useState([]);
    const [employeesOptions, setEmployeesOptions] = useState([]);
    const [errorNotificationMessage, setErrorNotificationMessage] = useState("");
    const [sucessNotificationMessage, setSucessNotificationMessage] = useState("");
    const [note, setNote] = useState('');
    const [userResponse, setUserResponse] = useState(selectedFeedback.response);
    const [imagesTask, setImagesTask] = useState({});
    const isProcessing = selectedFeedback.status === "Processing";
    const isWaiting = selectedFeedback.status === "Waiting";
    const isResponded = selectedFeedback.status === "Responded";
    const isClosed = selectedFeedback.status === "Closed";

    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
    };


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
        selectedFeedback.tasks.forEach((task) => {
            fetch(`https://localhost:7157/api/Task/GetFile?Id=${task.id || task.taskId}`)
                .then(response => response.json())
                .then(data => {
                    setImagesTask(prevState => ({
                        ...prevState,
                        [task.id || task.taskId]: data
                    }));
                });
        });
    }, [selectedFeedback.tasks]);

    useEffect(() => {
        selectedFeedback.tasks.forEach((task) => {
            fetch(`https://localhost:7157/api/Task/GetFile?Id=${task.id || task.taskId}`)
                .then(response => response.json())
                .then(data => {
                    setImagesTask(prevState => ({
                        ...prevState,
                        [task.id || task.taskId]: data
                    }));
                });
        });
    }, [selectedFeedback.tasks]);

    const onSubmit = async (data) => {
        switch (action) {
            case "Accept":
                try {
                    var option = {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    };
                    const response = await fetch("https://localhost:7157/api/Feedbacks/AcceptFeedback?feedbackId=" + selectedFeedback.feedbackId + "&response=" + userResponse, option);
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
                        setSucessNotificationMessage("Task sent successfully!");
                        setShowSuccessNotification(true);

                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    setErrorNotificationMessage("An error occurred while sending Task!");
                    setShowErrorNotification(true);
                }
                break;

            case "Reject":
                try {
                    var option = {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    };
                    const response = await fetch("https://localhost:7157/api/Feedbacks/RejectFeedback?feedbackId=" + selectedFeedback.feedbackId + "&response=" + userResponse, option);
                    const data = await response.text();
                    console.log("Data received:", data);
                    // Handle the data received from the server
                    setSucessNotificationMessage("This Report is Rejected!");
                    setShowSuccessNotification(true);

                    window.location.reload();
                } catch (error) {
                    console.error("Error: " + error.message);
                }
                break;

            case "Cancel":
                try {
                    var option = {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    };
                    const response = await fetch("https://localhost:7157/api/Feedbacks/CancelFeedback?feedbackId=" + selectedFeedback.feedbackId + "&response=" + userResponse, option);
                    const data = await response.text();
                    console.log("Data received:", data);
                    // Handle the data received from the server
                    setSucessNotificationMessage("This Report is Cancelled!");
                    setShowSuccessNotification(true);

                    window.location.reload();
                } catch (error) {
                    console.error("Error: " + error.message);
                }
                break;

            case "Close":
                try {
                    var option = {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    };
                    const response = await fetch("https://localhost:7157/api/Feedbacks/CloseFeedback?feedbackId=" + selectedFeedback.feedbackId + "&response=" + userResponse, option);
                    const data = await response.text();
                    console.log("Data received:", data);
                    // Handle the data received from the server
                    setSucessNotificationMessage("This Report is Closed!");
                    setShowSuccessNotification(true);

                    window.location.reload();
                } catch (error) {
                    console.error("Error: " + error.message);
                }
                break;
        }
    };

    const handleNoteChange = (event) => {
        if (note === "") {
            setNote(event.target.value.trim());
        } else {
            setNote(event.target.value);
        }
    };

    const handleResponseChange = (event) => {
        if (userResponse === "") {
            setUserResponse(event.target.value.trim());
        } else {
            setUserResponse(event.target.value);
        }
    };

    const handleImageClick = (image) => {
        setPreviewUrl(image);
        setShowModal(true);
    };

    const handleResponseImageClick = (clickedImage) => {
        // For simplicity, selecting the first image from the array
        setPreviewUrl(clickedImage.src);
        setShowModal(true);
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

    const TaskTime = ({ day }) => {
        // Create a new Date object
        const date = new Date(day);

        // Format the date as DD/MM/YY
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`;

        // Format the time as HH:MM
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        return `${formattedTime} ${formattedDate}`;
    };

    return (
        <StyledContainer sx={{
            width: '80vw',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
        }}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h3" fontWeight="bold" mb={4} align="center" style={{ margin: '20px 0', fontSize: '2rem' }}>Feedback Details</Typography>
                <div>
                    <Typography variant="body1" mb={3} style={{ fontSize: '1.2rem' }}><TaskTime day={selectedFeedback.dateTime} /></Typography>
                </div>
                <div>
                    <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1.2rem' }}>Title</Typography>
                    <Typography variant="body1" fontWeight="bold" mb={4} style={{ fontSize: '1.5rem' }}>{selectedFeedback.title}</Typography>
                </div>
                <StyledRow3>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1rem' }}>Campus</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>
                            {selectedFeedback.locationId.startsWith('NVH') ? 'NVH' : 'FPTU HCM'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1rem' }}>Room</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.locationId}</Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1rem' }}>Category</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.cate.description}</Typography>
                    </div>

                </StyledRow3>
                <StyledRow2 mt={3} >
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1rem' }}>Status</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.status}</Typography>
                    </div>
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={0} style={{ fontSize: '1rem' }}>Response</Typography>
                        <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.response}</Typography>
                    </div>

                </StyledRow2>
                <div>
                    <Typography variant="h5" fontWeight="medium" mt={4} mb={1} style={{ fontSize: '1.2rem' }}>More Details</Typography>
                    <Typography variant="body1" style={{ fontSize: '1rem' }}>{selectedFeedback.description}</Typography>
                </div>
                <div>
                    <Typography variant="h5" fontWeight="medium" mt={4} mb={1}>Images</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '2px', overflow: 'auto', maxHeight: '400px' }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ cursor: 'pointer', width: '120px', height: '120px' }} onClick={() => handleImageClick(image)}>
                                <img key={index} src={image} alt="Preview" style={{ width: '100%', height: '100%' }} />
                            </Box>
                        ))}
                    </Box>
                </div>
                {localStorage.getItem('userRole') === "Manager" && (isWaiting || isProcessing || isResponded) && (
                    <div>
                        <Typography variant="h6" fontWeight="medium" mt={5} mb={1}>Send response to Reporter</Typography>
                        <TextField
                            multiline
                            rows={3}
                            inputProps={{ maxLength: 100 }}
                            required
                            fullWidth
                            id="response"
                            label="Response"
                            variant="filled"
                            value={userResponse}
                            onChange={handleResponseChange}
                        />
                    </div>
                )}

                {((localStorage.getItem('userRole') == "Manager") && (isWaiting || isProcessing || isResponded) && action === "Accept") && (
                    <div>
                        <Typography variant="h6" fontWeight="medium" mt={6} mb={1}>Assign to Employee</Typography>
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

                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded) && action === "Accept") && (
                    <div>
                        <Typography variant="h6" fontWeight="medium" mt={2} mb={1}>Note to Employee</Typography>
                        <TextField
                            inputProps={{ maxLength: 100 }}
                            required
                            fullWidth
                            id="note"
                            label="Note"
                            variant="outlined"
                            value={note}
                            onChange={handleNoteChange}
                        />
                    </div>
                )}
                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded || isClosed) && action === "Accept") && (
                    <div>
                        <Typography variant="h5" fontWeight="medium" mb={1} mt={6} style={{ fontSize: '1.2rem' }}>Employee Task</Typography>
                        {selectedFeedback.tasks
                            .filter(task => task.status !== "Cancelled" && task.status !== "Removed")
                            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                            .map((task) => {
                                const photos = imagesTask[task.id || task.taskId]?.map((image) => ({
                                    src: image,
                                    width: 1,
                                    height: 1,
                                })) || [];

                                return (
                                    <div key={task.taskId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
                                        <Typography style={{ fontSize: '1rem' }}>Created on: <TaskTime day={task.dateTime} /></Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Manager name: {task.manager.username}</Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Employee name: {task.employee.username}</Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Status: {task.status}</Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Note: {task.note}</Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Response message: {task.responsed}</Typography>
                                        <Typography style={{ fontSize: '1rem' }}>Response images: </Typography>

                                        <div style={{ width: '100%' }}>
                                            <Gallery onClick={(event, { photo }) => handleResponseImageClick(photo)} photos={photos} columns={photos.length} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded) && action === "Accept") && (
                    <div>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                            <StyledButton type="submit" variant="contained" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Send Task</StyledButton>
                        </Box>

                    </div>
                )}

                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded) && action === "Reject") && (
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                            <StyledRejectButton type="submit" variant="contained" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Reject Report</StyledRejectButton>
                        </Box>
                    </div>
                )}

                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded) && action === "Cancel") && (
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                            <StyledCancelButton type="submit" variant="contained" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Cancel Report</StyledCancelButton>
                        </Box>
                    </div>
                )}

                {((localStorage.getItem('userRole') === "Manager") && (isWaiting || isProcessing || isResponded) && action === "Close") && (
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                            <StyledCloseButton type="submit" variant="contained" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Close Report</StyledCloseButton>
                        </Box>
                    </div>
                )}
                <br />
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
                    dateTime=""
                    title="Success"
                    content={sucessNotificationMessage}
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