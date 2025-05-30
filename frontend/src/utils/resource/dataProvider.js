import {
    MdDashboard,
    MdGroups,
    MdSettings,
    MdHelp,
    MdBusinessCenter,
    MdSettings as MdUserSettings,
} from 'react-icons/md';
import { FaUser } from 'react-icons/fa6';
import { IoDocumentText, IoDocuments } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa6";

const adminSidebarItems = [
    {
        group: "Main",
        items: [
            { name: "Dashboard", icon: MdDashboard, path: "/admin/" },
            { name: "Employees", icon: MdGroups, path: "/admin/employees" },
            { name: "Projects", icon: MdBusinessCenter, path: "/admin/projects" },
            // { name: "Attendance", icon: FaUserCheck, path: "/admin/attendance" },
            { name: "PaySlips", icon: IoDocuments, path: "/admin/payslips" },
            { name: "Reports", icon: IoDocumentText, path: "/admin/report" },
        ]
    },
    {
        group: "Other",
        items: [
            { name: "Settings", icon: MdSettings, path: "/admin/settings" },
            { name: "Help", icon: MdHelp, path: "/admin/help" },
        ]
    }
];

const employeeSidebarItems = [
    {
        group: "Main",
        items: [
            { name: "Dashboard", icon: MdDashboard, path: "/employee/" },
            { name: "Attendance", icon: FaUserCheck, path: "/employee/attendance" },
            { name: "Projects", icon: MdBusinessCenter, path: "/employee/projects" },
            { name: "PaySlips", icon: IoDocuments, path: "/employee/payslips" },
            { name: "Profile", icon: FaUser, path: "/employee/profile" },
        ]
    },
    {
        group: "Other",
        items: [
            { name: "Settings", icon: MdSettings, path: "/employee/settings" },
            { name: "Help", icon: MdHelp, path: "/employee/help" },
        ]
    }
];


export {
    adminSidebarItems,
    employeeSidebarItems
}