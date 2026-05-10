import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe (will be null if no key, handled in routes)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2023-10-16' as any }) : null;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });
  const PORT = 3000;

  app.use(express.json());

  // Real-time Intelligence Stream Logic
  const intelligenceNodes = [
    { type: 'ALGORITHM_SHIFT', message: 'Meta Matrix adjusting ad-weighting parameters', intensity: 0.8 },
    { type: 'VIRAL_SURGE', message: 'Keyword "DeepCore Neural" trending in tech sectors', intensity: 0.95 },
    { type: 'SYNC_SUCCESS', message: 'Global YouTube nodes reported high engagement on vertical formats', intensity: 0.7 },
    { type: 'ORACLE_INSIGHT', message: 'Projected reach expansion for AI-first content in Q3', intensity: 0.85 },
    { type: 'STRATEGY_ALERT', message: 'Competitor matrix detected in niche organic nodes', intensity: 0.6 },
  ];

  io.on('connection', (socket) => {
    // Send immediate welcome burst
    socket.emit('intelligence_burst', {
      timestamp: new Date().toISOString(),
      logs: intelligenceNodes.slice(0, 3)
    });

    socket.on('disconnect', () => {
    });
  });

  // Broadcast periodic intelligence updates
  setInterval(() => {
    const node = intelligenceNodes[Math.floor(Math.random() * intelligenceNodes.length)];
    io.emit('intelligence_update', {
      ...node,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    });
  }, 5000);

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'neural_sync_active', timestamp: new Date().toISOString() });
  });

  // YouTube Data Routes
  app.get('/api/youtube/search', async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
      const { youtubeService } = await import('./server/youtube.ts');
      const results = await youtubeService.searchVideos(q);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch YouTube data',
        message: error.message,
        hint: !process.env.GOOGLE_YOUTUBE_API_KEY ? 'YouTube API Key is missing in environment variables' : undefined
      });
    }
  });

  app.get('/api/youtube/stats', async (req, res) => {
    const { videoId } = req.query;
    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ error: 'VideoId parameter is required' });
    }

    try {
      const { youtubeService } = await import('./server/youtube.ts');
      const stats = await youtubeService.getVideoStats(videoId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch video stats',
        message: error.message,
        hint: !process.env.GOOGLE_YOUTUBE_API_KEY ? 'YouTube API Key is missing in environment variables' : undefined
      });
    }
  });

  app.get('/api/youtube/channel', async (req, res) => {
    const { identifier } = req.query;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'identifier parameter is required' });
    }

    try {
      const { youtubeService } = await import('./server/youtube.ts');
      const stats = await youtubeService.getChannelStats(identifier);
      const videos = await youtubeService.getChannelVideos(stats.id);
      res.json({ ...stats, recentVideos: videos });
    } catch (error: any) {
      if (!process.env.GOOGLE_YOUTUBE_API_KEY) {
         return res.json({
           title: "Demo Channel " + identifier,
           subscriberCount: "1250000",
           viewCount: "54200000",
           videoCount: "342",
           thumbnail: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
           recentVideos: [
             {
               id: 1, 
               title: 'I Built a Viral App in 24 Hours', 
               viewCount: '1200000', 
               likeCount: '80000',
               commentCount: '4500',
               publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
               thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop', 
               tags: 'tech, coding, challenge', category: 'YouTube' 
             },
             { 
               id: 2, 
               title: 'The Secret to 10k MRR', 
               viewCount: '450000', 
               likeCount: '32000',
               commentCount: '1200',
               publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
               thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', 
               tags: 'business, saas, startup', category: 'YouTube' 
             }
           ],
           _mocked: true
         });
      }
      res.status(500).json({ 
        error: 'Failed to fetch channel stats',
        message: error.message
      });
    }
  });

  app.get('/api/youtube/tags', async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
      const { youtubeService } = await import('./server/youtube.ts');
      const tags = await youtubeService.getRelatedTags(q);
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch tags', message: error.message });
    }
  });

