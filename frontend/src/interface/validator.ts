import { MessageManager } from "@/service/message";

export type Failure = {
    summary: string;
    detail: string;
};

export abstract class PyValidator {
    constructor(protected messageManager: MessageManager) {}

    abstract collectProblems(): Failure[];

    isValid(): boolean {
        return this.collectProblems().length === 0;
    }

    validate(): boolean {
        const problems = this.collectProblems();

        if (problems.length === 0) {
            return true;
        } else {
            // todo // this.messageFailures(problems);
            return false;
        }
    }

    sendMessageIfFail(formatResult: Failure | true): void {
        if (formatResult !== true) {
            this.messageManager.sendError(formatResult.summary, formatResult.detail);
        }
    }
}