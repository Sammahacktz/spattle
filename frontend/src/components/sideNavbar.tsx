import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Drawer, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";


export const SideNavbar = ({
    children,
}: {
    children?: React.ReactNode;
}): React.ReactElement => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 1900) {
            setOpen(false);
        }
    }, []);

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            className={`side-navbar ${open ? "open" : ""}`}
            data-testid="side-navbar-drawer"
        >
            <Box
                className={`side-navbar-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
                data-testid={"drawer-trigger"}
            >
                <Box display="flex" alignItems="center">
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close sidebar" : "Open sidebar"}
                        data-testid="mui-drawer-trigger"
                    >
                        <ChevronRightIcon
                            style={{
                                transform: open ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s",
                            }}
                        />
                    </IconButton>
                </Box>
            </Box>
            <Box className="side-navbar-content">{children}</Box>
        </Drawer>
    );
};
