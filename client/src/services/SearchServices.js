import axios from "axios";

const baseUrl = "http://localhost:5000/search/";

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
 * Send a job search request to the server
 * @param {*} title - the job's title
 * @param {*} location - the job's location
 * @returns an array of job search results
 */
const searchJobs = async (title, location) => {
    const url =
        baseUrl + "title-and-location?title=" + title + "&location=" + location;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            return response.data.jobs;
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Send a candidate search request to the server
 * @param {*} skills
 * @returns an array of candidates
 */
const searchCandidates = async (skills) => {
    const arrSkills = skills
        .split(",")
        .map((skill) => skill.toLowerCase().trim());
    const url = baseUrl + "skills?skills=" + skills;
    const headers = getHeaders();
    const params = {
        withCredentials: true,
    };

    try {
        const response = await axios.get(url, params, headers);
        if (response.status === 200) {
            const candidates = response.data.candidates.map((candidate) => {
                return {
                    ...candidate,
                    skills: candidate.skills.map((item) => {
                        return {
                            ...item,
                            matched: arrSkills.includes(
                                item.name.toLowerCase()
                            ),
                        };
                    }),
                };
            });
            return candidates;
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
        return [];
    }
};

const SearchServices = {
    searchJobs,
    searchCandidates,
};

export default SearchServices;
