const categoryService = require("../services/categories.service");
async function createCategory(req, res, next) {
  const categoryExists = await categoryService.checkIfCategoryExistsByName(
    req.body.category_name
  );
  if (categoryExists) {
    res.status(400).json({
      message: "This category is already exists!",
    });
  } else {
    try {
      const categoryData = req.body;
      if (
        categoryData.category_name === "" ||
        categoryData.description === ""
      ) {
        return res.status(400).json({
          message: "Category name and description are required",
        });
      }
      const category = await categoryService.createCategory(categoryData);
      if (!category) {
        res.status(400).json({
          message: "Failed to create the category!",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Category Created Successfully!",
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

async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    if (!categories) {
      return res.status(400).json({
        error: "Failed to get all categories",
      });
    } else {
      return res.status(200).json({
        status: true,
        data: categories,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

async function deleteCategory(req, res, next) {
  const categoryId = req.params.id;
  const categoryExists = await categoryService.checkIfCategoryExistsByID(
    categoryId
  );
  if (!categoryExists) {
    res.status(400).json({
      error: "Category is not exist!",
    });
  } else {
    try {
      const result = await categoryService.deleteCategory(categoryId);
      if (result) {
        res.status(200).json({
          status: "success",
          message: "Category deleted successfully",
        });
      } else {
        res.status(404).json({
          error: "Category not found",
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
async function updateCategory(req, res, next) {
  const categoryId = req.params.id;
  const updatedCategoryData = req.body;
  try {
    const categoryExists = await categoryService.checkIfCategoryExistsByID(
      categoryId
    );

    if (!categoryExists) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }
    if (
      updatedCategoryData.category_name === "" ||
      updatedCategoryData.description === ""
    ) {
      return res.status(400).json({
        message: "Category name and description are required",
      });
    }

    const success = await categoryService.updateCategory(
      categoryId,
      updatedCategoryData
    );

    if (success) {
      res.status(200).json({
        status: true,
        message: "Category updated successfully",
      });
    } else {
      res.status(404).json({
        error: "Category not found",
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
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
