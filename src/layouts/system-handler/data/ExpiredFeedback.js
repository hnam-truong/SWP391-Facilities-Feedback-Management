import React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

export default function ExpiredFeedback() {
    return (
        <div>
            <FormControl sx={{ m: 1, width: '25ch', mt: 9 }} variant="outlined">
                <label>Expire time of a Feedback</label>
                <OutlinedInput
                    id="outlined-adornment"
                    endAdornment={<InputAdornment position="end">hour</InputAdornment>}
                    aria-describedby="outlined-time-helper-text"
                    inputProps={{
                        'aria-label': 'time',
                    }}
                    defaultValue=""
                />
                <FormHelperText id="outlined-time-helper-text">Time</FormHelperText>
                <Button sx={{ color: 'ButtonFace', mt: 1 }} variant="contained">Update</Button>
            </FormControl>
        </div>
    )
}
