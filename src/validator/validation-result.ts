export class ValidationResult {
  #errorMessages: string[] = [];

  isValid() {
    return this.#errorMessages.length === 0;
  }

  putError(msg: string) {
    this.#errorMessages.push(msg);
  }

  getMessage(): string {
    return this.#errorMessages.join('\n');
  }

  static valid(): ValidationResult {
    return new ValidationResult();
  }
}
