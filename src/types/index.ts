export interface ICell {
  x: number;
  y: number;
  value: null | number;
  marks?: number[];
  fixed?: boolean;
  lit?: boolean;
}

export * from './Cell'
