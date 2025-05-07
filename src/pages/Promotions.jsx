import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Pagination,
} from "@mui/material";

const Promotions = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
                    { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
                );
                setPromos(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch promotions");
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // Pagination logic
    const paginatedPromos = promos.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 8, px: 2 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Promotions
            </Typography>
            <Grid container spacing={3}>
                {paginatedPromos.map((promo) => (
                    <Grid item xs={12} sm={6} md={4} key={promo.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="180"
                                image={
                                    promo.imageUrl ||
                                    "https://via.placeholder.com/400x180?text=No+Image"
                                }
                                alt={promo.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {promo.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {promo.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Promo Code:</strong> {promo.promo_code}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Discount Price:</strong>{" "}
                                    {promo.promo_discount_price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                    count={Math.ceil(promos.length / rowsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default Promotions;