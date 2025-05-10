const {
  sendQuoteNotificationToActiveUsers,
} = require("../services/notification.service");
const quoteService = require("../services/quote.service");

const createQuote = async (req, res) => {
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
      service_list,
    } = req.body;

    if (!Array.isArray(service_list)) {
      return res.status(400).json({ message: "Service list must be an array" });
    }
    const quoteData = {
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
      service_list,
      status,
    };
    console.log(quoteData);

    await sendQuoteNotificationToActiveUsers(quoteData);

    const result = await quoteService.createQuote(quoteData, service_list);

    res.status(201).json({
      message: "Quote Sent successfully",
      //   quote_id: result.quoteId,
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({ message: "Failed to create quote" });
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const quotes = await quoteService.getAllQuotes();

    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ message: "No quotes found" });
    }

    res.status(200).json({
      message: "Quotes fetched successfully",
      data: quotes,
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch quotes", error: error.message });
  }
};

const updateQuoteStatus = async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const result = await quoteService.updateQuoteStatus(quoteId, status);
    res.status(200).json({
      message: `Quote status updated successfully to ${status}`,
      quote_id: result.quote_id,
      status: result.status,
    });
  } catch (error) {
    console.error("Error updating quote status:", error);
    res.status(500).json({ message: "Failed to update quote status" });
  }
};

const deleteQuote = async (req, res) => {
  const quoteId = req.params.quoteId;

  try {
    const result = await quoteService.deleteQuote(quoteId);

    return res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return res.status(500).json({
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};

const updateQuote = async (req, res) => {
  const quoteId = req.params.quoteId;
  const quoteData = req.body;
  const { service_ids } = req.body;

  try {
    if (service_ids && !Array.isArray(service_ids)) {
      return res.status(400).json({ message: "service_ids must be an array." });
    }

    const updatedQuote = await quoteService.updateQuote(
      quoteId,
      quoteData,
      service_ids
    );

    return res.status(200).json({
      message: "Quote updated successfully",
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    return res.status(500).json({
      message: "Failed to update quote",
      error: error.message,
    });
  }
};
module.exports = {
  createQuote,
  updateQuoteStatus,
  deleteQuote,
  updateQuote,
  getAllQuotes,
};
