import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Avatar,
    Button,
    Divider,
    CircularProgress,
    TextField,
    Tabs,
    Tab,
    Chip,
    Alert,
    IconButton,
    Stack
} from "@mui/material";

import {
    MdEdit,
    MdSave,
    MdClose,
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdCalendarToday,
    MdPerson,
    MdLock,
    MdShoppingCart,
    MdDashboard
} from "react-icons/md";

import { BiUserCircle, BiCamera, BiHistory } from "react-icons/bi";

import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfileAdmin = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        profilePictureUrl: "",
        address: "",
    });

    // Fetch admin data on component mount
    useEffect(() => {
        // Check if logged in and if user is admin
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        if (auth.user && auth.user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchAdminProfile();
    }, [auth.isLoggedIn, auth.user, navigate]);

    const fetchAdminProfile = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const response = await axios.get(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user',
                config
            );

            console.log("Admin data:", response.data);
            const admin = response.data.data;
            setAdminData(admin);

            // Initialize form data for editing
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
                phoneNumber: admin.phoneNumber || "",
                profilePictureUrl: admin.profilePictureUrl || "",
                address: admin.address || ""
            });

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch admin profile", err);
            setError(err.response?.data?.message || 'Failed to load admin profile');
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (!editMode) {
            // Reset form data to current admin data when entering edit mode
            setFormData({
                name: adminData.name || "",
                email: adminData.email || "",
                phoneNumber: adminData.phoneNumber || "",
                profilePictureUrl: adminData.profilePictureUrl || "",
                address: adminData.address || "",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            // Update only the fields that are editable
            const dataToUpdate = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                profilePictureUrl: formData.profilePictureUrl,
                address: formData.address
            };

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile',
                dataToUpdate,
                config
            );

            console.log("Profile updated:", response.data);
            setAdminData(response.data.data);
            setEditMode(false);
            setLoading(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || 'Failed to update profile');
            setLoading(false);
        }
    };

    if (loading && !adminData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={4}>
                    {/* Admin Profile Overview */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ position: 'relative', textAlign: 'center', mb: 2 }}>
                                <Avatar
                                    src={adminData?.profilePictureUrl}
                                    alt={adminData?.name}
                                    sx={{ width: 120, height: 120, mx: 'auto', border: '4px solid #f0f0f0' }}
                                />
                                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {adminData?.name}
                                </Typography>
                                <Chip
                                    label="Administrator"
                                    color="primary"
                                    sx={{ mt: 1 }}
                                    icon={<MdDashboard />}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MdEmail sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography>{adminData?.email || 'No email'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MdPhone sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography>{adminData?.phoneNumber || 'No phone number'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MdLocationOn sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography>{adminData?.address || 'No address'}</Typography>
                                </Box>
                                {adminData?.createdAt && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <MdCalendarToday sx={{ color: 'primary.main', mr: 1 }} />
                                        <Typography>
                                            Joined: {format(new Date(adminData.createdAt), 'MMMM dd, yyyy')}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<MdEdit />}
                                onClick={handleEditToggle}
                                sx={{ mt: 3 }}
                            >
                                Edit Profile
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Admin Details and Management */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={handleTabChange}>
                                    <Tab label="Profile Details" icon={<MdPerson />} iconPosition="start" />
                                    <Tab label="Account Security" icon={<MdLock />} iconPosition="start" />
                                </Tabs>
                            </Box>

                            {/* Profile Details Tab */}
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 3 }}>
                                        {editMode ? 'Edit Profile Information' : 'Admin Profile Information'}
                                    </Typography>

                                    {editMode ? (
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        helperText="Email cannot be changed"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone Number"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Profile Picture URL"
                                                        name="profilePictureUrl"
                                                        value={formData.profilePictureUrl}
                                                        onChange={handleInputChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Address"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={2}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<MdClose />}
                                                            onClick={handleEditToggle}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            startIcon={<MdSave />}
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'Saving...' : 'Save Changes'}
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    ) : (
                                        <Box>
                                            <Grid container spacing={2}>
                                                {/* Display all admin fields */}
                                                {Object.entries(adminData || {}).map(([key, value]) => {
                                                    // Skip internal fields or null/undefined values
                                                    if (key === 'id' || key === '__v' || key === 'password' ||
                                                        key === 'salt' || value === null || value === undefined) {
                                                        return null;
                                                    }

                                                    // Format dates
                                                    if (key === 'createdAt' || key === 'updatedAt') {
                                                        value = format(new Date(value), 'MMMM dd, yyyy HH:mm');
                                                    }

                                                    // Format boolean values
                                                    if (typeof value === 'boolean') {
                                                        value = value ? 'Yes' : 'No';
                                                    }

                                                    return (
                                                        <Grid item xs={12} sm={6} key={key}>
                                                            <Box sx={{ mb: 2 }}>
                                                                <Typography variant="subtitle2" color="text.secondary"
                                                                            sx={{ textTransform: 'capitalize' }}>
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Account Security Tab */}
                            {tabValue === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Account Security
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        For security reasons, password changes must be made through a separate process.
                                    </Alert>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Account Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    User ID
                                                </Typography>
                                                <Typography variant="body1">
                                                    {adminData?.id || 'Not available'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Role
                                                </Typography>
                                                <Typography variant="body1">
                                                    {adminData?.role || 'Admin'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Email Verified
                                                </Typography>
                                                <Typography variant="body1">
                                                    {adminData?.emailVerified ? 'Yes' : 'No'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Last Login
                                                </Typography>
                                                <Typography variant="body1">
                                                    {adminData?.lastLogin ?
                                                        format(new Date(adminData.lastLogin), 'MMMM dd, yyyy HH:mm') :
                                                        'Not available'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </div>
    );
};

export default ProfileAdmin;