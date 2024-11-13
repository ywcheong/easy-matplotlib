import { MessageManager } from "@/service/message";

// export class ValidationFailure extends Error {
//     constructor(public summary: string, public detail: string) {
//         super(summary);
//         this.name = "Failure";
//     }
// }

/**
 * Abstract class representing a Python validator.
 * 
 * @remarks
 * This class should be extended to create specific validators.
 * 
 * @param messageManager - An instance of MessageManager used to handle error messages.
 * 
 * @method validate
 * This method should be implemented by subclasses to perform validation.
 * 
 * @returns A promise that resolves if validation is successful, or rejects if validation fails.
 * 
 * @sideEffect For every validation failure, an error message is pushed to the messageManager.
 */
export abstract class PyValidator {
    constructor(protected messageManager: MessageManager) {}
    abstract validate(): Promise<boolean>;
}