<template>
  <div class="d-flex numpad">
    <div class="aspect-ratio number-key"
         :class="getKeyClasses(i)"
         @click="onPadKeyClick(i)"
         @mouseenter="hoveredValue = i"
         @mouseleave="hoveredValue = 0"
         v-for="i in 9" :key="i">
      <svg viewBox="0 0 1 1"></svg>
      <div v-text="i" />
    </div>
    <div class="toggle">
      <Switch v-model:checked="usePad"
              @update:checked="usePad = $event"
              prefix="Select: "
              on-label="Numbers"
              off-label="Cells"
      />
    </div>
    <div class="aspect-ratio action-button"
         :class="{ active: button.id === editingMode }"
         v-for="button in menu" :key="button.id"
         @click="editingMode = button.id"
    >
      <svg :viewBox="'0 0 1 1'"></svg>
      <i aria-hidden="true" :class="['bi', `bi-${button.icon}`]" />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed, defineComponent } from 'vue'
import Switch from '@/components/Switch.vue'

export default defineComponent({
  name: 'NumPad',
  components: {
    Switch
  },
  setup () {
    const store = useStore()
    const activeCell = computed(() => store.getters.activeCell)
    const hoveredValue = computed({
      get () { return store.state.hoveredValue },
      set (value) { store.commit('setHoveredValue', value) }
    })
    const usePad = computed({
      get () { return store.state.usePad },
      set (value) { store.commit('setUsePad', value) }
    })
    const editingMode = computed({
      get () { return store.state.editingMode },
      set (value) { store.commit('setEditingMode', value) }
    })
    const useCells = computed(() => store.state.useCells)
    const activeValue = computed({
      get () {
        return store.state.activeValue
      },
      set (value) {
        store.commit('setActiveValue', value)
      }
    })
    const onPadKeyClick = (i: number) => {
      if (usePad.value) {
        if (activeValue.value === i) {
          switch (editingMode.value) {
            case 'marks':
              store.dispatch('placeMarks', i)
              break
            default:
          }
        } else {
          activeValue.value = i
        }
      } else {
        switch (editingMode.value) {
          case 'marks':
            activeCell.value.mark(i)
            break
          case 'values':
            store.commit('setCellProp', {
              index: activeCell.value.index,
              update: { value: i }
            })
            break
          case 'eraser':
            store.commit('setCellProp', {
              index: activeCell.value.index,
              update: { value: null }
            })
            break
          default:
        }
      }
    }
    const getKeyClasses = (i: number) => ({
      active: usePad.value && i === activeValue.value,
      'cell-mark': !usePad.value && !(activeCell.value.value === i),
      lit: !usePad.value && (
        activeCell.value.value
          ? activeCell.value.value === i
          : activeCell.value.marks.includes(i))
    })
    const menu = [
      {
        id: 'marks',
        icon: 'pencil',
        label: 'Use notes'
      }, {
        id: 'values',
        icon: 'check2-circle',
        label: 'Cell selection'
      },
      {
        id: 'eraser',
        icon: 'eraser'
      }
    ]
    return {
      menu,
      usePad,
      useCells,
      activeValue,
      editingMode,
      hoveredValue,
      getKeyClasses,
      onPadKeyClick
    }
  }
})
</script>

<style scoped lang="scss">
.numpad {
  .bi {
    font-size: 2rem;
  }
  flex-wrap: wrap;
  outline: 15px solid rgba(255,255,255,.42);
  outline-offset: 2px;
  > * {
    cursor: pointer;
    background-color: rgba(255,255,255,.42);
    border: 1px solid transparent;
    margin: 1px;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:hover:not(.toggle) {
      background-color: rgba(207, 241, 255, 0.42);
      border-color: #a5e2ff;
    }
    &.toggle {
      flex: 0 0 calc(100% - 2px);
    }
  }
  .number-key {
    flex: 0 0 calc(33.3333% - 2px);
    font-family: 'Hachi Maru Pop', cursive;
    font-size: 3rem;
    &.active {
      outline: 5px solid #57c9ff33;
      outline-offset: 2px;
      z-index: 1;
      background-color: #57c9ff99;
      color: white;
    }
    &.cell-mark:not(:hover) {
      color: #ccc;
    }
    &.cell-mark.lit {
      color: #69c;
    }
  }
  .action-button {
    position: relative;
    flex: 0 0 calc(33.3333% - 2px);
    &.active {
      outline: 5px solid #57c9ff33;
      outline-offset: 2px;
      z-index: 1;
      background-color: #57c9ff99;
      color: white;
    }
    .bi {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
