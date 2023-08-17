import {
  ArcOptions,
  CircularSliderCallbackOptions,
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

/**
 * Represents a circular slider control.
 */
export class CircularSlider {
  private readonly _container: Element;
  private readonly _radius: number;
  private readonly _min: number;
  private readonly _max: number;
  private readonly _step: number;
  private readonly _color: string;
  private readonly _size: number;
  public label: string;

  private readonly _arcOptions: ArcOptions;
  private readonly _handleOptions: HandleOptions;
  private readonly _onChange?: (options: CircularSliderCallbackOptions) => void;
  private readonly _id: string;

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
    onChange,
  }: CircularSliderOptions) {
    if (!container) throw new Error('Container element not found!');

    this._container = container;
    this._radius = radius;
    this._min = min ?? 0;
    this._max = max ?? 100;
    this._step = step ?? 1;
    this._color = color;
    this._size = size ?? 350;
    this._coordinates = { x: this._size / 2, y: this._size / 2 };

    this._value = initialValue ? Math.min(initialValue, this._max) : this._min;
    this._angle = this._getAngleForValue(this._value);
    this.label = label;

    this._arcOptions = arcOptions ?? new ArcOptions();
    this._handleOptions = handleOptions ?? new HandleOptions();
    this._onChange = onChange;

    this._id = Math.random().toString(36).substring(2, 9);

    this._init();
  }

  /**
   * Initialize the slider: render UI, bind events, and update state.
   */
  private _init(): void {
    this._render();
    this._bindEvents();
    this._update();
  }

  /**
   * Renders the slider's elements.
   */
  private _render(): void {
    this._renderContainer();
    this._renderDashedCircle();
    this._renderArc();
    this._renderHandle();
  }

  /**
   * Binds event listeners to relevant elements.
   */
  private _bindEvents(): void {
    this._bindUIInteractions();
    this._bindDocumentInteractions();
  }

  /**
   * Retrieves the unique identifier of the circular slider instance.
   *
   * @returns {string} The unique identifier.
   */
  public getId(): string {
    return this._id;
  }

  /**
   * Retrieves the current value of the circular slider.
   *
   * @returns {number} The current value.
   */
  public getValue(): number {
    return this._value;
  }

  /**
   * Retrieves the color of the circular slider.
   *
   * @returns {string} The color.
   */
  public getColor(): string {
    return this._color;
  }

  /**
   * Render the container SVG element.
   */
  private _renderContainer(): void {
    this._svg = createElementNS('svg', {
      width: this._size,
      height: this._size,
    });
    this._container.appendChild(this._svg);
  }

  /**
   * Renders the dashed circle background.
   */
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

  /**
   * Renders the colored arc representing the selected value.
   */
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

  /**
   * Renders the draggable handle element.
   */
  private _renderHandle(): void {
    const { width, fillColor, strokeColor } = this._handleOptions;

    this._handle = createElementNS('circle', {
      r: width / 1.5,
      fill: fillColor,
      stroke: strokeColor,
    });

    this._svg?.appendChild(this._handle);
  }

  /**
   * Retrieves the SVG path for the current arc.
   *
   * @returns {string} The SVG path.
   */
  private _getArcPath(): string {
    return describeArc(
      this._coordinates,
      this._radius,
      radiansToDegrees(this._startAngle),
      radiansToDegrees(this._angle),
    );
  }

  /**
   * Binds UI interaction event listeners.
   */
  private _bindUIInteractions(): void {
    this._handle?.addEventListener('mousedown', () => this._startDragging());
    this._handle?.addEventListener('touchstart', () => this._startDragging());
    this._svg?.addEventListener('click', (e) => this._onClick(e));
  }

  /**
   * Binds document interaction event listeners.
   */
  private _bindDocumentInteractions(): void {
    document.addEventListener('mousemove', (e) => this._onMove(e));
    document.addEventListener('touchmove', (e) => this._onMove(e));
    document.addEventListener('mouseup', () => this._endDragging());
    document.addEventListener('touchend', () => this._endDragging());
  }

  /**
   * Starts the dragging interaction.
   */
  private _startDragging(): void {
    this._dragging = true;
  }

  /**
   * Ends the dragging interaction.
   */
  private _endDragging(): void {
    this._dragging = false;
  }

  /**
   * Handles the click event on the slider.
   *
   * @param {MouseEvent | TouchEvent} event The click event.
   */
  private _onClick(event: MouseEvent | TouchEvent): void {
    this._recalculateAngle(event);
    this._recalculateValue();
    this._update();
  }

  /**
   * Handles the move event during dragging.
   *
   * @param {MouseEvent | TouchEvent} event The move event.
   */
  private _onMove(event: MouseEvent | TouchEvent): void {
    if (!this._dragging) return;
    this._recalculateAngle(event);
    this._recalculateValue();
    this._update();
  }

  /**
   * Updates the circular slider's appearance and value.
   */
  private _update(): void {
    const { x, y } = this._angleToCoordinates(this._angle);

    // Update handle position.
    this._handle?.setAttribute('cx', `${x}`);
    this._handle?.setAttribute('cy', `${y}`);

    // Update arc path.
    this._arc?.setAttribute('d', this._getArcPath());

    // Execute callback with new value.
    this._onChange?.({ id: this.getId(), value: this._value });
  }

  /**
   * Recalculates the angle based on mouse or touch event.
   *
   * @param {MouseEvent | TouchEvent} event The event triggering the recalculation.
   */
  private _recalculateAngle(event: MouseEvent | TouchEvent): void {
    const { x: centerX, y: centerY } = this._coordinates;
    const { x: startX, y: startY } = getClientCoordinates(event);
    const { left, top } = this._container.getBoundingClientRect();

    const angle = Math.atan2(startY - centerY - top, startX - centerX - left);

    this._angle = angle < this._startAngle ? angle + TAU : angle;
  }

  /**
   * Recalculates the value based on the current angle.
   */
  private _recalculateValue(): void {
    const angleDifference = this._angle - this._startAngle;
    const anglePerStep = TAU / ((this._max - this._min) / this._step);
    const numberOfSteps = Math.round(angleDifference / anglePerStep);
    const newValue = this._min + numberOfSteps * this._step;

    this._value = Math.max(this._min, Math.min(this._max, newValue));
  }

  /**
   * Converts a value to an angle for rendering.
   *
   * @param {number} value The value to convert.
   *
   * @returns {number} The angle in radians.
   */
  private _getAngleForValue(value: number): number {
    const valueRange = this._max - this._min;
    const valueFraction = (value - this._min) / valueRange;

    return this._startAngle + TAU * valueFraction;
  }

  /**
   * Converts an angle to coordinates for rendering.
   *
   * @param {number} angle - The angle in radians.
   *
   * @returns {Coordinates} The corresponding coordinates.
   */
  private _angleToCoordinates(angle: number): Coordinates {
    const { x, y } = this._coordinates;

    return {
      x: x + this._radius * Math.cos(angle),
      y: y + this._radius * Math.sin(angle),
    };
  }
}
