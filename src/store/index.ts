import { createStore } from 'vuex'
import { Cell, ICell } from '@/types'

export interface State {
  inputMode: boolean;
  hoveredValue: number;
  cells: Cell[],
  groups: number[][]
}

const cellGroups = {
  h: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35], [36, 37, 38, 39, 40, 41, 42, 43, 44], [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62], [63, 64, 65, 66, 67, 68, 69, 70, 71], [72, 73, 74, 75, 76, 77, 78, 79, 80]
  ],
  v: [
    [0, 9, 18, 27, 36, 45, 54, 63, 72], [1, 10, 19, 28, 37, 46, 55, 64, 73], [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75], [4, 13, 22, 31, 40, 49, 58, 67, 76], [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78], [7, 16, 25, 34, 43, 52, 61, 70, 79], [8, 17, 26, 35, 44, 53, 62, 71, 80]
  ],
  s: [
    [0, 1, 2, 9, 10, 11, 18, 19, 20], [27, 28, 29, 36, 37, 38, 45, 46, 47], [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [3, 4, 5, 12, 13, 14, 21, 22, 23], [30, 31, 32, 39, 40, 41, 48, 49, 50], [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [6, 7, 8, 15, 16, 17, 24, 25, 26], [33, 34, 35, 42, 43, 44, 51, 52, 53], [60, 61, 62, 69, 70, 71, 78, 79, 80]
  ]
}

export const store = createStore<State>({
  state: {
    inputMode: true,
    hoveredValue: 0,
    cells: [...new Array(81).keys()]
      .map((_, k) => new Cell({
        value: null,
        x: (k + 9) % 9,
        y: Math.floor(k / 9)
      })),
    groups: Object.values(cellGroups).flat()
  },
  mutations: {
    setHoveredValue (state, value) {
      state.hoveredValue = value
    },
    setCells (state, cells) {
      cells.forEach((cell: ICell) => {
        state.cells[cell.x + cell.y * 9].fixed = true
        state.cells[cell.x + cell.y * 9].value = cell.value
      })
    },
    setCellValue (state, { index, value }) {
      state.cells[index].value = value
    },
    reset (state) {
      state.cells.forEach(cell => {
        cell.value = null
      })
    },
    markCandidates (state, { candidates, value }) {
      state.cells.forEach((cell, index) => {
        const a = candidates.includes(index)
        const b = !cell.marks.includes(value)
        if ((a && b) || !(a || b)) {
          cell.mark(value)
          console.log(index, value, cell.marks)
        }
      })
    },
    setInputMode (state, value) {
      state.inputMode = value
    }
  },
  actions: {
    placeMarks ({ getters, state, commit, dispatch }, value) {
      const candidates = state.cells.filter(c =>
        !c.value && !getters.siblings(c.x, c.y).map((c: Cell) => c.value).includes(value)
      ).map(c => state.cells.findIndex(cell => cell === c))
      const group = state.groups.find(g => g.filter(cellIndex => candidates.includes(cellIndex)).length === 1)
      if (group) {
        const index = candidates.find(cellIndex => group.includes(cellIndex))
        if (index) {
          commit('setCellValue', { index, value })
          dispatch('placeMarks', value)
        }
      } else {
        commit('markCandidates', { candidates, value })
      }
    }
  },
  getters: {
    siblings: (state): (x: number, y: number) => Cell[] => (x, y) => state.cells.filter(
      c =>
        c.x === x ||
        c.y === y ||
        (
          Math.floor(c.x / 3) === Math.floor(x / 3) &&
          Math.floor(c.y / 3) === Math.floor(y / 3)
        )
    )
  },
  modules: {}
})

export type StoreType = typeof store;
