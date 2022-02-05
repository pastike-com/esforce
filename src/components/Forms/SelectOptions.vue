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

<style scoped lang="scss">
.select-dropdown {
  &:focus {
    border-bottom: 1px solid #4285f4;
    box-shadow: 0 1px 0 0 #4285f4;
  }

  ul {
    padding: 0;
    list-style-type: none;
  }
}

.dropdown-content {
  position: absolute;
  z-index: 1021;
  min-width: 6.25rem;
  //max-height: 40.625rem;
  width: 100%;
  margin: 0;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  will-change: width, height;
}
</style>
