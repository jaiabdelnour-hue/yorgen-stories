'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateStoryAction(topic: string, childName: string = "Yorgen") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Write a soothing, magical bedtime story for a child named ${childName}.
    The story should be about: ${topic}.
    
    Guidelines:
    - Tone: Calming, gentle, dreamy, safe.
    - Length: About 300-400 words.
    - Structure: Start with "Once upon a time, ${childName}...", have a gentle adventure, and end with the character falling asleep or saying goodnight.
    - Vocabulary: Simple, descriptive, sensory (soft clouds, twinkling stars).
    - Avoid: Scary elements, loud noises, high energy.
    
    Format the output as a JSON object with:
    {
      "title": "A short, cute title for the story",
      "content": "The full story text..."
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown formatting from JSON response
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return { success: true, data: JSON.parse(cleanedText) };
  } catch (error) {
    console.error("Error generating story:", error);
    return { success: false, error: "Failed to generate story" };
  }
}
