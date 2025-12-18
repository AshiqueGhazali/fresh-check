import { GoogleGenerativeAI } from "@google/generative-ai";

interface AiSummaryResponse {
  summary: string;
  evaluation: 'Good' | 'Average' | 'Poor';
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateReportSummary = async (reportData: any): Promise<AiSummaryResponse> => {
  // Graceful fallback if API key is missing
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using fallback mock summary.");
    return generateMockSummary(reportData);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const parsedData = typeof reportData === 'string' ? JSON.parse(reportData) : reportData;

    const prompt = `
      Analyze the following inspection report data and provide a concise summary (max 2 sentences) and an overall evaluation (Good, Average, or Poor).
      
      Report Data:
      ${JSON.stringify(parsedData, null, 2)}
      
      Output strictly in valid JSON format like this:
      {
        "summary": "Your summary here...",
        "evaluation": "Good" | "Average" | "Poor"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present (common in Gemini output)
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    
    // Parse the JSON response
    const aiOutput = JSON.parse(jsonStr);

    return {
      summary: aiOutput.summary || "Summary generation failed.",
      evaluation: validateEvaluation(aiOutput.evaluation)
    };

  } catch (error) {
    console.error("Error generating AI summary:", error);
    // Fallback on error
    return generateMockSummary(reportData);
  }
};

// Helper to ensure evaluation is one of the valid types
const validateEvaluation = (val: string): 'Good' | 'Average' | 'Poor' => {
  if (val === 'Good' || val === 'Average' || val === 'Poor') return val;
  return 'Average';
};

// Fallback Mock Logic (preserved for robustness)
const generateMockSummary = (reportData: any): AiSummaryResponse => {
  let score = 0;
  let totalQuestions = 0;
  
  try {
     const parsedData = typeof reportData === 'string' ? JSON.parse(reportData) : reportData;
     const keys = Object.keys(parsedData);
     totalQuestions = keys.length;
     
     for (const key of keys) {
       const val = parsedData[key];
       if (val === true || val === "true" || val === "pass" || val === "Yes" || (typeof val === 'string' && val.length > 0)) {
         score++; // Naive scoring
       }
     }
  } catch (e) {
    console.error("Error parsing report data for mock summary", e);
  }

  const percentage = totalQuestions > 0 ? (score / totalQuestions) : 0;
  let evaluation: 'Good' | 'Average' | 'Poor' = 'Poor';
  
  if (percentage > 0.8) evaluation = 'Good';
  else if (percentage > 0.5) evaluation = 'Average';
  
  return {
    summary: `(AI Unavailable) Automated Summary: Based on the inspection, the overall quality is rated as ${evaluation}. ${score} out of ${totalQuestions} checkpoints checks completed.`,
    evaluation
  };
};
