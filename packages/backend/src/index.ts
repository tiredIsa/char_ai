import express, { Application, Request, Response } from "express";
import chatRoutes from "./routes/chatRoutes";

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/chat", chatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Char.fxck is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
