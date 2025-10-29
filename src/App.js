import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TitleProvider } from './shared/hooks/TitleContext';
import { ToastContainer } from 'react-toastify';
import Layout from './shared/components/Layout';
import Login from './features/pages/Auth/Login';
import Register from './features/pages/Auth/Register';
import Profile from './features/pages/Profile/Profile';
import PrivateRoute from './shared/components/PrivateRoute';
import HrHome from './features/pages/Hr/HrHome';
import Employees from './features/pages/Hr/employees/Employees';
import AddEmployee from './features/pages/Hr/employees/AddEmployee';
import EditEmployee from './features/pages/Hr/employees/EditEmployee';
import EmployeeDetails from './features/pages/Hr/employees/EmployeeDetails';
import Attendance from './features/pages/Hr/attendance/Attendance';
import Salaries from './features/pages/Hr/salaries/Salaries';
import AddSalary from './features/pages/Hr/salaries/AddSalary';
import EditSalary from './features/pages/Hr/salaries/EditSalary';
import Vacations from './features/pages/Hr/vacations/Vacations';
import AddVacation from './features/pages/Hr/vacations/AddVacation';
import EditVacation from './features/pages/Hr/vacations/EditVacation';
import VacationDetails from './features/pages/Hr/vacations/VacationDetails';
import LeaveRequests from './features/pages/Hr/leave-requests/LeaveRequests';
import AddLeaveRequest from './features/pages/Hr/leave-requests/AddLeaveRequest';
import EditLeaveRequest from './features/pages/Hr/leave-requests/EditLeaveRequest';
import LeaveRequestDetails from './features/pages/Hr/leave-requests/LeaveRequestDetails';
import SalaryDetails from './features/pages/Hr/salaries/SalaryDetails';
import Payslips from './features/pages/Hr/payslips/Payslips';
import PayslipDetails from './features/pages/Hr/payslips/PayslipDetails';
import GeneratePayslip from './features/pages/Hr/payslips/GeneratePayslip';
import PayrollReport from './features/pages/Hr/reports/PayrollReport';
import AttendanceReport from './features/pages/Hr/reports/AttendanceReport';
import LeaveReport from './features/pages/Hr/reports/LeaveReport';
import Shifts from './features/pages/Hr/shifts/Shifts';
import AddShift from './features/pages/Hr/shifts/AddShift';
import EditShift from './features/pages/Hr/shifts/EditShift';
import ShiftDetails from './features/pages/Hr/shifts/ShiftDetails';
import JobTitles from './features/pages/Hr/job-titles/JobTitles';
import AddJobTitle from './features/pages/Hr/job-titles/AddJobTitle';
import EditJobTitle from './features/pages/Hr/job-titles/EditJobTitle';
import JobTitleDetails from './features/pages/Hr/job-titles/JobTitleDetails';
import Departments from './features/pages/Hr/departments/Departments';
import AddDepartment from './features/pages/Hr/departments/AddDepartment';
import EditDepartment from './features/pages/Hr/departments/EditDepartment';
import DepartmentDetails from './features/pages/Hr/departments/DepartmentDetails';
import AccountsTree from './features/pages/Accounting/AccountsTree';
// import Accounting from './features/dashboard/pages/Accounting-Departments/Accounting';
// import POS from './features/dashboard/pages/POS-Departments/POS';
// import Delivery from './features/dashboard/pages/Delivery-Departments/Delivery';
// import Warehouse from './features/dashboard/pages/Warehouse-Departments/Warehouse';
// import CallCenter from './features/dashboard/pages/CallCenter-Departments/CallCenter';
// import Reservations from './features/dashboard/pages/Reservations-Departments/Reservations';
// import Company from './features/dashboard/pages/Company/Company';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  return (
    <TitleProvider>
      <Router>
        <div className="App" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/company" element={<Company />} /> */}
          
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<HrHome />} />
              {/* HR Routes */}
              <Route path="employees" element={<Employees />} />
              <Route path="add-employee" element={<AddEmployee />} />
              <Route path="employees/view/:id" element={<EmployeeDetails />} />
              <Route path="edit-employee/:id" element={<EditEmployee />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="salaries" element={<Salaries />} />
              <Route path="add-salary" element={<AddSalary />} />
              <Route path="edit-salary/:id" element={<EditSalary />} />
              <Route path="vacations" element={<Vacations />} />
              <Route path="vacations/add" element={<AddVacation />} />
              <Route path="vacations/edit/:id" element={<EditVacation />} />
              <Route path="vacations/details/:id" element={<VacationDetails />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="leave-requests/add" element={<AddLeaveRequest />} />
            <Route path="leave-requests/edit/:id" element={<EditLeaveRequest />} />
            <Route path="leave-requests/details/:id" element={<LeaveRequestDetails />} />
            <Route path="salaries" element={<Salaries />} />
            <Route path="salaries/add" element={<AddSalary />} />
            <Route path="salaries/details/:id" element={<SalaryDetails />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="payslips/generate" element={<GeneratePayslip />} />
            <Route path="payslips/:id" element={<PayslipDetails />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="add-shift" element={<AddShift />} />
              <Route path="job-titles" element={<JobTitles />} />
              <Route path="add-job-title" element={<AddJobTitle />} />
              <Route path="job-titles/add" element={<AddJobTitle />} />
              <Route path="job-titles/edit/:id" element={<EditJobTitle />} />
              <Route path="job-titles/details/:id" element={<JobTitleDetails />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/add" element={<AddDepartment />} />
              <Route path="departments/edit/:id" element={<EditDepartment />} />
              <Route path="departments/details/:id" element={<DepartmentDetails />} />
              <Route path="reports/payroll" element={<PayrollReport />} />
              <Route path="reports/attendance" element={<AttendanceReport />} />
              <Route path="reports/leave" element={<LeaveReport />} />
              <Route path="accounts/tree" element={<AccountsTree />} />

              <Route path="shifts" element={<Shifts />} />
              <Route path="shifts/add" element={<AddShift />} />
              <Route path="shifts/edit/:id" element={<EditShift />} />
              <Route path="shifts/details/:id" element={<ShiftDetails />} />

              <Route path="profile" element={<Profile />} />
              <Route path="positions" element={<JobTitles />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </TitleProvider>
  );
}

export default App;
