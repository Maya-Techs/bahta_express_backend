const upload = require("../middlewares/upload.middleware");
const clientService = require("../services/client.service");
const { deleteFile } = require("../utils/upload");

async function getAllClients(req, res) {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to get clients", error });
  }
}

async function getAllPubClients(req, res) {
  try {
    const clients = await clientService.getAllPubClients();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to get clients", error });
  }
}
async function getWhatClientsSay(req, res) {
  try {
    const clients = await clientService.getWhatClientsSay();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to get what clients says", error });
  }
}
async function createClient(req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    try {
      const {
        name,
        email,
        phone,
        website,
        company_name,
        industry,
        message,
        client_role,
      } = req.body;
      const logoPath = req.files["client_logo"]
        ? req.files["client_logo"][0].filename
        : null;
      // Validate required fields
      if (!name || !company_name || !logoPath) {
        return res
          .status(400)
          .json({ error: "Please fill all required fields" });
      }

      const clientData = {
        name,
        email,
        phone,
        website,
        company_name,
        industry,
        logo_url: logoPath,
        message,
        client_role,
      };

      const client = await clientService.createClient(clientData);

      if (!client) {
        return res.status(400).json({ error: "Failed to create client" });
      }

      res
        .status(200)
        .json({ status: true, message: "Client Created Successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Something went wrong" });
    }
  });
}

async function deleteClient(req, res) {
  try {
    const clientId = req.params.id;
    const clientData = await clientService.getClientById(clientId);

    if (!clientData) {
      return res.status(404).json({ message: "Client not found" });
    }
    await deleteFile(`/ClientLogos/${clientData.logo_url}`);

    await clientService.deleteClient(clientId);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting client", error });
  }
}

async function updateClient(req, res) {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    try {
      const clientId = req.params.id;
      // Handle the logo file upload if provided
      const logoPath = req.files["client_logo"]
        ? req.files["client_logo"][0].filename
        : null;
      const clientData = await clientService.getClientById(clientId);

      if (!clientData) {
        return res.status(404).json({ message: "Client not found" });
      }

      if (logoPath && clientData.logo_url) {
        await deleteFile(`/ClientLogos/${clientData.logo_url}`);
      }

      const {
        name,
        email,
        phone,
        website,
        company_name,
        industry,
        message,
        client_role,
      } = req.body;
      // Validate required fields
      if (!name || !company_name) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const updatedData = {
        name,
        email,
        phone,
        website,
        company_name,
        industry,
        logo_url: logoPath, // Save logo file path if uploaded,
        message,
        client_role,
      };

      const success = await clientService.updateClient(clientId, updatedData);
      if (!success) {
        return res
          .status(404)
          .json({ message: "Client not found or not updated" });
      }
      res.status(200).json({ message: "Client updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating client", error });
    }
  });
}

async function getClientById(req, res) {
  try {
    const clientId = req.params.id;
    const exists = await clientService.checkIfClientExistsByID(clientId);
    if (!exists) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ client_id: clientId });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving client", error });
  }
}

module.exports = {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
  getClientById,
  getAllPubClients,
  getWhatClientsSay,
};
