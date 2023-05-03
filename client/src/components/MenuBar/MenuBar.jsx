import React, { useState, useContext, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import appLogo from "../../assets/app-logo.svg";
import AuthProvider, { UserContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import LocalPlayOutlinedIcon from "@mui/icons-material/LocalPlayOutlined";
import ProfileAvatar from "../Utils/ProfileAvatar";

// Component to render the Menu Bar
function MenuBar(props) {
    const { user, signOut } = useContext(UserContext);

    const { window, showOptions } = props;

    const [mobileOpen, setMobileOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleAccountClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    let navigate = useNavigate();

    const linkItems = user
        ? user.role === "recruiter"
            ? [
                  {
                      title: "Find Candidates",
                      url: "/recruiter/candidates",
                      icon: <PersonSearchOutlinedIcon />,
                  },
                  {
                      title: "Post Jobs",
                      url: "/recruiter/post-jobs",
                      icon: <CasesOutlinedIcon />,
                  },
                  {
                      title: "Manage Jobs",
                      url: "/recruiter/manage-jobs",
                      icon: <BallotOutlinedIcon />,
                  },
                  {
                      title: "Manage Memberships",
                      url: "/recruiter/membership",
                      icon: <LocalPlayOutlinedIcon />,
                  },
              ]
            : [
                  {
                      title: "Find Jobs",
                      url: "/job/search",
                      icon: <ManageSearchOutlinedIcon />,
                  },
                  {
                      title: "Saved Jobs",
                      url: "/job/saved",
                      icon: <BookmarksOutlinedIcon />,
                  },
                  {
                      title: "Applied Jobs",
                      url: "/candidate/applied-jobs",
                      icon: <SaveAltOutlinedIcon />,
                  },
              ]
        : [
              { title: "Login", url: "/account/login", primary: false },
              {
                  title: "Create Account",
                  url: "/account/signup",
                  primary: true,
              },
          ];

    const profileMenuItems = user
        ? [
              {
                  title: "Profile",
                  url: "/" + user.role + "/profile",
                  icon: <AccountCircleOutlinedIcon />,
              },
              {
                  title: "Settings",
                  url: "/" + user.role + "/settings",
                  icon: <SettingsOutlinedIcon />,
              },
          ]
        : [];

    useEffect(() => {}, []);

    useEffect(() => {}, [user]);

    return (
        <>
            <AppBar
                component="nav"
                color="inherit"
                elevation={0}
                position="sticky"
                className="menu-bar"
            >
                <Toolbar>
                    <a href="/">
                        <img src={appLogo} height={40} />
                    </a>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        Job Finder
                    </Typography>

                    {showOptions && (
                        <>
                            <Box
                                sx={{
                                    display: {
                                        xs: "none",
                                        sm: "none",
                                        md: "block",
                                    },
                                }}
                            >
                                {linkItems.map((item, idx) => (
                                    <Button
                                        key={idx}
                                        color={
                                            item.primary ? "primary" : "inherit"
                                        }
                                        href={item.url}
                                        variant={
                                            item.primary ? "contained" : "text"
                                        }
                                        disableElevation
                                    >
                                        {item.title}
                                    </Button>
                                ))}
                            </Box>
                            <Box>
                                {user && (
                                    <IconButton
                                        onClick={handleAccountClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                    >
                                        {user.role === "candidate" &&
                                            user.fullName &&
                                            user.fullName.length > 0 && (
                                                <ProfileAvatar
                                                    fullName={user.fullName}
                                                />
                                            )}
                                        {user.role === "candidate" &&
                                            !user.fullName && (
                                                <AccountCircleRoundedIcon />
                                            )}
                                        {user.role === "recruiter" &&
                                            (user.companyLogoUrl.length > 0 ? (
                                                <Avatar
                                                    src={user.companyLogoUrl}
                                                />
                                            ) : (
                                                <AccountCircleRoundedIcon />
                                            ))}
                                    </IconButton>
                                )}
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleAccountClose}
                onClick={handleAccountClose}
                sx={{ backdropFilter: "blur(5px)" }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            zIndex: 0,
                        },
                        minWidth: "200px",
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {profileMenuItems.map((item) => (
                    <MenuItem
                        key={item.title}
                        onClick={() => {
                            navigate(item.url);
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        {item.title}
                    </MenuItem>
                ))}
                {linkItems.map((item) => (
                    <MenuItem
                        key={item.title}
                        onClick={() => {
                            navigate(item.url);
                        }}
                    >
                        <ListItemIcon>{item.icon && item.icon}</ListItemIcon>
                        {item.title}
                    </MenuItem>
                ))}

                <MenuItem onClick={signOut}>
                    <ListItemIcon>
                        <LogoutOutlinedIcon />
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </>
    );
}

export default MenuBar;
