import { type MessageChannel } from '@/interface/message'

export class ConsoleMessageChannel implements MessageChannel {
    async sendSuccess(summary: string, detail: string) {
        console.log(`[Success] ${summary} => ${detail}`)
    }
    
    async sendInfo(summary: string, detail: string) {
        console.info(`[Info] ${summary} => ${detail}`)
    }
    
    async sendWarning(summary: string, detail: string) {
        console.warn(`[Warn] ${summary} => ${detail}`)
    }
    
    async sendError(summary: string, detail: string) {
        console.error(`[Error] ${summary} => ${detail}`)
    }
}

export class MessageManager {
    private channels: MessageChannel[] = [];

    async addChannel(channel: MessageChannel) {
        this.channels.push(channel);
    }

    async sendSuccess(summary: string, detail: string) {
        this.channels.map(channel => channel.sendSuccess(summary, detail));
    }

    async sendInfo(summary: string, detail: string) {
        this.channels.map(channel => channel.sendInfo(summary, detail));
    }
    
    async sendWarning(summary: string, detail: string) {
        this.channels.map(channel => channel.sendWarning(summary, detail));
    }
    
    async sendError(summary: string, detail: string) {
        this.channels.map(channel => channel.sendError(summary, detail));
    }
}
