const conn = require("../config/db.config");

// Create a new service
async function createService(service) {
  let createdService = {};

  try {
    const query = `
      INSERT INTO services (service_name) 
      VALUES (?)
    `;

    const result = await conn.query(query, [service.service_name]);

    if (result.affectedRows !== 1) {
      throw new Error("Failed to create service");
    }

    createdService = {
      service_id: result.insertId,
      ...service,
    };
  } catch (err) {
    console.error("Error creating service:", err);
    throw new Error("Something went wrong while creating the service");
  }

  return createdService;
}

// Get all services
async function getAllServices() {
  try {
    const rows = await conn.query("SELECT * FROM services");
    return rows;
  } catch (error) {
    console.error("Error getting all services:", error);
    throw error;
  }
}

// Get service by ID
async function getServiceById(serviceId) {
  try {
    const query = "SELECT * FROM services WHERE service_id = ?";
    const rows = await conn.query(query, [serviceId]);
    if (rows.length === 0) {
      throw new Error("Service not found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting service by ID:", error);
    throw error;
  }
}

// Delete a service
async function deleteService(serviceId) {
  try {
    await conn.query("DELETE FROM services WHERE service_id = ?", [serviceId]);
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

// Update a service
async function updateService(serviceId, updatedServiceData) {
  try {
    const updateQuery = `
      UPDATE services 
      SET service_name = ? 
      WHERE service_id = ?
    `;

    const result = await conn.query(updateQuery, [
      updatedServiceData.service_name,
      serviceId,
    ]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
  updateService,
};
