const { cos, sin } = Math;
export type PolarCoordinates = {
  r: number;
  theta: number;
};
export type XYCoordinates = {
  x: number;
  y: number;
};

export function polar2XY({ r, theta }: PolarCoordinates): XYCoordinates {
  return {
    x: r * cos(theta),
    y: r * sin(theta)
  };
}

export const applyScale =
  (scale: number) =>
    ({ x, y }: XYCoordinates) => ({ x: x * scale, y: y * scale });
