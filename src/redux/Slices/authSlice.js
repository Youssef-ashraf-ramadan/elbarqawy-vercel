import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const getToken = () => {
  const storedUser = sessionStorage.getItem("useralbaraqawy");
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    // البحث عن التوكن في أماكن مختلفة
    if (parsed.token) return parsed.token;
    if (parsed.data?.token) return parsed.data.token;
    if (parsed.result?.token) return parsed.result.token;
    if (parsed.user?.token) return parsed.user.token;
    return null;
  } catch {
    return null;
  }
};

// Helper function to get current language
const getCurrentLanguage = () => {
  return i18n.language || "ar";
};

// Async Thunk for deleting role
export const deleteRole = createAsyncThunk(
  "auth/deleteRole",
  async (roleId, thunkAPI) => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("useralbaraqawy"));

      // محاولة الحصول على التوكن من أماكن مختلفة
      let token = storedUser?.token;
      if (!token) {
        token = storedUser?.data?.token;
      }
      if (!token) {
        token = storedUser?.user?.token;
      }

      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/role/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل في حذف الصلاحية"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const currentLang = getCurrentLanguage();
      const response = await axios.post(`${BASE_URL}/auth/login`, userData, {
        headers: {
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed!";
      return rejectWithValue({ message });
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const currentLang = getCurrentLanguage();
      const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
        headers: {
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Register failed!";
      return rejectWithValue({ message });
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get profile!";
      return rejectWithValue({ message });
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to logout!";
      return rejectWithValue({ message });
    }
  }
);

// Get positions
export const getPositions = createAsyncThunk(
  "auth/getPositions",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/positions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get positions!";
      return rejectWithValue({ message });
    }
  }
);

// Add position
export const addPosition = createAsyncThunk(
  "auth/addPosition",
  async (positionData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/positions`, positionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        let errorMessage = '';
        
        // Combine all error messages
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errorMessage += errors[key].join(', ') + ' ';
          } else {
            errorMessage += errors[key] + ' ';
          }
        });
        
        return rejectWithValue({ 
          message: errorMessage.trim() || "Validation failed!",
          errors: error.response.data.errors 
        });
      }
      
      // Handle general error message
      const message = error.response?.data?.message || "Failed to add position!";
      return rejectWithValue({ message });
    }
  }
);

// Get job titles
export const getJobTitles = createAsyncThunk(
  "auth/getJobTitles",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/positions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get job titles!";
      return rejectWithValue({ message });
    }
  }
);

export const updateJobTitle = createAsyncThunk(
  "auth/updateJobTitle",
  async ({ id, jobTitleData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${BASE_URL}/positions/${id}`, jobTitleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue({ message: errorMessages.join(", ") });
      }
      const message = error.response?.data?.message || "Failed to update job title!";
      return rejectWithValue({ message });
    }
  }
);

export const deleteJobTitle = createAsyncThunk(
  "auth/deleteJobTitle",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/positions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete job title!";
      return rejectWithValue({ message });
    }
  }
);

export const getJobTitleDetails = createAsyncThunk(
  "auth/getJobTitleDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/positions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get job title details!";
      return rejectWithValue({ message });
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile!";
      return rejectWithValue({ message });
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": currentLang,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password!";
      return rejectWithValue({ message });
    }
  }
);

// Get roles
export const getRoles = createAsyncThunk(
  "auth/getRoles",
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/role?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get roles!";
      return rejectWithValue({ message });
    }
  }
);

// Get permissions
export const getPermissions = createAsyncThunk(
  "auth/getPermissions",
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/permissions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get permissions!";
      return rejectWithValue({ message });
    }
  }
);

// Create role
export const createRole = createAsyncThunk(
  "auth/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/store_role`, roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create role!";
      return rejectWithValue({ message });
    }
  }
);

