<template>
  <li
    :class="className"
    class="option"
    :aria-selected="active"
    :aria-disabled="disabled"
    role="option"
    tabindex="0"
    @click="select"
    @keydown.enter.stop="select(true)"
    @keydown.space.stop="select"
  >
    <span class="filtrable" :data-value="value">
      <slot></slot>
    </span>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SelectOption extends Vue {
  @Prop({ default: false, type: Boolean })
  readonly active?: boolean;

  @Prop({ default: false, type: Boolean })
  readonly disabled?: boolean;

  @Prop({ type: String })
  readonly value!: string;

  get className(): string[] {
    return [
      this.disabled ? "disabled" : "",
      this.active && !this.disabled ? "active" : "",
    ];
  }

  public select(keydown = false) {
    // @ts-ignore
    this.$emit("select", this.value, this.$slots.default[0].text, keydown);
  }
}
</script>

<style scoped lang="scss">
li {
  width: 100%;
  clear: both;
  line-height: 1.3rem;
  color: #000;
  text-align: left;
  text-transform: none;
  cursor: pointer;

  &.disabled,
  &.disabled > span,
  &.optgroup {
    color: rgba(#000, 0.3);
    cursor: context-menu;
    background-color: transparent !important;
  }

  &:hover,
  &.active {
    background-color: #eee;
  }

  & > a,
  & > span {
    display: block;
    padding: 0.5rem;
    font-size: 0.9rem;
    color: #4285f4;
  }
}
</style>
