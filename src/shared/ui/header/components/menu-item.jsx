import { NavLink } from "react-router-dom";

export const MenuItem = ({ item }) => (
    <li>
        <NavLink
            to={item.to}
            className={({ isActive }) => `${isActive ? 'menuActive' : 'link'} ${item.className}`}
        >
            <img src={item.icon} alt={`${item.label}Icon`} />
            {item.label}
        </NavLink>
    </li>
);