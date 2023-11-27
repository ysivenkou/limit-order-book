import './Layout.css'
import { useState } from 'react';
import {Outlet} from "react-router-dom";
import ClickAwayListener from "react-click-away-listener";
import Sidebar from "./Sidebar";
import { jwtDecode }  from 'jwt-decode'

const Layout = () => {
    const token = localStorage.getItem('accessToken')

    const [showPopupMenu, setShowPopupMenu] = useState(false)

    const handleOnClick = () => {
        setShowPopupMenu(true)
        console.log("Click")
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = "/login"
    }

    return (
        <div className="layout">
            <header>
                <ClickAwayListener onClickAway={() => setShowPopupMenu(false)}>
                    <ul className="popupMenu">
                        <li class="popupMenuItem" key="username" onClick={() => setShowPopupMenu(!showPopupMenu)} style={{
                            backgroundColor: showPopupMenu ? '#f3f3f3' : '#207ae7',
                            color: showPopupMenu ? 'black' : 'white',
                        }}>{token && jwtDecode(token).username}</li>
                        {showPopupMenu && <li class="popupMenuItem" key="logout" onClick={handleLogout} style={{ color: 'red' }}>Logout</li>}
                    </ul>
                </ClickAwayListener>
            </header>
            <div className="layoutContent">
                <Sidebar />
                <div className="componentContainer">
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

export default Layout;