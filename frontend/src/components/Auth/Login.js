import React, { useState, useContext,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            navigate('/tasklist');
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            login(res.data.token);
            navigate('/tasklist');
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <ToastContainer />
            <Card style={{ width: '25rem', padding: '2rem' }}>
                <h3 className="text-center">Login</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="w-100 mt-4">Login</Button>
                </Form>
                <div className="text-center mt-3">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>
                            Register
                        </Link>
                    </p>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