// Update role
export const updateRole = createAsyncThunk(
  "auth/updateRole",
  async ({ roleId, roleData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/role/${roleId}`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": currentLang,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update role!";
      return rejectWithValue({ message });
    }
  }
);

// Departments async thunks
export const getDepartments = createAsyncThunk(
  "auth/getDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get departments!";
      return rejectWithValue(message);
    }
  }
);

export const addDepartment = createAsyncThunk(
  "auth/addDepartment",
  async (departmentData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/departments`, departmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to add department!";
      return rejectWithValue(message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "auth/updateDepartment",
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${BASE_URL}/departments/${id}`, departmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to update department!";
      return rejectWithValue(message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "auth/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete department!";
      return rejectWithValue(message);
    }
  }
);

export const getDepartmentDetails = createAsyncThunk(
  "auth/getDepartmentDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get department details!";
      return rejectWithValue(message);
    }
  }
);

// Get employees
export const getEmployees = createAsyncThunk(
  "auth/getEmployees",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const response = await axios.get(`${BASE_URL}/employees?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get employees!";
      return rejectWithValue(message);
    }
  }
);

// Get employee details
export const getEmployeeDetails = createAsyncThunk(
  "auth/getEmployeeDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get employee details!";
      return rejectWithValue(message);
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "auth/updateEmployee",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

       const response = await axios.post(`${BASE_URL}/employees/${id}`, employeeData, {
         headers: {
           Authorization: `Bearer ${token}`,
           // Don't set Content-Type for FormData - let browser set it automatically
         },
       });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to update employee!";
      return rejectWithValue(message);
    }
  }
);

// Add employee
export const addEmployee = createAsyncThunk(
  "auth/addEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - let browser set it automatically
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to add employee!";
      return rejectWithValue(message);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "auth/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete employee!";
      return rejectWithValue(message);
    }
  }
);

// Get work shifts
export const getWorkShifts = createAsyncThunk(
  "auth/getWorkShifts",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/work-shifts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get work shifts!";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for adding work shift
export const addWorkShift = createAsyncThunk(
  "auth/addWorkShift",
  async (shiftData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/work-shifts`, shiftData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add work shift!";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for updating work shift
export const updateWorkShift = createAsyncThunk(
  "auth/updateWorkShift",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${BASE_URL}/work-shifts/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update work shift!";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for deleting work shift
export const deleteWorkShift = createAsyncThunk(
  "auth/deleteWorkShift",
  async (shiftId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/work-shifts/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete work shift!";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for getting work shift details
export const getWorkShiftDetails = createAsyncThunk(
  "auth/getWorkShiftDetails",
  async (shiftId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/work-shifts/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get work shift details!";
      return rejectWithValue(message);
    }
  }
);

// Get leave types (vacations)
export const getLeaveTypes = createAsyncThunk(
  "auth/getLeaveTypes",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const response = await axios.get(`${BASE_URL}/leave-types?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get leave types!";
      return rejectWithValue(message);
    }
  }
);

// Add leave type
export const addLeaveType = createAsyncThunk(
  "auth/addLeaveType",
  async (leaveTypeData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/leave-types`, leaveTypeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to add leave type!";
      return rejectWithValue(message);
    }
  }
);

// Update leave type
export const updateLeaveType = createAsyncThunk(
  "auth/updateLeaveType",
  async ({ id, leaveTypeData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${BASE_URL}/leave-types/${id}`, leaveTypeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to update leave type!";
      return rejectWithValue(message);
    }
  }
);

// Delete leave type
export const deleteLeaveType = createAsyncThunk(
  "auth/deleteLeaveType",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/leave-types/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete leave type!";
      return rejectWithValue(message);
    }
  }
);

// Get leave type details
export const getLeaveTypeDetails = createAsyncThunk(
  "auth/getLeaveTypeDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/leave-types/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get leave type details!";
      return rejectWithValue(message);
    }
  }
);

// Get leave requests
export const getLeaveRequests = createAsyncThunk(
  "auth/getLeaveRequests",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const response = await axios.get(`${BASE_URL}/leave-requests?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get leave requests!";
      return rejectWithValue(message);
    }
  }
);

// Add leave request
export const addLeaveRequest = createAsyncThunk(
  "auth/addLeaveRequest",
  async (leaveRequestData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/leave-requests`, leaveRequestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to add leave request!";
      return rejectWithValue(message);
    }
  }
);

// Update leave request
export const updateLeaveRequest = createAsyncThunk(
  "auth/updateLeaveRequest",
  async ({ id, leaveRequestData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${BASE_URL}/leave-requests/${id}`, leaveRequestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(", "));
      }
      const message = error.response?.data?.message || "Failed to update leave request!";
      return rejectWithValue(message);
    }
  }
);

// Delete leave request
export const deleteLeaveRequest = createAsyncThunk(
  "auth/deleteLeaveRequest",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(`${BASE_URL}/leave-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete leave request!";
      return rejectWithValue(message);
    }
  }
);

