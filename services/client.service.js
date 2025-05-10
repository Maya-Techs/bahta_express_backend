const conn = require("../config/db.config");

// Check if a client exists by ID
async function checkIfClientExistsByID(client_id) {
  const query = "SELECT * FROM clients WHERE client_id = ?";
  const rows = await conn.query(query, [client_id]);
  return rows.length > 0;
}

async function checkIfClientExistsByEmail(email) {
  const query = "SELECT * FROM clients WHERE email = ?";
  const rows = await conn.query(query, [email]);
  return rows.length > 0;
}

// Create a new client
async function createClient(client) {
  let createdClient = {};

  try {
    const query = `
      INSERT INTO clients 
      (name, email, phone, website, company_name, industry, logo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with client data
    const result = await conn.query(query, [
      client.name,
      client.email,
      client.phone,
      client.website,
      client.company_name,
      client.industry,
      client.logo_url, // Saving the logo URL (or null if no file uploaded)
    ]);

    // Check if one row was affected (i.e., the client was successfully created)
    if (result.affectedRows !== 1) {
      throw new Error("Failed to create client");
    }

    // Assign client_id and return the created client data
    createdClient = {
      client_id: result.insertId, // Get the auto-generated ID of the new client
      ...client,
    };
  } catch (err) {
    console.error("Error creating client:", err);
    throw new Error("Something went wrong while creating the client");
  }

  return createdClient;
}

// Get all clients
async function getAllClients() {
  try {
    const rows = await conn.query("SELECT * FROM clients");
    return rows;
  } catch (error) {
    console.error("Error getting all clients:", error);
    throw error;
  }
}
async function getAllPubClients() {
  try {
    const rows = await conn.query("SELECT logo_url as logo FROM clients");
    return rows;
  } catch (error) {
    console.error("Error getting all pub clients:", error);
    throw error;
  }
}

// write get client by id function?

// Get client by ID

async function getClientById(clientId) {
  try {
    const query = "SELECT * FROM clients WHERE client_id = ?";
    const rows = await conn.query(query, [clientId]);
    if (rows.length === 0) {
      throw new Error("Client not found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting client by ID:", error);
    throw error;
  }
}

// Delete a client
async function deleteClient(clientId) {
  try {
    await conn.query("DELETE FROM clients WHERE client_id = ?", [clientId]);
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

// Update a client
async function updateClient(clientId, updatedClientData) {
  try {
    let updateFields = [
      "name = ?",
      "email = ?",
      "phone = ?",
      "website = ?",
      "company_name = ?",
      "industry = ?",
    ];
    let values = [
      updatedClientData.name,
      updatedClientData.email,
      updatedClientData.phone,
      updatedClientData.website,
      updatedClientData.company_name,
      updatedClientData.industry,
    ];

    // Only update logo_url if provided
    if (updatedClientData.logo_url) {
      updateFields.push("logo_url = ?");
      values.push(updatedClientData.logo_url);
    }

    values.push(clientId); // for WHERE clause

    const updateQuery = `
      UPDATE clients 
      SET ${updateFields.join(", ")} 
      WHERE client_id = ?
    `;

    const result = await conn.query(updateQuery, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

module.exports = {
  checkIfClientExistsByID,
  checkIfClientExistsByEmail,
  createClient,
  getAllClients,
  deleteClient,
  updateClient,
  getClientById,
  getAllPubClients,
};
