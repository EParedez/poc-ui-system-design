
import { Component } from '@angular/core';

@Component({
  selector: 'ui-button-wrapper',
  template: '<ui-button><ng-content></ng-content></ui-button>'
})
export class ButtonComponent {}
