import React, { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import { useTranslation } from "react-i18next";
import { FaUsers, FaClock, FaMoneyBillWave, FaCalendarAlt, FaChartPie, FaArrowUp, FaUserTie, FaCogs, FaChartBar, FaKey, FaCog } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import "./home.css";

const Home = () => {
  const { t, i18n } = useTranslation("global");
  const { setTitle } = useTitle();
  
  useEffect(() => {
    setTitle("لوحة التحكم");
  }, [setTitle]);
  
  // بيانات الإحصائيات
  const statsData = [
    {
      icon: <FaUsers />,
      number: "150",
      title: "إجمالي الموظفين",
      change: "أكثر بـ 8 موظفين عن الشهر السابق",
      color: "#AC2000",
      bgColor: "#D1FAE5"
    },
    {
      icon: <FaClock />,
      number: "95%",
      title: "معدل الحضور",
      change: "أكثر بنسبة 2.1% عن الشهر السابق",
      color: "#8B5CF6",
      bgColor: "#EDE9FE"
    },
    {
      icon: <FaMoneyBillWave />,
      number: "45",
      title: "طلبات المرتبات",
      change: "أكثر بـ 3 طلبات عن الشهر السابق",
      color: "#3B82F6",
      bgColor: "#DBEAFE"
    },
    {
      icon: <FaCalendarAlt />,
      number: "12",
      title: "طلبات الإجازات",
      change: "أقل بـ 2 طلب عن الشهر السابق",
      color: "#F59E0B",
      bgColor: "#FEF3C7"
    }
  ];

  // بيانات الحضور
  const attendanceData = {
    total: 150,
    present: 142,
    absent: 8,
    late: 12
  };

  // بيانات الـ chart للحضور
  const chartData = [
    { name: 'حاضر', value: 142, color: '#F6630d' },
    { name: 'متأخر', value: 12, color: '#B3B3B3' },
    { name: 'غائب', value: 8, color: '#F5F5DC' }
  ];

  // بيانات الموظفين
  const employeesData = [
    { id: 1, name: "أحمد محمد علي", department: "الموارد البشرية", position: "مدير", status: "نشط", phone: "+201 0101010" },
    { id: 2, name: "فاطمة أحمد حسن", department: "المحاسبة", position: "محاسب", status: "نشط", phone: "+201 0101011" },
    { id: 3, name: "محمد سعد إبراهيم", department: "التقنية", position: "مطور", status: "إجازة", phone: "+201 0101012" },
    { id: 4, name: "نور الدين محمود", department: "المبيعات", position: "مندوب مبيعات", status: "نشط", phone: "+201 0101013" }
  ];

  // بيانات طلبات الإجازات
  const vacationRequestsData = [
    { id: 1, name: "أحمد محمد علي", department: "الموارد البشرية", type: "إجازة سنوية", startDate: "15/02/2025", endDate: "20/02/2025", status: "موافق عليها" },
    { id: 2, name: "فاطمة أحمد حسن", department: "المحاسبة", type: "إجازة مرضية", startDate: "10/02/2025", endDate: "12/02/2025", status: "قيد المراجعة" },
    { id: 3, name: "محمد سعد إبراهيم", department: "التقنية", type: "إجازة طوارئ", startDate: "08/02/2025", endDate: "08/02/2025", status: "موافق عليها" },
    { id: 4, name: "نور الدين محمود", department: "المبيعات", type: "إجازة سنوية", startDate: "25/02/2025", endDate: "28/02/2025", status: "مرفوضة" },
    { id: 5, name: "سارة محمود أحمد", department: "التسويق", type: "إجازة أمومة", startDate: "01/03/2025", endDate: "30/04/2025", status: "موافق عليها" },
    { id: 6, name: "خالد عبد الرحمن", department: "العمليات", type: "إجازة سنوية", startDate: "18/02/2025", endDate: "22/02/2025", status: "قيد المراجعة" }
  ];
  
  return (
      <div className="main_content">
      <div className="dashboard-container">
        {/* إحصائيات رئيسية - 4 كروت في صف واحد */}
        <div className="row mb-4">
          {statsData.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                  {stat.icon}
                </div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-title">{stat.title}</p>
                <div className="stat-change">
                  <FaArrowUp className="arrow-up" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* جدول طلبات الإجازات - كامل العرض */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-container">
              <h3 className="table-title">طلبات الإجازات</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم الموظف</th>
                      <th>القسم</th>
                      <th>نوع الإجازة</th>
                      <th>تاريخ البداية</th>
                      <th>تاريخ النهاية</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacationRequestsData.map((request) => (
                      <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>{request.name}</td>
                        <td>{request.department}</td>
                        <td>{request.type}</td>
                        <td>{request.startDate}</td>
                        <td>{request.endDate}</td>
                        <td>
                          <span className={`status-badge ${
                            request.status === 'موافق عليها' ? 'approved' :
                            request.status === 'قيد المراجعة' ? 'pending' : 'rejected'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* جدول الموظفين + الرسم البياني - في صف واحد */}
        <div className="row">
          {/* جدول الموظفين */}
          <div className="col-lg-6 mb-3">
            <div className="table-container">
              <h3 className="table-title">قائمة الموظفين</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم الموظف</th>
                      <th>القسم</th>
                      <th>المنصب</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesData.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id.toString().padStart(2, '0')}</td>
                        <td>{employee.name}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>
                          <span className={`status-badge ${
                            employee.status === 'نشط' ? 'active' : 'inactive'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* الرسم البياني للحضور */}
          <div className="col-lg-6 mb-3">
            <div className="reservations-section">
              <div className="reservations-chart">
                <div className="chart-container">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart width={200} height={200}>
                      <Pie
                        data={chartData}
                        cx={100}
                        cy={100}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                        labelFormatter={(label) => `${label}:`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="reservations-details">
                <h3 className="reservations-title">{attendanceData.total} إجمالي الموظفين</h3>
                <div className="reservation-items">
                  <div className="reservation-item">
                    <div className="reservation-bar approved"></div>
                    <span>{attendanceData.present} حاضر</span>
                  </div>
                  <div className="reservation-item">
                    <div className="reservation-bar pending"></div>
                    <span>{attendanceData.late} متأخر</span>
                  </div>
                  <div className="reservation-item">
                    <div className="reservation-bar rejected"></div>
                    <span>{attendanceData.absent} غائب</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
};

export default Home;
