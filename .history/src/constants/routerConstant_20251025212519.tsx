
const RouterConstant={
    Login:"/login",
    Dashboard:"/dashboard",
    Home:"/home",
    SignUp:'signup',
    Otp:"/otp",
    PasswordPage:"/passwordpage",
    MailAnalytices:"/mailAnalytices",

   //Bulk Email Routes
  BULK_EMAIL: '/bulk-email',
  SCHEDULE_EMAILS: '/schedule-emails',
  CUSTOM_EMAILS: '/custom-emails',
  EMAIL_SIGNATURES: '/email-signatures',
  PROFILE_SETTINGS: '/profile-settings',
  CAMPAIGN_DETAIL: '/campaign/:campaignId',
  CAMPAIGN_TRACKING: '/campaign/:campaignId/tracking',

}
export default RouterConstant;


export const SIDEBAR_MENU = [
  {
    id: 1,
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    id: 2,
    name: 'Mail Analytics',
    path: ROUTES.MAIL_ANALYTICS,
    icon: 'BarChart3',
  },
  {
    id: 3,
    name: 'Bulk Email',
    path: ROUTES.BULK_EMAIL,
    icon: 'Zap',
  },
  {
    id: 4,
    name: 'Schedule Emails',
    path: ROUTES.SCHEDULE_EMAILS,
    icon: 'Clock',
  },
  {
    id: 5,
    name: 'Custom Emails',
    path: ROUTES.CUSTOM_EMAILS,
    icon: 'Mail',
  },
  {
    id: 6,
    name: 'Email Signatures',
    path: ROUTES.EMAIL_SIGNATURES,
    icon: 'PenTool',
  },
  {
    id: 7,
    name: 'Profile Settings',
    path: ROUTES.PROFILE_SETTINGS,
    icon: 'Settings',
  },
];