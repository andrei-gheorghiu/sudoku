<template>
  <span class="cell aspect-ratio"
        :class="{
           hovered: hoveredValue === cell.value,
           lit: cell.lit,
           active: !usePad && activeCellIndex === cell.index }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onClick">
    <svg viewBox="0 0 1 1"></svg>
    <transition name="scale" appear>
      <span v-if="cell.value"
            class="cell-value"
            :class="{ fixed: cell.fixed }"
            @click.capture="placeMarks"
            :key="1">
        {{ cell.value }}
        <span v-if="!cell.fixed" class="btn-close"/>
      </span>
      <span v-else class="grid" :key="2">
        <span v-for="key in 9"
              v-text="key"
              :key="key"
              :class="{
                marked: cell.marks.includes(key),
                active: getActiveGridClass(key)
              }"/>
      </span>
    </transition>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Cell } from '@/types'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CellRecord',
  props: {
    cell: {
      type: Cell,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const usePad = computed(() => store.state.usePad)
    const editingMode = computed(() => store.state.editingMode)
    const activeValue = computed(() => store.state.activeValue)
    const activeCellIndex = computed(() => store.state.activeCellIndex)
    const hoveredValue = computed(() => store.state.hoveredValue)
    const onMouseEnter = () => {
      store.dispatch('enterCell', props.cell.index)
    }
    const onMouseLeave = () => {
      store.dispatch('exitCell', props.cell.index)
    }
    const onClick = () => {
      if (usePad.value) {
        switch (editingMode.value) {
          case 'marks':
            props.cell.mark(activeValue.value)
            break
          case 'values':
            store.commit('setCellProp', {
              index: props.cell.index,
              update: {
                value: activeValue.value
              }
            })
            break
          case 'eraser':
            if (!props.cell.fixed) {
              if (props.cell.value) {
                store.commit('setCellProp', {
                  index: props.cell.index,
                  update: {
                    value: null
                  }
                })
              } else {
                store.commit('setCellProp', {
                  index: props.cell.index,
                  update: {
                    marks: []
                  }
                })
              }
            }
            break
          default:
        }
      } else {
        if (editingMode.value === 'eraser') {
          store.commit('clearCell', props.cell.index)
        }
        store.commit('setActiveCellIndex', props.cell.index)
      }
    }
    const getActiveGridClass = (key: number) =>
      usePad.value
        ? (editingMode.value === 'values' && activeValue.value === key) ||
          (editingMode.value === 'marks' && hoveredValue.value === key) ||
          (!hoveredValue.value && activeValue.value === key)
        : hoveredValue.value === key
    const placeMarks = () => store.dispatch('placeMarks', props.cell.value)
    return {
      usePad,
      activeValue,
      activeCellIndex,
      hoveredValue,
      editingMode,
      onMouseEnter,
      onMouseLeave,
      onClick,
      placeMarks,
      getActiveGridClass
    }
  }
})
</script>
