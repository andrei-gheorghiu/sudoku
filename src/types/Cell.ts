import { ICell } from './index'

export class Cell implements ICell {
  private _data!: ICell;

  constructor (data: ICell | Cell) {
    if (data instanceof Cell) return data
    this._data = Object.assign({}, data)
  }

  get index () {
    return this._data.x + this._data.y * 9
  }

  get x () {
    return this._data.x
  }

  get y () {
    return this._data.y
  }

  get value () {
    return this._data.value
  }

  set value (val) {
    this._data.value = val
  }

  get fixed () {
    return !!this._data.fixed
  }

  set fixed (val) {
    this._data.fixed = !!val
  }

  get lit () {
    return this._data.lit
  }

  set lit (val) {
    this._data.lit = val
  }

  get marks () {
    return this._data.marks || []
  }

  set marks (value) {
    this._data.marks = value
  }

  mark (n: number) {
    this._data.marks = this.marks.includes(n)
      ? this.marks.filter(o => o !== n)
      : [...this.marks, n]
  }
}
