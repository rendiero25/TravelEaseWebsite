import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, TextField, Alert } from "@mui/material";

import BannerForRegisterBg from "../assets/images/bannerforregister-bg.jpg";

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
        <div className="m-0 p-0 box-border font-primary">
            <div className="bg-gray/5 px-6 py-10 xl:py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col gap-20 xl:gap-25">
                <div className="flex flex-col gap-20 xl:gap-25">
                    <div className="w-full mx-auto">
                        <h2 className="font-medium text-4xl mb-4 text-center">
                            Hello {userName}, How can we help you?
                        </h2>
                        <p className="text-gray text-light text-center text-lg">
                            Reach out to our customer service or check our contact info below.
                        </p>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8 justify-between items-center w-full">
                        <div className="w-75vw mx-auto border-[0.03rem] border-primary/7">
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-medium text-3xl mb-4 text-center">
                                    Get in touch with Customer Service
                                </h3>
                                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                                    <TextField
                                        label="Your Email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleFormChange}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                    />
                                    <Button type="submit" variant="outlined" sx={{color:"#FF948D", fontWeight:"400", textTransform:"none", fontSize:"14px", borderWidth:"2px", borderColor:"#FF948D", borderRadius:"50px", padding:"8px 46px"}}>
                                        Submit
                                    </Button>
                                </form>
                                {formStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{formStatus.error}</Alert>}
                                {formStatus.success && <Alert severity="success" sx={{ mt: 2 }}>{formStatus.success}</Alert>}
                            </div>
                        </div>

                        <div className="w-25vw mx-auto mb-6 border-[0.03rem] border-primary/7">
                            <div className="bg-white rounded-lg p-8 flex flex-col gap-1">
                                <h3 className="font-medium text-3xl mb-4">Contact Information</h3>
                                <p className="text-base">
                                    Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                                </p>
                                <p className="text-base">
                                    WhatsApp: <a href={`https://wa.me/${CONTACT_WA.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{CONTACT_WA}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto bg-gray/5">
                <div className="">
                    <h3 className="font-medium text-3xl mb-9 px-6 text-center">Our Location</h3>
                    <div className="w-full h-[350px] mt-4">
                        <iframe
                            src={MAPS_EMBED_URL}
                            width="100%"
                            height="100%"
                            className="border-0 w-full h-full"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bekasi Location"
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="relative w-full mx-auto flex justify-center items-center">
                <div className="w-full">
                    <img src={BannerForRegisterBg} alt="contact-banner" className="w-full h-[15rem] object-cover"/>
                </div>

                <div className="absolute w-full text-white px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col xl:flex-row gap-4 justify-center items-center">
                    <div className="w-full">
                        <h3 className="font-medium text-3xl mb-1">
                            Subscribe for Updates & Promotions
                        </h3>
                        <p className="text-light text-lg">
                            Get the latest news and exclusive offers from TravelEase.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="flex gap-4 w-full justify-center items-center">
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Enter your email"
                            value={subscribeEmail}
                            onChange={e => setSubscribeEmail(e.target.value)}
                            sx={{
                                bgcolor: "white",
                                borderRadius: 1,
                                minWidth: 250
                            }}
                            inputProps={{ style: { color: "#1e1e1e" } }}
                        />
                        <Button type="submit" variant="outlined" sx={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px", borderColor: "white", borderRadius:"50px", padding:"12px 50px"}}>
                            Subscribe
                        </Button>
                    </form>

                    {subscribeStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{subscribeStatus.error}</Alert>}
                    {subscribeStatus.success && <Alert severity="success" sx={{ mt: 2 }}>{subscribeStatus.success}</Alert>}
                </div>
            </div>
        </div>
    );
};

export default Contact;