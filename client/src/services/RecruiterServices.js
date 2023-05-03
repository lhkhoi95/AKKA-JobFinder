import axios from "axios";

const baseUrl = "http://localhost:5000/recruiter/";

/**
 * Send the update profile request to the server
 * @param {*} companyProfile
 * @returns the resposne from the server
 */
const updateCompanyProfile = async (companyProfile) => {
    const url = baseUrl + "update";
    const token = document.cookie.split("=")[1];
    const params = {
        withCredentials: true,
    };

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
    };
    axios.defaults.xsrfCookieName = "csrf_access_token";
    axios.defaults.xsrfHeaderName = "X-CSRF-TOKEN";

    try {
        const response = await axios.put(url, companyProfile, params, headers);
        const { data } = response;
        const user = JSON.parse(localStorage.getItem("user"));
        const profile = {
            ...data,
            uid: user.uid,
            role: "recruiter",
        };
        localStorage.setItem("user", JSON.stringify(profile));
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

const RecruiterServices = {
    updateCompanyProfile,
};

export default RecruiterServices;
