import { User, CollabEvent } from '../types';

type Listener = (event: CollabEvent) => void;

const CURSOR_COLORS = [
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
];

class CollaborationService {
  private listeners: Listener[] = [];
  private connected = false;
  private mockIntervals: number[] = [];
  private channel: BroadcastChannel | null = null;
  public sessionId = Math.random().toString(36).substr(2, 9);

  connect(user: User, docId: string) {
    if (this.connected) return;
    this.connected = true;
    
    // Assign a consistent color to the local user based on session/random
    const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    const userWithColor = { ...user, color };

    // Simulate WebSocket connection using BroadcastChannel for cross-tab sync
    this.channel = new BroadcastChannel(`tmcp_collab_${docId}`);
    
    this.channel.onmessage = (ev) => {
      this.notify(ev.data);
    };

    console.log(`[Collaboration] Connected to doc ${docId} as ${user.name} (${this.sessionId})`);
    
    // Broadcast join to other tabs
    this.send({ type: 'user_joined', user: userWithColor });
    
    // Simulate remote activity (Bots) to demonstrate real-time features
    this.startSimulation();
  }

  disconnect() {
    this.connected = false;
    
    if (this.channel) {
      // Broadcast leave
      this.send({ type: 'user_left', userId: 'self' });
      this.channel.close();
      this.channel = null;
    }

    this.mockIntervals.forEach(id => clearTimeout(id));
    this.mockIntervals = [];
    this.listeners = [];
    console.log('[Collaboration] Disconnected');
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Mimic WebSocket.send()
  send(event: CollabEvent) {
    if (!this.connected || !this.channel) return;
    
    // Attach session ID to distinguish tabs
    const eventWithSession = { ...event, sessionId: this.sessionId };
    this.channel.postMessage(eventWithSession);
  }

  private notify(event: CollabEvent) {
    this.listeners.forEach(l => l(event));
  }

  private startSimulation() {
    const mockUser: User = {
      id: 'u2',
      name: 'Sarah Mensah',
      role: 'Editor',
      email: 'sarah@techbridge.edu.gh',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mensah&background=random',
      color: '#8b5cf6' // Violet
    };

    const mockUser2: User = {
      id: 'u3',
      name: 'David Ofori',
      role: 'Creator',
      email: 'david@techbridge.edu.gh',
      avatar: 'https://ui-avatars.com/api/?name=David+Ofori&background=random',
      color: '#10b981' // Emerald
    };

    // 1. Sarah joins
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ type: 'user_joined', user: mockUser, sessionId: 'bot-1' });
    }, 2000));

    // 2. Sarah types a sentence character by character
    const sentence = " I think we should emphasize the impact of AI on local agriculture.";
    let charIndex = 0;
    
    this.mockIntervals.push(window.setTimeout(() => {
      const typingInterval = window.setInterval(() => {
        if (charIndex >= sentence.length) {
          clearInterval(typingInterval);
          return;
        }
        
        const char = sentence[charIndex];
        // Simulate append at "end" (position -1 or large number in simplistic logic, 
        // but here we rely on the editor handling 'insert' at explicit position or end)
        // We'll use a high position to signify 'append' for simplicity in this mock, 
        // or the editor's length if we could read it. 
        // Since we can't read editor state here easily, we'll assume the editor handles 
        // high position as append.
        
        this.notify({ 
          type: 'text_update', 
          userId: mockUser.id, 
          sessionId: 'bot-1',
          text: char, 
          position: 10000, // Append
          action: 'insert'
        });
        
        // Update cursor to end
        this.notify({
          type: 'cursor_move',
          userId: mockUser.id,
          position: 10000 + charIndex, // Mock position
          sessionId: 'bot-1'
        });

        charIndex++;
      }, 100); // Fast typing
      
      this.mockIntervals.push(typingInterval);
    }, 4000));

    // 3. David joins later
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ type: 'user_joined', user: mockUser2, sessionId: 'bot-2' });
    }, 8000));

     // 4. David pastes a chunk
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ 
        type: 'text_update', 
        userId: mockUser2.id, 
        sessionId: 'bot-2',
        text: '\n\nDavid: Agreed. Including the AgTech photos.', 
        position: 20000,
        action: 'insert'
      });
       this.notify({
        type: 'cursor_move',
        userId: mockUser2.id,
        position: 20050,
        sessionId: 'bot-2'
      });
    }, 12000));
  }
}

export const collaborationService = new CollaborationService();