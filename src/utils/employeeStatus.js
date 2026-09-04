// Utility functions for employee status filtering

/**
 * Check if an employee should be hidden from dashboard views
 * @param {Object} emp - Employee object
 * @returns {boolean} - True if employee should be hidden
 */
export const isEmployeeHidden = (emp) => {
  if (!emp) return true;
  
  // Check if employee has a status field that indicates they should be hidden
  if (emp.status === 'inactive' || emp.status === 'terminated' || emp.status === 'resigned') {
    return true;
  }
  
  // Check if employee has an isActive field
  if (emp.isActive === false) {
    return true;
  }
  
  // Check if employee has an active field
  if (emp.active === false) {
    return true;
  }
  
  // Default: don't hide any employees
  return false;
};

/**
 * Filter attendance records to only include active employees
 * @param {Array} records - Attendance records array
 * @param {Array} employees - Employees array
 * @returns {Array} - Filtered attendance records
 */
export const filterActiveRecords = (records, employees) => {
  if (!records || !Array.isArray(records)) return [];
  if (!employees || !Array.isArray(employees)) return records;
  
  return records.filter(record => {
    const employee = employees.find(emp => 
      emp.employeeId === record.employeeId || emp._id === record.employeeId
    );
    return employee && !isEmployeeHidden(employee);
  });
};