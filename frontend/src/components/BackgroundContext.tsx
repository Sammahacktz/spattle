import React, { ReactNode } from 'react';


import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function URLWatcher() {
    const location = useLocation();

    useEffect(() => {
        const terminal = document.getElementById("terminal");
        const bg = document.getElementById("dna-bg");
        if (location.pathname !== "/" && terminal) {
            terminal.style.display = "none";
            bg!.style.filter = "blur(5px)"
        } else if (terminal) {
            terminal.style.display = "block";
            bg!.style.filter = "none"
        }
    }, [location]);

    return null;
}



interface BackgroundContextProps {
    children: ReactNode;
}

const BackgroundContext: React.FC<BackgroundContextProps> = ({ children }) => {
    URLWatcher()
    return <>{children}</>;
};

export default BackgroundContext;
