import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;
let isMockMode = false;

export const initializeGemini = (apiKey: string) => {
  if (!apiKey || apiKey === "sim") {
    isMockMode = true;
    return;
  }
  try {
    client = new GoogleGenAI({ apiKey });
    isMockMode = false;
  } catch (e) {
    console.error("Invalid API Key format");
    isMockMode = true;
  }
};

export const generateResponse = async (prompt: string, history: string[]): Promise<string> => {
  // 1. SIMULATION MODE (No Key)
  if (!client || isMockMode) {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
      return "GREETINGS, AUTHORIZED PERSONNEL. HEV SYSTEMS NOMINAL.";
    }
    if (lowerPrompt.includes("time")) {
      return `CURRENT SYSTEM TIME: ${new Date().toLocaleTimeString()}. ANOMALY CHECK: NEGATIVE.`;
    }
    if (lowerPrompt.includes("black mesa")) {
      return "BLACK MESA RESEARCH FACILITY: OPERATIONAL. SECTOR C TEST LABS: RESTRICTED.";
    }
    
    return "SIMULATION MODE: NEURAL NET UNREACHABLE. PLEASE ENTER A VALID API KEY TO ACCESS FULL INTELLIGENCE. (Try asking 'hello' or 'time' for test responses).";
  }

  // 2. REAL AI MODE
  const systemInstruction = `
    You are the HEV Suit AI (Hazardous Environment Suit) for Black Mesa. 
    Speak in a robotic, helpful, yet slightly ominous tone.
    Refer to the user as "Dr. Freeman" or "Authorized Personnel".
    Keep responses concise and technical.
    Current context: assisting academic team with research.
  `;

  try {
    const model = client.models;
    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "ERR: EMPTY_RESPONSE_PACKET";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "WARNING: UPLINK SIGNAL LOST. RE-CALIBRATE API KEY.";
  }
};
