
import OwnerSidebar from '../components/OwnerSidebar'
import OwnerDashboard from '../components/OwnerDashboard'
import { BrowserRouter as  Routes, Route} from 'react-router-dom';
import OwnerCricksal from './OwnerCricksal';
import AllBooking from './AllBooking';
import ArenaReview from './ArenaReview';
import OwnerProfile from './OwnerProfile';

const OwnerHome = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-blue to-accent-blue">
            {/* Sidebar */}
            <div className="w-64">
                <OwnerSidebar />
            </div>

            <div className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<OwnerDashboard />} />
                    <Route path="/cricksal" element={< OwnerCricksal/>} />
                    <Route path="/bookings" element={< AllBooking/>} />
                    <Route path="/reviews" element={< ArenaReview/>} />
                    {/* <Route path="/payments" element={< PaymentArena/>} /> */}
                    <Route path="/profile" element={< OwnerProfile/>} />

                </Routes>
            </div>
        </div>
  )
}

export default OwnerHome