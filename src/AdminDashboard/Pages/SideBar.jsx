import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineDashboard,MdOutlineSettings  } from "react-icons/md";
import { FaUsers, FaCarSide } from "react-icons/fa";
import { TiBook } from "react-icons/ti";
import { VscFeedback } from "react-icons/vsc";
import { BiSolidReport } from "react-icons/bi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
export default function SideBar() {
  const array = [
    { title: 'Dashboard', link: '/', icon: <MdOutlineDashboard /> },
    { title: 'Customers', link: 'AdminDashboard/customers', icon: <FaUsers /> },
    { title: 'Vehicles', link: 'AdminDashboard/vehicles', icon: <FaCarSide /> },
    { title: 'Bookings/Services', link: 'AdminDashboard/booking', icon: <TiBook /> },
    { title: 'Invoices', link: 'AdminDashboard/invoices', icon: <LiaFileInvoiceDollarSolid /> },
    { title: 'Feedback', link: 'AdminDashboard/feedback', icon: <VscFeedback /> },
    { title: 'Reports', link: 'AdminDashboard/report', icon: <BiSolidReport /> },

  ]
  return (
    <div className=' min-h-screen text-white bg-[#0B1F2D] sm:w-2/12'>
      <h1 className=' font-semibold text-md sm:text-xl px-2 py-4'>Admin Dashboard</h1>

      <div className='py-3'>
        {
          array.map((val, ind) => (
            <div key={ind} className='py-2 px-4'>
              <Link to={val.link} className=' hover:bg-white hover:text-black py-2  px-4 flex gap-2 items-center'><span>{val.icon}</span><span>{val.title}</span></Link>
            </div>
          ))
        }
        <div className=' absolute bottom-3 px-2'>
          <Link to='/settings'><span className=' flex items-center gap-2'><MdOutlineSettings />Settings</span></Link>
        </div>
      </div>
    </div>
  )
}
