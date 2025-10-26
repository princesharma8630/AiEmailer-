import { Route, Routes } from "react-router-dom";
import RouterConstant from "../constants/routerConstant";
import PublicRouter from "./publicRouter";
import PrivateRouter from "./privateRouter";
import AuthLayout from "../layouts/authLayout/authlayout";
import MainLayout from "../layouts/mainlayout/mainlayout";
import OTPPage from "../pages/signup/otppage";
import LoginPage from "../pages/login/login";
import SignupPage from "../pages/signup/signup";
import Dashboard from "../pages/dashboard/dashboard";
import MailAnalytics from "../pages/mailAnalytics/mailAnalytics";
import HomePage from "../pages/home/home";



function MainRouter() {
   return (  
      <Routes>
         {/* Public Routes with AuthLayout */}
         <Route element={<PublicRouter/>}>
            <Route element={<AuthLayout/>}>
               <Route path="/" element={<HomePage/>}/>
               <Route path={RouterConstant.Home} element={<HomePage/>} />
               <Route path={RouterConstant.Login} element={<LoginPage/>} />
               <Route path={RouterConstant.SignUp} element={<SignupPage/>} />
               <Route path={RouterConstant.Otp} element={<OTPPage/>}/>
               <Route path={RouterConstant.Login} element={<LoginPage/>}/>
            </Route>
         </Route>

         {/* Private Routes with MainLayout */}
         <Route element={<PrivateRouter/>}>
            <Route element={<MainLayout/>}>
               <Route path={RouterConstant.Dashboard} element={<Dashboard/>} />
               <Route path={RouterConstant.MailAnalytices} element={<MailAnalytics/>} />
               <Route path={ROuter} element={<h1 className="p-6">Bulk Email Content</h1>} />
               <Route path="/schedule-emails" element={<h1 className="p-6">Schedule Emails Content</h1>} />
               <Route path="/custom-emails" element={<h1 className="p-6">Custom Emails Content</h1>} />
               <Route path="/email-signatures" element={<h1 className="p-6">Email Signatures Content</h1>} />
               <Route path="/profile-settings" element={<h1 className="p-6">Profile Settings Content</h1>} />
            </Route>
         </Route>
      </Routes>
   )
}

export default MainRouter;