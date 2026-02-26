import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import "./styles.css";

const Layout = ({ authenticated }) => {
    return (
        <div className="layout">
            {authenticated &&
                <Header />
            }
            <main>
                <Outlet />
            </main>
            {/* <div className="spacer"></div> */}
            <Footer />
        </div>
    );
}

export default Layout;