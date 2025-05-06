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
    MdShoppingCart
} from "react-icons/md";

import { BiUserCircle, BiCamera, BiHistory } from "react-icons/bi";

import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfileUser = () => {
    const { auth, updateUserData } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        profilePictureUrl: "",
        address: "",
    });

    // Fetch user data on component mount
    useEffect(() => {
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        fetchUserProfile();
    }, [auth.isLoggedIn, navigate]);

    const fetchUserProfile = async () => {
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

            console.log("User data:", response.data);
            const user = response.data.data;
            setUserData(user);

            // Initialize form data for editing
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                profilePictureUrl: user.profilePictureUrl || "",
                address: user.address || ""
            });

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch user profile", err);
            setError(err.response?.data?.message || 'Failed to load user profile');
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (!editMode) {
            // Reset form data to current user data when entering edit mode
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                profilePictureUrl: userData.profilePictureUrl || "",
                address: userData.address || "",
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
                address: formData.address
            };

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile',
                dataToUpdate,
                config
            );

            console.log("Update response:", response.data);

            // Update local data
            setUserData(prev => ({
                ...prev,
                ...dataToUpdate
            }));

            // Update auth context if necessary
            updateUserData({
                ...auth.user,
                ...dataToUpdate
            });

            setEditMode(false);
            setLoading(false);

            // Show success message (you might want to add a state for this)
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || 'Failed to update profile');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), 'dd MMMM yyyy');
        } catch (error) {
            return dateString;
        }
    };

    if (loading && !userData) {
        return (
            <div>
                <Header />
                <Container sx={{ mt: 12, mb: 8, minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </Container>
                <Footer />
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div>
                <Header />
                <Container sx={{ mt: 12, mb: 8, minHeight: "70vh" }}>
                    <Alert severity="error">{error}</Alert>
                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </Container>
                <Footer />
            </div>
        );
    }

    return (
        <div>

            <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
                <Grid container spacing={4}>
                    {/* Left side - User Card */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                                <Avatar
                                    src={userData?.profilePictureUrl}
                                    alt={userData?.name}
                                    sx={{ width: 150, height: 150, mb: 2 }}
                                />

                                <Typography variant="h5" gutterBottom>
                                    {userData?.name}
                                </Typography>

                                <Chip
                                    label={userData?.role?.name || "User"}
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />

                                <Typography variant="body2" color="text.secondary" align="center">
                                    Member since {formatDate(userData?.createdAt)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<MdShoppingCart />}
                                    onClick={() => navigate('/purchase-list')}
                                    sx={{ mb: 2 }}
                                >
                                    My Orders
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<MdLock />}
                                    onClick={() => navigate('/change-password')}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right side - User Information and Tabs */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ borderRadius: 2 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    aria-label="user profile tabs"
                                >
                                    <Tab
                                        icon={<BiUserCircle />}
                                        iconPosition="start"
                                        label="Profile Information"
                                    />
                                    <Tab
                                        icon={<BiHistory />}
                                        iconPosition="start"
                                        label="Account Activity"
                                    />
                                </Tabs>
                            </Box>

                            {/* Profile Information Tab */}
                            {tabValue === 0 && (
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                        <Typography variant="h6">Personal Information</Typography>

                                        <Button
                                            variant="outlined"
                                            startIcon={editMode ? <MdClose /> : <MdEdit />}
                                            onClick={handleEditToggle}
                                            color={editMode ? "error" : "primary"}
                                        >
                                            {editMode ? "Cancel" : "Edit Profile"}
                                        </Button>
                                    </Box>

                                    {editMode ? (
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        InputProps={{
                                                            startAdornment: <MdPerson style={{ marginRight: 8 }} />,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        InputProps={{
                                                            startAdornment: <MdEmail style={{ marginRight: 8 }} />,
                                                        }}
                                                        helperText="Email cannot be changed"
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone Number"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        InputProps={{
                                                            startAdornment: <MdPhone style={{ marginRight: 8 }} />,
                                                        }}
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
                                                        rows={3}
                                                        InputProps={{
                                                            startAdornment: <MdLocationOn style={{ marginRight: 8, alignSelf: 'flex-start', marginTop: 8 }} />,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<MdSave />}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    ) : (
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdPerson style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Full Name
                                                </Typography>
                                                <Typography variant="body1">
                                                    {userData?.name || "Not provided"}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdEmail style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Email Address
                                                </Typography>
                                                <Typography variant="body1">
                                                    {userData?.email || "Not provided"}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdPhone style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Phone Number
                                                </Typography>
                                                <Typography variant="body1">
                                                    {userData?.phoneNumber || "Not provided"}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdLocationOn style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Address
                                                </Typography>
                                                <Typography variant="body1">
                                                    {userData?.address || "Not provided"}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdCalendarToday style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Account Created
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatDate(userData?.createdAt)}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <MdCalendarToday style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                    Last Updated
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatDate(userData?.updatedAt)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}
                                </Box>
                            )}

                            {/* Account Activity Tab */}
                            {tabValue === 1 && (
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>Account Activity</Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                                                    <Typography variant="subtitle2">Last Login</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(new Date())}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                                                    <Typography variant="subtitle2">Profile Created</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(userData?.createdAt)}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                                                    <Typography variant="subtitle2">Last Profile Update</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(userData?.updatedAt)}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

        </div>
    );
};

export default ProfileUser;