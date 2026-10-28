/**
 * @file supabaseSync.ts
 * @description Cloud persistence and synchronization service for ExploreX.
 * 
 * Data Architecture:
 * - Hybrid Cloud & In-Memory Fallback: Attempts to synchronize user state directly
 *   to Supabase PostgreSQL (`user_data` table). If Supabase credentials are not
 *   configured or the database is unreachable, the system transparently falls back to
 *   in-memory server caching and browser local storage, ensuring 100% offline availability.
 * - Single Payload Entity: All user relational entities (profile, trips, expenses, memories)
 *   are synced with atomic versioning under the user's normalized email address.
 */

import { UserProfile, Trip, Expense, Memory } from '../types';

/**
 * Data bundle representing the complete state of a user's account.
 */
export interface SyncPayload {
  /** User's primary email address (case-insensitive key) */
  email: string;
  /** User profile settings, preferred currency, travel pace */
  profile: UserProfile;
  /** List of created or saved trips with multi-day itineraries */
  trips: Trip[];
  /** Logged trip expenses for budget tracking */
  expenses: Expense[];
  /** AI-generated travel journals, social captions, and memories */
  memories: Memory[];
}

/**
 * Saves or upserts user data to the database via Express `/api/sync/save`.
 * 
 * @param {SyncPayload} payload - The complete user data package
 * @returns {Promise<{ success: boolean; storedIn?: string; note?: string }>} Sync outcome
 */
export async function saveUserDataToDatabase(payload: SyncPayload): Promise<{ success: boolean; storedIn?: string; note?: string }> {
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
    console.warn("[ExploreX Sync] Database background sync notice:", err);
  }
  return { success: false };
}

/**
 * Fetches user profile, trips, expenses, and memories by email.
 * 
 * @param {string} email - Target account email
 * @returns {Promise<{ source: 'supabase' | 'server_cache' | 'none'; data: any } | null>} Loaded data
 */
export async function fetchUserDataFromDatabase(email: string): Promise<{ source: string; data: any } | null> {
  try {
    const res = await fetch(`/api/sync/user/${encodeURIComponent(email)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[ExploreX Sync] Database load notice:", err);
  }
  return null;
}

/**
 * Inspects live Supabase PostgreSQL connection status and checks if the 'user_data' table exists.
 * 
 * @returns {Promise<{ connected: boolean; tableReady?: boolean; message?: string }>} Health details
 */
export async function checkSupabaseStatus(): Promise<{ connected: boolean; tableReady?: boolean; message?: string }> {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[ExploreX Sync] Supabase status check error:", err);
  }
  return { connected: false, message: "Could not reach sync endpoint" };
}
