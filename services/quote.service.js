const db = require("../config/db.config");

async function checkIfQuoteExistsById(quoteId) {
  const query = "SELECT * FROM quotes WHERE quote_id = ?";
  const rows = await db.query(query, [quoteId]);
  return rows.length > 0;
}

async function createQuote(quoteData, service_list) {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
      status,
    } = quoteData;

    const query = `
      INSERT INTO quotes (first_name, last_name, email, phone_number, origin_address, destination_address, weight_kg, dimensions, number_of_pieces, commodity, additional_info, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
      status || "pending",
    ]);

    if (result.affectedRows === 0) return null;

    const quoteId = result.insertId;

    if (Array.isArray(service_list) && service_list.length > 0) {
      const serviceValues = service_list.map((service) => [
        quoteId,
        service.service_id,
      ]);
      const placeholders = serviceValues.map(() => "(?, ?)").join(", ");
      const flatValues = serviceValues.flat();

      const insertQuery = `INSERT INTO quote_services (quote_id, service_id) VALUES ${placeholders}`;

      try {
        await db.query(insertQuery, flatValues);
      } catch (error) {
        console.error("Error inserting quote services:", error);
        throw error;
      }
    }

    return {
      quote_id: quoteId,
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
      status,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating quote: " + error.message);
  }
}

async function getAllQuotes() {
  try {
    const quotes = await db.query(
      "SELECT * FROM quotes ORDER BY submitted_at DESC"
    );
    const services = await db.query(`
      SELECT qs.quote_id, s.service_name 
      FROM quote_services qs
      JOIN services s ON qs.service_id = s.service_id
    `);

    const quotesWithServices = quotes.map((q) => ({
      ...q,
      services: services
        .filter((s) => s.quote_id === q.quote_id)
        .map((s) => s.service_name),
    }));

    return quotesWithServices;
  } catch (error) {
    console.error("Error fetching quotes: ", error);
    throw new Error("Error fetching quotes: " + error.message);
  }
}

async function updateQuoteStatus(quoteId, newStatus) {
  try {
    const validStatuses = ["pending", "approved", "rejected"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        "Invalid status value. Valid options are: 'pending', 'approved', 'rejected'."
      );
    }
    const query = `
      UPDATE quotes
      SET status = ?
      WHERE quote_id = ?
    `;
    const result = await db.query(query, [newStatus, quoteId]);
    if (result.affectedRows === 0) {
      throw new Error("Quote not found or status is already the same.");
    }
    return {
      quote_id: quoteId,
      status: newStatus,
    };
  } catch (error) {
    console.error("Error updating quote status: ", error);
    throw new Error("Error updating quote status: " + error.message);
  }
}

async function updateQuote(quoteId, quoteData, serviceIds) {
  try {
    const quoteExists = await checkIfQuoteExistsById(quoteId);
    if (!quoteExists) {
      throw new Error("Quote not found.");
    }

    const {
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
    } = quoteData;

    const query = `
      UPDATE quotes
      SET first_name = ?, last_name = ?, email = ?, phone_number = ?, origin_address = ?, 
          destination_address = ?, weight_kg = ?, dimensions = ?, number_of_pieces = ?, 
          commodity = ?, additional_info = ?
      WHERE quote_id = ?
    `;
    const result = await db.query(query, [
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
      quoteId,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to update quote.");
    }

    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      const deleteQuery = "DELETE FROM quote_services WHERE quote_id = ?";
      await db.query(deleteQuery, [quoteId]);

      const serviceValues = serviceIds.map((serviceId) => [quoteId, serviceId]);
      const placeholders = serviceValues.map(() => "(?, ?)").join(", ");
      const flatValues = serviceValues.flat();

      const insertQuery = `INSERT INTO quote_services (quote_id, service_id) VALUES ${placeholders}`;
      await db.query(insertQuery, flatValues);
    }

    return {
      quote_id: quoteId,
      first_name,
      last_name,
      email,
      phone_number,
      origin_address,
      destination_address,
      weight_kg,
      dimensions,
      number_of_pieces,
      commodity,
      additional_info,
    };
  } catch (error) {
    console.error("Error updating quote:", error);
    throw new Error("Error updating quote: " + error.message);
  }
}
async function deleteQuote(quoteId) {
  try {
    const quoteExists = await checkIfQuoteExistsById(quoteId);
    if (!quoteExists) {
      throw new Error("Quote not found.");
    }

    const deleteServicesQuery = "DELETE FROM quote_services WHERE quote_id = ?";
    await db.query(deleteServicesQuery, [quoteId]);

    const deleteQuoteQuery = "DELETE FROM quotes WHERE quote_id = ?";
    const result = await db.query(deleteQuoteQuery, [quoteId]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete quote.");
    }

    return { message: "Quote deleted successfully." };
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw new Error("Error deleting quote: " + error.message);
  }
}

module.exports = {
  createQuote,
  checkIfQuoteExistsById,
  getAllQuotes,
  updateQuoteStatus,
  updateQuote,
  deleteQuote,
};
