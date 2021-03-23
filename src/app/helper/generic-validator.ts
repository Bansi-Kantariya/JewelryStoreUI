import { FormGroup } from '@angular/forms';

export class GenericValidator {

  constructor(private valudationMessage : { [key : string] :{ [key : string] : string}}){

  }

  processMessages(container : FormGroup) : {[key : string] : string} {
    const messages: { [x: string]: string; } = {};
    for (const controlKey in container.controls){
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        if(this.valudationMessage[controlKey]){
          messages[controlKey] = '';
          if((c.touched || c.dirty) && c.errors) {
            Object.keys(c.errors).map(messageKey => {
              if (this.valudationMessage[controlKey][messageKey]) {
                messages[controlKey] += this.valudationMessage[controlKey][messageKey] + ' ';
              }
            })
          }
        }
      }
    }
    return messages;
  }

  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        if (c.errors) {
          errorCount += Object.keys(c.errors).length;
          console.log(errorCount);
        }
      }
    }
    return errorCount;
  }
}
