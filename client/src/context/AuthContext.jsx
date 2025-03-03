import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

// create an axios instance with deafault config which can be used in entire application
const api = axios.create({
  withCredentials: true, // Important for sending and receiving cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // get api base url from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  // setup axios interceptor to handle API errors globally
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear user state and redirect user back to login page
          setUser(null);
          navigate("/login");
        }
        // pass the error down to the promise chain
        // This allows component-level catch blocks to still handle the error if needed
        // Without this, errors would be swallowed by the interceptor
        return Promise.reject(error);
      }
    );

    // removes the interceptor when the component unmounts
    // This prevents memory leaks and interceptor duplication if the component remounts
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // validate user session on initial app load
  useEffect(() => {
    const validateSession = async () => {
      // check if there is indicator in local storage
      if (!localStorage.getItem("isAuthenticated")) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`${apiBaseUrl}/v1/auth/validate`);
        console.log("validate session response: ", response);

        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          localStorage.removeItem("isAuthenticated"); // clear flag if session is invalid
        }
      } catch (error) {
        // session expired or token invalid
        console.error("Session validation failed", error);
        localStorage.removeItem("isAuthenticated");
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, [apiBaseUrl]);

  // login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post(`${apiBaseUrl}/v1/auth/login`, {
        email,
        password,
      });

      // backend will sent cookies which will be automatically stored in the browser cookies
      // set data in user state
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("isAuthenticated", true); // set flag for authenticated users
      } else {
        setError("Invalid credentials");
      }
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setLoading(false);
      throw error;
    }
  };

  // register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post(`${apiBaseUrl}/v1/auth/register`, {
        name,
        email,
        password,
      });

      // set data in user state
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("isAuthenticated", true); // set flag for authenticated users
      } else {
        setError("Invalid credentials");
      }
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setLoading(false);
      throw error;
    }
  };

  // logout function
  const logout = async () => {
    try {
      await api.post(`${apiBaseUrl}/v1/auth/logout`);
    } catch (error) {
      console.error("Logout failed", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("isAuthenticated"); // remove indicator from local storage
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
