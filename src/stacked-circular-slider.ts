import {
  CircularSliderCallbackOptions,
  CircularSliderOptions,
  StackCircularSliderOptions,
} from './types.ts';
import { createElementNS } from './util.ts';
import { CircularSlider } from './circular-slider.ts';

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

  private _render(sliders: CircularSliderOptions[]): void {
    sliders.forEach((slider) => {
      this.appendSlider(slider);
    });
  }

  private _createContainer(parent: Element, size: number = 500): SVGSVGElement {
    const svg = createElementNS('svg', {
      width: size,
      height: size,
    });

    parent.appendChild(svg);

    return svg;
  }

  private _createLegendList(): HTMLUListElement {
    const legendContainer = document.createElement('div');
    legendContainer.classList.add('legend');
    this._container.appendChild(legendContainer);

    const legendList = document.createElement('ul');
    legendList.classList.add('legend__list');
    legendContainer.appendChild(legendList);

    return legendList;
  }

  private _appendSliderToLegend(slider: CircularSlider): void {
    if (this._legendList) {
      const item = document.createElement('li');
      item.classList.add('legend__item');
      item.id = slider.getId();

      const itemValue = document.createElement('span');
      itemValue.classList.add('legend__item-value');
      itemValue.textContent = `$${slider.getValue()}`;
      item.appendChild(itemValue);

      const itemColor = document.createElement('span');
      itemColor.classList.add('legend__item-color');
      itemColor.style.backgroundColor = slider.getColor();
      item.appendChild(itemColor);

      const itemLabel = document.createElement('span');
      itemLabel.classList.add('legend__item-label');
      itemLabel.textContent = slider.label;
      item.appendChild(itemLabel);

      this._legendList.appendChild(item);
    }
  }

  public appendSlider(options: CircularSliderOptions): void {
    const updateLegendItem = (options: CircularSliderCallbackOptions) => {
      const { id, value } = options;
      const item = document.getElementById(id);
      const valueElement = item?.firstChild;

      if (valueElement) {
        valueElement.textContent = `$${value}`;
      }
    };

    const slider = new CircularSlider({
      ...options,
      container: this._svg,
      callback: updateLegendItem,
    });

    this._appendSliderToLegend(slider);
  }
}
