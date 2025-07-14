
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
    <div className="flex h-screen bg-gradient-to-br from-dark-blue to-accent-blue">
            {/* Sidebar */}
            <div className="w-64">
                <AdminSidebar />
            </div>

            <div className="flex-1 overflow-auto">
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