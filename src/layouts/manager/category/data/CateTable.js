/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";

export default function CateTable() {
    const [cates, setCates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:7157/api/Cate/GetAllCate");
                const data = await response.json();
                setCates(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteCate = async (cateId) => {
        try {
            await fetch(`https://localhost:7157/api/Cate/Delete?CateId=${cateId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // Include any additional headers if needed
                },
            });

            // Assuming a successful delete, update the state to remove the deleted category
            setCates((prevCates) => prevCates.filter((cate) => cate.id !== cateId));
        } catch (error) {
            console.error("Error deleting category:", error);
            // Handle error accordingly
        }
    };

    const cateRows = cates.map((cate) => ({
        cateID: (
            <MDBox alignItems="center">
                <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                    {cate.id}
                </MDTypography>
            </MDBox>
        ),
        description: (
            <MDBox textAlign="left">
                <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                    {cate.description}
                </MDTypography>
            </MDBox>
        ),
        action: (
            <IconButton onClick={() => handleDeleteCate(cate.id)}>
                <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                    Delete
                </MDTypography>
            </IconButton>
        ),
    }));

    return {
        columns: [
            { Header: "Category ID", accessor: "cateID", align: "center" },
            { Header: "Description", accessor: "description", align: "left" },
            { Header: "action", accessor: "action", align: "center" },
        ],

        rows: cateRows,
    };
}