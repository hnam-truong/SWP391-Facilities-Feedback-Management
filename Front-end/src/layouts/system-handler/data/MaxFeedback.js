import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

export default function MaxFeedback() {
    const [value, setValue] = useState(""); // Default value is an empty string
    const [response, setResponse] = useState(null);

    useEffect(() => {
        // Fetch the configuration data and set the initial state value
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7157/api/Config');
                const data = await response.json();

                // Find the item with variable "FeedbackExpiredHour" and set its value
                const feedbackExpiredHour = data.find(item => item.variable === "MaxFeedbackPerLocation");
                if (feedbackExpiredHour) {
                    setValue(feedbackExpiredHour.value);
                }
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        };

        fetchData(); // Call the fetch function
    }, []);

    const handleUpdateClick = async () => {
        const configData = {
            id: "e47ddfee-79ec-4f54-b8c8-d57e1384de5d",
            variable: "MaxFeedbackPerLocation",
            value: value,
        };

        try {
            const response = await fetch('https://localhost:7157/api/Config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify(configData),
            });

            const data = await response.json();
            setResponse(data);
        } catch (error) {
            console.error('Error updating configuration:', error);
        }
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: '25ch', mt: 5 }} variant="outlined">
                <label>Max Feedback for each Category in each Location </label>
                <OutlinedInput
                    id="outlined-adornment"
                    endAdornment={<InputAdornment position="end">Task</InputAdornment>}
                    aria-describedby="outlined-helper-text"
                    inputProps={{
                        'aria-label': 'task',
                    }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <FormHelperText id="outlined-helper-text">Number</FormHelperText>
                <Button sx={{ color: 'ButtonFace', mt: 1 }} onClick={handleUpdateClick} variant="contained">Update</Button>
            </FormControl>
            {response && (
                <div>
                    <h2>Update Response</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
