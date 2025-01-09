import { readDB, writeDB } from "../db/db.js";
const fileName = "users.json";

export const createUser = async (req, res) => {
  const users = await readDB(fileName);
  const { name, email, password } = req.body;

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);

  await writeDB(fileName, users);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    message: "Foydalanuvchi muvaffaqiyatli qo'shildi!",
  });
};

export const getUsers = async (req, res) => {
  const users = await readDB(fileName);
  res.json(users);
};

export const getUserById = async (req, res) => {
  const users = await readDB(fileName);
  const user = users.find((u) => u.id === parseInt(req.params.userId));

  if (!user) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
  }

  res.json(user);
};

export const updateUser = async (req, res) => {
  const users = await readDB(fileName);
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.userId));

  if (userIndex === -1) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  await writeDB(fileName, users);

  res.json({
    ...users[userIndex],
    message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
  });
};

export const deleteUser = async (req, res) => {
  let users = await readDB(fileName);
  users = users.filter((u) => u.id !== parseInt(req.params.userId));

  await writeDB(fileName, users);

  res.json({ message: "Foydalanuvchi muvaffaqiyatli o'chirildi!" });
};