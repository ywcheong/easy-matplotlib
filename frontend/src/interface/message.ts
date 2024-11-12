export interface MessageChannel {
    sendSuccess(summary: string, detail: string): void;
    sendInfo(summary: string, detail: string): void;
    sendWarning(summary: string, detail: string): void;
    sendError(summary: string, detail: string): void;
}