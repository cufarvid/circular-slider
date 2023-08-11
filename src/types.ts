export interface CircularSliderOptions {
  container: HTMLElement;
  label: string;
  radius?: number;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  initialValue?: number;
  size?: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type SVGElementAttribute =
  | 'd'
  | 'fill'
  | 'height'
  | 'r'
  | 'stroke'
  | 'stroke-width'
  | 'width';
