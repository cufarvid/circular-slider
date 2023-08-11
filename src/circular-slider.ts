import {
  ArcOptions,
  CircularSliderOptions,
  Coordinates,
  HandleOptions,
} from './types';
import { TAU } from './constants';
import {
  createElementNS,
  describeArc,
  getClientCoordinates,
  radiansToDegrees,
} from './util';

export class CircularSlider {
  private readonly _container: HTMLElement;
  private readonly _radius: number;
  private readonly _min: number;
  private readonly _max: number;
  private readonly _step: number;
  private readonly _color: string;
  private readonly _size: number;
  public label: string;

  private readonly _arcOptions: ArcOptions;
  private readonly _hadleOptions: HandleOptions;

  private _value: number;
  private _angle: number;
  private _dragging: boolean = false;
  private _startAngle: number = -Math.PI / 2;
  private readonly _coordinates: Coordinates = { x: 0, y: 0 };

  private _svg?: SVGSVGElement;
  private _handle?: SVGCircleElement;
  private _arc?: SVGPathElement;

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
    arcOptions,
    handleOptions,
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
    this._angle = this._getAngleForValue(this._value);
    this.label = label;

    this._arcOptions = arcOptions ?? new ArcOptions();
    this._hadleOptions = handleOptions ?? new HandleOptions();

    this._init();
  }

  private _init(): void {
    this._render();
    this._bindEvents();
    this._update();
  }

  private _render(): void {
    this._renderContainer();
    this._renderDashedCircle();
    this._renderArc();
    this._renderHandle();
  }

  private _renderContainer() {
    this._svg = createElementNS('svg', {
      width: this._size,
      height: this._size,
    });
    this._container.appendChild(this._svg);
  }

  private _renderDashedCircle(): void {
    const { chunkSize, width } = this._arcOptions;
    const circumference = TAU * this._radius;
    const chunkCount = Math.floor(circumference / chunkSize);
    const chunkAngle = TAU / chunkCount;

    const gap = chunkAngle * this._radius - chunkSize / 2;
    const dashArray = `${chunkSize} ${gap}`;
    const path = describeArc(this._coordinates, this._radius, 0, 360);

    this._svg?.appendChild(
      createElementNS('path', {
        d: path,
        fill: 'none',
        stroke: 'gray',
        'stroke-width': width,
        'stroke-dasharray': dashArray,
      }),
    );
  }

  private _renderArc(): void {
    const { width, opacity } = this._arcOptions;

    this._arc = createElementNS('path', {
      d: this._getArcPath(),
      fill: 'none',
      stroke: this._color,
      'stroke-width': width,
      opacity,
    });

    this._svg?.appendChild(this._arc);
  }

  private _renderHandle(): void {
    const { width, fillColor, strokeColor } = this._hadleOptions;

    this._handle = createElementNS('circle', {
      r: width / 1.5,
      fill: fillColor,
      stroke: strokeColor,
    });

    this._svg?.appendChild(this._handle);
  }

  private _getArcPath(): string {
    return describeArc(
      this._coordinates,
      this._radius,
      radiansToDegrees(this._startAngle),
      radiansToDegrees(this._angle),
    );
  }

  private _bindEvents(): void {
    const start = (event: MouseEvent | TouchEvent): void => {
      this._dragging = true;
      this._angle = this._recalculateAngle(event);
      document.addEventListener('mousemove', move);
      document.addEventListener('touchmove', move);
      document.addEventListener('mouseup', end);
      document.addEventListener('touchend', end);
    };

    const move = (event: MouseEvent | TouchEvent): void => {
      if (!this._dragging) return;
      this._angle = this._recalculateAngle(event);
      this._update();
    };

    const end = (): void => {
      this._dragging = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };

    this._handle?.addEventListener('mousedown', start);
    this._handle?.addEventListener('touchstart', start);
  }

  private _update(): void {
    const { x, y } = this._angleToCoordinates(this._angle);

    // Update handle position.
    this._handle?.setAttribute('cx', `${x}`);
    this._handle?.setAttribute('cy', `${y}`);

    // Update arc path.
    this._arc?.setAttribute('d', this._getArcPath());
  }

  private _recalculateAngle(event: MouseEvent | TouchEvent): number {
    const { x: centerX, y: centerY } = this._coordinates;
    const { x: startX, y: startY } = getClientCoordinates(event);

    const angle = Math.atan2(startY - centerY, startX - centerX);

    if (angle < this._startAngle) {
      return angle + TAU;
    }

    return angle;
  }

  private _getAngleForValue(value: number): number {
    const valueRange = this._max - this._min;
    const valueFraction = (value - this._min) / valueRange;

    return this._startAngle + TAU * valueFraction;
  }

  private _angleToCoordinates(angle: number): Coordinates {
    const { x, y } = this._coordinates;

    return {
      x: x + this._radius * Math.cos(angle),
      y: y + this._radius * Math.sin(angle),
    };
  }
}
