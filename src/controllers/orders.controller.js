import fs from "fs/promises";
import path from "path";

const ordersFilePath = path.resolve("src/db/orders.json");

const readOrders = async () => {
  try {
    const data = await fs.readFile(ordersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeOrders = async (orders) => {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
};

export const getOrders = async (req, res) => {
  const orders = await readOrders();
  res.status(200).json(orders);
};

export const createOrder = async (req, res) => {
  const { userId, productId, total, status } = req.body;

  if (!userId || !productId || !total || !status) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring!" });
  }

  const orders = await readOrders();
  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    userId,
    productId,
    total,
    status,
  };

  orders.push(newOrder);
  await writeOrders(orders);

  res.status(201).json(newOrder);
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const orders = await readOrders();

  const order = orders.find((o) => o.id === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ message: "Buyurtma topilmadi" });
  }

  res.status(200).json(order);
};

export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const orders = await readOrders();

  const orderIndex = orders.findIndex((o) => o.id === parseInt(orderId));
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Buyurtma topilmadi" });
  }

  orders[orderIndex].status = status;
  await writeOrders(orders);

  res.status(200).json(orders[orderIndex]);
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  const orders = await readOrders();

  const updatedOrders = orders.filter((o) => o.id !== parseInt(orderId));
  if (updatedOrders.length === orders.length) {
    return res.status(404).json({ message: "Buyurtma topilmadi" });
  }

  await writeOrders(updatedOrders);
  res.status(200).json({ message: "Buyurtma o'chirildi" });
};