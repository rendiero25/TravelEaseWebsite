import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import * as React from 'react';
import Button from '@mui/material/Button';

const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export default function Register() {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Simple validation
        if (
            !form.email ||
            !form.name ||
            !form.password ||
            !form.passwordRepeat
        ) {
            setError("All fields are required.");
            return;
        }
        if (!form.terms) {
            setError("You must accept the terms & conditions.");
            return;
        }
        if (form.password !== form.passwordRepeat) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                API_URL,
                {
                    email: form.email,
                    name: form.name,
                    password: form.password,
                    passwordRepeat: form.passwordRepeat,
                    role: "user",
                },
                {
                    headers: { "apiKey": API_KEY },
                }
            );
            // Sukses, redirect ke login page
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
        setLoading(false);
    };

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="flex flex-col items-center justify-between min-h-screen">
                <Header />

                <div className="flex flex-col justify-between w-full">
                    <div className="py-10 px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col justify-center items-center w-full">
                        <div className="w-full xl:max-w-sm flex flex-col gap-6">
                            <h2 className="text-2xl font-light text-black">Register</h2>

                            {error && (
                                <div className="text-red-600 font-bold text-xl">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2 pb-2">
                                    <label className="block mb-1 font-light text-md text-black">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                        placeholder="Enter your email address"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pb-2">
                                    <label className="block mb-1 font-light text-md text-black">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                        placeholder="Enter your name"
                                        required
                                        autoComplete="name"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pb-2">
                                    <label className="block mb-1 font-light text-md text-black">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                        placeholder="Password"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pb-2">
                                    <label className="block mb-1 font-light text-md text-black">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="passwordRepeat"
                                        value={form.passwordRepeat}
                                        onChange={handleChange}
                                        className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                        placeholder="Confirm Password"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="flex items-center pb-6">
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={form.terms}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    <label className="flex flex-row gap-2 items-center justify-between text-black font-light text-md">
                                        I've read and accept{" "} <span className="text-black underline font-normal">terms & conditions</span>
                                    </label>
                                </div>

                                <Button type="submit" variant="outlined" disabled={loading}
                                        sx={{color:"#FF948D", fontWeight:"400", textTransform:"none", fontSize:"14px", borderWidth:"2px", borderColor:"#FF948D", borderRadius:"50px", padding:"8px 46px"}}>
                                            {loading ? "Registering..." : "Sign Up"}
                                </Button>
                            </form>

                            <div className="font-light text-md text-black flex justify-center gap-2">
                                Already have an account?{" "}
                                <Link className="text-black underline font-normal" to="/login">
                                    Login
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="w-full"><Footer /></div>
            </div>
        </div>
    );
}