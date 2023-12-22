export abstract class CommercetoolsError {
  [key: string]: any;
  statusCode: number | undefined;
  code: string | undefined;
  message: string | undefined;
  field: string | undefined;
  invalidValue: any;
  duplicateValue: any;
  conflictingResource: any;
  detailedErrorMessage: string | undefined;
  allowedValues: [any] | undefined;
  exceededResource: any;

  toJson() {
    const errorObject: { [index: string]: any } = {};
    Object.keys(this).forEach((key) => {
      if (this[key]) {
        errorObject[key] = this[key];
      }
    });
    return {
      statusCode: this.statusCode,
      message: this.message,
      errors: [errorObject],
    };
  }
}

export class InvalidJsonInput extends CommercetoolsError {
  statusCode = 400;
  code = "InvalidJsonInput";
  message = "Request body does not contain valid JSON.";
  constructor(detailedErrorMessage: string) {
    super();
    this.detailedErrorMessage = detailedErrorMessage;
  }
}

export class InvalidField extends CommercetoolsError {
  statusCode = 400;
  code = "InvalidField";
  message = "The value $invalidValue is not valid for field $field.";
  constructor(field: string, invalidValue: any, allowedValues: any) {
    super();
    this.field = field;
    this.invalidValue = invalidValue;
    this.allowedValues = allowedValues;
    this.message = `The value ${invalidValue} is not valid for field ${field}.`;
  }
}

export class InternalServerError extends CommercetoolsError {
  statusCode = 500;
  code = "General";
  message = "Write operations are temporarily unavailable";
  constructor(message: string = "") {
    super();
    if (message) this.message = message;
  }
}
