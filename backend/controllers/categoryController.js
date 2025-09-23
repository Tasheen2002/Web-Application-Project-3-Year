import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const { status = 'active', includeProducts = false } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    let categories;
    if (includeProducts === 'true') {
      categories = await Category.find(query)
        .populate('featuredProducts', 'name price images')
        .sort({ sortOrder: 1, name: 1 });
    } else {
      categories = await Category.find(query)
        .sort({ sortOrder: 1, name: 1 });
    }

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('parent', 'name slug')
      .populate('children', 'name slug image')
      .populate('featuredProducts', 'name price images ratings');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const parentCategories = await Category.find({
      parent: null,
      status: 'active'
    })
      .populate({
        path: 'children',
        match: { status: 'active' },
        select: 'name slug image'
      })
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      categories: parentCategories
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};