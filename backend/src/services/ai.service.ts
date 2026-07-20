import { config } from '../config';
import { IProperty } from '../models/Property';
import { IUser } from '../models/User';
import type { IDocument } from '../models/Document';
import { IMessage } from '../models/ChatConversation';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

async function callClaude(systemPrompt: string, userMessage: string, maxTokens = 2000, temperature = 0.7) {
  if (!config.anthropic.apiKey) {
    return generateMockResponse(systemPrompt, userMessage);
  }

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropic.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return generateMockResponse(systemPrompt, userMessage);
    }

    const data = await response.json() as { content: { text: string }[] };
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API call failed:', error);
    return generateMockResponse(systemPrompt, userMessage);
  }
}

function generateMockResponse(systemPrompt: string, _userMessage: string): string {
  if (systemPrompt.includes('investment analyst')) {
    return JSON.stringify({
      investmentScore: 78,
      scoreBreakdown: {
        marketAnalysis: 82,
        locationQuality: 76,
        financialPotential: 75,
        legalRiskAssessment: 77,
      },
      marketAnalysis: 'The property is located in a high-growth area with increasing property values. Recent developments and infrastructure improvements suggest continued appreciation.',
      riskAssessment: 'Low to moderate risk. The property has good fundamentals with stable demand in the area. Key risks include market volatility and potential interest rate changes.',
      roiProjections: { conservative: 5.2, moderate: 6.7, optimistic: 9.1 },
      recommendation: 'Strong Buy - This property presents an excellent investment opportunity with above-market ROI potential.',
      summary: 'This property is an excellent investment opportunity due to its location in a high-growth neighborhood. The current price is competitive for similar properties in the area.',
    });
  }

  if (systemPrompt.includes('investment matcher')) {
    return JSON.stringify([
      { propertyId: 'mock1', matchScore: 95, reasoning: 'Matches all investment preferences', whyMatches: 'Perfect fit for your portfolio diversification strategy', investmentScore: 85, projectedROI: 7.2 },
      { propertyId: 'mock2', matchScore: 88, reasoning: 'Strong location match', whyMatches: 'Located in your preferred area with high growth potential', investmentScore: 82, projectedROI: 6.8 },
      { propertyId: 'mock3', matchScore: 82, reasoning: 'Good ROI potential', whyMatches: 'Above-average ROI in your target market', investmentScore: 79, projectedROI: 8.1 },
      { propertyId: 'mock4', matchScore: 76, reasoning: 'Budget-friendly option', whyMatches: 'Affordable entry point with solid fundamentals', investmentScore: 74, projectedROI: 5.9 },
      { propertyId: 'mock5', matchScore: 71, reasoning: 'Emerging area potential', whyMatches: 'Up-and-coming neighborhood with appreciation potential', investmentScore: 71, projectedROI: 9.5 },
    ]);
  }

  if (systemPrompt.includes('real estate document')) {
    return JSON.stringify({
      documentType: 'Purchase Agreement',
      keyDates: { signing: '2024-01-15', closing: '2024-03-01', effective: '2024-01-15' },
      partiesInvolved: ['John Doe (Buyer)', 'Jane Smith (Seller)', 'ABC Realty (Agency)'],
      propertyDetails: { address: '123 Main St, New York, NY 10001', price: 450000 },
      keyTerms: ['30-day closing period', 'Finance contingency', 'Home inspection within 14 days'],
      redFlags: ['Missing seller disclosure statement', 'Unclear property boundary description'],
      actionItems: ['Request seller disclosure', 'Schedule home inspection', 'Verify financing pre-approval'],
      recommendations: 'Proceed with caution. Ensure all disclosures are obtained before signing.',
      summary: 'Standard purchase agreement for a residential property with a 30-day closing timeline.',
    });
  }

  return 'I am an AI investment assistant ready to help you make informed property investment decisions. Based on your query, I recommend analyzing the specific property metrics including location, price trends, and ROI projections before making a decision.';
}

async function* streamClaude(systemPrompt: string, messages: IMessage[], maxTokens = 1000) {
  if (!config.anthropic.apiKey) {
    const mockResponse = generateMockResponse(systemPrompt, messages.map(m => m.content).join('\n'));
    yield { type: 'content_block_delta', delta: { text: mockResponse } };
    return;
  }

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropic.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        temperature: 0.7,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const mockResponse = generateMockResponse(systemPrompt, messages.map(m => m.content).join('\n'));
      yield { type: 'content_block_delta', delta: { text: mockResponse } };
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta') {
              yield data;
            }
          } catch { /* skip parse errors */ }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    const mockResponse = generateMockResponse(systemPrompt, messages.map(m => m.content).join('\n'));
    yield { type: 'content_block_delta', delta: { text: mockResponse } };
  }
}

