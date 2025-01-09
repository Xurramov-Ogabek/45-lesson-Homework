import fs from "fs/promises";
import path from "path";

const productsFilePath = path.resolve("src/db/products.json");

const readProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProducts = async (products) => {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
};

export const getProducts = async (req, res) => {
  const products = await readProducts();
  res.status(200).json(products);
};

export const createProduct = async (req, res) => {
  const { name, price, description, stock } = req.body;

  if (!name || !price || !description || !stock) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring!" });
  }

  const products = await readProducts();
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    description,
    stock,
  };

  products.push(newProduct);
  await writeProducts(products);

  res.status(201).json(newProduct);
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const products = await readProducts();

  const product = products.find((p) => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ message: "Mahsulot topilmadi" });
  }

  res.status(200).json(product);
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, description, stock } = req.body;
  const products = await readProducts();

  const productIndex = products.findIndex((p) => p.id === parseInt(productId));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Mahsulot topilmadi" });
  }

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
    description,
    stock,
  };

  await writeProducts(products);
  res.status(200).json(products[productIndex]);
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const products = await readProducts();

  const updatedProducts = products.filter((p) => p.id !== parseInt(productId));
  if (updatedProducts.length === products.length) {
    return res.status(404).json({ message: "Mahsulot topilmadi" });
  }

  await writeProducts(updatedProducts);
  res.status(200).json({ message: "Mahsulot o'chirildi" });
};