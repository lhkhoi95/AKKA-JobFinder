import React, { useState, createContext, useEffect } from "react";

import AuthenticationServices from "../services/AuthenticationServices";

export const UserContext = createContext({ user: null });

/**
 * Authentication Provider
 * Provide current user context for other components to access the current user state.
 */
export default (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    /**
     * On component mounted
     * Get current user information.
     */
    useEffect(() => {
        const myUser = AuthenticationServices.getCurrentUser();
        setUser(myUser);
    }, []);

    // Handle event to sign the user in
    const signIn = async (data) => {
        try {
            // Wait for sign in request's response from the server
            const response = await AuthenticationServices.signIn(data);

            // Sign in Success
            if (response.status === 200) {
                const userInfo = response.data.user_info;
                // Get user information based on user role
                // and bind the local storage
                AuthenticationServices.getProfile(userInfo.role).then(
                    (response) => {
                        if (userInfo.role === "candidate") {
                            const profile = {
                                ...userInfo,
                                ...response.data.profile,
                            };
                            localStorage.setItem(
                                "user",
                                JSON.stringify(profile)
                            );

                            if (profile.fullName === "") {
                                // Redirect to update profile form when Full Name is empty
                                window.location.href =
                                    "/candidate/build-profile";
                            } else {
                                // Redirect to home page
                                window.location.href = "/";
                            }
                        }
                        if (userInfo.role === "recruiter") {
                            const profile = {
                                ...userInfo,
                                ...response.data,
                            };
                            localStorage.setItem(
                                "user",
                                JSON.stringify(profile)
                            );

                            if (profile.companyName === "") {
                                // Redirect to update profile form when Company Name is empty
                                window.location.href =
                                    "/recruiter/build-profile";
                            } else {
                                // Redirect to home page
                                window.location.href = "/";
                            }
                        }
                    }
                );
            }

            return response;
        } catch (e) {
            console.error(e);
        }
    };

    // Log the user out
    const signOut = () => {
        AuthenticationServices.signOut();
        window.location.href = "/";
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, signIn, signOut }}>
            {props.children}
        </UserContext.Provider>
    );
};
