
import AdminSidebar from '../components/AdminSidebar'
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
// import ManageOwner from './ManageOwner';
import ManageCricksal from './ManageCricksal';
import Reviews from './Reviews';
import Bookings from './Bookings';
import AllUsersForAdmin from './AllUser';

const AdminHome = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 min-h-screen p-6">
            {/* Sidebar */}
            <div className="w-64">
                <AdminSidebar />
            </div>
            <div className="flex-1 overflow-auto">
                {/* <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">Admin Dashboard</h1> */}
                <Routes>
                    <Route path="/" element={<AdminDashboard/>} />
                    <Route path="/arenas" element={<ManageCricksal />} />
                    <Route path="/users" element={<AllUsersForAdmin/>} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/reviews" element={<Reviews />} />
                </Routes>
            </div>
        </div>
  )
}
export default AdminHome