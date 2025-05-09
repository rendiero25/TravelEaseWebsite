import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

import {
    Container,
    Typography,
    Avatar,
    Button,
    Divider,
    CircularProgress,
    TextField,
    Tabs,
    Tab,
    Chip,
    Alert
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
    const [success, setSuccess] = useState(null);

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

            const user = response.data.data;
            setUserData(user);

            setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                profilePictureUrl: user.profilePictureUrl || "",
                address: user.address || ""
            });

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load user profile');
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        setError(null);
        setSuccess(null);
        if (!editMode) {
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
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

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

            // Pastikan response OK dan ada data
            if (response.data && response.data.status === "OK") {
                setUserData(prev => ({
                    ...prev,
                    ...dataToUpdate
                }));

                updateUserData({
                    ...auth.user,
                    ...dataToUpdate
                });

                setEditMode(false);
                setSuccess("Profile updated successfully!");
                setError(null);
            } else {
                setError(response.data?.message || "Failed to update profile");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
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
                <Container sx={{ mt: 12, mb: 8, minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </Container>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div>
                
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
                
            </div>
        );
    }

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div className="w-full mx-auto mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
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
                                <div className="my-4 w-full border-b border-gray-200"></div>
                                <div className="w-full flex flex-col gap-2">
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
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow p-6">
                                <div className="border-b border-gray-200 mb-4">
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
                                </div>
                                {tabValue === 0 && (
                                    <div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                            <Typography variant="h6">Personal Information</Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={editMode ? <MdClose /> : <MdEdit />}
                                                onClick={handleEditToggle}
                                                color={editMode ? "error" : "primary"}
                                            >
                                                {editMode ? "Cancel" : "Edit Profile"}
                                            </Button>
                                        </div>
                                        {success && (
                                            <Alert severity="success" sx={{ mb: 2 }}>
                                                {success}
                                            </Alert>
                                        )}
                                        {error && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {error}
                                            </Alert>
                                        )}
                                        {editMode ? (
                                            <form onSubmit={handleSubmit}>
                                                <div className="flex flex-col gap-4">
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
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<MdSave />}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdPerson style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Full Name
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {userData?.name || "Not provided"}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdEmail style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Email Address
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {userData?.email || "Not provided"}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdPhone style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Phone Number
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {userData?.phoneNumber || "Not provided"}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdLocationOn style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Address
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {userData?.address || "Not provided"}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdCalendarToday style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Account Created
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatDate(userData?.createdAt)}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        <MdCalendarToday style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                                        Last Updated
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatDate(userData?.updatedAt)}
                                                    </Typography>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {tabValue === 1 && (
                                    <div>
                                        <Typography variant="h6" gutterBottom>Account Activity</Typography>
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <Typography variant="subtitle2">Last Login</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(new Date())}
                                                </Typography>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <Typography variant="subtitle2">Profile Created</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(userData?.createdAt)}
                                                </Typography>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <Typography variant="subtitle2">Last Profile Update</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(userData?.updatedAt)}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default ProfileUser;