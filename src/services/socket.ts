export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private readonly baseDelay = 5000;
  private connecting = false;
  private authenticated = false;
  private token: string | null = null;
  private shouldReconnect = true; // ✅ Prevent unnecessary reconnections

  connect(token: string, contactId?: string) { // Accept `contactId`
    if (this.connecting || this.socket?.readyState === WebSocket.OPEN) {
      console.log("✅ WebSocket already connected or connecting.");
      return;
    }
  
    if (!token) {
      console.error("❌ Cannot connect to WebSocket: No token provided.");
      return;
    }
  
    if (!contactId) {
      console.error("❌ Cannot connect to WebSocket: No contact_id provided.");
      return;
    }
  
    this.token = token;
    this.connecting = true;
    console.log("🔄 Attempting to connect to WebSocket with contact:", contactId);
  
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  
    // ✅ Append `contact_id` to WebSocket URL
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/?token=${encodeURIComponent(token)}&contact=${contactId}`;
  
    this.socket = new WebSocket(wsUrl);
  
    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected Successfully.");
      this.reconnectAttempts = 0;
      this.connecting = false;
      this.authenticated = true;
    };
  
    this.socket.onerror = (event) => {
      console.error("⚠️ WebSocket Error:", event);
      this.connecting = false;
      this.authenticated = false;
    };
  
    this.socket.onclose = (event) => {
      console.log(`🚫 WebSocket Disconnected (Code: ${event.code}, Reason: ${event.reason})`);
  
      this.connecting = false;
      this.authenticated = false;
    };
  }
  

  sendMessage(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("🚫 Cannot send message: WebSocket is not connected.");
      return;
    }

    try {
      const message = {
        type: data.type || 'message',
        receiver: typeof data.receiver === 'string' ? parseInt(data.receiver) : data.receiver,
        content: data.content.trim(),
      };

      console.log("📤 Sending WebSocket message:", message);
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error("❌ Error sending WebSocket message:", error);
    }
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    console.log("🔌 Disconnecting WebSocket...");
    this.shouldReconnect = false; // Prevent reconnection after manual disconnect
    this.reconnectAttempts = this.maxReconnectAttempts; // Stop reconnection attempts

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.messageHandlers = [];
    this.connecting = false;
    this.authenticated = false;
  }
}

export const wsService = new WebSocketService();
