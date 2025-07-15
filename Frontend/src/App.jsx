import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setUser } from './features/user/userSlice';
import ScrollToTop from './client/components/ScrollToTop';
import Header from './client/components/Header';
import Home from './client/Pages/Home';
import Mybooking from './client/Pages/MyBooking';
// import BecomeOwner from './client/Pages/BecomeOwner';
import About from './client/Pages/About';
// import SignIn from './client/components/SignIn';
import AdminHome from './admin/pages/AdminHome';
import OwnerHome from './owner/pages/OwnerHome';
import CricksalDetail from './client/Pages/CricksalDetail';
import BookArena from './client/Pages/BookArena';
import FindCricksalCourts from './client/Pages/FindCricksalCourts';
import PaymentSuccess from './client/Pages/PaymentSuccess';
import UserProfile from './client/Pages/UserProfile';
import Login from './client/components/Login';
import Signup from './client/components/Signup';


const App = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token);
        dispatch(setUser(userData)); 
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);  // Set loading to false once the check is complete
  }, [dispatch]);

  // console.log("User Role:", user?.role);

  // Show loading state until data is fetched
  if (loading) return <div>Loading...</div>;
  

  return (
    <>
      <ScrollToTop />
      {user?.role === 'admin' ? (
        <Routes>
          <Route path="/admin/*" element={<AdminHome />} />
          <Route path="*" element={<Navigate to="/admin" />} />
          
        </Routes>
      ) : user?.role === 'owner' ? (
        <Routes>
          <Route path="/owner/*" element={<OwnerHome />} />
          <Route path="*" element={<Navigate to="/owner" />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/findcricksalcourts" element={<FindCricksalCourts />} />
            <Route path="/booking/success/" element={<PaymentSuccess/>} />
            <Route path="/UserProfile" element={<UserProfile/>} />
            <Route path="/mybooking" element={<Mybooking />} />
            {/* <Route path="/becomeowner" element={<BecomeOwner />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/sign-in" element={<SignIn />} /> */}
            <Route path="/cricksal/:id" element={<CricksalDetail />} />
            <Route path="/book/:id" element={<BookArena />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;




