import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { UserContext } from "../../providers/AuthProvider";

/**
 * A functional component that render the Copyright
 */
function Copyright() {
    return (
        <Typography variant="body2">
            {"Copyright © "}
            {new Date().getFullYear()}{" "}
            <Link color="inherit" href="#">
                akka - Job Finder
            </Link>{" "}
            {". "}
            {"All rights reserved."}
        </Typography>
    );
}

/**
 * A component that display the Footer of the website
 */
export default function Footer() {
    const { user } = useContext(UserContext);

    const getFooterItems = () => {
        if (user) {
            if (user.role === "candidate") {
                console.log("Candidate user");
                return [
                    {
                        title: "About Us",
                        items: [{ title: "About Us", to: "/about-us" }],
                    },
                    {
                        title: "For Talents",
                        items: [
                            { title: "Find Jobs", to: "/job/search" },
                            { title: "Saved Jobs", to: "/job/saved" },
                            {
                                title: "Applied Jobs",
                                to: "/candidate/applied-jobs",
                            },
                            { title: "Settings", to: "/candidate/settings" },
                        ],
                    },
                ];
            } else if (user.role === "recruiter") {
                return [
                    {
                        title: "About Us",
                        items: [{ title: "About Us", to: "/about-us" }],
                    },
                    {
                        title: "For Recruiters",
                        items: [
                            {
                                title: "Find Candidates",
                                to: "/recruiter/candidates",
                            },
                            {
                                title: "Membership",
                                to: "/recruiter/membership",
                            },
                            {
                                title: "Manage Jobs",
                                to: "/recruiter/manage-jobs",
                            },
                            { title: "Settings", to: "/candidate/settings" },
                        ],
                    },
                ];
            } else return [];
        } else {
            return [
                {
                    title: "About Us",
                    items: [{ title: "About Us", to: "/about-us" }],
                },
                {
                    title: "Accounts",
                    items: [
                        { title: "Create Account", to: "/account/signup" },
                        { title: "Login", to: "/account/login" },
                        {
                            title: "Forgot Password",
                            to: "/account/forgot-password",
                        },
                    ],
                },
            ];
        }
    };

    const sections = getFooterItems();

    return (
        <Box
            component="footer"
            className="footer"
            sx={{
                py: 3,
                px: 2,
                mt: "auto",
            }}
        >
            <Container maxWidth="md">
                <Grid container>
                    <Grid item xs={12} sm={4} md={6}>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="body1" fontWeight="bold">
                                AKKA - Job Finder
                            </Typography>
                        </Stack>
                        <Copyright />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <Grid container spacing={2}>
                            {sections.map((section) => (
                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    key={"footer-item-" + section.title}
                                >
                                    <Stack>
                                        <Typography fontWeight="bold">
                                            {section.title}
                                        </Typography>
                                        {section.items.map((item) => (
                                            <Link
                                                href={item.to}
                                                key={item.title}
                                                underline="none"
                                            >
                                                <Typography>
                                                    {item.title}
                                                </Typography>
                                            </Link>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
