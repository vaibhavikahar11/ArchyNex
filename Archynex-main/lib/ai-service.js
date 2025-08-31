import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initialize();
  }

  initialize() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API key not found");
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-flash for free tier
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
    } catch (error) {
      console.error("Failed to initialize AI service:", error);
    }
  }

  async generateSystemDesign(requirements) {
    if (!this.model) {
      throw new Error("AI service not initialized. Please check your API key.");
    }

    const prompt = `
    As a system design expert, help me create a system architecture based on these requirements:
    
    Requirements: ${requirements}
    
    Please provide:
    1. Recommended system components (databases, servers, load balancers, etc.)
    2. Architecture patterns to consider
    3. Key design decisions and trade-offs
    4. Scalability considerations
    5. Suggested technology stack
    
    Format your response in a clear, structured way that helps with system design planning.
    Keep the response concise but comprehensive.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI service");
      }

      return text;
    } catch (error) {
      console.error("AI generation error:", error);

      // Provide more specific error messages
      if (error.message.includes("API_KEY_INVALID")) {
        throw new Error(
          "Invalid API key. Please check your Gemini API key configuration."
        );
      } else if (error.message.includes("QUOTA_EXCEEDED")) {
        throw new Error("API quota exceeded. Please check your usage limits.");
      } else if (error.message.includes("MODEL_NOT_FOUND")) {
        throw new Error("AI model not available. Please try again later.");
      } else {
        throw new Error(
          "Failed to generate system design suggestions. Please try again."
        );
      }
    }
  }

  async optimizeSystemDesign(currentDesign) {
    if (!this.model) {
      throw new Error("AI service not initialized. Please check your API key.");
    }

    const prompt = `
    Analyze this system design and provide optimization suggestions:
    
    Current Design: ${JSON.stringify(currentDesign, null, 2)}
    
    Please provide:
    1. Performance optimization opportunities
    2. Security improvements
    3. Cost optimization strategies
    4. Scalability enhancements
    5. Best practices recommendations
    
    Focus on practical, actionable improvements. Keep the response structured and concise.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI service");
      }

      return text;
    } catch (error) {
      console.error("AI optimization error:", error);
      throw new Error(
        "Failed to generate optimization suggestions. Please try again."
      );
    }
  }

  async explainComponent(componentType, context = "") {
    if (!this.model) {
      throw new Error("AI service not initialized. Please check your API key.");
    }

    const prompt = `
    Explain the ${componentType} component in system design:
    
    Context: ${context}
    
    Please provide:
    1. What this component does
    2. When to use it
    3. Common configurations
    4. Integration considerations
    5. Alternatives to consider
    
    Keep the explanation concise but comprehensive.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI service");
      }

      return text;
    } catch (error) {
      console.error("AI explanation error:", error);
      throw new Error(
        "Failed to generate component explanation. Please try again."
      );
    }
  }

  async generateLoadTestingStrategy(systemDesign) {
    if (!this.model) {
      throw new Error("AI service not initialized. Please check your API key.");
    }

    const prompt = `
    Create a load testing strategy for this system design:
    
    System Design: ${JSON.stringify(systemDesign, null, 2)}
    
    Please provide:
    1. Key performance metrics to monitor
    2. Test scenarios to implement
    3. Load testing tools recommendations
    4. Expected bottlenecks to watch for
    5. Scalability testing approach
    
    Make it practical and actionable for implementation. Keep the response structured.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI service");
      }

      return text;
    } catch (error) {
      console.error("AI load testing error:", error);
      throw new Error(
        "Failed to generate load testing strategy. Please try again."
      );
    }
  }

  isAvailable() {
    return this.model !== null;
  }
}

export default new AIService();
