import { Response } from 'express';

class SseManager {
    private clients: { id: number; res: Response }[] = [];

    constructor() {
        // Start heartbeat to keep connections alive
        setInterval(() => this.sendHeartbeat(), 30000);
    }

    // Add a new client connection
    addClient(id: number, res: Response) {
        this.clients.push({ id, res });
        console.log(`✅ SSE Client Connected: Admin ${id}. Total clients: ${this.clients.length}`);

        // Remove client when connection closes
        res.on('close', () => {
            this.clients = this.clients.filter(client => client.res !== res);
            console.log(`❌ SSE Client Disconnected: Admin ${id}. Remaining: ${this.clients.length}`);
        });
    }

    // Broadcast an event to all connected clients
    broadcast(type: string, data: any) {
        if (this.clients.length === 0) return;

        console.log(`📢 Broadcasting '${type}' to ${this.clients.length} clients.`);
        this.clients.forEach(client => {
            try {
                client.res.write(`event: ${type}\n`);
                client.res.write(`data: ${JSON.stringify(data)}\n\n`);
            } catch (error) {
                console.error(`Error sending to client ${client.id}:`, error);
            }
        });
    }

    // Send a message to a specific admin (optional, for future use)
    sendToAdmin(adminId: number, type: string, data: any) {
        const client = this.clients.find(c => c.id === adminId);
        if (client) {
            try {
                client.res.write(`event: ${type}\n`);
                client.res.write(`data: ${JSON.stringify(data)}\n\n`);
            } catch (error) {
                console.error(`Error sending to admin ${adminId}:`, error);
            }
        }
    }

    private sendHeartbeat() {
        if (this.clients.length === 0) return;
        this.clients.forEach(client => {
            // SSE comment for keep-alive
            client.res.write(': keep-alive\n\n');
        });
    }
}

export const sseManager = new SseManager();
