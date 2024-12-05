import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskList = ({ tasks, setTasks }) => {
    const [editingTask, setEditingTask] = useState(null); 
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDueDate, setEditDueDate] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [showModal, setShowModal] = useState(false); 

    const token = sessionStorage.getItem('authToken');

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`, {
                headers: { Authorization: token },
            });
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err.response?.data?.message || err.message);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        
        const parsedDate = new Date(task.due_date);
        setEditDueDate(isNaN(parsedDate.getTime()) ? null : parsedDate); 
        setEditStatus(task.status);
        setShowModal(true); 
    };

    const handleUpdate = async (id) => {
        try {
            const updatedTask = {
                title: editTitle,
                description: editDescription,
                due_date: editDueDate ? editDueDate.toISOString() : null,
                status: editStatus,
            };
            const res = await axios.put(
                `http://localhost:5000/tasks/${id}`,
                updatedTask,
                { headers: { Authorization: token } }
            );
            setTasks((prev) =>
                prev.map((task) => (task._id === id ? res.data : task))
            );
            setShowModal(false);
            setEditingTask(null);
        } catch (err) {
            console.error('Error updating task:', err.response?.data?.message || err.message);
        }
    };

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString(); 
    };

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <Table striped bordered hover responsive className="mt-4">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{formatDate(task.due_date)}</td>
                                        <td>
                                            <Badge bg={task.status === 'Completed' ? 'success' : 'warning'}>
                                                {task.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => startEditing(task)}
                                            >
                                                Edit
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(task._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription" className="mt-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDueDate" className="mt-2">
                            <Form.Label>Due Date</Form.Label>
                            <DatePicker
                                selected={editDueDate}
                                onChange={(date) => setEditDueDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                            />
                        </Form.Group>

                        <Form.Group controlId="formStatus" className="mt-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleUpdate(editingTask)}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TaskList;
