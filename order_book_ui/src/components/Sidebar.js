import './Sidebar.css'
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="Sidebar">
            <Link className="sidebarItem" to="/">Limit Order Book</Link>
            <Link className="sidebarItem" to="/orders">My Orders</Link>
            <Link className="sidebarItem" to="/transactions">Transactions History</Link>
        </div>
    )
}

export default Sidebar;