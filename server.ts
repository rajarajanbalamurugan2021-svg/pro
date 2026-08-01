import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Smart Campus Management System',
    geminiConnected: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

// AI Chatbot API
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const lastUserMessage = messages[messages.length - 1]?.content || 'Hello';

    if (!ai) {
      return res.json({
        reply: `Hello ${userContext?.name || 'Student'}! I am the Smart Campus Assistant. How can I help you navigate your results, complaints, attendance, or campus events today?`
      });
    }

    const systemInstruction = `You are "Campus AI", the intelligent virtual assistant for Smart Campus Management System.
User Context: Name=${userContext?.name || 'User'}, Role=${userContext?.role || 'student'}, Department=${userContext?.department || 'General'}.
Provide helpful, concise, academic, and friendly answers regarding GPA/CGPA calculations, reporting complaints, submitting leave applications, mentor meetings, lab attendance requirements (minimum 75%), or campus events.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: lastUserMessage,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({
      reply: response.text || "I'm sorry, I couldn't process that request at the moment."
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      reply: 'An error occurred while connecting to the AI service. Please try again.'
    });
  }
});

// AI Complaint Classifier API
app.post('/api/ai/classify-complaint', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!ai) {
      return res.json({
        category: 'Infrastructure',
        priority: 'Medium',
        suggestedDept: 'Estate Maintenance Division',
        estimatedResolutionHours: 24,
        aiAnalysis: 'Complaint automatically flagged for standard campus facility review.'
      });
    }

    const prompt = `Analyze this university campus complaint and return JSON with classification fields.
Complaint Title: ${title}
Complaint Description: ${description}

Return JSON with:
category: one of ["Infrastructure", "Hostel", "Academic", "IT & Wi-Fi", "Library", "Transport", "Other"]
priority: one of ["Low", "Medium", "High", "Critical"]
suggestedDept: specific department responsible
estimatedResolutionHours: number
aiAnalysis: brief explanation of priority & cause`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            suggestedDept: { type: Type.STRING },
            estimatedResolutionHours: { type: Type.NUMBER },
            aiAnalysis: { type: Type.STRING }
          },
          required: ['category', 'priority', 'suggestedDept', 'estimatedResolutionHours', 'aiAnalysis']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/classify-complaint:', error);
    res.json({
      category: 'Infrastructure',
      priority: 'Medium',
      suggestedDept: 'General Campus Helpdesk',
      estimatedResolutionHours: 24,
      aiAnalysis: 'Automatic fallback routing applied.'
    });
  }
});

// AI Result Predictor API
app.post('/api/ai/predict-result', async (req, res) => {
  try {
    const { studentResult, targetSemester } = req.body;

    if (!ai) {
      const currentCgpa = studentResult?.cgpa || 8.5;
      return res.json({
        predictedSGPA: Math.min(10, +(currentCgpa * 1.03).toFixed(2)),
        predictedCGPA: currentCgpa,
        keyFocusSubjects: ['Core Algorithms', 'Embedded Systems'],
        recommendations: [
          'Maintain a minimum 85% attendance across lab courses.',
          'Solve previous 5 semester question papers from Collaboration Hub.'
        ]
      });
    }

    const prompt = `Student Current CGPA: ${studentResult?.cgpa}, Current SGPA: ${studentResult?.sgpa}, Semester: ${studentResult?.semester}.
Target Semester: ${targetSemester}.
Current Subject Performance: ${JSON.stringify(studentResult?.subjects || [])}.

Provide an academic performance forecast and actionable grade improvement plan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedSGPA: { type: Type.NUMBER },
            predictedCGPA: { type: Type.NUMBER },
            keyFocusSubjects: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['predictedSGPA', 'predictedCGPA', 'keyFocusSubjects', 'recommendations']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/ai/predict-result:', error);
    const { studentResult } = req.body || {};
    res.json({
      predictedSGPA: 8.8,
      predictedCGPA: studentResult?.cgpa || 8.5,
      keyFocusSubjects: ['Core Engineering Modules'],
      recommendations: ['Focus on internal practical assessments and continuous revision.']
    });
  }
});

// AI Attendance Analyzer API
app.post('/api/ai/analyze-attendance', async (req, res) => {
  try {
    const { attendanceData } = req.body || {};

    if (!ai) {
      return res.json({
        riskLevel: (attendanceData?.percentage || 80) < 75 ? 'HIGH_RISK' : 'SAFE',
        classesNeededToReach75: (attendanceData?.percentage || 80) < 75 ? 5 : 0,
        summary: `Attendance is at ${attendanceData?.percentage || 80}%. Maintain consistent presence.`
      });
    }

    const prompt = `Analyze student attendance data: Total Classes=${attendanceData?.totalClasses}, Attended=${attendanceData?.attendedClasses}, Percentage=${attendanceData?.percentage}%.
Subject breakdown: ${JSON.stringify(attendanceData?.subjectWise || [])}.
Provide risk assessment and exact action required if percentage is below 75%.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            classesNeededToReach75: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ['riskLevel', 'classesNeededToReach75', 'summary']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-attendance:', error);
    const { attendanceData } = req.body || {};
    res.json({
      riskLevel: (attendanceData?.percentage || 80) < 75 ? 'HIGH_RISK' : 'SAFE',
      classesNeededToReach75: (attendanceData?.percentage || 80) < 75 ? 4 : 0,
      summary: 'Attendance review complete.'
    });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Campus Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
