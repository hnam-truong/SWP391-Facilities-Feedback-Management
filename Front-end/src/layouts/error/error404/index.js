import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
      switch (localStorage.getItem('userRole')) {
        case "Manager":
          navigate('/dashboard');
          break;

        case "Task Employee":
          navigate('/my-tasks');
          break;

        case "Student":
        case "Lecturer":
        case "Casual Employee":
          navigate('/my-reports');
          break;

        default:
          navigate('/error-404');
          break;
    }
  }, []);
  return (
    !localStorage.getItem('userRole') ? (
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>Oops!</h1>
          </div>
          <h2>404 - Page not found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <a href="/">Go To Homepage</a>
        </div>
      </div>
    ) : null
  );
};

export default ErrorPage;