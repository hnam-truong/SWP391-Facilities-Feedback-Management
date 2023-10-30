import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

export default function SignOut() {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigate('/sign-in');
    }, []);
}
