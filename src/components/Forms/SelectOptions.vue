<template>
  <div
    class="dropdown-content select-dropdown"
    ref="options"
    role="listbox"
    v-show="show"
    :id="id"
  >
    <div class="select-inner-wrapper" ref="wrapper">
      <ul ref="optionList">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SelectOptions extends Vue {
  @Prop({ type: String })
  readonly id!: string;

  @Prop({ default: false, type: Boolean })
  readonly show?: boolean;

  mounted() {
    window.addEventListener("keyup", this.close);
  }

  beforeDestroy() {
    window.removeEventListener("keyup", this.close);
  }

  public close(e: any): void {
    if (this.show && e.keyCode === 27) {
      this.$emit("close");
    }
  }
}
</script>

<style scoped lang="scss"></style>
