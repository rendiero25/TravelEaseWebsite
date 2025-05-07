import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";

const CONTACT_EMAIL = "workspace.rendy@gmail.com";
const CONTACT_WA = "+62 812 9879 0058";
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.314442158263!2d107.0000493147696!3d-6.219099995498996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698c1e6b7e6e2f%3A0x401e8f1fc28c8e0!2sBekasi%2C%20West%20Java%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1718000000000!5m2!1sen!2sid";

const Contact = () => {
    const { auth } = useAuth();
    const userName = auth?.user?.name || "Guest";

    // State untuk form customer service
    const [form, setForm] = useState({ email: "", description: "" });
    const [formStatus, setFormStatus] = useState({ success: null, error: null });

    // State untuk subscribe
    const [subscribeEmail, setSubscribeEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState({ success: null, error: null });

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.description) {
            setFormStatus({ success: null, error: "Please fill all fields." });
            return;
        }
        // Simulasi submit
        setTimeout(() => {
            setFormStatus({ success: "Your message has been sent!", error: null });
            setForm({ email: "", description: "" });
        }, 700);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!subscribeEmail) {
            setSubscribeStatus({ success: null, error: "Please enter your email." });
            return;
        }
        // Simulasi subscribe
        setTimeout(() => {
            setSubscribeStatus({ success: "Subscribed successfully!", error: null });
            setSubscribeEmail("");
        }, 700);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fafbfc", py: 6 }}>
            <Box sx={{ maxWidth: 700, mx: "auto", mb: 6, p: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Hello {userName}, How can we help you?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Reach out to our customer service or check our contact info below.
                </Typography>
            </Box>

            <Box sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Get in touch with Customer Service
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Your Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleFormChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            minRows={3}
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                    {formStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{formStatus.error}</Alert>}
                    {formStatus.success && <Alert severity="success" sx={{ mt: 2 }}>{formStatus.success}</Alert>}
                </Paper>
            </Box>

            <Box sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
                <Paper sx={{ p: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Typography variant="body1">
                        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </Typography>
                    <Typography variant="body1">
                        WhatsApp: <a href={`https://wa.me/${CONTACT_WA.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{CONTACT_WA}</a>
                    </Typography>
                </Paper>
            </Box>

            <Box sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Our Location</Typography>
                    <Box sx={{ width: "100%", height: 350, mt: 2 }}>
                        <iframe
                            src={MAPS_EMBED_URL}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bekasi Location"
                        ></iframe>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
                <Paper sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f8616c",
                    color: "white",
                    borderRadius: 2
                }}>
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Typography variant="h6" fontWeight={600}>
                            Subscribe for Updates & Promotions
                        </Typography>
                        <Typography variant="body2">
                            Get the latest news and exclusive offers from TravelEase.
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Enter your email"
                            value={subscribeEmail}
                            onChange={e => setSubscribeEmail(e.target.value)}
                            sx={{
                                bgcolor: "white",
                                borderRadius: 1,
                                mr: 1,
                                minWidth: 220
                            }}
                            inputProps={{ style: { color: "#1e1e1e" } }}
                        />
                        <Button type="submit" variant="contained" sx={{ bgcolor: "#fff", color: "#f8616c", fontWeight: 600 }}>
                            Subscribe
                        </Button>
                    </form>
                </Paper>
                {subscribeStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{subscribeStatus.error}</Alert>}
                {subscribeStatus.success && <Alert severity="success" sx={{ mt: 2 }}>{subscribeStatus.success}</Alert>}
            </Box>
        </Box>
    );
};

export default Contact;