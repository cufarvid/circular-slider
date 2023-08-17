import { Coordinates, SVGElementAttribute } from './types';

/**
 * Converts polar coordinates to Cartesian coordinates.
 *
 * @param {Coordinates} coordinates The center of the Cartesian coordinate system.
 * @param {number} radius The radial distance from the center point.
 * @param {number} angleInDegrees The angle in degrees.
 *
 * @returns {Coordinates} The Cartesian coordinates.
 */
export function polarToCartesian(
  coordinates: Coordinates,
  radius: number,
  angleInDegrees: number,
): Coordinates {
  const { x, y } = coordinates;
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: x + radius * Math.cos(angleInRadians),
    y: y + radius * Math.sin(angleInRadians),
  };
}

/**
 * Creates an SVG path description for an arc.
 *
 * @param {Coordinates} coordinates The center of the arc.
 * @param {number} radius The radius of the arc.
 * @param {number} startAngle The starting angle in degrees.
 * @param {number} endAngle The ending angle in degrees.
 *
 * @returns {string} The SVG path description.
 */
export function describeArc(
  coordinates: Coordinates,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const fullCircle = endAngle - startAngle === 360;
  const start = polarToCartesian(coordinates, radius, endAngle - 0.01);
  const end = polarToCartesian(coordinates, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

  // prettier-ignore
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    fullCircle ? 'Z' : '',
  ].join(' ');
}

/**
 * Creates an SVG element with specified attributes.
 *
 * @template K SVG element tag name.
 * @param {K} qualifiedName The SVG element tag name.
 * @param {Object.<SVGElementAttribute, string | number>} attributes The attributes of the element.
 *
 * @returns {SVGElementTagNameMap[K]} The created SVG element.
 */
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

/**
 * Converts radians to degrees.
 *
 * @param {number} radians - The angle in radians.
 *
 * @returns {number} The angle in degrees.
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI + 90;
}

/**
 * Retrieves client coordinates from mouse or touch events.
 *
 * @param {MouseEvent | TouchEvent} event The event containing client coordinates.
 *
 * @returns {Coordinates} The client coordinates.
 */
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
