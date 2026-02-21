
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-button')
export class UIButton extends LitElement {
  static styles = css`
    button {
      background: var(--color-primary);
      color: white;
      border-radius: 6px;
      padding: 8px 12px;
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}
