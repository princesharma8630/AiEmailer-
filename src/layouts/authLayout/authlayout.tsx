
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div >
        {/* Auth Pages Content (Login, Signup, OTP, etc.) */}
        <div >
          <Outlet />
        </div> 
      </div>
   
  );
};

export default AuthLayout;