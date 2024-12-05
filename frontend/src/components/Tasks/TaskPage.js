import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { AuthContext } from '../../context/AuthContext';
import { Container, Row, Col, Button } from 'react-bootstrap';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = sessionStorage.getItem('authToken');
            try {
                const res = await axios.get('http://localhost:5000/tasks', {
                    headers: { Authorization: token },
                });
                setTasks(res.data);
            } catch (err) {
                console.error('Error fetching tasks:', err.response.data.message);
            }
        };

        fetchTasks();
    }, []);

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col className="d-flex justify-content-between align-items-center">
                    <h3>Welcome, </h3>
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <TaskForm setTasks={setTasks} />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <TaskList tasks={tasks} setTasks={setTasks} />
                </Col>
            </Row>
        </Container>
    );
};

export default TaskPage;
