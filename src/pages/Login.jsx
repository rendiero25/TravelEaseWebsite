import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

import * as React from 'react';
import Button from '@mui/material/Button';

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "", remember: false });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
                {
                    email: form.username, // gunakan "email" sesuai docs endpoint
                    password: form.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apiKey": "24405e01-fbc1-45a5-9f5a-be13afcd757c"
                    },
                }
            );

            const token = response.data.token;
            const user = response.data.data;

            login(token, user);

            // Opsi: simpan ke localStorage jika "remember me" dicentang
            if(form.remember){
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(data));
            }

            // Redirect after login
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Login gagal. Cek username/password.");
        }
        setLoading(false);
    };

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="flex flex-col items-center justify-center min-h-screen xl:-mt-10">
                <div className="flex flex-col justify-between gap-10 5xl:gap-20 w-full">
                    <div className="py-10 px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex justify-center items-center w-full">
                        <form onSubmit={handleSubmit} className="w-full xl:max-w-sm flex flex-col gap-6">
                            <h2 className="text-2xl font-light text-black">Sign In</h2>

                            {error &&
                                <div className="text-red-600 font-bold text-xl">
                                    {error}
                                </div>
                            }

                            <div className="flex flex-col gap-2 pb-2">
                                <label className="block mb-1 font-light text-md text-black">Email address</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                    placeholder="Your email address"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="block mb-1 font-light text-md text-black">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="border border-black/20 px-6 py-2 w-full placeholder:font-light placeholder:text-sm"
                                    placeholder="Your password"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between pb-6">
                                <label className="flex items-center justify-between text-black font-light text-md">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={form.remember}
                                        onChange={handleChange}
                                        className="mr-2 "/>
                                    Remember Me
                                </label>

                                <Link to="/forgot-password" className="text-black font-light text-md">Forgot Password?</Link>
                            </div>

                            <Button type="submit" variant="outlined" disabled={loading}
                                    sx={{color:"#FF948D", fontWeight:"400", textTransform:"none", fontSize:"14px", borderWidth:"2px", borderColor:"#FF948D", borderRadius:"50px", padding:"8px 46px"}}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>

                            {/*<button*/}
                            {/*    type="submit"*/}
                            {/*    className="w-full bg-pink-500 text-white rounded py-2 mt-2 hover:bg-pink-600"*/}
                            {/*    disabled={loading}>*/}
                            {/*        {loading ? "Logging in..." : "Login"}*/}
                            {/*</button>*/}

                            <div className="mt-3 text-center">
                                <span className="font-light text-md text-black">Don't have an account?</span>{" "}
                                <Link to="/register" className="text-black underline">Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}