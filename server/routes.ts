import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRequestSchema } from "@shared/schema";
import { ArduinoCodeGenerator } from "./codeGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate Arduino functions
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateRequestSchema.parse(req.body);
      
      // Create code generator with parameters
      const generator = new ArduinoCodeGenerator(validatedData.parameters);
      
      // Generate requested function(s)
      const result = generator.generateByType(validatedData.functionType);
      
      // Return as array for consistency
      const functions = Array.isArray(result) ? result : [result];
      
      // Debug logging
      console.log('Generated functions:', JSON.stringify(functions.map(f => ({ 
        functionType: f.functionType, 
        hasCode: !!f.code,
        codeLength: f.code?.length 
      }))));
      
      res.json(functions);
    } catch (error) {
      console.error("Error generating code:", error);
      res.status(400).json({ 
        error: "Failed to generate code", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
