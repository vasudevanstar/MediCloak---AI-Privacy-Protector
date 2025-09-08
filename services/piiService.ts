// Use a singleton pattern to ensure the AI client is initialized only once.
// The type is 'any' because we are using a dynamic import to prevent load-time errors.
let ai: any | null = null;

const REDACTION_TEXT = '[REDACTED]';

/**
 * Lazily initializes and returns the GoogleGenAI client instance using a dynamic import.
 * This prevents the app from crashing on load due to potential issues in the AI SDK.
 * @returns A promise that resolves with the initialized GoogleGenAI client.
 * @throws {Error} If the AI service cannot be initialized.
 */
const getAiClient = async (): Promise<any> => {
  if (!ai) {
    try {
      // Dynamically import the module only when it's first needed.
      const { GoogleGenAI } = await import('@google/genai');
      // The API key is read from the environment variable.
      ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      throw new Error("AI service could not be initialized. Please check your API key configuration.");
    }
  }
  return ai;
};


/**
 * Redacts personally identifiable information (PII) from a given text using the Gemini AI model.
 * @param text The input text to be redacted.
 * @returns A promise that resolves with the text where PII is replaced by "[REDACTED]".
 */
export const redactText = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return text;
  }

  const fullPrompt = `You are an expert AI specializing in medical data privacy. 
Your task is to identify and redact Personally Identifiable Information (PII) from the following text while preserving all medical information.
Replace all PII with the exact string "${REDACTION_TEXT}".
Do NOT redact any medical information such as diagnoses, symptoms, medication names, lab results, or treatment plans.
PII includes, but is not limited to:
- Names of patients, doctors (unless part of a hospital name), relatives.
- Phone numbers.
- Addresses, including street names, cities, zip codes.
- Dates (like date of birth, admission dates).
- Aadhaar numbers, Social Security Numbers, or other national identifiers.
- Email addresses.
- Medical record numbers (MRN).

Return only the redacted text, with no additional commentary or explanation.

Here is the text to process:
---
${text}
---
`;


  try {
    const aiClient = await getAiClient(); // Wait for the client to be ready.
    
    const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            temperature: 0.0, // Be deterministic for this task
        },
    });
    
    return response.text;

  } catch (error) {
    console.error("Error redacting text with Gemini API:", error);
    // Propagate a user-friendly error up to the UI component.
    throw new Error(error instanceof Error ? error.message : "Failed to redact information due to an AI service error.");
  }
};