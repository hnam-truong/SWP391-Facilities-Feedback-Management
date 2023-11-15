import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

export default function SignOut() {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            localStorage.clear();
            navigate('/sign-in');
        } catch (error) {
            console.error("Sign Out Error:", error);
        }
    }, []);
}
