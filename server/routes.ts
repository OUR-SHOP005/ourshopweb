import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      
      // In a real application, this would send an email
      // For now, we'll just log it to the console
      console.log("Contact form submission:", validatedData);
      
      // Optionally save to database
      // await storage.saveContactSubmission(validatedData);
      
      res.status(200).json({ message: "Message received successfully" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { generateGeminiResponse } = await import("./lib/gemini");
      await generateGeminiResponse(req, res);
    } catch (error) {
      console.error("Error processing chat request:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
