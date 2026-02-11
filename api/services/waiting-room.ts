import { v4 as uuidv4 } from 'uuid';

interface QueueItem {
  userId: string;
  eventId: string;
  timestamp: number;
}

interface ActiveSession {
  userId: string;
  eventId: string;
  expiresAt: number;
}

// In-memory simulation of Redis/Queue
// In production, this MUST be replaced by Redis
class WaitingRoomState {
  private static queues: Record<string, QueueItem[]> = {};
  private static activeSessions: Record<string, ActiveSession> = {};
  
  // Config
  private static MAX_ACTIVE_USERS_PER_EVENT = 5; // Low number for demo purposes
  private static SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

  static joinQueue(eventId: string, userId: string) {
    if (!this.queues[eventId]) {
      this.queues[eventId] = [];
    }

    // Check if already in queue
    const existingIndex = this.queues[eventId].findIndex(item => item.userId === userId);
    if (existingIndex !== -1) {
      return { position: existingIndex + 1, status: 'waiting' };
    }

    // Check if already has active session
    if (this.hasActiveSession(eventId, userId)) {
      return { position: 0, status: 'active' };
    }

    // Add to queue
    this.queues[eventId].push({
      userId,
      eventId,
      timestamp: Date.now()
    });

    return { position: this.queues[eventId].length, status: 'waiting' };
  }

  static getStatus(eventId: string, userId: string) {
    // Check active session
    if (this.hasActiveSession(eventId, userId)) {
      return { position: 0, status: 'active', message: 'You are in!' };
    }

    // Check queue position
    if (!this.queues[eventId]) {
      return { position: null, status: 'not_in_queue' };
    }

    const index = this.queues[eventId].findIndex(item => item.userId === userId);
    if (index === -1) {
      return { position: null, status: 'not_in_queue' };
    }

    // Process queue (simplified logic)
    // If position is within the allowed active slots (conceptually)
    // Here we just move people from queue to active if there's space
    this.processQueue(eventId);

    // Check again if they became active
    if (this.hasActiveSession(eventId, userId)) {
      return { position: 0, status: 'active', message: 'You are in!' };
    }

    // Re-calculate position after processing
    const newIndex = this.queues[eventId].findIndex(item => item.userId === userId);
    return { position: newIndex + 1, status: 'waiting', estimatedWait: (newIndex + 1) * 2 }; // 2 min per person dummy
  }

  private static processQueue(eventId: string) {
    const activeCount = Object.values(this.activeSessions).filter(s => s.eventId === eventId).length;
    const availableSlots = this.MAX_ACTIVE_USERS_PER_EVENT - activeCount;

    if (availableSlots > 0 && this.queues[eventId]?.length > 0) {
      const toPromote = this.queues[eventId].splice(0, availableSlots);
      
      toPromote.forEach(item => {
        const sessionId = uuidv4();
        this.activeSessions[sessionId] = {
          userId: item.userId,
          eventId: item.eventId,
          expiresAt: Date.now() + this.SESSION_DURATION_MS
        };
        // For simple lookup by user/event, we might need a better structure, 
        // but for now we iterate or assume userId is unique enough for the demo
      });
    }
  }

  private static hasActiveSession(eventId: string, userId: string): boolean {
    // Cleanup expired first
    const now = Date.now();
    for (const [id, session] of Object.entries(this.activeSessions)) {
      if (session.expiresAt < now) {
        delete this.activeSessions[id];
      }
    }

    return Object.values(this.activeSessions).some(
      s => s.eventId === eventId && s.userId === userId
    );
  }
}

export const WaitingRoomService = WaitingRoomState;
