import React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

export default function MaxFeedback() {
    return (
        <div>
            <FormControl sx={{ m: 1, width: '25ch', mt: 5 }} variant="outlined">
                <label>Max Feedback for each Category in each Room </label>
                <OutlinedInput
                    id="outlined-adornment"
                    endAdornment={<InputAdornment position="end">Task</InputAdornment>}
                    aria-describedby="outlined-helper-text"
                    inputProps={{
                        'aria-label': 'task',
                    }}
                    defaultValue=""
                />
                <FormHelperText id="outlined-helper-text">Number</FormHelperText>
                <Button sx={{ color: 'ButtonFace', mt: 1 }} variant="contained">Update</Button>
            </FormControl>
        </div>
    )
}
