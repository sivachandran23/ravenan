import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskPage from './components/Tasks/TaskPage';
import PrivateRoute from './components/PrivateRoute'; 
import NotFound from './components/NotFound';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/tasklist"
                        element={
                            <PrivateRoute element={<TaskPage />} />  
                        }
                    />
                     <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
