import React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

export default function ExpiredFeedback() {
  return (
    <div><OutlinedInput
    id="outlined-adornment-weight"
    endAdornment={<InputAdornment position="end">kg</InputAdornment>}
    aria-describedby="outlined-weight-helper-text"
    inputProps={{
      'aria-label': 'weight',
    }}
  />
  <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText></div>
  )
}
