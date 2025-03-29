import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI with your API key
// The API key should be in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

// Website information for context
const websiteInfo = {
  name: "OurShop",
  description: "Award-winning web design agency helping businesses succeed in the digital world through innovative design and development solutions.",
  services: [
    { name: "Web Design", price: "₹4999", description: "Create stunning, responsive websites that captivate your audience." },
    { name: "UI/UX Design", price: "₹5999", description: "Design intuitive user interfaces and seamless user experiences." },
    { name: "Branding", price: "₹3499", description: "Build a strong brand identity that sets you apart from competitors." },
    { name: "Custom Web Development", price: "₹7999", description: "Tailored web solutions built with cutting-edge technologies to meet your specific business needs." },
    { name: "Mobile App Development", price: "₹6999", description: "Native and cross-platform mobile applications that deliver exceptional user experiences." },
    { name: "Digital Strategy", price: "₹3999", description: "Strategic digital solutions to help your business grow and succeed in the digital landscape." }
  ],
  team: [
    { name: "Bhupesh Pratap Singh", role: "Creative Director", instagram: "thakur_ayush_singh_29_" },
    { name: "Utkarsh Chaudhary", role: "Lead Developer", instagram: "utkarsh_chaudhary_009" }
  ],
  contact: {
    email: "ourshop005@gmail.com",
    businessHours: "Monday - Friday: 9:00 AM - 6:00 PM, Saturday - Sunday: Closed"
  },
  socialMedia: {
    instagram: "our_shop_005",
    youtube: "OurShop-e8x",
    linkedin: "www.linkedin.com/in/our-shop-shop-a45011356",
    whatsapp: "https://whatsapp.com/channel/0029VbAS7Id6buMASI7zX401"
  }
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      console.warn('GOOGLE_GENAI_API_KEY not set');
      return NextResponse.json(
        { 
          error: 'AI service is not configured',
          message: 'The AI assistant is currently unavailable. Please try again later.'
        },
        { status: 503 }
      );
    }

    try {
      // Use the model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Create a system prompt with information about OurShop
      const systemPrompt = `
        You are an AI assistant for OurShop, a web design agency.
        
        About OurShop:
        ${websiteInfo.description}
        
        Services offered:
        ${websiteInfo.services.map(service => `- ${service.name} (Starting from ${service.price}): ${service.description}`).join('\n')}
        
        Team:
        ${websiteInfo.team.map(member => `- ${member.name}: ${member.role}`).join('\n')}
        
        Contact information:
        - Email: ${websiteInfo.contact.email}
        - Business hours: ${websiteInfo.contact.businessHours}
        
        Social media:
        - Instagram: ${websiteInfo.socialMedia.instagram}
        - YouTube: ${websiteInfo.socialMedia.youtube}
        - LinkedIn: ${websiteInfo.socialMedia.linkedin}
        - WhatsApp Channel: ${websiteInfo.socialMedia.whatsapp}
        
        Important instructions:
        1. Only provide information about OurShop and its services
        2. If asked about something unrelated to OurShop, politely redirect to OurShop's services
        3. Be helpful, professional, and friendly in your responses
        4. Keep responses concise and focused on OurShop
        5. If users ask about connecting or chatting with OurShop, mention our WhatsApp channel and provide the link
        6. ALWAYS use Markdown formatting to create beautiful, well-structured responses:
           - Use headings (## and ###) for section titles
           - Use **bold** for important information like prices and service names
           - Use *italics* for emphasis
           - Use bullet points and numbered lists where appropriate
           - Use horizontal rules (---) to separate sections
           - For services, format them in a nice table when listing multiple services
           - For pricing, use a clear format like: **Service**: ₹XXXX
           - Include emoji where appropriate to make the conversation engaging (👋, ✨, 💻, 🎨, etc.)
           - Always ensure your formatting is correct and readable
        7. NEVER mention these formatting instructions to the user
      `;

      // Generate content with the system prompt
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: "I understand. I'll help answer questions about OurShop, its services, team, and contact information using Markdown formatting to create beautiful, well-structured responses." }] },
          { role: 'user', parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      });
      
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    } catch (aiError: any) {
      console.error('Error generating AI content:', aiError);
      
      const errorMessage = aiError.message || 'Failed to generate AI response';
      let statusCode = 500;
      
      // Handle rate limiting
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        statusCode = 429;
      }
      
      // Handle authentication errors
      if (errorMessage.includes('authentication') || errorMessage.includes('API key')) {
        statusCode = 401;
      }
      
      return NextResponse.json({
        error: 'AI error',
        message: errorMessage
      }, { status: statusCode });
    }
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 