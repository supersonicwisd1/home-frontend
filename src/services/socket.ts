// src/services/socket.ts
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private readonly baseDelay = 5000;
  private connecting = false;
  private authenticated = false;
  private token: string | null = null;
  private shouldReconnect = true;
  private typingTimeout: number | null = null;

  connect(token: string, contactId?: string) {
    if (this.connecting || this.socket?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected or connecting.");
      return;
    }

    if (!token) {
      console.error("Cannot connect to WebSocket: No token provided.");
      return;
    }

    this.token = token;
    this.connecting = true;
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/?token=${encodeURIComponent(token)}${
      contactId ? `&contact_id=${contactId}` : ''
    }`;

    // console.log("Connecting to:", wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("WebSocket Connected Successfully");
      this.reconnectAttempts = 0;
      this.connecting = false;
      this.authenticated = true;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📥 Received message:", data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onerror = (event) => {
      console.error("WebSocket Error:", event);
      this.connecting = false;
      this.authenticated = false;
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket Disconnected (Code: ${event.code}, Reason: ${event.reason})`);
      this.connecting = false;
      this.authenticated = false;

      // Don't reconnect if it was manually closed or max attempts reached
      if (this.shouldReconnect && 
          this.reconnectAttempts < this.maxReconnectAttempts && 
          event.code !== 1000) {  // 1000 is normal closure
        const delay = this.baseDelay * Math.pow(1.5, this.reconnectAttempts);
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connect(this.token!, contactId), delay);
      }
    };
  }

  sendMessage(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket is not connected.");
      return;
    }

    try {
      const message = {
        type: data.type || 'message',
        receiver: typeof data.receiver === 'string' ? parseInt(data.receiver) : data.receiver,
        content: data.content.trim(),
        is_image: data.isImage || false,
        image_url: data.imageUrl || null
      };

      console.log("Sending message:", message);
      this.socket.send(JSON.stringify(message));

      // Set up a timeout to check if the connection was closed
      setTimeout(() => {
        if (this.socket?.readyState === WebSocket.CLOSED) {
          console.log("Connection closed after sending, attempting to reconnect...");
          this.connect(this.token!, message.receiver.toString());
        }
      }, 100);

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Attempt to reconnect if there was an error
      if (this.socket?.readyState !== WebSocket.OPEN) {
        console.log("Attempting to reconnect after error...");
        this.connect(this.token!, data.receiver.toString());
      }
    }
  }

  // Add a new method to check connection
  ensureConnection(contactId: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log("Ensuring WebSocket connection...");
      this.connect(this.token!, contactId);
    }
  }

  sendTypingStatus(receiverId: string | number, isTyping: boolean) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.sendMessage({
      type: 'typing',
      receiver: receiverId,
      is_typing: isTyping
    });

    if (isTyping) {
      this.typingTimeout = setTimeout(() => {
        this.sendTypingStatus(receiverId, false);
      }, 3000);
    }
  }

  markAsRead(senderId: string | number) {
    this.sendMessage({
      type: 'read',
      sender: senderId
    });
  }

  editMessage(messageId: string | number, content: string, receiverId: string | number) {
    this.sendMessage({
      type: 'edit',
      message_id: messageId,
      content: content,
      receiver: receiverId
    });
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    console.log("🔌 Disconnecting WebSocket...");
    this.shouldReconnect = false;
    this.reconnectAttempts = this.maxReconnectAttempts;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

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