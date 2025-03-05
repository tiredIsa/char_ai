import { Request, Response } from "express";
import * as proxyApi from "../services/openRouterService";
import * as googleAiStudio from "../services/googleAiStudio";
import config from "../config/config"; // Импортируем конфигурацию

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userMessages = req.body.messages;

    if (!userMessages) {
      res.status(400).json({ error: "Messages is required" });
      return;
    }

    // Вызываем сервис для взаимодействия с AI-моделью
    const aiResponse = await proxyApi.getAIResponse(userMessages, config.aiModel);

    // Отправляем ответ пользователю
    res.status(200).json({ reply: aiResponse });
  } catch (error: any) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
