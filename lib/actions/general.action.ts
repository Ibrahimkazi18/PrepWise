'use server';

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewByUserId(userId : string) : Promise<Interview[] | null> {
    const interviews = await db.collection('interviews').where('userId', '==', userId).orderBy("createdAt", "desc").get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params : GetLatestInterviewsParams) : Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;
    
    const interviews = await db
        .collection('interviews')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getInterviewById(id : string) : Promise<Interview | null> {
    const interview = await db.collection('interviews').doc(id).get();

    return interview.data() as Interview;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript} = params

    try {
        const formattedTranscript = transcript
                                        .map((sentence : { role: string; content: string }) => (
                                            `- ${sentence.role}: ${sentence.content}\n`
                                        )).join('');
        
        const { object: {totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } =  await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
                You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                Transcript:
                ${formattedTranscript}

                Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                - **Communication Skills**: Clarity, articulation, structured responses.
                - **Technical Knowledge**: Understanding of key concepts for the role.
                - **Problem-Solving**: Ability to analyze problems and propose solutions.
                - **Cultural & Role Fit**: Alignment with company values and job role.
                - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
                `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        })                                        

        const feedback = await db.collection('feedback').add({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString(),
        })

        return {
            success: true,
            feedbackId: feedback.id,
        }
    } catch (error) {
        console.error("Error saving feedback: ", error);

        return {
            success: false,
            feedbackId: null,
        }
    }
}

export async function getFeedbackByInterviewid(params: GetFeedbackByInterviewIdParams): Promise<Feedback[] | null> {
    const { interviewId, userId } = params;
  
    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
  
    if (feedbackQuery.empty) return null;
  
    return feedbackQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  }

  export async function getFeedbackById(params: GetFeedbackByIdParams): Promise<Feedback | null> {
    const { feedbackId, userId } = params;
  
    try {
        const feedbackDoc = await db.collection("feedback").doc(feedbackId).get();

        if (!feedbackDoc.exists) {
            console.log(`Feedback with ID ${feedbackId} not found`);
            return null;
        }

        const feedbackData = feedbackDoc.data() as Feedback;
        if (feedbackData.userId !== userId) {
            console.log(`Access denied: Feedback ${feedbackId} does not belong to user ${userId}`);
            return null;
        }

        return {
            ...feedbackData,
        } as Feedback;
        
    } catch (error) {
        console.error(`Error fetching feedback by ID ${feedbackId}:`, error);
        return null;
    }
  }