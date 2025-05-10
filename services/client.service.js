const conn = require("../config/db.config");

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

async function createClient(client) {
  let createdClient = {};

  try {
    const query = `
      INSERT INTO clients 
      (name, email, phone, website, company_name, industry, logo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await conn.query(query, [
      client.name,
      client.email,
      client.phone,
      client.website,
      client.company_name,
      client.industry,
      client.logo_url,
    ]);

    if (result.affectedRows !== 1) {
      throw new Error("Failed to create client");
    }

    createdClient = {
      client_id: result.insertId,
      ...client,
    };
  } catch (err) {
    console.error("Error creating client:", err);
    throw new Error("Something went wrong while creating the client");
  }

  return createdClient;
}

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

    if (updatedClientData.logo_url) {
      updateFields.push("logo_url = ?");
      values.push(updatedClientData.logo_url);
    }

    values.push(clientId);

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
