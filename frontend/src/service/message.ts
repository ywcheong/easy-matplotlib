
import toasteventbus from 'primevue/toasteventbus'

import { type MessageChannel } from '@/interface/message'

export class DirectToastMessageChannel implements MessageChannel {
    sendSuccess(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'success', summary: summary, detail: detail, life: 3000 })
    }

    sendInfo(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'info', summary: summary, detail: detail, life: 3000 })
    }

    sendWarning(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'warn', summary: summary, detail: detail, life: 3000 })
    }

    sendError(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'error', summary: summary, detail: detail, life: 3000 })
    }
}

export class ConsoleMessageChannel implements MessageChannel {
    sendSuccess(summary: string, detail: string): void {
        console.log(`[Success] ${summary} => ${detail}`)
    }
    
    sendInfo(summary: string, detail: string): void {
        console.info(`[Info] ${summary} => ${detail}`)
    }
    
    sendWarning(summary: string, detail: string): void {
        console.warn(`[Warn] ${summary} => ${detail}`)
    }
    
    sendError(summary: string, detail: string): void {
        console.error(`[Error] ${summary} => ${detail}`)
    }
}

export class MessageManager {
    private channels: MessageChannel[] = [];

    addChannel(channel: MessageChannel): void {
        this.channels.push(channel);
    }

    removeChannel(channel: MessageChannel): void {
        const index = this.channels.indexOf(channel);
        if (index >= 0) {
            this.channels.splice(index, 1);
        }
    }

    sendSuccess(summary: string, detail: string): void {
        this.channels.forEach(channel => channel.sendSuccess(summary, detail));
    }

    sendInfo(summary: string, detail: string): void {
        this.channels.forEach(channel => channel.sendInfo(summary, detail));
    }
    
    sendWarning(summary: string, detail: string): void {
        this.channels.forEach(channel => channel.sendWarning(summary, detail));
    }
    
    sendError(summary: string, detail: string): void {
        this.channels.forEach(channel => channel.sendError(summary, detail));
    }
}