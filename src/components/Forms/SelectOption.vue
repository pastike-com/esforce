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
    @mouseleave="hover = false"
    @mouseover="hover = true"
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

  private hover = false;

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

<style scoped lang="scss"></style>
