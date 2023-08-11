import { Coordinates, SVGElementAttribute } from './types';

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): Coordinates {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const fullCircle = endAngle - startAngle === 360;
  const start = polarToCartesian(x, y, radius, endAngle - 0.01);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

  // prettier-ignore
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    fullCircle ? 'Z' : '',
  ].join(' ');
}

export function createElementNS<K extends keyof SVGElementTagNameMap>(
  qualifiedName: K,
  attributes: { [key in SVGElementAttribute]?: string | number },
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    qualifiedName,
  );

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value.toString());
  }

  return element;
}
