import axios from "axios";

const baseUrl = "http://localhost:5000/application/";

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
 * Apply a specific job
 */
const apply = async (jobId) => {
    const url = baseUrl + "post-one";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };
    const data = {
        job_id: jobId,
    };

    try {
        const response = await axios.post(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Get all applications that a user applied.
 * @returns an array of applied applications.
 */
const getApplications = async () => {
    const url = baseUrl + "get-all";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            return response.data.applications;
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Get all applications that applied to a specific job.
 * @param jobId
 * @returns an array of applied applications.
 */
const getApplicationsByJobId = async (jobId) => {
    const url = baseUrl + "get-all-by-job-id?job_id=" + jobId;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };
    try {
        const response = await axios.get(url, params, headers);
        return response.data.map((item) => {
            return {
                ...item.candidateInfo,
                applicationInfo: { ...item.applicationInfo },
            };
        });
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * Update an application status
 * @param {*} jobId
 * @param {*} newStatus
 * @returns true if the process updated successfully.
 */
const updateApplicationStatus = async (jobId, newStatus) => {
    const url = baseUrl + "update";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = {
        id: jobId,
        status: newStatus,
    };

    try {
        const response = await axios.put(url, data, params, headers);
        return response.status === 201;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/**
 * Verify if a user has already applied to a job.
 * @param {*} jobId
 * @returns
 */
const isJobApplied = async (jobId) => {
    const applications = await getApplications();
    const jobIds = applications.map((app) => app.jobId);
    return jobIds.includes(jobId);
};

const ApplicationServices = {
    apply,
    getApplications,
    getApplicationsByJobId,
    updateApplicationStatus,
    isJobApplied,
};

export default ApplicationServices;
