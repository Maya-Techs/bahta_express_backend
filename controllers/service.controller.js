const serviceService = require("../services/service.service");

async function getAllServices(req, res) {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json({ status: "success", data: services });
  } catch (error) {
    res.status(500).json({ message: "Failed to get services", error });
  }
}

async function createService(req, res) {
  try {
    const { service_name } = req.body;
    // Validate required fields
    if (!service_name) {
      return res.status(400).json({ error: "Service name is required" });
    }

    const serviceData = { service_name };
    const service = await serviceService.createService(serviceData);

    if (!service) {
      return res.status(400).json({ error: "Failed to create service" });
    }

    res
      .status(200)
      .json({ status: true, message: "Service Created Successfully" });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
}

async function updateService(req, res) {
  try {
    const serviceId = req.params.id;
    const { service_name } = req.body;

    if (!service_name) {
      return res.status(400).json({ error: "Service name is required" });
    }

    const updatedService = await serviceService.updateService(serviceId, {
      service_name,
    });

    if (!updatedService) {
      return res
        .status(404)
        .json({ message: "Service not found or not updated" });
    }

    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
}

async function deleteService(req, res) {
  try {
    const serviceId = req.params.id;
    const serviceData = await serviceService.getServiceById(serviceId);

    if (!serviceData) {
      return res.status(404).json({ message: "Service not found" });
    }

    await serviceService.deleteService(serviceId);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
}

async function getServiceById(req, res) {
  try {
    const serviceId = req.params.id;
    const service = await serviceService.getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving service", error });
  }
}

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
};
