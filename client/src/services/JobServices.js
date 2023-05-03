import axios from "axios";
import moment from "moment";

const baseUrl = "http://localhost:5000/job/";

const DATE_FORMAT = "YYYY-MM-DD";

const getToken = () => {
    return document.cookie.split("=")[1];
};

const getHeaders = () => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getToken(),
    };
    axios.defaults.xsrfCookieName = "csrf_access_token";
    axios.defaults.xsrfHeaderName = "X-CSRF-TOKEN";
    return headers;
};
/**
 * Method to save a job
 * @param {*} jobInfo
 * @returns
 */
const saveJob = async (jobInfo) => {
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = {
        job_id: jobInfo.id,
        title: jobInfo.title,
        start_date: moment(jobInfo.startDate).format(DATE_FORMAT),
        end_date: moment(jobInfo.endDate).format(DATE_FORMAT),
        location: jobInfo.location,
        category: jobInfo.category,
        experience_level: jobInfo.experienceLevel,
        type: jobInfo.type,
        salary_min: parseInt(jobInfo.salaryMin),
        salary_max: parseInt(jobInfo.salaryMax),
        description: jobInfo.description,
    };

    try {
        // If the job has an id, send an update request
        if (data.job_id) {
            const url = baseUrl + "update";
            const response = await axios.put(url, data, params, headers);

            if (response.status === 200) {
                return "Job updated successfully!";
            } else {
                return "Error updating job. Please try again.";
            }
        } else {
            // If the job has not been assigned an id, send a post request
            const url = baseUrl + "post";
            const response = await axios.post(url, data, params, headers);
            if (response.status === 201) {
                return "Job posted successfully!";
            } else {
                return "Error creating job. Please try again.";
            }
        }
    } catch (e) {
        console.error(e);
        return e;
    }
};

/**
 * Method to get a list of jobs that have posted by the current user
 * @returns an array of job items
 */
const getPostedJobs = async () => {
    const url = baseUrl + "get-posted-jobs";
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        return response.data.jobs;
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * Send a get job information request to the server
 * @param {*} jobId
 * @returns the job information
 */
const getJob = async (jobId) => {
    const url = baseUrl + `get-one?job_id=${jobId}`;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    let jobInfo = null;

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            jobInfo = response.data.jobs[0];
        }
    } catch (e) {
        console.error(e);
    } finally {
        return jobInfo;
    }
};

/**
 * Send a delete request to delete a job to the server
 * @param {*} jobId
 * @returns delete message
 */
const deleteJob = async (jobId) => {
    const url = baseUrl + `delete?job_id=${jobId}`;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    let message = "";
    try {
        const response = await axios.delete(url, params, headers);
        console.log(response);
        if (response.status === 200) {
            message = response.data.message;
        }
    } catch (e) {
        console.error(e);
        message = "Error";
    } finally {
        return message;
    }
};

/**
 * Method to get all jobs in the databse
 * @returns an array of job items
 */
const getJobs = async () => {
    const url = baseUrl + "get-all";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            const jobs = response.data.jobs.filter(
                (job) =>
                    moment() >= moment(job.startDate, DATE_FORMAT) &&
                    moment(job.endDate) <= moment(job.endDate, DATE_FORMAT)
            );
            return jobs;
        } else return [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const JobServices = {
    saveJob,
    getJob,
    getJobs,
    getPostedJobs,
    deleteJob,
};

export default JobServices;
