// aiService.ts
import axios from "axios";
import rateLimit from "axios-rate-limit";
import { IModelsConfig } from "../config/config";

const http = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 10000 });

export const getAIResponse = async (messages: [{ role: string; content: string }], config: IModelsConfig): Promise<string> => {
  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: config.basePrompt }],
        },
        ...messages,
      ],
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const response = await http.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${config.apiKeys.google}`, payload, {
      headers: headers,
    });

    if (response.status === 200 && response.data && response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected response from AI model:", response.data);
      throw new Error("Unexpected response from AI model");
    }
  } catch (error: any) {
    console.error("Error calling AI model:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get response from AI model: " + (error.response?.data?.error?.message || error.message));
  }
};
