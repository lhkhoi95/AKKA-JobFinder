import axios from "axios";
import moment from "moment";

const baseUrl = "http://localhost:5000/candidate/";
const skillBaseUrl = "http://localhost:5000/skill/";
const educationBaseUrl = "http://localhost:5000/education/";
const workBaseUrl = "http://localhost:5000/work-experience/";

const DATE_FORMAT = "YYYY-MM-DD";

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
 * Post candidate update profile request to the server
 * @param {*} profile
 */
const updateCandidateProfile = async (profile) => {
    const url = baseUrl + "update";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = {
        full_name: profile.fullName,
        location: profile.location,
        bio: profile.bio,
        phone_number: profile.phoneNumber,
        resume_url: profile.resumeUrl,
    };

    try {
        const response = await axios.put(url, data, params, headers);
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedProfile = {
            ...response.data,
            uid: user.uid,
            role: "candidate",
        };
        localStorage.setItem("user", JSON.stringify(updatedProfile));
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a get candidate profile to the server
 * @returns the profile of current candidate user
 */
const getCandidateProfile = async () => {
    const url = baseUrl + "get-profile";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        const { data } = response;
        if (response.status === 200) {
            return data;
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a post new skill request to the server
 * @param {*} skill
 * @returns the skill with auto-generated id
 */
const addSkill = async (skill) => {
    const url = skillBaseUrl + "post-one";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = { skill: skill };

    try {
        const response = await axios.post(url, data, params, headers);
        if (response.status === 201) {
            return response.data.skill;
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a get user skills list
 * @returns current user skills list
 */
const getSkills = async () => {
    const url = skillBaseUrl + "get";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };
    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            return response.data.skills;
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a delete request do delete a skill
 * @param {*} skillId
 * @returns true if skill deleted successfully
 */
const deleteSkill = async (skillId) => {
    const url = skillBaseUrl + "delete?ids=" + skillId;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };
    try {
        const response = await axios.delete(url, params, headers);
        return response.status === 200;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a Get user education history to the server
 * @returns user's education history list
 */
const getEducationItems = async () => {
    const url = educationBaseUrl + "get-all";
    const headers = getHeaders();
    const params = { withCredentials: true };
    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            return response.data.educations.map((item) => {
                return {
                    ...item,
                    startDate:
                        item.startDate === "None"
                            ? null
                            : moment(item.startDate, DATE_FORMAT).toDate(),
                    endDate:
                        item.endDate === "None"
                            ? null
                            : moment(item.endDate, DATE_FORMAT).toDate(),
                };
            });
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Save education histories
 * @param {*} educationItems
 */
const saveEducationHistory = async (educationItems) => {
    try {
        // Filter the new items (item without id)
        const newItems = educationItems.filter(
            (item) => item.schoolId == null && item.schoolName.length > 0
        );
        // Filter the items that have id
        const updateItems = educationItems.filter(
            (item) => item.schoolId != null && item.schoolName.length > 0
        );

        const [res1, res2] = await Promise.all([
            addNewEducationHistory(newItems),
            updateEducationHistory(updateItems),
        ]);
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a post request to add new education history items to the server
 * @param {*} educationItems
 * @returns post request response
 */
const addNewEducationHistory = async (educationItems) => {
    const url = educationBaseUrl + "post-batch";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = educationItems.map((item) => {
        return {
            school_name: item.schoolName,
            degree: item.degree,
            major: item.major,
            start_date: item.startDate
                ? moment(item.startDate).format(DATE_FORMAT)
                : null,
            end_date: item.endDate
                ? moment(item.endDate).format(DATE_FORMAT)
                : null,
            description: item.description,
        };
    });

    try {
        const response = await axios.post(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send an update education history items to the server
 * @param {*} educationItems
 * @returns the update request response
 */
const updateEducationHistory = async (educationItems) => {
    const url = educationBaseUrl + "update";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = educationItems.map((item) => {
        return {
            school_id: item.schoolId,
            school_name: item.schoolName,
            degree: item.degree,
            major: item.major,
            start_date: item.startDate
                ? moment(item.startDate).format(DATE_FORMAT)
                : null,
            end_date: item.endDate
                ? moment(item.endDate).format(DATE_FORMAT)
                : null,
            description: item.description,
        };
    });

    try {
        const response = await axios.put(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a delete education history item request to the server
 * @param {*} id
 * @returns true if the item deleted successfully
 */
const deleteEducationHistory = async (id) => {
    const url = educationBaseUrl + "delete?ids=" + id;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.delete(url, params, headers);
        return response.status === 200;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a request to get a list of work experience items
 * @returns a list of work experience items
 */
const getWorkHistoryItems = async () => {
    const url = workBaseUrl + "get-all";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            return response.data.work_experiences.map((item) => {
                return {
                    ...item,
                    currentJob: item.currentJob.toLowerCase() === "true",
                    startDate:
                        item.startDate === "None" || item.startDate === null
                            ? null
                            : moment(item.startDate, DATE_FORMAT).toDate(),
                    endDate:
                        item.endDate === "None" || item.endDate === null
                            ? null
                            : moment(item.endDate, DATE_FORMAT).toDate(),
                };
            });
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Update work history items
 * @param {*} items
 */
const saveWorkHistory = async (items) => {
    try {
        // Filter items that have no ids (for add new)
        const newItems = items.filter(
            (item) => item.id == null && item.position.length > 0
        );

        // Filter items that already have id
        const updateItems = items.filter(
            (item) => item.id != null && item.position.length > 0
        );

        const [res1, res2] = await Promise.all([
            addNewWorkHistory(newItems),
            updateWorkHistory(updateItems),
        ]);
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a post request to add new work history items
 * @param {*} items
 * @returns a post request response from the server
 */
const addNewWorkHistory = async (items) => {
    const url = workBaseUrl + "post-batch";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = items.map((item) => {
        return {
            company_name: item.companyName,
            position: item.position,
            current_job: item.currentJob,
            start_date: item.startDate
                ? moment(item.startDate).format(DATE_FORMAT)
                : null,
            end_date: item.endDate
                ? moment(item.endDate).format(DATE_FORMAT)
                : null,
            description: item.description,
            location: item.location,
        };
    });

    try {
        const response = await axios.post(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a update request to update work history items
 * @param {*} items
 * @returns an update request response from the server
 */
const updateWorkHistory = async (items) => {
    const url = workBaseUrl + "update";
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    const data = items.map((item) => {
        return {
            id: item.id,
            company_name: item.companyName,
            position: item.position,
            current_job: item.currentJob,
            start_date: item.startDate
                ? moment(item.startDate).format(DATE_FORMAT)
                : null,
            end_date: item.endDate
                ? moment(item.endDate).format(DATE_FORMAT)
                : null,
            description: item.description,
            location: item.location,
        };
    });

    try {
        const response = await axios.put(url, data, params, headers);
        return response;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a delete request to delete a work history item
 * @param {*} id
 * @returns true if the item deleted successfully
 */
const deleteWorkHistory = async (id) => {
    const url = workBaseUrl + "delete?ids=" + id;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.delete(url, params, headers);
        return response.status === 200;
    } catch (e) {
        console.error(e);
    }
};

const CandidateServices = {
    getEducationItems,
    updateCandidateProfile,
    getCandidateProfile,
    getSkills,
    addSkill,
    deleteSkill,
    getEducationItems,
    saveEducationHistory,
    deleteEducationHistory,
    getWorkHistoryItems,
    saveWorkHistory,
    deleteWorkHistory,
};

export default CandidateServices;
