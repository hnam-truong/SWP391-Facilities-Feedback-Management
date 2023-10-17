import React, { useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";

const SwitchStar = () => {
  const [clicked, setClicked] = useState(false);

  const handleIconClick = () => {
    setClicked(!clicked);
  };

  return (
    <IconButton onClick={handleIconClick}>
      {clicked ? <StarIcon color="star" sx={{ color: "#ffea00" }} /> : <StarBorderIcon />}
    </IconButton>
  );
};

export default SwitchStar;
