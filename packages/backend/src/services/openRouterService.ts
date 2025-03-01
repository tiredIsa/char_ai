// aiService.ts
import axios from "axios";
import rateLimit from "axios-rate-limit";

interface AIModelConfig {
  apiKey?: string;
  endpoint: string;
  model: string;
  basePrompt: string;
}

const http = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 10000 });

export const getAIResponse = async (messages: [{ role: string; content: string }], config: AIModelConfig): Promise<string> => {
  try {
    const payload = {
      model: config.model,
      messages: [
        {
          role: "system",
          content: config.basePrompt,
        },
        ...messages,
      ],
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const response = await http.post(config.endpoint, payload, {
      headers: headers,
    });

    if (response.status === 200 && response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error("Unexpected response from AI model:", response.data);
      throw new Error("Unexpected response from AI model");
    }
  } catch (error: any) {
    console.error("Error calling AI model:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get response from AI model: " + (error.response?.data?.error?.message || error.message));
  }
};
