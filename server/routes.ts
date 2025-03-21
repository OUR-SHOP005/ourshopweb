import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      
      // Log the form submission
      console.log("Contact form submission:", validatedData);
      
      // Send email notification
      try {
        const { sendContactEmail } = await import("./lib/email");
        await sendContactEmail(validatedData);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Continue execution even if email fails
      }
      
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
