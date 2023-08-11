import { CircularSliderOptions } from './types';

export class CircularSlider {
  private readonly _container: HTMLElement;
  private readonly _radius: number;
  private readonly _min: number;
  private readonly _max: number;
  private readonly _step: number;
  private readonly _color: string;
  public label: string;

  private _value: number;
  private _angle: number = 0;
  private _dragging: boolean = false;

  constructor({
    container,
    radius,
    min,
    max,
    step,
    color,
    initialValue,
    label,
  }: CircularSliderOptions) {
    this._container = container;
    this._radius = radius ?? 100;
    this._min = min ?? 0;
    this._max = max ?? 100;
    this._step = step ?? 1;
    this._color = color ?? '#000';
    this._value = initialValue ?? this._min;
    this.label = label;

    this._init();
  }

  private _init() {
    this._render();
    this._bindEvents();
    this._update();
  }

  private _render() {}

  private _bindEvents() {}

  private _update() {}
}
