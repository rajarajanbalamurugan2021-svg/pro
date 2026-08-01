import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

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

// AI Project Title & Abstract Generator API
app.post('/api/ai/suggest-project', async (req, res) => {
  try {
    const { domain, problemStatement, department } = req.body || {};

    if (!ai) {
      return res.json({
        title: `Smart ${domain || 'Campus'} Innovation Platform`,
        abstract: `An advanced AI-driven research and execution system addressing ${problemStatement || 'university project collaboration challenges'}. Features real-time tracking, skill matching, and faculty co-piloting.`,
        suggestedCategory: 'AI & Machine Learning',
        tags: ['AI', 'React', 'Node.js', 'Tailwind', 'REST API'],
        requiredSkills: ['React.js', 'TypeScript', 'Node.js', 'Python', 'Database Systems'],
        estimatedInnovationScore: 88,
        suggestedMilestones: [
          'Requirement Analysis & Architecture Blueprint',
          'Database Schema & API Gateway Setup',
          'Frontend Interface & Component Assembly',
          'Faculty Review & User Testing',
          'Final Deployment & Certification'
        ]
      });
    }

    const prompt = `You are a Senior Academic Research Director. Generate a high-impact student project idea proposal based on:
Domain/Topic: ${domain || 'Software Engineering'}
Problem Statement: ${problemStatement || 'Optimizing team formation and project tracking'}
Department: ${department || 'Computer Science & Engineering'}

Return JSON:
title: catchy innovation project title
abstract: concise 3-4 sentence academic abstract
suggestedCategory: one of ["AI & Machine Learning", "Web & Mobile Apps", "IoT & Robotics", "Cybersecurity", "Cloud & DevOps", "Blockchain & Fintech", "Biomedical & Health Tech", "Renewable Energy"]
tags: array of 4-6 strings
requiredSkills: array of 4-6 technical skills required
estimatedInnovationScore: integer between 75 and 98
suggestedMilestones: array of 4-5 milestone title strings`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            abstract: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedInnovationScore: { type: Type.NUMBER },
            suggestedMilestones: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['title', 'abstract', 'suggestedCategory', 'tags', 'requiredSkills', 'estimatedInnovationScore', 'suggestedMilestones']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-project:', error);
    res.json({
      title: 'Autonomous Campus AI Assistant & Task Automator',
      abstract: 'A full-stack collaborative system designed to streamline student projects and faculty evaluations using structured workflow states.',
      suggestedCategory: 'AI & Machine Learning',
      tags: ['AI', 'Automation', 'FullStack'],
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL'],
      estimatedInnovationScore: 85,
      suggestedMilestones: [
        'System Requirement Specification',
        'Backend Microservices Development',
        'UI Dashboard Implementation',
        'Faculty Evaluation & Demo'
      ]
    });
  }
});

// AI Teammate Matching API
app.post('/api/ai/match-teammates', async (req, res) => {
  try {
    const { requiredSkills, candidateStudents } = req.body || {};

    if (!ai) {
      const scored = (candidateStudents || []).map((student: any) => {
        const studentSkills = student.skills || [];
        const matches = requiredSkills.filter((sk: string) =>
          studentSkills.some((s: string) => s.toLowerCase().includes(sk.toLowerCase()))
        );
        const matchPercent = Math.min(98, Math.max(50, Math.round((matches.length / (requiredSkills.length || 1)) * 100) + 30));
        return {
          studentId: student.id,
          studentName: student.name,
          matchPercentage: matchPercent,
          matchedSkills: matches.length > 0 ? matches : ['Problem Solving', 'Teamwork'],
          recommendationReason: `Strong background in ${student.department} with relevant skills.`
        };
      });
      return res.json({ matches: scored });
    }

    const prompt = `Evaluate these candidate students against project required skills: ${JSON.stringify(requiredSkills)}.
Candidates: ${JSON.stringify(candidateStudents)}.
For each candidate, calculate matchPercentage (0-100), list matchedSkills, and provide a 1-sentence recommendationReason explaining why they fit the team.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  studentId: { type: Type.STRING },
                  studentName: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendationReason: { type: Type.STRING }
                },
                required: ['studentId', 'studentName', 'matchPercentage', 'matchedSkills', 'recommendationReason']
              }
            }
          },
          required: ['matches']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/ai/match-teammates:', error);
    res.json({ matches: [] });
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