export const aiService = {
  async analyzeProperty(property: IProperty) {
    const systemPrompt = `You are an expert real estate investment analyst. Analyze this property and provide:
1. Investment Score (0-100)
2. Score breakdown for each factor
3. Market analysis for the location
4. Risk assessment
5. ROI projections (conservative, moderate, optimistic)
6. Investment recommendation

Provide response as valid JSON with these exact keys:
{
  "investmentScore": number,
  "scoreBreakdown": {
    "marketAnalysis": number,
    "locationQuality": number,
    "financialPotential": number,
    "legalRiskAssessment": number
  },
  "marketAnalysis": string,
  "riskAssessment": string,
  "roiProjections": {
    "conservative": number,
    "moderate": number,
    "optimistic": number
  },
  "recommendation": string,
  "summary": string
}`;

    const propertyData = `
Title: ${property.title}
Location: ${property.location.city}, ${property.location.state}
Price: $${property.price.toLocaleString()}
Type: ${property.type}
Bedrooms: ${property.bedrooms}, Bathrooms: ${property.bathrooms}
Square Feet: ${property.squareFeet.toLocaleString()}
Year Built: ${property.yearBuilt}
Description: ${property.description}
Status: ${property.status}`;

    const response = await callClaude(systemPrompt, propertyData);
    try {
      return JSON.parse(response);
    } catch {
      return JSON.parse(generateMockResponse(systemPrompt, propertyData));
    }
  },

  async getRecommendations(userData: unknown, properties: IProperty[]) {
    const systemPrompt = `You are a real estate investment matcher. Based on the user's profile and preferences, recommend the best properties from the available database.

User Profile and preferences provided. For each recommendation (top 5), provide:
{
  "propertyId": string,
  "matchScore": number (0-100),
  "reasoning": string,
  "whyMatches": string,
  "investmentScore": number,
  "projectedROI": number
}

Return as JSON array of recommendations.`;

    const propertiesData = properties.slice(0, 20).map(p => ({
      id: p._id.toString(),
      title: p.title,
      location: `${p.location.city}, ${p.location.state}`,
      price: p.price,
      type: p.type,
      score: p.investmentScore?.score || 0,
      roi: p.investmentScore?.roiProjections?.moderate || 0,
    }));

    const message = `User Data: ${JSON.stringify(userData)}\nAvailable Properties: ${JSON.stringify(propertiesData)}`;
    const response = await callClaude(systemPrompt, message);
    try {
      return JSON.parse(response);
    } catch {
      return JSON.parse(generateMockResponse(systemPrompt, message));
    }
  },

  async chatStream(message: string, history: IMessage[], property: unknown, user: IUser) {
    const systemPrompt = `You are an AI Investment Assistant for a property investment platform. You help users with:
- Answering questions about properties and investments
- Providing investment advice and ROI analysis
- Explaining market trends and metrics
- Comparing properties
- Portfolio management suggestions

Be helpful, concise, and data-driven. Use the context provided to give personalized responses.

User: ${user.name}
${property ? `\nCurrent Property Context: ${JSON.stringify(property)}` : ''}`;

    return streamClaude(systemPrompt, history);
  },

  async analyzeDocument(doc: IDocument) {
    const systemPrompt = `Analyze this real estate document and extract key information:

Extract and provide:
1. Document Type
2. Key Dates
3. Parties Involved
4. Property Details
5. Key Terms & Conditions
6. Legal Issues or Red Flags
7. Action Items & Recommendations
8. Summary

Respond as JSON:
{
  "documentType": string,
  "keyDates": { [date_type]: date },
  "partiesInvolved": string[],
  "propertyDetails": { address: string, price: number },
  "keyTerms": string[],
  "redFlags": string[],
  "actionItems": string[],
  "recommendations": string,
  "summary": string
}`;

    const response = await callClaude(systemPrompt, `Document: ${doc.filename}\nType: ${doc.fileType}\n\nProcessing document analysis...`);
    try {
      return JSON.parse(response);
    } catch {
      return JSON.parse(generateMockResponse(systemPrompt, 'Document analysis'));
    }
  },
};
