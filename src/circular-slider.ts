import { CircularSliderOptions, Coordinates } from './types';
import { createElementNS, describeArc } from './util';

export class CircularSlider {
  private readonly _container: HTMLElement;
  private readonly _radius: number;
  private readonly _min: number;
  private readonly _max: number;
  private readonly _step: number;
  private readonly _color: string;
  private readonly _size: number;
  public label: string;

  private _value: number;
  private _angle: number = 0;
  private _dragging: boolean = false;
  private _coordinates: Coordinates = { x: 0, y: 0 };

  private _svg?: SVGSVGElement;
  private _handle?: SVGCircleElement;

  constructor({
    container,
    radius,
    min,
    max,
    step,
    color,
    initialValue,
    label,
    size,
  }: CircularSliderOptions) {
    this._container = container;
    this._radius = radius ?? 100;
    this._min = min ?? 0;
    this._max = max ?? 100;
    this._step = step ?? 1;
    this._color = color ?? '#000';
    this._size = size ?? 500;
    this._coordinates = { x: this._size / 2, y: this._size / 2 };

    this._value = initialValue ? Math.min(initialValue, this._max) : this._min;
    this.label = label;

    this._init();
  }

  private _init(): void {
    this._render();
    this._bindEvents();
    this._update();
  }

  private _render(): void {
    // Create the SVG container.
    this._svg = createElementNS('svg', {
      width: this._size,
      height: this._size,
    });
    this._container.appendChild(this._svg);

    const { x, y } = this._coordinates;
    const path = describeArc(x, y, this._radius, 0, 360);
    // Create the outer circle.
    const strip = createElementNS('path', {
      d: path,
      fill: 'none',
      stroke: this._color,
      'stroke-width': 20,
    });
    this._svg.appendChild(strip);

    // Create the handle.
    this._handle = createElementNS('circle', {
      r: 10,
      fill: 'white',
    });
    this._svg.appendChild(this._handle);
  }

  private _bindEvents() {}

  private _update() {}
}
