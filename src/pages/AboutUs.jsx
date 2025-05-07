import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { FaUsers, FaSuitcaseRolling, FaExchangeAlt, FaGlobeAsia } from "react-icons/fa";
import { MdGroups, MdTravelExplore, MdTrendingUp } from "react-icons/md";

// Ganti dengan path gambar yang sesuai di assets kamu
import AboutImg from "../assets/images/aboutus-hero.jpg";
import TraveleaseLogo from "../assets/images/travelease-logo.png";
import EcosystemImg from "../assets/images/hero-bg.png";

const AboutUs = () => {
    return (
        <Box sx={{ bgcolor: "#fafbfc", minHeight: "100vh", pb: 8 }}>
            {/* Hero Section */}
            <Box sx={{ position: "relative", width: "100%", height: { xs: 220, md: 350 }, mb: 6 }}>
                <img
                    src={AboutImg}
                    alt="About Travelease"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }}
                />
                <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography variant="h2" sx={{ color: "white", fontWeight: 700, textShadow: "0 2px 8px #000", textAlign: "center" }}>
                        Discover the World with Travelease
                    </Typography>
                </Box>
            </Box>

            {/* Apa itu Travelease */}
            <Grid container spacing={4} sx={{ maxWidth: 1100, mx: "auto", mb: 8, alignItems: "center" }}>
                <Grid item xs={12} md={6}>
                    <img
                        src={TraveleaseLogo}
                        alt="Travelease Logo"
                        style={{ width: "80%", maxWidth: 320, display: "block", margin: "0 auto" }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Apa itu Travelease?
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                        Travelease adalah platform pemesanan perjalanan dan aktivitas yang memudahkan pengguna untuk menemukan, merencanakan, dan memesan pengalaman terbaik di berbagai destinasi. Kami hadir untuk menyederhanakan perjalanan Anda, mulai dari inspirasi hingga pengalaman nyata di lapangan.
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Dengan jaringan mitra lokal dan teknologi terkini, Travelease memastikan setiap perjalanan menjadi lebih mudah, aman, dan berkesan.
                    </Typography>
                </Grid>
            </Grid>

            {/* Our Product */}
            <Box sx={{ maxWidth: 1100, mx: "auto", mb: 8 }}>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
                    Our Product
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                            <MdTravelExplore size={40} color="#F8616C" />
                            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>120+</Typography>
                            <Typography variant="body2" color="text.secondary">Activities</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                            <FaExchangeAlt size={40} color="#F8616C" />
                            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>8,500+</Typography>
                            <Typography variant="body2" color="text.secondary">Transactions</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                            <FaUsers size={40} color="#F8616C" />
                            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>3,200+</Typography>
                            <Typography variant="body2" color="text.secondary">Users</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                            <FaGlobeAsia size={40} color="#F8616C" />
                            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>15+</Typography>
                            <Typography variant="body2" color="text.secondary">Destinations</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Empowering the Travel Ecosystem */}
            <Box sx={{ maxWidth: 1100, mx: "auto", mb: 8 }}>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
                    Empowering the Travel Ecosystem
                </Typography>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <img
                            src={EcosystemImg}
                            alt="Empowering Ecosystem"
                            style={{ width: "100%", borderRadius: 12, minHeight: 220, objectFit: "cover" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <MdGroups size={32} color="#F8616C" />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Enabling Customers</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Memberikan kemudahan akses, transparansi harga, dan pengalaman pemesanan yang seamless bagi pelanggan.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <MdTrendingUp size={32} color="#F8616C" />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Empowering Communities</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Mendukung pelaku usaha lokal dan komunitas pariwisata untuk berkembang melalui kolaborasi dan teknologi.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <MdTravelExplore size={32} color="#F8616C" />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Sustainable Tourism</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Berkomitmen pada pariwisata berkelanjutan yang berdampak positif bagi lingkungan dan masyarakat.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default AboutUs;