// Get leave request details
export const getLeaveRequestDetails = createAsyncThunk(
  "auth/getLeaveRequestDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/leave-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get leave request details!";
      return rejectWithValue(message);
    }
  }
);

// Update leave request status
export const updateLeaveRequestStatus = createAsyncThunk(
  "auth/updateLeaveRequestStatus",
  async ({ id, status, rejection_reason }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const body = { status };
      if (status === "rejected" && rejection_reason) {
        body.rejection_reason = rejection_reason;
      }

      const response = await axios.post(`${BASE_URL}/leave-requests/${id}/status`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update leave request status!";
      return rejectWithValue(message);
    }
  }
);

// Get attendance
export const getAttendance = createAsyncThunk(
  "auth/getAttendance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const url = `${BASE_URL}/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get attendance!";
      return rejectWithValue(message);
    }
  }
);

// Check in
export const checkIn = createAsyncThunk(
  "auth/checkIn",
  async (checkInData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const dataToSend = {
        employee_id: checkInData.employee_id,
        notes: checkInData.check_in_notes || ''
      };

      const response = await axios.post(`${BASE_URL}/attendance/check-in`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to check in!";
      return rejectWithValue(message);
    }
  }
);

// Check out
export const checkOut = createAsyncThunk(
  "auth/checkOut",
  async (checkOutData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const dataToSend = {
        employee_id: checkOutData.employee_id,
        notes: checkOutData.check_out_notes || ''
      };

      const response = await axios.post(`${BASE_URL}/attendance/check-out`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to check out!";
      return rejectWithValue(message);
    }
  }
);

// Get salaries
export const getSalaries = createAsyncThunk(
  "auth/getSalaries",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const url = `${BASE_URL}/salaries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get salaries!";
      return rejectWithValue(message);
    }
  }
);

// Add salary
export const addSalary = createAsyncThunk(
  "auth/addSalary",
  async (salaryData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(`${BASE_URL}/salaries`, salaryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add salary!";
      return rejectWithValue(message);
    }
  }
);

// Get salary details
export const getSalaryDetails = createAsyncThunk(
  "auth/getSalaryDetails",
  async (employeeId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/employees/${employeeId}/salary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get salary details!";
      return rejectWithValue(message);
    }
  }
);

// Get payslips
export const getPayslips = createAsyncThunk(
  "auth/getPayslips",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      const url = `${BASE_URL}/payslips${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get payslips!";
      return rejectWithValue(message);
    }
  }
);

// Get payslip details
export const getPayslipDetails = createAsyncThunk(
  "auth/getPayslipDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(`${BASE_URL}/payslips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get payslip details!";
      return rejectWithValue(message);
    }
  }
);

// Generate payslip
export const generatePayslip = createAsyncThunk(
  "auth/generatePayslip",
  async (payslipData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.post(`${BASE_URL}/payslips/generate`, payslipData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to generate payslip!";
      return rejectWithValue(message);
    }
  }
);

// Get leave reports
export const getLeaveReports = createAsyncThunk(
  "auth/getLeaveReports",
  async (dates, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const queryParams = new URLSearchParams();
      queryParams.append('start_date', dates.start_date);
      queryParams.append('end_date', dates.end_date);
      const url = `${BASE_URL}/hr-reports/leaves?${queryParams.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get leave reports!";
      return rejectWithValue(message);
    }
  }
);

// Get attendance reports
export const getAttendanceReports = createAsyncThunk(
  "auth/getAttendanceReports",
  async (params, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const queryParams = new URLSearchParams();
      queryParams.append('year', params.year);
      queryParams.append('month', params.month);
      const url = `${BASE_URL}/hr-reports/attendance?${queryParams.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get attendance reports!";
      return rejectWithValue(message);
    }
  }
);

