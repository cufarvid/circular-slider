export interface CircularSliderOptions {
  container?: Element;
  label: string;
  radius: number;
  min?: number;
  max?: number;
  step?: number;
  color: string;
  initialValue?: number;
  size?: number;
  arcOptions?: ArcOptions;
  handleOptions?: HandleOptions;
  onChange?: (options: CircularSliderCallbackOptions) => void;
}

export interface CircularSliderCallbackOptions {
  id: string;
  value: number;
}

export interface StackCircularSliderOptions {
  container: Element;
  size?: number;
  sliders: CircularSliderOptions[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export class ArcOptions {
  chunkSize: number = 5;
  width: number = 20;
  opacity: number = 0.8;
}

export class HandleOptions {
  width: number = 20;
  fillColor: string = 'white';
  strokeColor: string = 'black';
}

export type SVGElementAttribute =
  | 'd'
  | 'fill'
  | 'height'
  | 'r'
  | 'stroke'
  | 'stroke-width'
  | 'width'
  | 'opacity'
  | 'stroke-dasharray';
