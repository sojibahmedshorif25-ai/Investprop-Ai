import { Request, Response, NextFunction } from 'express';
import { Property } from '../models/Property';
import { ChatConversation } from '../models/ChatConversation';
import { DocumentModel } from '../models/Document';
import { Preference } from '../models/Preference';
import { aiService } from '../services/ai.service';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth';

export const analyzeProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) {
      throw ApiError.notFound('Property not found');
    }

    const analysis = await aiService.analyzeProperty(property);

    property.investmentScore = {
      ...analysis,
      generatedAt: new Date(),
      generatedBy: 'Claude 3.5 Sonnet',
    };
    await property.save();

    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const preferences = await Preference.findOne({ user: (req as AuthRequest).user!._id });
    const userProperties = await Property.find({ owner: (req as AuthRequest).user!._id });
    const allProperties = await Property.find({
      owner: { $ne: (req as AuthRequest).user!._id },
      'investmentScore.score': { $exists: true },
    }).limit(50);

    const recommendations = await aiService.getRecommendations(
      { preferences: preferences?.toObject(), portfolio: userProperties },
      allProperties
    );

    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message, conversationId, propertyContext } = req.body;

    let conversation;
    if (conversationId) {
      conversation = await ChatConversation.findOne({ _id: conversationId, user: (req as AuthRequest).user!._id });
      if (!conversation) {
        throw ApiError.notFound('Conversation not found');
      }
    } else {
      conversation = await ChatConversation.create({
        user: (req as AuthRequest).user!._id,
        messages: [],
        title: message.substring(0, 50),
      });
    }

    let propertyData = null;
    if (propertyContext) {
      propertyData = await Property.findById(propertyContext);
    }

    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
      propertyContext: propertyContext || undefined,
    };

    conversation.messages.push(userMessage);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await aiService.chatStream(
      message,
      conversation.messages.slice(-10),
      propertyData,
      (req as AuthRequest).user!
    );

    let fullResponse = '';
    for await (const chunk of stream) {
      if ('type' in chunk && chunk.type === 'content_block_delta' && 'delta' in chunk) {
        const text = (chunk.delta as { text?: string }).text || '';
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    conversation.messages.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });

    await conversation.save();
    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const analyzeDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { documentId } = req.body;
    const doc = await DocumentModel.findOne({ _id: documentId, user: (req as AuthRequest).user!._id });
    if (!doc) {
      throw ApiError.notFound('Document not found');
    }

    const analysis = await aiService.analyzeDocument(doc);
    doc.analysis = { ...analysis, generatedAt: new Date() };
    await doc.save();

    res.json({ success: true, message: 'Document analyzed', data: { documentId: doc._id } });
  } catch (error) {
    next(error);
  }
};

export const getDocumentAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await DocumentModel.findOne({ _id: req.params.id, user: (req as AuthRequest).user!._id });
    if (!doc) {
      throw ApiError.notFound('Document not found');
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
