import { CircularSliderOptions, StackCircularSliderOptions } from './types.ts';
import { createElementNS } from './util.ts';
import { CircularSlider } from './circular-slider.ts';

export class StackedCircularSlider {
  private readonly _container: SVGSVGElement;

  constructor({ container, size, sliders }: StackCircularSliderOptions) {
    this._container = this._createContainer(container, size);

    this._render(sliders);
  }

  private _createContainer(parent: Element, size: number = 500): SVGSVGElement {
    const svg = createElementNS('svg', {
      width: size,
      height: size,
    });

    parent.appendChild(svg);

    return svg;
  }

  private _render(sliders: CircularSliderOptions[]): void {
    sliders.forEach((slider) => {
      this.appendSlider(slider);
    });
  }

  public appendSlider(options: CircularSliderOptions): void {
    new CircularSlider({
      ...options,
      container: this._container,
    });
  }
}
