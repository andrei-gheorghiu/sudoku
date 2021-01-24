<template>
  <div class="container">
    <div class="d-flex justify-content-center mb-5"
         @click.capture.prevent="inputMode = !inputMode ">
      <div class="switch-container d-flex align-items-center p-3">
        <div class="mr-3">Marks</div>
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="marking"
                 v-model="inputMode">
          <label class="custom-control-label" for="marking">Values</label>
        </div>
      </div>
    </div>
    <div class="board">
      <cell-record v-for="(cell, key) in cells"
                   :key="key"
                   :cell="cell"
                   :hovered-mark="getHoveredMark(cell)"
                   :class="{ lit: hoveredValue === cell.value, highlight: cell.lit }"
                   @mouseenter="onMouseEnter(cell)"
                   @mouseleave="onMouseLeave"
                   @mark="mark($event, cell)"
                   @valueClick="onValueClick(cell)"
      ></cell-record>
    </div>
    <div class="d-flex justify-content-center mt-5">
      <div class="btn-group btn-group-lg">
        <button v-for="key in 9"
                :key="key"
                class="btn"
                :class="inputMode && (activeValue !== key)? 'btn-outline-dark' : 'btn-dark'"
                @click="onBottomRowClick(key)">{{ key }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { UnwrapRef } from '@vue/reactivity'
import gameData from '@/assets/data.json'
import CellRecord from './CellRecord.vue'
import { Cell } from '@/types'
import { StoreType } from '@/store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SudokuBoard',
  components: {
    CellRecord
  },
  setup () {
    const store: StoreType = useStore()
    const inputMode = computed({
      get (): boolean {
        return store.state.inputMode
      },
      set (value) {
        store.commit('setInputMode', value)
      }
    })
    const activeValue = computed((): number => store.state.activeValue)
    const hoveredValue = computed((): number => store.state.hoveredValue)
    const cells = computed((): Cell[] => store.state.cells)

    const onMouseEnter = (cell: UnwrapRef<Cell>) => {
      setHoveredValue(cell.value || 0)
      cellSiblings(cell).forEach(c => { c.lit = true })
    }
    const setHoveredValue = (value: number) => {
      store.commit('setHoveredValue', value)
    }
    const onMouseLeave = () => {
      store.commit('setHoveredValue', 0)
      cells.value.forEach(c => { c.lit = false })
    }
    const cellSiblings = (cell: UnwrapRef<Cell>) => cells.value.filter(
      c =>
        c.x === cell.x ||
        c.y === cell.y ||
        (
          Math.floor(c.x / 3) === Math.floor(cell.x / 3) &&
          Math.floor(c.y / 3) === Math.floor(cell.y / 3)
        )
    )
    const getHoveredMark = (cell: UnwrapRef<Cell>) => {
      return hoveredValue.value && !cell.value
        ? !cells.value
          .filter(c => c.value === hoveredValue.value)
          .map(c => cellSiblings(c)).flat().includes(cell as Cell)
          ? hoveredValue.value
          : null
        : null
    }
    const setActiveValue = (n: number) => store.commit('setActiveValue', n)
    const onBottomRowClick = (n: number) => inputMode.value ? setActiveValue(n) : placeMarks(n)
    const placeMarks = (n: number) => store.dispatch('placeMarks', n)
    const mark = (value: number, cell: UnwrapRef<Cell>) => {
      inputMode.value
        ? store.commit('setCellValue', {
          index: cell.x + cell.y * 9,
          value: activeValue.value
        })
        : cell.mark(value)
    }
    const onValueClick = (cell: UnwrapRef<Cell>) => inputMode.value && cell.value
      ? store.commit('setCellValue', { index: cell.x + cell.y * 9, value: null })
      : store.dispatch('placeMarks', cell.value)
    return {
      inputMode,
      cells,
      activeValue,
      hoveredValue,
      onMouseEnter,
      onMouseLeave,
      cellSiblings,
      getHoveredMark,
      setHoveredValue,
      placeMarks,
      onBottomRowClick,
      onValueClick,
      mark
    }
  },
  mounted () {
    this.$store.commit('reset')
    setTimeout(() => {
      this.$store.commit('setCells', gameData.squares)
    }, 1e3)
    /* this.axios.get('/sudoku/new/?size=9&level=3')
      .then(r => {
        console.log(r)
        r.data.squares.forEach((c: Cell) => {
          this.cells[c.x + c.y * 9].value = c.value
        })
      }) */
  }
})
</script>

<style lang="scss">
$bg: #f5f7f9;
$cellBorder: #e3e9ef;
$fieldBorder: #a5e2ff;
.board {
  outline: 20px solid rgba(255,255,255,.42);
  padding-left: 1px;
  padding-bottom: 1px;
  display: flex;
  flex-wrap: wrap;
  width: 540px;
  margin: 0 auto;
  box-shadow: 0 1px 5px -1px rgba(0,0,0,.1), 0 3px 10px 0 rgba(0,0,0,.07), 0 1px 18px 0 rgba(0,0,0,.06);
  > .cell {
    flex: 0 0 calc(100%/9);
    display: grid;
    position: relative;
    > * {
      grid-area: 1/1;
    }
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: #69c;
      &.fixed {
        color: #000;
      }
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      > * {
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 33%;
        height: 33%;
        border-radius: 50%;
        color: #ccc;
        cursor: pointer;
        opacity: 0;
        font-weight: bold;
        &.marked {
          color: #ccc;
          opacity: 1;
          &.active {
            color: #f50;
            background-color: #ff550011
          }
        }

      }
      &:hover > * {
        opacity: 1;
        &.marked {
          color: #f50
        }
      }
    }
    svg {
      background-color: $bg;
      transition: background-color .21s cubic-bezier(.4,0,.2,1);
      border: 1px solid $cellBorder;
      margin-bottom: -1px;
      margin-left: -1px;
    }
    &:nth-child(3n + 1) svg {
      border-left-color: $fieldBorder;
    }
    &:nth-child(9n + 0) svg {
      border-right-color: $fieldBorder;
    }
    &:nth-child(-n+9),
    &:nth-child(n+28):nth-child(-n+36),
    &:nth-child(n+55):nth-child(-n+63) {
      svg {
        border-top-color: $fieldBorder;
      }
    }
    &:nth-child(n+73) svg {
      border-bottom-color: $fieldBorder;
    }
    &:hover, &.h-light {
      svg {
        background-color: white;
      }
    }
    &.lit span {
      color: #f50;
    }
    &.highlight svg {
      background-color: rgba(255, 255, 255, .8);
    }
  }
}
</style>
