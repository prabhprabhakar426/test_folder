import { getRole } from "./auth";

const menuByRole = {
    ADMIN: [
        { label: "Dashboard", path: "/", icon: "fas fa-chart-line" },
        { label: "Products", path: "/products", icon: "fas fa-box" },
        { label: "Users", path: "/users", icon: "fas fa-users" },
        { label: "Orders", path: "/orders", icon: "fas fa-shopping-cart" },
    ],
    MANAGER: [
        { label: "Dashboard", path: "/", icon: "fas fa-chart-line" },
        { label: "Products", path: "/products", icon: "fas fa-box" },
        { label: "Users", path: "/users", icon: "fas fa-users" },
        { label: "Orders", path: "/orders", icon: "fas fa-shopping-cart" },
    ],
    USER: [
        { label: "Dashboard", path: "/", icon: "fas fa-chart-line" },
        { label: "Products", path: "/products", icon: "fas fa-box" },
        { label: "Orders", path: "/orders", icon: "fas fa-shopping-cart" },
    ]
};

export const menuItems = () => {
    const role = getRole();
    console.log('menu ' + role)
    return menuByRole[role] || menuByRole.USER;
};


