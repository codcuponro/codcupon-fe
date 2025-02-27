"use client"
import React, { createContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const ToastContext = createContext();

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity });
    };

    const closeToast = () => {
        setToast({ ...toast, open: false });
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast}>
                <Alert onClose={closeToast} severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
