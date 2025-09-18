import BranchManager from "./AccessScope";
import CarsPro from "./BranchCars";
import BranchCustomers from "./BranchCustomers"
import BranchDashboardPlus from "./BranchDashboard";
import FeedbackReviewsPro from "./BranchFeedback";
import InvoiceForm from "./BranchInvoice";
import ServicesElite from "./BranchService";
import SecurityDashboard from "./GuardrailsSecurity";
import ReportsExportsAligned from "./Reports";
import SearchSavedViewsPro from "./SearchSavedViews";


export const BranchRoute = [
  { path: "/branchdashboard", element:<BranchDashboardPlus/> },
  { path: "/branchmanager", element:<BranchManager/> },
  { path: "/branchcustomers", element:<BranchCustomers/> },
  { path: "/branchcar", element:<CarsPro/> },
  { path: "/branchservice", element:<ServicesElite/> },
  { path: "/invoice", element:<InvoiceForm/> },
  { path: "/branchfeedback", element:<FeedbackReviewsPro/> },
  { path: "/branchreports", element:<ReportsExportsAligned/> },
  { path: "/searchsaved", element:<SearchSavedViewsPro/> },
  { path: "/security", element:<SecurityDashboard/> },

 
];