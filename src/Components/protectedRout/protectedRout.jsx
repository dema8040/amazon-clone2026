import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

const ProtectedRoute = ({ children, msg, redirect }) => {
  const navigate = useNavigate();
  const [{ user }] = useContext(DataContext);

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          msg,
          redirect,
        },
        replace: true,
      });
    }
  }, [user, navigate, msg, redirect]);

  // Wait for the user to be authenticated
  if (!user) {
    return null;
  }

  // Render the requested page when logged in
  return children;
};

export default ProtectedRoute;
