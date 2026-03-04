import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { AnalysisResult, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeReviews(reviews: string, companyName: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `ACT AS A WORLD-CLASS CORPORATE STRATEGIST AND SENTIMENT ANALYST.
    
    PERFORM A BRUTALLY HONEST AND DEEP ANALYSIS of these customer reviews for ${companyName}:
    
    REVIEWS:
    ${reviews}
    
    YOUR MISSION:
    1. Identify the core emotional drivers behind the sentiment.
    2. Extract a sentiment trend (distribute sequentially if no dates).
    3. Create a word cloud of high-impact praises and complaints.
    4. Provide a hard-hitting executive summary with 3 ACTIONABLE, HIGH-LEVERAGE improvements.
    5. METAREVIEW: Use Google Search to find ${companyName}'s latest public promises, mission statements, or news releases. Compare these corporate "promises" against the "reality" of the customer reviews. Identify the "Delivery Gap" with extreme precision.
    `,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          actionableItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Top 3 actionable areas for improvement"
          },
          sentimentTrend: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                score: { type: Type.NUMBER, description: "Sentiment score from -1 to 1" },
                label: { type: Type.STRING }
              },
              required: ["date", "score", "label"]
            }
          },
          wordCloud: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                value: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ["praise", "complaint"] }
              },
              required: ["text", "value", "type"]
            }
          },
          metaReview: {
            type: Type.OBJECT,
            properties: {
              promises: { type: Type.ARRAY, items: { type: Type.STRING } },
              deliveryGap: { type: Type.STRING, description: "Analysis of how well they deliver on promises" },
              newsSources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["promises", "deliveryGap"]
          }
        },
        required: ["summary", "actionableItems", "sentimentTrend", "wordCloud", "metaReview"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  const result = JSON.parse(text) as AnalysisResult;
  
  // Extract grounding metadata if available
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    result.metaReview.newsSources = chunks
      .filter(c => c.web)
      .map(c => ({ title: c.web!.title || "News Source", uri: c.web!.uri }));
  }

  return result;
}

export async function chatWithAI(messages: Message[], context: AnalysisResult | null): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `You are a Customer Sentiment Expert. 
      ${context ? `You are analyzing data for a company. Here is the current analysis context: ${JSON.stringify(context)}` : ""}
      Help the user understand the sentiment data, suggest strategies, and answer questions about the reviews.
      Use ThinkingLevel.HIGH for complex reasoning.`,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });

  const lastMessage = messages[messages.length - 1].content;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text || "I'm sorry, I couldn't process that.";
}
