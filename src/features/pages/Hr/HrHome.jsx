import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserTie, FaEye, FaEdit, FaTrash, FaHardHat, FaUserCog } from 'react-icons/fa';

const HrDashboard = () => {
  // بيانات الموظفين
  const employees = [
    {
      id: 1,
      name: 'أبوبكر إسماعيل',
      role: 'مهندس',
      location: 'كمبوند 56',
      image: '/user.webp'
    },
    {
      id: 2,
      name: 'أبوبكر إسماعيل',
      role: 'مهندس',
      location: 'كمبوند 56',
      image: '/user.webp'
    },
    {
      id: 3,
      name: 'أبوبكر إسماعيل',
      role: 'مهندس',
      location: 'كمبوند 56',
      image: '/user.webp'
    },
    {
      id: 4,
      name: 'أبوبكر إسماعيل',
      role: 'مهندس',
      location: 'كمبوند 56',
      image: '/user.webp'
    }
  ];

  const newEmployees = [
    {
      id: 1,
      name: 'احمد يونس محمد',
      code: '1155611',
      job: 'مهندس',
      location: 'كمبوند B12',
      status: 'متاح',
      image: '/user.webp'
    },
    {
      id: 2,
      name: 'احمد يونس محمد',
      code: '1155611',
      job: 'مهندس',
      location: 'كمبوند B12',
      status: 'متاح',
      image: '/user.webp'
    },
    {
      id: 3,
      name: 'احمد يونس محمد',
      code: '1155611',
      job: 'مهندس',
      location: 'كمبوند B12',
      status: 'متاح',
      image: '/user.webp'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ 
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white'
      }}>
      {/* الإحصائيات الرئيسية */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          marginBottom: '30px',
          width: '100%'
        }}>
        {/* إجمالي عدد العمال */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: '#202938',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer'
          }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ff6b35',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            <FaHardHat />
          </div>
          <div>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#AC2000',
              marginBottom: '5px',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              1000
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'white',
              fontWeight: '500',
              fontFamily: 'Montserrat-Arabic, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              إجمالي عدد العمال
            </div>
          </div>
        </motion.div>

        {/* إجمالي عدد المهندسين */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: '#202938',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer'
          }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#AC2000',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            <FaUserCog />
          </div>
          <div>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#AC2000',
              marginBottom: '5px',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              100
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'white',
              fontWeight: '500',
              fontFamily: 'Montserrat-Arabic, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              إجمالي عدد المهندسين
            </div>
          </div>
        </motion.div>

        {/* إجمالي عدد الموظفين */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: '#202938',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer'
          }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#007bff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            <FaUsers />
          </div>
          <div>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#AC2000',
              marginBottom: '5px',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              1100
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'white',
              fontWeight: '500',
              fontFamily: 'Montserrat-Arabic, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              إجمالي عدد الموظفين
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* المحتوى الرئيسي */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px',
          marginBottom: '30px',
          width: '100%'
        }}>
        {/* قائمة الموظفين */}
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #AC2000',
            backgroundColor: '#202938'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              قائمة الموظفين
            </h3>
          </div>

          <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '1px solid #333',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    #
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '1px solid #333',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    اسم الموظف
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '1px solid #333',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    دور الموظف
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '1px solid #333',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    الموقع
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.id} style={{ 
                    borderBottom: '1px solid #333'
                  }}>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'Montserrat-Arabic, sans-serif'
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: 'white',
                      fontWeight: '500',
                      fontFamily: 'Montserrat-Arabic, sans-serif'
                    }}>
                      {employee.name}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: 'white',
                      fontFamily: 'Montserrat-Arabic, sans-serif'
                    }}>
                      {employee.role}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: 'white',
                      fontFamily: 'Montserrat-Arabic, sans-serif'
                    }}>
                      {employee.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* تحليل الغيابات */}
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #AC2000',
            backgroundColor: '#202938'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#white',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              الغيابات
            </h3>
          </div>

          <div style={{ padding: '30px', textAlign: 'center' }}>
            {/* الرسم البياني الدائري */}
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'conic-gradient(#AC2000 0deg 270deg, #ff6b35 270deg 324deg, #dc3545 324deg 360deg)',
              margin: '0 auto 25px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#202938',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'Montserrat-Arabic, sans-serif'
              }}>
                60%
              </div>
            </div>

            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '25px',
              fontFamily: 'Montserrat-Arabic, sans-serif'
            }}>
              351 إجمالي الحضور
            </div>

            {/* تفاصيل الحضور */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                justifyContent: 'space-between'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: '#AC2000',
                  borderRadius: '3px',
                  marginLeft: '10px'
                }}></div>
                <span style={{ 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>270 حضور</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                justifyContent: 'space-between'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: '#ff6b35',
                  borderRadius: '3px',
                  marginLeft: '10px'
                }}></div>
                <span style={{ 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>60 استأذان</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                justifyContent: 'space-between'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: '#dc3545',
                  borderRadius: '3px',
                  marginLeft: '10px'
                }}></div>
                <span style={{ 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>21 غياب</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* الموظفين الجدد */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden',
          width: '100%'
        }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #AC2000',
          backgroundColor: '#202938'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            الموظفين الجداد
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1f2e' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  الصورة
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  اسم الموظف
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  كود الموظف
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  الوظيفة
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  اسم الموقع
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  حالة العمل
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  fontFamily: 'Montserrat-Arabic, sans-serif'
                }}>
                  الإجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {newEmployees.map((employee, index) => (
                <tr key={employee.id} style={{ 
                  borderBottom: '1px solid #333'
                }}>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <img 
                      src={employee.image} 
                      alt={employee.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    color: 'white',
                    fontWeight: '500',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    {employee.name}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    color: 'white',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    {employee.code}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    color: 'white',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    {employee.job}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    color: 'white',
                    fontFamily: 'Montserrat-Arabic, sans-serif'
                  }}>
                    {employee.location}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: '#AC2000',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat-Arabic, sans-serif'
                    }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                      <button
                        style={{
                          backgroundColor: '#AC2000',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="عرض"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* الترقيم */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          borderTop: '1px solid #333'
        }}>
          <button style={{
            backgroundColor: '#AC2000',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            1
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            2
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            3
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            4
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            5
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Montserrat-Arabic, sans-serif'
          }}>
            &gt;&gt;
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HrDashboard;
