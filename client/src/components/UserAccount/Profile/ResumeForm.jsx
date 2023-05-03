import React, { useState, useEffect, useRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import FileHandlingServices from "../../../services/FileHandlingServices";
import CandidateServices from "../../../services/CandidateServices";

/**
 * Component to render a Resume File Upload
 */
function ResumeForm(props) {
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const fileInput = useRef();

    // Handle file selected
    const handleFileInput = (e) => {
        if (e.target.files.length > 0) {
            console.log(e.target.files[0]);
            setSelectedFile(e.target.files[0]);
            handleFileUpload(e.target.files[0]);
        }
    };

    // Handle file dragged
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle file dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    // Uploading file
    const handleFileUpload = async (resumeFile) => {
        setLoading(true);
        const response = await FileHandlingServices.uploadResume(resumeFile);
        if (response !== "") {
            setResumeUrl(response);
            const user = JSON.parse(localStorage.getItem("user"));
            const profile = { ...user, resumeUrl: response };
            CandidateServices.updateCandidateProfile(profile).then((res) => {
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setResumeUrl(user.resumeUrl);
        }
    }, []);

    return (
        <>
            <Typography variant="h4" fontWeight="bold">
                Upload Your Resume File
            </Typography>
            <Box className={["profile-form-container", "container"]}>
                <Stack
                    className="file-upload-container"
                    style={{ minHeight: "20vh" }}
                    justifyContent="center"
                    alignItems="center"
                    onDragEnter={handleDrag}
                    onClick={() => fileInput.current.click()}
                >
                    <div></div>
                    <UploadFileRoundedIcon
                        style={{ fontSize: "50px" }}
                        color="primary"
                    />
                    <Typography>Click the button</Typography>
                    <Typography>or drag & drop you file here</Typography>
                    <input
                        ref={fileInput}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileInput}
                        accept="application/pdf"
                    />
                    {dragActive && (
                        <div
                            id="drag-file-element"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        ></div>
                    )}
                </Stack>
                {resumeUrl != null && (
                    <Stack>
                        <Typography>Uploaded File</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="text" href={resumeUrl}>
                                <InsertDriveFileRoundedIcon color="primary" />
                                <span>
                                    {resumeUrl.split("/").length > 0 &&
                                        resumeUrl.split("/").slice(-1)[0]}
                                </span>
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Box>
        </>
    );
}
export default ResumeForm;
