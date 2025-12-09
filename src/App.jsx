import AppRoutes from '@/routes/AppRoutes';
import { StationProvider } from '@/context/StationContext';
import { AuthProvider } from '@/context/AuthContext';
import { FuelProvider } from '@/context/FuelContext';
import React from 'react';

function App() {
    return (
        <AuthProvider>
            <StationProvider>
                <FuelProvider>
                    <AppRoutes />
                </FuelProvider>
            </StationProvider>
        </AuthProvider>
    );
}

export default App;