// SEO & Creative Intelligence
  app.post('/api/creative/generate', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured serverside.' });
      }
      
      const { type, topic, platform } = req.body;
      if (!type || !topic) {
        return res.status(400).json({ error: 'Type and topic are required' });
      }

      const ai = new GoogleGenAI({ apiKey });

      let prompt = '';
      if (type === 'script') {
        prompt = `Act as a world-class Social Media Content Architect. 
Topic: ${topic}
Platform: ${platform || 'YouTube'}
Generate a high-retention script structure.
Return JSON: {
  "hook": "Strong opening sentence",
  "intro": "Context setting",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "outro": "Engagement CTA",
  "estimatedDuration": "mins"
}`;
      } else if (type === 'thumbnail') {
        prompt = `Act as a Graphic Design Expert for high-CTR thumbnails.
Topic: ${topic}
Generate 3 distinct thumbnail concepts.
Return JSON: {
  "concepts": [
    { "visual": "Description of the main image", "text": "Text overlay words", "psychology": "Why this works" }
  ]
}`;
      } else if (type === 'ideas') {
        prompt = `Act as a Viral Content Strategist. Generate 5 high-potential viral content ideas for the niche: ${topic} on the platform: ${platform || 'YouTube'}.
Each idea must be unique, catchy, and designed to trigger the algorithm.
Return JSON ONLY: {
  "ideas": [
    { "title": "Catchy & Benefit-Driven Title", "angle": "The unique psychological hook or perspective", "difficulty": "Easy/Med/Hard" }
  ]
}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanText));
    } catch (error: any) {
      console.error('Creative Gen Error:', error);
      res.status(500).json({ error: 'Failed to generate creative intelligence.', message: error.message });
    }
  });

  app.post('/api/seo/generate', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured serverside.' });
      }
      
      const { platform, query } = req.body;
      if (!platform || !query) {
        return res.status(400).json({ error: 'Platform and query are required' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Act as an expert Social Media & SEO Manager like VidIQ or TubeBuddy. 
Generate a comprehensive, viral SEO strategy for the platform: ${platform}.
Topic / Idea: ${query}

Return ONLY a valid JSON object with EXACTLY this structure:
{
  "title": "Optimized Viral Title",
  "viralChance": 85,
  "description": "Engaging description customized for the platform's algorithm",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "trends": ["Current Trend 1", "Current Trend 2"],
  "strategy": "A short, brutal 2-sentence strategy on how to guarantee growth with this niche.",
  "lowCompetitionNiches": ["Niche 1", "Niche 2", "Niche 3"],
  "lowCompetitionKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
  "viralKeywords": ["Viral KW 1", "Viral KW 2", "Viral KW 3"],
  "viralTitles": ["Viral Title Concept 1", "Viral Title Concept 2", "Viral Title Concept 3"],
  "viralVideoNiches": ["Micro Niche 1", "Micro Niche 2"]
}

Ensure the viralChance is a number between 1 and 99 representing probability of high engagement.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanText));
    } catch (error: any) {
      console.error('SEO Gen Error:', error);
      res.status(500).json({ error: 'Failed to generate SEO intelligence.', message: error.message });
    }
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { tier, userId } = req.body;
      
      // Fallback for demo purposes if Stripe key is not configured
      if (!stripe) {
        console.warn('Stripe key missing. Using demo fallback.');
        return res.json({ 
          id: 'demo_session', 
          // Simulate immediate redirect to success page
          url: `${req.headers.origin || 'http://localhost:3000'}/payment/success?session_id=demo_session&tier=${tier}`
        });
      }

      let price = 0;
      if (tier === 'pro') price = 2900; // $29.00
      else if (tier === 'premium') price = 9900; // $99.00

      if (price === 0) {
        return res.status(400).json({ error: 'Invalid tier' });
      }

      const session = await stripe.checkout.sessions.create({
        // Omitting 'payment_method_types' automatically enables all payment methods 
        // configured in your Stripe Dashboard (Apple Pay, Google Pay, Cards, etc.)
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Hub ${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
                description: 'Full access to Neural Node capabilities.',
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // In preview environment, we use the referrer or host to redirect
        success_url: `${req.headers.origin || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
        cancel_url: `${req.headers.origin || 'http://localhost:3000'}/hub-upgrade`,
        metadata: {
          userId: userId || 'anonymous',
          tier: tier
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe Session Error:', error);
      res.status(500).json({ error: 'Failed to create checkout session', message: error.message });
    }
  });

  app.get('/api/verify-checkout', async (req, res) => {
    try {
      const { session_id, tier } = req.query;
      
      if (!stripe) {
        // Demo fallback verification
        if (session_id === 'demo_session') {
          return res.json({ success: true, tier: tier || 'pro' });
        }
        return res.status(500).json({ error: 'Stripe is not configured on the server.' });
      }
      
      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status === 'paid') {
        res.json({ success: true, tier: session.metadata?.tier || 'pro' });
      } else {
        res.json({ success: false, status: session.payment_status });
      }
    } catch (error: any) {
      console.error('Stripe Verify Error:', error);
      res.status(500).json({ error: 'Failed to verify session', message: error.message });
    }
  });

  app.post('/api/growth/architect', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured serverside.' });
      }
      
      const { task_id, context_data } = req.body;
      if (!task_id || !context_data) {
        return res.status(400).json({ error: 'task_id and context_data are required' });
      }

      const ai = new GoogleGenAI({ apiKey });

      let systemPrompt = `You are a Social Media Growth Architect & Senior Full-Stack AI Developer. Your job is to transform raw social media data into actionable growth strategies that outperform tools like VidIQ and TubeBuddy.
You MUST output ONLY a valid JSON object matching this schema:
{
  "feature_type": "string",
  "prediction_score": number,
  "actionable_steps": ["step 1", "step 2"],
  "ai_draft": "string",
  "reasoning": "string"
}`;

      let userPrompt = '';
      switch (task_id) {
        case 'PREDICTIVE_TREND_ANALYSIS':
          userPrompt = `Analyze the following data to predict Viral Gaps and topics rising on platforms but haven't peaked yet on YouTube: ${context_data}`;
          break;
        case 'AGENTIC_ENGAGEMENT':
          userPrompt = `Analyze the following comments. Categorize them into "Sales Leads," "Video Suggestions," or "Community Support," and draft replies maintaining the creator's voice: ${context_data}`;
          break;
        case 'CONTENT_REPURPOSING':
          userPrompt = `Analyze the following video transcript. Identify the exact timestamps (MM:SS) for high-impact Hooks and Value Bombs suitable for 60-second vertical Shorts: ${context_data}`;
          break;
        case 'THUMBNAIL_VISION':
          userPrompt = `Evaluate this thumbnail description or image data against high-CTR competitors. Provide a Confidence Score and suggest 3 specific visual changes: ${context_data}`;
          break;
        default:
          return res.status(400).json({ error: 'Invalid task_id' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${systemPrompt}\n\nTask: ${userPrompt}`
      });
      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanText));
    } catch (error: any) {
      console.error('Growth Architect Error:', error);
      res.status(500).json({ error: 'Failed to generate architect intelligence.', message: error.message });
    }
  });

  // Neural Lab Psychological Analytics
  app.post('/api/neural/analyze-psychology', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing' });

      const { topic, script, platform } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Act as an Elite Viral Content Scientist and Psychology Expert.
Analyze this content for ${platform}:
Topic: ${topic}
Script/Outline: ${script}

Analyze strictly based on:
- Retention psychology
- Emotional engagement
- Storytelling quality
- Hook strength
- Viral probability

Return a JSON object:
{
  "overallScore": number,
  "viralProbability": number,
  "retentionEstimate": "string",
  "diagnosis": "string",
  "scores": [{ "category": "string", "score": number, "explanation": "string", "fix": "string" }],
  "timeline": [{ "timestamp": "string", "impact": "positive|negative|neutral", "insight": "string", "recommendation": "string" }]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanText));
    } catch (error: any) {
      console.error('Neural Analysis Error:', error);
      res.status(500).json({ error: 'Psychology analysis failed' });
    }
  });

  app.post('/api/neural/analyze-thumbnail', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing' });

      const { title, niche } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Analyze thumbnail psychology for a video titled "${title}" in the "${niche}" niche.
Analyze triggers, clutter, and contrast.
Return JSON: {
  "score": number,
  "ctrPrediction": "string",
  "clutterDetection": "low|med|high",
  "psychologyTriggers": ["string"],
  "textOptimization": "string",
  "colorOptimization": "string",
  "compositionTips": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanText));
    } catch (error: any) {
      console.error('Thumbnail Analysis Error:', error);
      res.status(500).json({ error: 'Thumbnail analysis failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Neural Nexus Online: http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('System Failure during Nexus initialization:', err);
});
