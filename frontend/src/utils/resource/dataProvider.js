import {
    MdDashboard,
    MdSettings,
    MdHelp,
    MdSettings as MdUserSettings,
} from 'react-icons/md';
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";

const instructorSidebarItems = [
    {
        group: "Main",
        items: [
            { name: "Dashboard", icon: MdDashboard, path: "/instructor/" },
            { name: "Courses", icon: BsFileEarmarkMusicFill, path: "/instructor/courses" },
            { name: "Quizes", icon: MdQuiz, path: "/instructor/quizes" },
        ]
    },
    {
        group: "Other",
        items: [
            { name: "Settings", icon: MdSettings, path: "/instructor/settings" },
            { name: "Help", icon: MdHelp, path: "/instructor/help" },
        ]
    }
];



export {
    instructorSidebarItems,
}