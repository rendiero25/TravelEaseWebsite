// UserManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// MUI Components
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';

const UserManagement = () => {
    const { auth } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch current user details
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user',
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setCurrentUser(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch current user data');
                setLoading(false);
                console.error('Error fetching current user:', err);
            }
        };

        if (auth.token) {
            fetchCurrentUser();
        }
    }, [auth.token]);

    // Fetch all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user',
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setAllUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users data');
                setLoading(false);
                console.error('Error fetching all users:', err);
            }
        };

        if (auth.token && activeTab === 1) {
            fetchAllUsers();
        }
    }, [auth.token, activeTab]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Open role update dialog
    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setDialogOpen(true);
    };

    // Close role update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
        setNewRole('');
    };

    // Update user role
    const handleUpdateRole = async () => {
        try {
            setLoading(true);
            await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${selectedUser.id}`,
                { role: newRole },
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update local state
            setAllUsers(allUsers.map(user =>
                user.id === selectedUser.id ? { ...user, role: newRole } : user
            ));

            setSuccess(`Updated ${selectedUser.name}'s role to ${newRole}`);
            setLoading(false);
            handleCloseDialog();
        } catch (err) {
            setError('Failed to update user role');
            setLoading(false);
            console.error('Error updating user role:', err);
        }
    };

    // Close alert messages
    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null);
    };

    // Render current user info
    const renderCurrentUserInfo = () => {
        if (!currentUser) {
            return <Typography variant="body1">No user information available</Typography>;
        }

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Current User Information</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row"><strong>Name</strong></TableCell>
                                <TableCell>{currentUser.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row"><strong>Email</strong></TableCell>
                                <TableCell>{currentUser.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row"><strong>Role</strong></TableCell>
                                <TableCell>{currentUser.role}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row"><strong>Phone Number</strong></TableCell>
                                <TableCell>{currentUser.phoneNumber || 'Not provided'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row"><strong>Profile Picture</strong></TableCell>
                                <TableCell>
                                    {currentUser.profilePictureUrl ? (
                                        <img
                                            src={currentUser.profilePictureUrl}
                                            alt="Profile"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    ) : 'No profile picture'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    // Render all users table
    const renderAllUsers = () => {
        if (allUsers.length === 0) {
            return <Typography variant="body1">No users found</Typography>;
        }

        return (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.phoneNumber || 'Not provided'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpenDialog(user)}
                                    >
                                        Change Role
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>User Management</Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Current User" />
                    <Tab label="All Users" />
                </Tabs>
            </Box>

            {/* Tab panels */}
            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ py: 3 }}>
                {activeTab === 0 && renderCurrentUserInfo()}
            </Box>
            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ py: 3 }}>
                {activeTab === 1 && renderAllUsers()}
            </Box>

            {/* Role update dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Update User Role</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Changing role for: {selectedUser?.name}
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={newRole}
                            label="Role"
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleUpdateRole} variant="contained" color="primary">
                        Update Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Loading indicator */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error and success messages */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement;