import { useState, useEffect } from 'react';

export const useWaitingRoom = (eventId: string) => {
  const [status, setStatus] = useState<'not_in_queue' | 'waiting' | 'active'>('active'); // Default to active for demo
  const [position, setPosition] = useState<number | null>(null);
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>('mock-user-id');

  const joinQueue = async () => {
    // Simulate joining queue
    setStatus('waiting');
    setPosition(10);
    setEstimatedWait(30);

    // Simulate queue progress
    let currentPosition = 10;
    const interval = setInterval(() => {
      currentPosition -= 2;
      setPosition(Math.max(1, currentPosition));
      
      if (currentPosition <= 0) {
        clearInterval(interval);
        setStatus('active');
      }
    }, 1000);
  };

  return { status, position: position || 0, estimatedWait: estimatedWait || 0, joinQueue, userId };
};
