import { mediaQueryLarge, isMobileBreakpoint } from '@theme/utilities';

class AccordionCustom extends HTMLElement {
  get details() {
    const details = this.querySelector('details');
    if (!(details instanceof HTMLDetailsElement)) throw new Error('Details element not found');
    return details;
  }

  get summary() {
    const summary = this.details.querySelector('summary');
    if (!(summary instanceof HTMLElement)) throw new Error('Summary element not found');
    return summary;
  }

  get #disableOnMobile() { return this.dataset.disableOnMobile === 'true'; }
  get #disableOnDesktop() { return this.dataset.disableOnDesktop === 'true'; }
  get #closeWithEscape()  { return this.dataset.closeWithEscape === 'true'; }

  #controller = new AbortController();
  #groupRoot = null;

  connectedCallback() {
    const { signal } = this.#controller;

    this.#groupRoot =
      this.closest('.shopify-section') ||
      this.closest('[data-accordion-group]') ||
      this.parentElement;

    this.#setDefaultOpenState();
    this.#enforceSingleOpen();

    this.addEventListener('keydown', this.#handleKeyDown, { signal });
    this.summary.addEventListener('click', this.handleClick, { signal });
    mediaQueryLarge.addEventListener('change', this.#handleMediaQueryChange, { signal });

    this.details.addEventListener('toggle', this.#handleToggle, { signal });
  }

  disconnectedCallback() { this.#controller.abort(); }

  handleClick = (event) => {
    const isMobile = isMobileBreakpoint();
    const isDesktop = !isMobile;
    if ((isMobile && this.#disableOnMobile) || (isDesktop && this.#disableOnDesktop)) {
      event.preventDefault();
      return;
    }
  };

  #handleMediaQueryChange = () => {
    this.#setDefaultOpenState();
    this.#enforceSingleOpen();
  };

  #setDefaultOpenState() {
    const isMobile = isMobileBreakpoint();
    this.details.open =
      (isMobile && this.hasAttribute('open-by-default-on-mobile')) ||
      (!isMobile && this.hasAttribute('open-by-default-on-desktop'));
  }

  #handleToggle = () => {
    if (this.details.open) this.#closeSiblings();
  };

  #closeSiblings() {
    if (!this.#groupRoot) return;
    const nodes = this.#groupRoot.querySelectorAll('accordion-custom');
    nodes.forEach((el) => {
      if (el !== this) {
        const d = el.querySelector('details');
        if (d && d.open) d.open = false;
      }
    });
  }

  #enforceSingleOpen() {
    if (this.details.open) this.#closeSiblings();
  }

  #handleKeyDown(event) {
    if (event.key === 'Escape' && this.#closeWithEscape) {
      event.preventDefault();
      this.details.open = false;
      this.summary.focus();
    }
  }
}

if (!customElements.get('accordion-custom')) {
  customElements.define('accordion-custom', AccordionCustom);
}
