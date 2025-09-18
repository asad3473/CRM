import HQoverview from '../../AdminDashboard/Components/FeedBack/HQoverview'
import BranchPerformance from '../../AdminDashboard/Components/FeedBack/BranchPerformance'
import Dashboard from '../../AdminDashboard/Pages/Dashboard'
import FeedbackReports from '../../AdminDashboard/Components/FeedBack/FeedbackReports'
import Compaign from '../../AdminDashboard/Components/Marketing/Compaign'
import Template from '../../AdminDashboard/Components/Marketing/Template'
import Audience from '../../AdminDashboard/Components/Marketing/Audience'
import Services from '../../AdminDashboard/Components/Operation/Services'
import Customers from '../../AdminDashboard/Components/Operation/Customers'
import Cars from '../../AdminDashboard/Components/Operation/Cars'
import Calendar from '../../AdminDashboard/Components/Operation/Calendar'
import Settings from '../../AdminDashboard/Pages/Settings'
import AnalyticsReports from '../../AdminDashboard/Components/AnalyticsReports/AnalyticsReports'

export const HQRoutes = [
  { path: "/hqdashboard", element: < Dashboard/> },
  { path: "/feedback/hqoverview", element: <HQoverview /> },
  { path: "/feedback/performance", element: <BranchPerformance /> },
  { path: "/feedback/analytics", element: <AnalyticsReports /> },
  { path: "/feedback/report", element: <FeedbackReports /> },
  { path: "/analytics-report", element: <AnalyticsReports /> },
  { path: "/marketing/compaign", element: <Compaign /> },
  { path: "/marketing/templates", element: <Template /> },
  { path: "/marketing/audience", element: <Audience /> },
  { path: "/operations/customers", element: <Customers /> },
  { path: "/operations/services", element: <Services /> },
  { path: "/operations/cars", element: <Cars /> },
  { path: "/operations/calendar", element: <Calendar /> },
  { path: "/settings", element: <Settings /> },
];