import React from "react";
import Skeleton from "@mui/material/Skeleton";

/**
 * A component serves as a placeholder for loading animation
 */
function SkeletonLabel(props) {
    const { text, width, animation } = props;
    return (
        <>
            {text ? (
                text
            ) : (
                <Skeleton
                    variant="text"
                    width={width ? width : 100}
                    animation={animation}
                />
            )}
        </>
    );
}

export default SkeletonLabel;
