import React from "react";
import Avatar from "@mui/material/Avatar";

/**
 * A component to render the Profile Avatar based on user's first name
 */
function ProfileAvatar(props) {
    const { fullName } = props;
    return <Avatar {...stringAvatar(fullName)} />;
}

// Get a hexademical color value from a string
function stringToColor(string) {
    let hash = 0;
    let i;

    if (string === undefined) {
        string = "Unnamed User";
    }

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    if (name === undefined) {
        name = "Unnamed User";
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 32,
            height: 32,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

export default ProfileAvatar;
