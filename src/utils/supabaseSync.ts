import { UserProfile, Trip, Expense, Memory } from '../types';

export interface SyncPayload {
  email: string;
  profile: UserProfile;
  trips: Trip[];
  expenses: Expense[];
  memories: Memory[];
}

export async function saveUserDataToDatabase(payload: SyncPayload): Promise<{ success: boolean; storedIn?: string }> {
  try {
    const res = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Database sync background notice:", err);
  }
  return { success: false };
}

export async function fetchUserDataFromDatabase(email: string): Promise<{ source: string; data: any } | null> {
  try {
    const res = await fetch(`/api/sync/user/${encodeURIComponent(email)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Database load notice:", err);
  }
  return null;
}

export async function checkSupabaseStatus(): Promise<{ connected: boolean; tableReady?: boolean; message?: string }> {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Supabase check error:", err);
  }
  return { connected: false, message: "Could not reach sync endpoint" };
}
