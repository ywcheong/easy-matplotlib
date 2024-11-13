import { type MessageChannel } from '@/interface/message'
import toasteventbus from 'primevue/toasteventbus'

export class DirectToastMessageChannel implements MessageChannel {
    private static commonParams = {
        life: 3000,
    }

    sendSuccess(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'success', summary, detail, ...DirectToastMessageChannel.commonParams })
    }

    sendInfo(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'info', summary, detail, ...DirectToastMessageChannel.commonParams })
    }

    sendWarning(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'warn', summary, detail, ...DirectToastMessageChannel.commonParams })
    }

    sendError(summary: string, detail: string): void {
        toasteventbus.emit('add', { severity: 'error', summary, detail, ...DirectToastMessageChannel.commonParams })
    }
}