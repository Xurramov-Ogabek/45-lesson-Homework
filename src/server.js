import express from "express";
import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import productsRoutes from "./routes/products.routes.js"; 

const app = express();

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes); 

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server ishga tushdi.http://localhost:${PORT} `);
});