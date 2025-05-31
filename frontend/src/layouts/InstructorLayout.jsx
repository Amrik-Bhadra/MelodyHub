import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { instructorSidebarItems as sidebarItems } from "../utils/resource/dataProvider";
import {
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdClose,
  MdSearch,
  MdNotifications,
  MdExpandMore,
  MdLogout,
  MdAccountCircle,
  MdSettings as MdUserSettings,
} from "react-icons/md";
import { FaStore } from "react-icons/fa";
import useAxios from "../utils/validator/useAxios";
import toast from "react-hot-toast";
import logo from "../assets/logo.png"

const InstructorLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  // Mock user data (replace with actual user data)
  const user = {
    name: auth.user.name,
    email: auth.user.email,
    role: auth.user.role,
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/login");
      } else {
        toast.error("Failed to Logout!");
        return;
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const [notifications] = useState([
    { id: 1, text: "New order received", time: "5m ago" },
    { id: 2, text: "Product stock low", time: "1h ago" },
  ]);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LogoSection = ({ collapsed, isMobile }) => (
    <Link
      to="/seller/"
      className={`
        h-16 flex items-center gap-3 px-4 border-b border-gray-200
        hover:bg-gray-50 transition-colors duration-200
        ${collapsed && !isMobile ? "justify-center" : ""}
      `}
    >
      <img src={logo} alt="logo" className="h-10 text-sky shrink-0" />
      {(!collapsed || isMobile) && (
        <span className="font-bold text-xl text-gray-800">MelodyHub</span>
      )}
    </Link>
  );

  const NavItem = ({ item, isMobile }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={`
          relative flex items-center gap-3 px-3 py-3 rounded-lg
          transition-all duration-200 group
          ${!isMobile && isCollapsed ? "justify-center" : ""}
          ${
            isActive
              ? "bg-gradient-to-r from-sky to-sky text-white shadow-md"
              : "hover:bg-indigo-50 text-gray-700"
          }
        `}
        title={!isMobile && isCollapsed ? item.name : ""}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Icon
          className={`
            shrink-0
            ${!isMobile && isCollapsed ? "w-6 h-6" : "w-5 h-5"}
            ${isActive ? "text-white" : "text-gray-500 group-hover:text-sky"}
            transition-colors duration-200
          `}
        />

        {(!isCollapsed || isMobile) && (
          <span
            className={`
            text-sm font-medium
            ${isActive ? "text-white" : "text-gray-700 group-hover:text-sky"}
            transition-colors duration-200
          `}
          >
            {item.name}
          </span>
        )}

        {!isMobile && isCollapsed && isActive && (
          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"></div>
        )}
      </Link>
    );
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts[0][0]?.toUpperCase() + (parts[1]?.[0]?.toUpperCase() || "");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const currentItem = sidebarItems
      .flatMap((group) => group.items)
      .find((item) => item.path === path);
    return currentItem ? currentItem.name : "Dashboard";
  };

  const SearchBar = () => (
    <div
      className={`
      flex items-center
      ${isSearchExpanded ? "w-64" : "w-10"}
      transition-all duration-300
    `}
    >
      <div className="relative flex items-center w-full">
        <button
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          className="p-2 rounded-lg hover:bg-gray-100 absolute left-0"
        >
          <MdSearch className="w-6 h-6 text-gray-500" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className={`
            pl-10 pr-4 py-2 rounded-lg bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            ${isSearchExpanded ? "w-full opacity-100" : "w-0 opacity-0"}
            transition-all duration-300
          `}
        />
      </div>
    </div>
  );

  const NotificationDropdown = () => (
    <div className="relative">
      <button
        className="p-2 rounded-lg hover:bg-gray-100 relative"
        onClick={() => setIsProfileDropdownOpen(false)}
      >
        <MdNotifications className="w-6 h-6 text-gray-500" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
    </div>
  );

  const ProfileDropdown = () => (
    <div className="relative profile-dropdown">
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-sky text-white flex items-center justify-center font-medium">
          {getInitials(user?.name || "")}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <MdExpandMore
          className={`
          w-5 h-5 text-gray-500 transition-transform duration-200
          ${isProfileDropdownOpen ? "rotate-180" : ""}
        `}
        />
      </button>

      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/seller/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              <MdAccountCircle className="w-5 h-5" />
              Profile
            </Link>
            <Link
              to="/seller/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              <MdUserSettings className="w-5 h-5" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-200 py-1">
            <button
              onClick={() => {
                // Add logout logic here
                handleLogout();
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <MdLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside
        className={`
          hidden lg:flex bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out flex-col
          ${isCollapsed ? "w-[80px]" : "w-[250px]"}
        `}
      >
        <LogoSection collapsed={isCollapsed} />

        <div className="flex-1 p-3 flex flex-col gap-6 overflow-y-auto">
          {sidebarItems.map((group, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 mb-3 px-3 uppercase tracking-wider">
                  {group.group}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item, itemIdx) => (
                  <NavItem key={itemIdx} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`
          p-4 border-t border-gray-200 mt-auto
          ${isCollapsed ? "text-center" : ""}
        `}
        >
          {!isCollapsed ? (
            <>
              <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                <Link to="/terms" className="hover:text-sky transition-colors">
                  Terms & Conditions
                </Link>
                <Link
                  to="/privacy"
                  className="hover:text-sky transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
              <p className="text-xs text-gray-400">© 2025 MelodyHub</p>
            </>
          ) : (
            <div className="text-center">
              <span className="text-xs text-gray-400">©</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200">
              <LogoSection isMobile={true} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <MdClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-3">
              {sidebarItems.map((group, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 mb-3 px-3 uppercase tracking-wider">
                    {group.group}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item, itemIdx) => (
                      <NavItem key={itemIdx} item={item} isMobile={true} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MdMenu className="w-6 h-6 text-gray-500" />
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <MdChevronRight className="w-6 h-6 text-gray-500" />
              ) : (
                <MdChevronLeft className="w-6 h-6 text-gray-500" />
              )}
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <SearchBar />
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-6 py-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default InstructorLayout
