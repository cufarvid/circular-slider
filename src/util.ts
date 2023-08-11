import { Coordinates, SVGElementAttribute } from './types';

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

export function describeArc(
  coordinates: Coordinates,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const { x, y } = coordinates;
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

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI + 90;
}

export function getClientCoordinates(
  event: MouseEvent | TouchEvent,
): Coordinates {
  if (event instanceof MouseEvent) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  return {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
}
