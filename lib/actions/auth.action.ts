'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already existing. Please sign in instead'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: 'User created successfully. Please Sign In.'
        }

    } catch(error: any){
        console.error("Error creating user ", error);

        if(error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email already in use.'
            }
        }

        return {
            success: false,
            message: 'Error creating user.'
        }
    }
}

export async function setSessionCookie (idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 7 * 1000});

    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
        return { 
            success: true, 
            message: 'Signed in successfully' 
        };

    } catch (error) {
        console.error("Error signing in ", error);

        return {
            success: false,
            message: 'Error signing in.'
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists){
            return null;
        }

        return {
            id: userRecord.id,
            ...userRecord.data(),
        } as User;
    }
    catch(error: any){
        console.error("Error getting current user ", error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}