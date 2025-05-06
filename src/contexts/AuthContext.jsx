// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Auth state: simpan token, role, nama, dst di sini (bisa extend sesuai kebutuhan)
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        token: null,
        user: null,    // { name: "...", role: "...", dst }
    });

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, [])

    // Fungsi login & logout
    const login = (token, user) => {
        const authData = {
            isLoggedIn: true,
            token,
            user,
        }
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    };

    const logout = async () => {
        try {
            // Only call the API if user is logged in and has a token
            if (auth.isLoggedIn && auth.token) {
                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Authorization': `Bearer ${auth.token}`
                    }
                };

                // Call the logout API
                await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout',
                    config
                );
            }
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Clear auth state and local storage regardless of API success/failure
            setAuth({isLoggedIn: false, token: null, user: null});
            localStorage.removeItem('auth');
        }
    };


    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);