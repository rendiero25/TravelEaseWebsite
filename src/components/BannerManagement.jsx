// BannerManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// MUI Components
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
    Pagination
} from '@mui/material';

// Icons
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const BannerManagement = () => {
    const { auth } = useAuth();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form states
    const [formMode, setFormMode] = useState('create'); // 'create', 'update', 'view'
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        imageUrl: '',
        isActive: true
    });

    // Search and pagination
    const [searchBannerId, setSearchBannerId] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5); // ubah dari 5 ke 3

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // Fetch all banners on component mount
    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== "admin") {
            window.location.href = "/";
            return;
        }
        fetchAllBanners();
    }, []);

    // Fetch all banners
    const fetchAllBanners = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners',
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                }
            );
            setBanners(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch banners');
            setLoading(false);
            console.error('Error fetching banners:', err);
        }
    };

    // Search banner by ID
    const handleSearchBanner = async () => {
        if (!searchBannerId.trim()) {
            setError('Please enter a banner ID');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // Cari banner di list lokal dulu
            const found = banners.find(b => String(b.id) === searchBannerId.trim());
            if (found) {
                setBanners([found]);
                setLoading(false);
                return;
            }
            // Jika tidak ketemu, coba fetch ke API
            const response = await axios.get(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banner/${searchBannerId.trim()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                }
            );
            if (response.data && response.data.data) {
                setBanners([response.data.data]);
            } else {
                setBanners([]);
                setError('Banner not found');
            }
            setLoading(false);
        } catch (err) {
            setBanners([]);
            setError('Banner not found or error occurred');
            setLoading(false);
            console.error('Error searching banner:', err);
        }
    };

    // Reset search and show all banners
    const handleResetSearch = () => {
        setSearchBannerId('');
        fetchAllBanners();
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle checkbox change for isActive
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            isActive: e.target.checked
        });
    };

    // Open form dialog for creating a new banner
    const handleOpenCreateForm = () => {
        setFormMode('create');
        setFormData({
            name: '',
            imageUrl: '',
            isActive: true
        });
        setFormOpen(true);
    };

    // Open form dialog for updating a banner
    const handleOpenUpdateForm = (banner) => {
        setFormMode('update');
        setFormData({
            id: banner.id,
            name: banner.name,
            imageUrl: banner.imageUrl,
            isActive: banner.isActive
        });
        setFormOpen(true);
    };

    // Open form dialog for viewing a banner
    const handleOpenViewForm = (banner) => {
        setFormMode('view');
        setFormData({
            id: banner.id,
            name: banner.name,
            imageUrl: banner.imageUrl,
            isActive: banner.isActive
        });
        setFormOpen(true);
    };

    // Close form dialog
    const handleCloseForm = () => {
        setFormOpen(false);
    };

    // Create a new banner
    const handleCreateBanner = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update local state
            setBanners([...banners, response.data.data]);
            setSuccess('Banner created successfully');
            setLoading(false);
            handleCloseForm();
        } catch (err) {
            setError('Failed to create banner');
            setLoading(false);
            console.error('Error creating banner:', err);
        }
    };

    // Update an existing banner
    const handleUpdateBanner = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${formData.id}`,
                {
                    name: formData.name,
                    imageUrl: formData.imageUrl,
                    isActive: formData.isActive
                },
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update local state
            setBanners(banners.map(banner =>
                banner.id === formData.id ? response.data.data : banner
            ));

            setSuccess('Banner updated successfully');
            setLoading(false);
            handleCloseForm();
        } catch (err) {
            setError('Failed to update banner');
            setLoading(false);
            console.error('Error updating banner:', err);
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteDialog = (banner) => {
        setBannerToDelete(banner);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setBannerToDelete(null);
    };

    // Delete a banner
    const handleDeleteBanner = async () => {
        try {
            setLoading(true);

            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${bannerToDelete.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                }
            );

            // Update local state
            setBanners(banners.filter(banner => banner.id !== bannerToDelete.id));

            setSuccess('Banner deleted successfully');
            setLoading(false);
            handleCloseDeleteDialog();
        } catch (err) {
            setError('Failed to delete banner');
            setLoading(false);
            console.error('Error deleting banner:', err);
        }
    };

    // Handle form submission
    const handleSubmitForm = () => {
        if (formMode === 'create') {
            handleCreateBanner();
        } else if (formMode === 'update') {
            handleUpdateBanner();
        }
    };

    // Close alert messages
    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate pagination
    const paginatedBanners = banners.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Form validation
    const isFormValid = formData.name.trim() !== '' && formData.imageUrl.trim() !== '';

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>Banner Management</Typography>

            {/* Search and Add Banner */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '60%' }}>
                    <TextField
                        label="Search by Banner ID"
                        variant="outlined"
                        size="small"
                        value={searchBannerId}
                        onChange={(e) => setSearchBannerId(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {/* Button untuk mencari banner */}
                                    <IconButton onClick={handleSearchBanner} edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button variant="outlined" onClick={handleResetSearch}>
                        Show All
                    </Button>
                </Box>

                {/* Button untuk membuat banner */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateForm}
                >
                    Add New Banner
                </Button>
            </Paper>

            {/* Banners Grid View */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {paginatedBanners.length === 0 ? (
                        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                            No banners found
                        </Typography>
                    ) : (
                        <div className="flex flex-row gap-6 w-full justify-center items-stretch py-10">
                            {paginatedBanners.map((banner) => (
                                <div
                                    key={banner.id}
                                    className="flex flex-col bg-white rounded-lg shadow-md w-full max-w-xs min-w-[220px] flex-1"
                                >
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.name}
                                        className="h-40 w-full object-cover rounded-t-lg"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x160?text=Image+Not+Available"; }}
                                    />
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="font-semibold text-lg mb-1 truncate" title={banner.name}>{banner.name}</div>
                                        <div className="text-gray-500 text-xs mb-1">ID: {banner.id}</div>
                                        <div className={`text-xs font-bold mb-2 ${banner.isActive ? "text-green-600" : "text-red-500"}`}>
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </div>
                                        <div className="flex flex-row gap-2 mt-auto">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleOpenViewForm(banner)}
                                                title="View"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </button>
                                            <button
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleOpenUpdateForm(banner)}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleOpenDeleteDialog(banner)}
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <Pagination
                            count={Math.ceil(banners.length / rowsPerPage)}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </>
            )}

            {/* Banner Form Dialog */}
            <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
                <DialogTitle>
                    {formMode === 'create' ? 'Create New Banner' :
                        formMode === 'update' ? 'Update Banner' : 'Banner Details'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseForm}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Banner Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={formMode === 'view'}
                                    required={formMode !== 'view'}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    disabled={formMode === 'view'}
                                    required={formMode !== 'view'}
                                    margin="normal"
                                    helperText="Enter a valid image URL"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1" sx={{ mr: 2 }}>
                                        Status:
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color={formData.isActive ? "success" : "error"}
                                        onClick={() => formMode !== 'view' && setFormData({...formData, isActive: !formData.isActive})}
                                        disabled={formMode === 'view'}
                                    >
                                        {formData.isActive ? "Active" : "Inactive"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                        {formData.imageUrl && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Image Preview:
                                </Typography>
                                <img
                                    src={formData.imageUrl}
                                    alt="Banner Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm}>
                        {formMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {formMode !== 'view' && (
                        <Button
                            onClick={handleSubmitForm}
                            variant="contained"
                            color="primary"
                            disabled={!isFormValid}
                        >
                            {formMode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete the banner "{bannerToDelete?.name}"?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button
                        onClick={handleDeleteBanner}
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

export default BannerManagement;