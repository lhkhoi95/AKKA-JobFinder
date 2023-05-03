import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

/**
 * Component to display information about the development team
 */
function AboutUs() {
    return (
        <div className="list-container">
            <Stack spacing={2} sx={{ margin: 4 }}>
                <Typography variant="h4">About Us</Typography>
                <Typography>
                    <b>AKKA - Job Finder</b> is a Software Engineering II class
                    project developed by:
                </Typography>
                <ul>
                    <li>
                        <Typography>
                            Kenny Nguyen, Front End Developer
                        </Typography>
                    </li>
                    <li>
                        <Typography>Khoi Ly, Back End Developer</Typography>
                    </li>
                    <li>
                        <Typography>Ayaz Azhar, UI Tester</Typography>
                    </li>
                    <li>
                        <Typography>Anh Vuong, UI Tester</Typography>
                    </li>
                </ul>
            </Stack>
        </div>
    );
}
export default AboutUs;
