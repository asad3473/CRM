import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdOutlineSettings,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { BiSolidReport } from "react-icons/bi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GiJerusalemCross } from "react-icons/gi";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const location = useLocation();

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when route changes
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile]);

  const toggleDropdown = (title) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const array = [
    { title: 'Dashboard', link: '/', icon: <MdOutlineDashboard /> },
    {
      title: 'Operations',
      icon: <FaUsers />,
      dropdown: [
        { title: 'Customers', link: 'dashboard/operations/customers' },
        { title: 'Cars', link: 'dashboard/operations/cars' },
        { title: 'Services', link: 'dashboard/operations/services' },
        { title: 'Calendar', link: 'dashboard/operations/calendar' },
      ],
    },
    {
      title: 'Marketing',
      icon: <GiJerusalemCross />,
      dropdown: [
        { title: 'Campaign', link: 'dashboard/marketing/campaign' },
        { title: 'Templates', link: 'dashboard/marketing/templates' },
        { title: 'Audience/Tag', link: 'dashboard/marketing/audience' },
      ],
    },

    {
      title: 'Feedback', link: '/feedback', icon: <VscFeedback />,
      dropdown: [
        { title: 'HQ Overview', link: '/feedback/hqoverview' },
        { title: 'Branch Performance', link: '/feedback/performance' },
        { title: 'Service Analytics', link: '/feedback/analytics' },
        { title: 'Feedback Reports', link: '/feedback/report' },
      ],

    },
    { title: 'Analytics/Reports', link: '/analytics-report', icon: <BiSolidReport /> },
  ];

  return (
    <div className=''>
      {/* Toggle button for mobile */}
      <button
        className="fixed top-4 left-4 sm:hidden p-2 bg-[#0B1F2D] text-white rounded-md z-50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 transition-transform duration-300 ease-in-out
        bg-[#0B1F2D] text-white sm:w-64 w-64 min-h-screen fixed sm:relative z-50
        shadow-xl
      `}>
        <h1 className="font-bold text-xl px-6 py-5 border-b border-gray-700 flex items-center">
          HQ Dashboard
        </h1>

        <div className="py-3 overflow-y-auto h-[calc(100vh-80px)]">
          {array.map((val, ind) => (
            <div key={ind} className="px-3 py-1">
              {val.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(val.title)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${activeDropdown === val.title ? 'bg-blue-800 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{val.icon}</span>
                      {val.title}
                    </span>
                    <span>
                      {activeDropdown === val.title ?
                        <MdKeyboardArrowUp /> :
                        <MdKeyboardArrowDown />
                      }
                    </span>
                  </button>

                  {/* Dropdown list */}
                  {activeDropdown === val.title && (
                    <div className="ml-6 mt-1 mb-2 flex flex-col gap-1 border-l border-gray-600 pl-4 py-1">
                      {val.dropdown.map((item, i) => (
                        <Link
                          key={i}
                          to={item.link}
                          className={`py-2 px-3 rounded transition-colors duration-200
                            ${location.pathname === item.link ? 'text-blue-300 font-medium' : 'hover:text-blue-400'}`}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={val.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${location.pathname === val.link ? 'bg-blue-800 text-white' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-lg">{val.icon}</span>
                  {val.title}
                </Link>
              )}
            </div>
          ))}

          {/* Settings at bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4 bg-[#0B1F2D]">
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${location.pathname === '/settings' ? 'bg-blue-800 text-white' : 'hover:bg-gray-700'}`}
            >
              <MdOutlineSettings className="text-lg" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}