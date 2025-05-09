import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

import {
    Container,
    Typography,
    Box,
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
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 xl:py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col gap-20 xl:gap-25">
                <div className="bg-gray-50">
                    <div className="max-w-7xl mx-auto mb-8">
                        {error && (
                            <Alert severity="error" className="mb-2">
                                {error}
                            </Alert>
                        )}

                        {/* Flexbox layout replaces Grid */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Admin Profile Overview */}
                            <div className="w-full md:w-1/3">
                                <Paper elevation={3} className="p-6 rounded-2xl flex flex-col items-center">
                                    <Avatar
                                        src={adminData?.profilePictureUrl}
                                        alt={adminData?.name}
                                        sx={{ width: 120, height: 120, mx: 'auto', border: '4px solid #f0f0f0' }}
                                    />

                                    <Typography variant="h5" className="mt-4 font-bold">
                                        {adminData?.name}
                                    </Typography>

                                    <Chip
                                        label="Administrator"
                                        color="primary"
                                        className="my-2"
                                        icon={<MdDashboard />}
                                        sx={{padding: "4px 8px"}}
                                    />

                                    <div className="my-6 w-full border-b border-black/7"></div>

                                    <Stack spacing={2} className="w-full my-2 mb-8 flex flex-col justify-center items-center">
                                        <Box className="flex items-center gap-2">
                                            <MdEmail className="text-black" />
                                            <Typography>{adminData?.email || 'No email'}</Typography>
                                        </Box>
                                        <Box className="flex items-center gap-2">
                                            <MdPhone className="text-black" />
                                            <Typography>{adminData?.phoneNumber || 'No phone number'}</Typography>
                                        </Box>
                                        <Box className="flex items-center gap-2">
                                            <MdLocationOn className="text-black" />
                                            <Typography>{adminData?.address || 'No address'}</Typography>
                                        </Box>
                                        
                                        {adminData?.createdAt && (
                                            <Box className="flex items-center gap-2">
                                                <MdCalendarToday className="text-primary" />
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
                                        sx={{padding: "12px 0"}}                                        
                                    >
                                        Edit Profile
                                    </Button>
                                </Paper>
                            </div>

                            {/* Admin Details and Management */}
                            <div className="w-full md:w-2/3">
                                <Paper elevation={3} className="p-6 rounded-2xl">
                                    <div className="border-b border-gray-200 mb-4">
                                        <Tabs value={tabValue} onChange={handleTabChange}>
                                            <Tab label="Profile Details" icon={<MdPerson />} iconPosition="start" />
                                            <Tab label="Account Security" icon={<MdLock />} iconPosition="start" />
                                        </Tabs>
                                    </div>

                                    {/* Profile Details Tab */}
                                    {tabValue === 0 && (
                                        <div>
                                            <Typography variant="h6" className="mb-8">
                                                {editMode ? 'Edit Profile Information' : 'Admin Profile Information'}
                                            </Typography>

                                            {editMode ? (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="flex flex-col md:flex-row md:flex-wrap gap-8 w-full">
                                                        <TextField
                                                            fullWidth
                                                            label="Name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="md:w-[48%]"
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            label="Email"
                                                            name="email"
                                                            value={formData.email}
                                                            disabled
                                                            helperText="Email cannot be changed"
                                                            className="md:w-[48%]"
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            label="Phone Number"
                                                            name="phoneNumber"
                                                            value={formData.phoneNumber}
                                                            onChange={handleInputChange}
                                                            className="md:w-[48%]"
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            label="Profile Picture URL"
                                                            name="profilePictureUrl"
                                                            value={formData.profilePictureUrl}
                                                            onChange={handleInputChange}
                                                            className="md:w-[48%]"
                                                            InputProps={{
                                                                style: { maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }
                                                            }}
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            label="Address"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            multiline
                                                            rows={2}
                                                            className="w-full"
                                                        />
                                                        <div className="flex gap-2 justify-end w-full mt-2">
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
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 w-full">
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
                                                                <div className="w-full" key={key}>
                                                                    <Box className="mb-2">
                                                                        <Typography variant="subtitle2" color="text.primary"
                                                                                    className="capitalize">
                                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                        </Typography>
                                                                        
                                                                        <Typography variant="body1" color="text.primary" sx={{width: "100%", overflow: "hidden", textOverflow: "ellipsis"}}>
                                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                        </Typography>
                                                                    </Box>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Account Security Tab */}
                                    {tabValue === 1 && (
                                        <div>
                                            <Typography variant="h6" gutterBottom>
                                                Account Security
                                            </Typography>
                                            <Alert severity="info" className="mb-4">
                                                For security reasons, password changes must be made through a separate process.
                                            </Alert>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Account Information
                                            </Typography>
                                            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                                                <div className="md:w-[48%]">
                                                    <Box className="mb-2">
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            User ID
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {adminData?.id || 'Not available'}
                                                        </Typography>
                                                    </Box>
                                                </div>
                                                <div className="md:w-[48%]">
                                                    <Box className="mb-2">
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Role
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {adminData?.role || 'Admin'}
                                                        </Typography>
                                                    </Box>
                                                </div>
                                                <div className="md:w-[48%]">
                                                    <Box className="mb-2">
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Email Verified
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {adminData?.emailVerified ? 'Yes' : 'No'}
                                                        </Typography>
                                                    </Box>
                                                </div>
                                                <div className="md:w-[48%]">
                                                    <Box className="mb-2">
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Last Login
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {adminData?.lastLogin ?
                                                                format(new Date(adminData.lastLogin), 'MMMM dd, yyyy HH:mm') :
                                                                'Not available'}
                                                        </Typography>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAdmin;