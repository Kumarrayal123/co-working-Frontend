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
