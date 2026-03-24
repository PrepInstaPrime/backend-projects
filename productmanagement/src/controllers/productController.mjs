import productModel from "../models/productModel.mjs";
import uploadFile from "../aws/uploadFile.mjs";

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    if(!files || files.length===0){
        return res.status(400).send({message: "failed", error: "Image is required"});
    }
    const image= await uploadFile(files[0]);
    if(!image){
        return res.status(500).send({message: "failed", error: "failed to upload image"})
    }
      
    data.productImage = image;
    const product = await productModel.create(data);

    res.status(201).send({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).send({status: false,message: err.message,});
  }
};

export const getProducts = async (req, res) => {
  try {
    let filter = { isDeleted: false };

    const query = req.query;

    if (query.size) {
      filter.availableSizes = query.size;
    }

    if (query.name) {
      filter.title = { $regex: query.name, $options: "i" };
    }

    if (query.priceGreaterThan) {
      filter.price = { $gt: query.priceGreaterThan };
    }

    if (query.priceLessThan) {
      filter.price = { ...filter.price, $lt: query.priceLessThan };
    }

    let sort = {};

    if (query.priceSort) {
      sort.price = query.priceSort;
    }

    const products = await productModel.find(filter).sort(sort);

    res.status(200).send({
      status: true,message: "Products fetched",data: products,});
  } catch (err) {
    res.status(500).send({status: false,message: err.message,});
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findOne({_id: req.params.productId,isDeleted: false,});

    if (!product) {
      return res.status(404).send({status: false,message: "Product not found",});
    }
    res.status(200).send({status: true,data: product,});
  } catch (err) {
    res.status(500).send({status: false,message: err.message,});
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndUpdate(
      { _id: req.params.productId, isDeleted: false },
      req.body,
      { new: true },
    );
    if (!product) {
      return res.status(404).send({status: false,message: "Product not found",});
    }
    res.status(200).send({
      status: true,message: "Product updated",data: product,});
  } catch (err) {
    res.status(500).send({status: false,message: err.message,});
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndUpdate(
      { _id: req.params.productId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );
    if (!product) {
      return res.status(404).send({status: false,message: "Product not found",});
    }
    res.status(200).send({status: true,message: "Product deleted",});
  } catch (err) {
    res.status(500).send({status: false,message: err.message,});
  }
};