// Get payroll reports
export const getPayrollReports = createAsyncThunk(
  "auth/getPayrollReports",
  async (params, { rejectWithValue }) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const queryParams = new URLSearchParams();
      queryParams.append('year', params.year);
      queryParams.append('month', params.month);
      const url = `${BASE_URL}/hr-reports/payroll?${queryParams.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get payroll reports!";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    profile: null,
    roles: [],
    permissions: [],
    positions: [],
    jobTitles: [],
    jobTitleDetails: null,
    departments: [],
    departmentDetails: null,
    employees: [],
    employeeDetails: null,
    employeesPagination: null,
    workShifts: [],
    workShiftDetails: null,
    leaveTypes: [],
    leaveTypeDetails: null,
    leaveTypesPagination: null,
    leaveRequests: [],
    leaveRequestDetails: null,
    leaveRequestsPagination: null,
    attendance: [],
    attendancePagination: null,
    salaries: [],
    salariesPagination: null,
    salaryDetails: null,
    payslips: [],
    payslipsPagination: null,
    payslipDetails: null,
    leaveReports: null,
    attendanceReports: null,
    payrollReports: null,
    rolesPagination: null,
    permissionsPagination: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearReports: (state) => {
      state.leaveReports = null;
      state.attendanceReports = null;
      state.payrollReports = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
      sessionStorage.removeItem("useralbaraqawy");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;

        // حفظ البيانات المطلوبة مع التوكن
        const userDataToStore = {
          message: action.payload.message,
          data: action.payload.data,
          type: action.payload.type,
          code: action.payload.code,
          token: action.payload.data?.token,
        };

        sessionStorage.setItem("useralbaraqawy", JSON.stringify(userDataToStore));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Register reducers
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        // عند التسجيل الناجح لا نقوم بتسجيل دخول المستخدم تلقائياً
        // ولا نقوم بحفظ أي توكن في الجلسة. سيتم توجيهه لصفحة تسجيل الدخول.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Profile reducers
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // البيانات تأتي مباشرة من الـ response وليس داخل data object
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Update profile reducers
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
        state.success = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Change password reducers
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Roles reducers
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload.data;
        state.rolesPagination = action.payload.pagination;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Permissions reducers
      .addCase(getPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload.data;
        state.permissionsPagination = action.payload.pagination;
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Create role reducers
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Update role reducers
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Delete role reducers
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Logout reducers
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.profile = null;
        state.success = action.payload.message;
        sessionStorage.removeItem("useralbaraqawy");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        // Even if logout fails on server, clear local state
        state.user = null;
        state.profile = null;
        sessionStorage.removeItem("useralbaraqawy");
      })
      // Positions reducers
      .addCase(getPositions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPositions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.positions = action.payload.data;
      })
      .addCase(getPositions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Add position reducers
      .addCase(addPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة المسمى الوظيفي بنجاح";
        state.error = null;
      })
      .addCase(addPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.success = null;
      })
      // Job titles reducers
      .addCase(getJobTitles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobTitles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobTitles = action.payload.data;
      })
      .addCase(getJobTitles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Job titles additional reducers
      .addCase(updateJobTitle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJobTitle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث المسمى الوظيفي بنجاح";
        state.error = null;
      })
      .addCase(updateJobTitle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.success = null;
      })
      .addCase(deleteJobTitle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJobTitle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف المسمى الوظيفي بنجاح";
        state.error = null;
      })
      .addCase(deleteJobTitle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.success = null;
      })
      .addCase(getJobTitleDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobTitleDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobTitleDetails = action.payload.data || action.payload;
      })
      .addCase(getJobTitleDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Departments reducers
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload.data;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة القسم بنجاح";
        state.error = null;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث القسم بنجاح";
        state.error = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف القسم بنجاح";
        state.error = null;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getDepartmentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartmentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departmentDetails = action.payload.data;
      })
      .addCase(getDepartmentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.data;
        state.employeesPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEmployeeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getEmployeeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث الموظف بنجاح";
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة الموظف بنجاح";
        state.error = null;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف الموظف بنجاح";
        state.error = null;
        // Remove employee from the list
        state.employees = state.employees.filter(emp => emp.id !== action.meta.arg);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getWorkShifts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkShifts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workShifts = action.payload.data;
        state.error = null;
      })
      .addCase(getWorkShifts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addWorkShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addWorkShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة الوردية بنجاح";
        state.error = null;
        if (action.payload.data) {
          state.workShifts.push(action.payload.data);
        }
      })
      .addCase(addWorkShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateWorkShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWorkShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث الوردية بنجاح";
        state.error = null;
        if (action.payload.data) {
          const index = state.workShifts.findIndex(shift => shift.id === action.meta.arg.id);
          if (index !== -1) {
            state.workShifts[index] = action.payload.data;
          }
        }
      })
      .addCase(updateWorkShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteWorkShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف الوردية بنجاح";
        state.error = null;
        state.workShifts = state.workShifts.filter(shift => shift.id !== action.meta.arg);
      })
      .addCase(deleteWorkShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getWorkShiftDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkShiftDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workShiftDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getWorkShiftDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Leave types reducers
      .addCase(getLeaveTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveTypes = action.payload.data;
        state.leaveTypesPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getLeaveTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addLeaveType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLeaveType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة نوع الإجازة بنجاح";
        state.error = null;
        if (action.payload.data) {
          state.leaveTypes.push(action.payload.data);
        }
      })
      .addCase(addLeaveType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateLeaveType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث نوع الإجازة بنجاح";
        state.error = null;
        if (action.payload.data) {
          const index = state.leaveTypes.findIndex(leaveType => leaveType.id === action.meta.arg.id);
          if (index !== -1) {
            state.leaveTypes[index] = action.payload.data;
          }
        }
      })
      .addCase(updateLeaveType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteLeaveType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف نوع الإجازة بنجاح";
        state.error = null;
        state.leaveTypes = state.leaveTypes.filter(leaveType => leaveType.id !== action.meta.arg);
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getLeaveTypeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveTypeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveTypeDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getLeaveTypeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Leave requests reducers
      .addCase(getLeaveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveRequests = action.payload.data;
        state.leaveRequestsPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة طلب الإجازة بنجاح";
        state.error = null;
        if (action.payload.data) {
          state.leaveRequests.push(action.payload.data);
        }
      })
      .addCase(addLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث طلب الإجازة بنجاح";
        state.error = null;
        if (action.payload.data) {
          const index = state.leaveRequests.findIndex(request => request.id === action.meta.arg.id);
          if (index !== -1) {
            state.leaveRequests[index] = action.payload.data;
          }
        }
      })
      .addCase(updateLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم حذف طلب الإجازة بنجاح";
        state.error = null;
        state.leaveRequests = state.leaveRequests.filter(request => request.id !== action.meta.arg);
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getLeaveRequestDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveRequestDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveRequestDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getLeaveRequestDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateLeaveRequestStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeaveRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تحديث حالة طلب الإجازة بنجاح";
        state.error = null;
        if (action.payload.data) {
          const index = state.leaveRequests.findIndex(request => request.id === action.meta.arg.id);
          if (index !== -1) {
            state.leaveRequests[index] = action.payload.data;
          }
        }
      })
      .addCase(updateLeaveRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      // Attendance reducers
      .addCase(getAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload.data;
        state.attendancePagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تسجيل الحضور بنجاح";
        state.error = null;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم تسجيل الانصراف بنجاح";
        state.error = null;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      // Salaries reducers
      .addCase(getSalaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSalaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salaries = action.payload.data;
        state.salariesPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getSalaries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addSalary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSalary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم إضافة الراتب بنجاح";
        state.error = null;
      })
      .addCase(addSalary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(getSalaryDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSalaryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salaryDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getSalaryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get payslips
      .addCase(getPayslips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPayslips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payslips = action.payload.data;
        state.payslipsPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getPayslips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get payslip details
      .addCase(getPayslipDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPayslipDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payslipDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getPayslipDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate payslip
      .addCase(generatePayslip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generatePayslip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "تم توليد كشف الراتب بنجاح!";
        state.error = null;
      })
      .addCase(generatePayslip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get leave reports
      .addCase(getLeaveReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveReports = action.payload;
        state.error = null;
      })
      .addCase(getLeaveReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get attendance reports
      .addCase(getAttendanceReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceReports = action.payload;
        state.error = null;
      })
      .addCase(getAttendanceReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get payroll reports
      .addCase(getPayrollReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPayrollReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payrollReports = action.payload;
        state.error = null;
      })
      .addCase(getPayrollReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState, clearError, clearSuccess, clearReports, logout } = authSlice.actions;
export default authSlice.reducer;
