import axios from "axios";
import moment from "moment";

const baseUrl = "http://localhost:5000/membership/";

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
 * Post a membership purchase request to the server
 * @param {*} selectedPlan
 * @returns response from the server
 */
const addMembership = async (selectedPlan) => {
    const url = baseUrl + "post";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = {
        type: selectedPlan.type,
        price: selectedPlan.price,
    };

    try {
        const response = await axios.post(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e.response);
        return e.response;
    }
};

/**
 * Get the user's current membership information
 * @returns the user's current membership information if exists, else return null
 */
const getMembership = async () => {
    const url = baseUrl + "get";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            const membershipInfo = {
                ...response.data,
                expirationDate: moment(
                    response.data.expirationDate,
                    "YYYY-MM-DD"
                ).toDate(),
                startDate: moment(
                    response.data.startDate,
                    "YYYY-MM-DD"
                ).toDate(),
            };
            return {
                ...membershipInfo,
                status: getMembershipStatus(membershipInfo.expirationDate),
                isExpired:
                    getMembershipStatus(membershipInfo.expirationDate) ===
                    "Expired",
            };
        } else {
            return null;
        }
    } catch (e) {
        console.error(e.response);
        return null;
    }
};

/**
 * Check if the membership is expired
 */
const isMembershipExpired = async () => {
    const membershipInfo = await getMembership();
    if (membershipInfo) {
        return membershipInfo.isExpired;
    } else {
        return true;
    }
};

/**
 * Get the membership status based on expired date and current date
 * @param {*} expireDate
 * @returns membership status in text
 */
const getMembershipStatus = (expireDate) => {
    if (expireDate) {
        const today = moment();
        return today <= expireDate ? "Active" : "Expired";
    }
    return null;
};

const MembershipServices = {
    getMembership,
    addMembership,
    isMembershipExpired,
};

export default MembershipServices;
