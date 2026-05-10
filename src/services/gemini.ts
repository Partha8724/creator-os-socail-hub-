export const gemini = {
  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) {
        throw new Error('AI generation failed');
      }
      const data = await response.json();
      return data.text || '';
    } catch (e: any) {
      console.warn("Generating mock content due to missing backend");
      // Basic mock so the UI doesn't crash
      return "```json\n" + JSON.stringify({ 
         winner: "A", winnerTitle: "Mock Title", confidenceScore: 85, reasoning: "Mock reasoning.",
         optimizedTitle: "Mock Optimized Title", optimizedTags: ["mock", "tags"],
         overallScore: 80, hook: { score: 80, feedback: "Mock hook feedback.", fix: "Mock fix" },
         pacing: { score: 80, feedback: "Mock pacing", dropOffRisk: "Mock dropoff" },
         storytelling: { weaknesses: ["weakness 1"], strengths: ["strength 1"] },
         emotionalSpikes: [{ section: "0:00", emotion: "Curiosity" }],
         seoOptimizations: { suggestedTitles: ["Title 1"], descriptionOptimization: "Desc opt", suggestedTags: ["tags"] },
         ideas: [
           { title: "Mock Viral Idea 1", angle: "Controversial take", difficulty: "Easy" },
           { title: "Mock Viral Idea 2", angle: "Data driven", difficulty: "Med" },
           { title: "Mock Viral Idea 3", angle: "Tutorial", difficulty: "Hard" },
           { title: "Mock Viral Idea 4", angle: "Entertainment", difficulty: "Easy" },
           { title: "Mock Viral Idea 5", angle: "Vlog format", difficulty: "Med" }
         ],
         scriptHook: "Mock generated hook", intro: "Mock generated intro", keyPoints: ["Point 1", "Point 2"], outro: "Mock outro", estimatedDuration: "5 mins",
         concepts: [
           { text: "Hook", visual: "Close up", psychology: "Curiosity" }
         ]
      }) + "\n```";
    }
  },

  async getProphecy(context: string) {
    await new Promise(r => setTimeout(r, 1000));
    return `The data signifies a shift. Based on "${context}", expect organic reach to plateau unless you introduce extreme pattern interrupts within the first 2 seconds. Optimize for retention over click-through for the next cycle.`;
  },

  async analyzeYouTubeSEO(title: string, description: string) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      optimizedTitle: title ? `[VIRAL] ${title} - What They Don't Tell You` : "The Untold Truth About Smart Systems",
      improvedDescription: description ? `${description}\n\n🔥 Watch to the end for the secret pattern!\n#trending #tech #growth` : "Discover the hidden mechanics of algorithmic growth.\n\n#trending #tech",
      viralProbability: 0.87,
      heatMapKeywords: ["untold truth", "secret pattern", "viral", "algorithm", "2026 growth"]
    };
  },

  async analyzeYouTubeShortsSEO(title: string, description: string) {
    await new Promise(r => setTimeout(r, 1200));
    return {
      optimizedTitle: title ? `${title} #shorts` : "This changes EVERYTHING #shorts",
      improvedDescription: description ? `${description}\nSubscribe for more! #shorts #viral` : "This is insane! #shorts #viral",
      viralProbability: 0.94,
      heatMapKeywords: ["insane", "viral", "shorts strategy", "hook"]
    };
  },

  async generateShortsBlueprint(topic: string, platform: string) {
    await new Promise(r => setTimeout(r, 1800));
    return {
      optimizedTitle: `The ${topic} Secret for ${platform}`,
      highEnergyDescription: `You won't believe how this ${topic} hack works on ${platform}! Drops rules. Breaks algorithms.`,
      nicheTags: [topic.replace(/\s+/g, '').toLowerCase(), "growth", "hack", "viral", "2026", "secret", "algorithm"],
      structuralGrowthInstructions: [
        "0:00-0:03 - HOOK: State the impossible claim.",
        "0:03-0:15 - BUILD: Show hyper-fast visual proof.",
        "0:15-0:30 - PAYOFF: Explain the core mechanic.",
        "0:30-0:45 - CTA: Tell them to save the video for later."
      ]
    };
  },

  async getDailyTrends() {
    await new Promise(r => setTimeout(r, 1000));
    return [
      { topicName: "Viral Neural Aesthetics", viralPotential: "98%", platformStrategy: "YouTube/Shorts" },
      { topicName: "Smart Content Automation 2026", viralPotential: "94%", platformStrategy: "Instagram" },
      { topicName: "AI-First Social Growth", viralPotential: "96%", platformStrategy: "TikTok/Shorts" },
      { topicName: "The Future of Smart Interfaces", viralPotential: "92%", platformStrategy: "Multi-Platform" },
      { topicName: "Decoding Algorithmic Patterns", viralPotential: "95%", platformStrategy: "YouTube" }
    ];
  },

  async generateGrowthBlueprint(topic: string, platform: string) {
    await new Promise(r => setTimeout(r, 2000));
    return {
      optimizedTitle: `Mastering ${topic} on ${platform} Fast`,
      highEnergyDescription: `A complete guide to dominating ${topic} on ${platform}. We analyze the data and give you the step-by-step framework to win.`,
      nicheTags: [topic.toLowerCase().replace(/\s+/g, ''), "mastery", "guide", "framework", platform.toLowerCase()],
      structuralGrowthInstructions: [
        "Pre-production: Research competitor thumbnails.",
        "Production: Shoot in 4K, focus on dynamic lighting.",
        "Editing: Cut dead air, add sound effects every 7 seconds.",
        "Publishing: A/B test titles for 2 hours.",
        "Post-publishing: Pin a highly engaging comment."
      ]
    };
  }
};

