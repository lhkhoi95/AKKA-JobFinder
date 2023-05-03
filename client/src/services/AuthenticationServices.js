import axios from "axios";

const API_URL = "http://localhost:5000/";

const getHeaders = () => {
    const token = document.cookie.split("=")[1];
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
    };
    axios.defaults.xsrfCookieName = "csrf_access_token";
    axios.defaults.xsrfHeaderName = "X-CSRF-TOKEN";

    return headers;
};

/**
 * Method to login to the application
 * @param loginInfo { email, password }
 * @returns sign in response
 */
const signIn = async (loginInfo) => {
    const user = { ...loginInfo };
    const params = {
        withCredentials: true,
    };
    const url = API_URL + "user/login";

    try {
        const response = await axios.post(url, user, params);
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

/**
 * Method to create an account
 * @param {*} userInfo
 * @returns
 */
const signUp = async (userInfo) => {
    const url = API_URL + "user/register";
    const params = {
        withCredentials: true,
    };
    try {
        const response = await axios.post(url, userInfo, params);
        return response;
    } catch (e) {
        console.error(e);
        return e.response;
    }
};

/**
 * Log the user out of the web application
 */
const signOut = () => {
    // Clear user out of local storage
    localStorage.setItem("user", null);
};

/**
 * Get the current logged in user information from the local storage
 */
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

/**
 * Retrieve user profile from the back end
 * @param {*} role the user's role ['candidate', 'recruiter']
 * @returns user profile
 */
const getProfile = async (role) => {
    const url = API_URL + role + "/get-profile";
    const params = {
        withCredentials: true,
    };
    try {
        const response = await axios.get(url, params);
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

/**
 * Update user email address
 * @param {*} loginInfo
 * @returns true if email updated successfully
 */
const updateEmail = async (loginInfo) => {
    const url = API_URL + "user/update";
    const params = {
        withCredentials: true,
    };
    const headers = getHeaders();
    const data = {
        email: loginInfo.email,
        current_password: loginInfo.password,
        new_password: "",
    };

    try {
        const response = await axios.put(url, data, params, headers);
        return response;
    } catch (e) {
        return e.response;
    }
};

/**
 * Update user password
 * @param {*} currentPassword
 * @param {*} newPassword
 * @returns true if password updated successfully
 */
const updatePassword = async (currentPassword, newPassword) => {
    const url = API_URL + "user/update";
    const params = {
        withCredentials: true,
    };
    const headers = getHeaders();
    const data = {
        email: "",
        current_password: currentPassword,
        new_password: newPassword,
    };

    try {
        const response = await axios.put(url, data, params, headers);
        return response;
    } catch (e) {
        return e.response;
    }
};

/**
 * Delete user account
 * @param {*} currentPassword
 * @returns true if account deleted successfully
 */
const deleteAccount = async (currentPassword) => {
    const url = API_URL + "user/delete";
    const params = {
        withCredentials: true,
    };
    const headers = getHeaders();
    const data = {
        password: currentPassword,
    };

    try {
        const response = await axios.post(url, data, params, headers);
        return response;
    } catch (e) {
        return e.response;
    }
};

/**
 * Send the request to recover password to back end
 * @param {*} email
 * @returns true if request posted successfully
 */
const requestRecoverPassword = async (email) => {
    const url = API_URL + "user/send-recovery-url?email=" + email;
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params);
        return response;
    } catch (e) {
        return e.response;
    }
};

/**
 * Update new password
 * @param {*} newPassword
 * @param {*} token
 * @returns response from back end.
 */
const resetPassword = async (newPassword, token) => {
    const url = API_URL + "user/reset-password";
    const params = {
        withCredentials: true,
    };
    const data = {
        new_password: newPassword,
        reset_token: token,
    };

    try {
        const response = await axios.post(url, data, params);
        return response;
    } catch (e) {
        return e.response;
    }
};

const AuthenticationServices = {
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    getProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
    requestRecoverPassword,
    resetPassword,
};

export default AuthenticationServices;
