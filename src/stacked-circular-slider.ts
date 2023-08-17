import {
  CircularSliderCallbackOptions,
  CircularSliderOptions,
  StackCircularSliderOptions,
} from './types.ts';
import { createElementNS } from './util.ts';
import { CircularSlider } from './circular-slider.ts';

/**
 * Represents a stacked circular slider control.
 */
export class StackedCircularSlider {
  private readonly _container: Element;
  private readonly _svg: SVGSVGElement;
  private readonly _legendList: HTMLUListElement;

  constructor({ container, size, sliders }: StackCircularSliderOptions) {
    this._container = container;
    this._legendList = this._createLegendList();
    this._svg = this._createContainer(container, size);

    this._render(sliders);
  }

  /**
   * Renders the stacked circular sliders.
   *
   * @param {CircularSliderOptions[]} sliders The options for individual circular sliders.
   */
  private _render(sliders: CircularSliderOptions[]): void {
    sliders.forEach((slider) => {
      this.appendSlider(slider);
    });

    this._renderInstructions();
  }

  /**
   * Creates an SVG container and appends it to the provided parent.
   *
   * @param {Element} parent The parent element to append the container to.
   * @param {number} [size=350] The size of the SVG container.
   *
   * @returns {SVGSVGElement} The created SVG container.
   */
  private _createContainer(parent: Element, size: number = 350): SVGSVGElement {
    const container = document.createElement('div');
    container.classList.add('container');

    const svg = createElementNS('svg', {
      width: size,
      height: size,
    });

    container.appendChild(svg);
    parent.appendChild(container);

    return svg;
  }

  /**
   * Renders instructions for the stacked circular sliders.
   */
  private _renderInstructions(): void {
    const instructions = document.createElement('div');
    instructions.classList.add('instructions');
    instructions.textContent = 'Adjust dial to enter expenses';

    this._container.appendChild(instructions);
  }

  /**
   * Creates a legend list and appends it to the container.
   *
   * @returns {HTMLUListElement} The created legend list.
   */
  private _createLegendList(): HTMLUListElement {
    const legendContainer = document.createElement('div');
    legendContainer.classList.add('legend');
    this._container.appendChild(legendContainer);

    const legendList = document.createElement('ul');
    legendList.classList.add('legend__list');
    legendContainer.appendChild(legendList);

    return legendList;
  }

  /**
   * Updates the legend item with the provided id and value.
   *
   * @param {CircularSliderCallbackOptions} options - Options containing id and value of the legend item.
   */
  private _updateLegendItem(options: CircularSliderCallbackOptions): void {
    const { id, value } = options;
    const item = document.getElementById(id);

    if (!item) return;

    const valueElement = item.querySelector('.legend__item-value');
    if (valueElement) {
      valueElement.textContent = `$${value}`;
    }
  }

  /**
   * Appends a circular slider to the legend.
   *
   * @param {CircularSlider} slider The circular slider to append.
   */
  private _appendSliderToLegend(slider: CircularSlider): void {
    const item = document.createElement('li');
    item.classList.add('legend__item');
    item.id = slider.getId();

    item.innerHTML = `
      <span class="legend__item-value">$${slider.getValue()}</span>
      <span class="legend__item-color" style="background-color: ${slider.getColor()}"></span>
      <span class="legend__item-label">${slider.label}</span>
    `;

    this._legendList.appendChild(item);
  }

  /**
   * Appends a circular slider to the legend and initializes its update behavior.
   *
   * @param {CircularSliderOptions} options - The options for the circular slider.
   */
  public appendSlider(options: CircularSliderOptions): void {
    const slider = new CircularSlider({
      ...options,
      container: this._svg,
      callback: this._updateLegendItem,
    });

    this._appendSliderToLegend(slider);
  }
}
