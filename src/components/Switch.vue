<template>
  <label class="switch-container">
    <span v-text="prefix" class="prefix" />
    <span v-text="offLabel" class="label" :class="{ checked: !checked }"/>
    <input type="checkbox"
           v-bind="$attrs"
           :checked="checked"
           class="input"
           @change="$emit('update:checked', $event.target.checked)"/>
    <span class="switch"/>
    <span v-text="onLabel" class="label" :class="{ checked: checked }"/>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Switch',
  inheritAttrs: false,
  props: {
    onLabel: {
      type: String,
      default: ''
    },
    offLabel: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style scoped lang="scss">
$switch-container-width: 50px;
$switch-size: calc(#{$switch-container-width} / 2);
$switch-color: #57c9ff;

.switch-container {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 38.75px .5rem;
}

.input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch {
  display: flex;
  align-items: center;
  position: relative;
  height: $switch-size;
  flex-basis: $switch-container-width;
  border-radius: $switch-size;
  transition: background-color 0.25s ease-in-out;
  background-color: $switch-color;
  flex-shrink: 0;

  &:before {
    content: "";
    position: absolute;
    left: 1px;
    height: calc(#{$switch-size} - 2px);
    width: calc(#{$switch-size} - 2px);
    border-radius: 50px;
    background-color: white;
    transition: transform 0.21s cubic-bezier(.4,0,.2,1);
    border: 2px solid darken($switch-color, 5);
  }
}

.input:checked + .switch {
  background-color: $switch-color;
}

.input:checked + .switch::before {
  border-color: darken($switch-color, 5);
  transform: translateX(
      calc(#{$switch-container-width} - #{$switch-size})
  );
}

.input:focus + .switch::before {
  border-color: darken($switch-color, 5);
}

.input:focus:checked + .switch::before {
  border-color: darken($switch-color, 5);
}

.input:disabled + .switch {
  background-color: var(--gray);
}

.input:disabled + .switch::before {
  background-color: var(--gray-dark);
  border-color: var(--gray-dark);
}
.prefix {
  font-style: italic;
  font-weight: 700;
  padding-left: .5rem;
}
.label {
  margin: 0 .5rem;
  color: #bbb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  &:hover {
    color: #999;
  }
  &.checked {
    color: $switch-color;
  }
}

</style>
