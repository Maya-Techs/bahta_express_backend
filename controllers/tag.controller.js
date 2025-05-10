const tagService = require("../services/tag.service");
async function createTag(req, res, next) {
  const tagExists = await tagService.checkIfTagExistsByName(req.body.tag_name);

  if (tagExists) {
    res.status(400).json({
      message: "This tag is already exists!",
    });
  } else {
    try {
      const tagData = req.body;
      if (tagData.tag_name === "" || tagData.description === "") {
        return res.status(400).json({
          message: "Tag name and description are required",
        });
      }
      const tag = await tagService.createTag(tagData);

      if (!tag) {
        res.status(400).json({
          message: "Failed to create the tag!",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Tag Created Successfully!",
        });
      }
    } catch (error) {
      console.error(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

async function getAllTags(req, res, next) {
  try {
    const tags = await tagService.getAllTags();
    if (!tags) {
      return res.status(400).json({
        error: "Failed to get all tags",
      });
    } else {
      return res.status(200).json({
        status: true,
        data: tags,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

async function deleteTag(req, res, next) {
  const tagId = req.params.id;
  const tagExists = await tagService.checkIfTagExistsByID(tagId);
  if (!tagExists) {
    res.status(400).json({
      error: "Tag is not exist!",
    });
  } else {
    try {
      const result = await tagService.deleteTag(tagId);
      if (result) {
        res.status(200).json({
          status: "success",
          message: "Tag deleted successfully",
        });
      } else {
        res.status(404).json({
          error: "Tag not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
async function updateTag(req, res, next) {
  const tagId = req.params.id;
  const updatedTagData = req.body;

  try {
    const tagExists = await tagService.checkIfTagExistsByID(tagId);

    if (!tagExists) {
      return res.status(400).json({
        message: "Tag not found.",
      });
    }
    if (updatedTagData.tag_name === "" || updatedTagData.description === "") {
      return res.status(400).json({
        message: "Tag name and description are required",
      });
    }

    const success = await tagService.updateTag(tagId, updatedTagData);

    if (success) {
      res.status(200).json({
        status: true,
        message: "Tag updated successfully",
      });
    } else {
      res.status(404).json({
        error: "Tag not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
module.exports = {
  createTag,
  getAllTags,
  deleteTag,
  updateTag,
};
