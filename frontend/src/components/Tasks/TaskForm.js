import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Form, Button } from 'react-bootstrap';

const TaskForm = ({ setTasks }) => {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(null); 
    const [status, setStatus] = useState('Pending');

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate(null);
        setStatus('Pending');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('authToken');
        try {
            const res = await axios.post(
                'http://localhost:5000/tasks',
                {
                    title,
                    description,
                    due_date: dueDate?.toISOString(),
                    status,
                },
                { headers: { Authorization: token } }
            );
            setTasks((prev) => [...prev, res.data]);
            handleClose();
        } catch (err) {
            console.error('Error creating task:', err.response.data.message);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Task
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title" className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="dueDate" className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <div>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select a due date"
                                minDate={new Date()}
                                required
                            />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="status" className="mb-4">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Add Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TaskForm;
