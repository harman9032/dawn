if (!customElements.get('sticky-add-to-cart')) {
  customElements.define(
    'sticky-add-to-cart',
    class StickyAddToCart extends HTMLElement {
      constructor() {
        super();
        this.onIntersect = this.onIntersect.bind(this);
        this.onVariantChange = this.onVariantChange.bind(this);
        this.onDocumentChange = this.onDocumentChange.bind(this);
        this.hideTimeout = null;
        this.unsubscribeVariantChange = null;
        this.observer = null;
      }

      connectedCallback() {
        this.target = document.getElementById(this.dataset.target);
        if (!this.target) return;

        this.sectionId = this.dataset.section;
        this.variantInput = this.querySelector('input[name="id"]');
        this.priceElement = this.querySelector('.sticky-atc__price');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton ? this.submitButton.querySelector('span') : null;

        if ('IntersectionObserver' in window) {
          this.observer = new IntersectionObserver(this.onIntersect, { threshold: 0 });
          this.observer.observe(this.target);
        }

        if (
          typeof PUB_SUB_EVENTS !== 'undefined' &&
          PUB_SUB_EVENTS.variantChange &&
          typeof subscribe === 'function'
        ) {
          this.unsubscribeVariantChange = subscribe(PUB_SUB_EVENTS.variantChange, this.onVariantChange);
        }

        document.addEventListener('change', this.onDocumentChange);
      }

      disconnectedCallback() {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        if (this.unsubscribeVariantChange) {
          this.unsubscribeVariantChange();
          this.unsubscribeVariantChange = null;
        }
        document.removeEventListener('change', this.onDocumentChange);
        clearTimeout(this.hideTimeout);
      }

      /* ---------------------------------------------------------------- */
      /* Visibility                                                        */
      /* ---------------------------------------------------------------- */

      onIntersect(entries) {
        entries.forEach((entry) => {
          if (entry.target !== this.target) return;

          if (entry.isIntersecting) {
            this.hide();
            return;
          }

          // Only show once the user has scrolled *past* the buy button
          // (button is above the viewport), not while it is still below the fold.
          if (entry.boundingClientRect.top < 0) {
            this.show();
          } else {
            this.hide();
          }
        });
      }

      show() {
        clearTimeout(this.hideTimeout);
        if (this.classList.contains('sticky-atc--visible')) return;

        this.removeAttribute('hidden');
        // Force a reflow so the slide-in transition runs after `hidden` is removed.
        // eslint-disable-next-line no-unused-expressions
        this.offsetHeight;
        window.requestAnimationFrame(() => {
          this.classList.add('sticky-atc--visible');
        });
      }

      hide() {
        if (this.hasAttribute('hidden')) return;

        this.classList.remove('sticky-atc--visible');
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
          if (!this.classList.contains('sticky-atc--visible')) {
            this.setAttribute('hidden', '');
          }
        }, 300);
      }

      /* ---------------------------------------------------------------- */
      /* Variant sync                                                      */
      /* ---------------------------------------------------------------- */

      // Payload published by product-info.js:
      // { data: { sectionId, html, variant } }
      onVariantChange(event) {
        const data = event && event.data ? event.data : null;
        if (!data) return;
        if (data.sectionId && this.sectionId && data.sectionId !== this.sectionId) return;

        const variant = data.variant;
        if (!variant) {
          this.setUnavailable();
          return;
        }

        this.setVariantId(variant.id);
        this.syncPrice();
        this.setAvailability(Boolean(variant.available) && !this.targetIsDisabled());
      }

      // Fallback: react to native change events from the main product form.
      // product-info.js dispatches `change` on the main form's input[name="id"]
      // after it has updated the value, and variant-selects fire change on
      // user interaction.
      onDocumentChange(event) {
        const target = event.target;
        if (!target || this.contains(target)) return;

        const isVariantSelect = typeof target.closest === 'function' && target.closest('variant-selects');
        const isMainVariantInput =
          target.matches &&
          target.matches('input[name="id"]') &&
          typeof target.closest === 'function' &&
          target.closest(`#product-form-${this.sectionId}`);

        if (!isVariantSelect && !isMainVariantInput) return;

        // Defer one frame so product-info.js has finished toggling the main
        // submit button before we mirror its state.
        window.requestAnimationFrame(() => this.syncFromMainForm());
      }

      syncFromMainForm() {
        const mainForm = document.getElementById(`product-form-${this.sectionId}`);
        const mainInput = mainForm ? mainForm.querySelector('input.product-variant-id, input[name="id"]') : null;
        const variantId = mainInput ? mainInput.value : '';

        if (!variantId) {
          this.setUnavailable();
          return;
        }

        this.setVariantId(variantId);
        this.syncPrice();

        const disabled = this.targetIsDisabled();
        const targetText = this.target.querySelector('span');
        this.setAvailability(!disabled, disabled && targetText ? targetText.textContent.trim() : undefined);
      }

      setVariantId(variantId) {
        if (!this.variantInput) return;
        this.variantInput.value = variantId ?? '';
        this.variantInput.disabled = false;
      }

      syncPrice() {
        if (!this.priceElement || !this.sectionId) return;
        const source = document.getElementById(`price-${this.sectionId}`);
        if (!source) return;
        this.priceElement.innerHTML = source.innerHTML;
        this.priceElement.classList.toggle('hidden', source.classList.contains('hidden'));
      }

      setAvailability(available, disabledText) {
        if (!this.submitButton) return;
        const strings = window.variantStrings || {};

        if (available) {
          this.submitButton.removeAttribute('disabled');
          this.submitButton.removeAttribute('aria-disabled');
          if (this.submitButtonText) {
            this.submitButtonText.textContent = strings.addToCart || this.dataset.addToCart || 'Add to cart';
          }
        } else {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (this.submitButtonText) {
            this.submitButtonText.textContent =
              disabledText || strings.soldOut || this.dataset.soldOut || 'Sold out';
          }
        }
      }

      setUnavailable() {
        const strings = window.variantStrings || {};
        if (this.variantInput) this.variantInput.value = '';
        if (this.priceElement) this.priceElement.classList.add('hidden');
        this.setAvailability(false, strings.unavailable || this.dataset.unavailable || 'Unavailable');
      }

      targetIsDisabled() {
        return Boolean(this.target && this.target.hasAttribute('disabled'));
      }
    }
  );
}
