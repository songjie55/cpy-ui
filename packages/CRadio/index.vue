<template>
  <label
      class="c_radio_wrap"
      :disabled="$attrs.disabled"
      :class="{
        c_radio_wrap_b2:Number($parent.selectedType)==2,
        c_radio_wrap_selected: $parent.value == value&&!$attrs.disabled,
        c_radio_wrap_blue:$parent.value == value &&Number($parent.selectedType)==1&&!$attrs.disabled
      }"
      :value='value'>
    <input
        :disabled="$attrs.disabled"
        type="radio"
        :value="value"
        @click="handleClick"
        class="c_radio">
    <slot/>
    <div
        class="c_radio_wrap_button_selected"
        v-show="$parent.value ==value&&Number($parent.selectedType)==2">
      <icon
          name="icon-xuanxiangka_gou"
          class="c_radio_wrap_button_selected_icon"></icon>
    </div>
  </label>
</template>
<script>
import Icon from "../CIcon/index.vue";

export default {
  name: 'CRadio',
  components: {
    Icon
  },
  props: {
    value: {required: true}
  },
  inject: ['setGroupValue'],
  methods: {
    handleClick(e) {
      this.setGroupValue(e);
      this.$emit('change', e);
    }
  }
};
</script>
<style lang="less">

.c_radio_wrap {
  position: relative;
  display: inline-block;
  min-width: 120px;
  min-height: 40px;
  padding: 0 24px;
  text-align: center;
  color: #323232;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  border: 1px solid #C8C8C8;
  border-radius: 4px;
  line-height: 40px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  user-select: none;
  margin-right: 16px;


  &_button_selected {
    transition: all 0.2s ease-out;
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    color: #fff;
    border-style: solid;
    // border-right: 30px @--main-blue;
    // border-bottom: 30px transparent;
    border-top: unset;
    border-left: unset;
    border-right-width: 30px;
    border-right-color: @--main-blue;
    border-bottom-width: 30px;
    border-bottom-color: transparent;

    &_icon {
      transition: all 0.2s ease-out;
      position: absolute;
      bottom: -15px;
      left: 15px;
      font-size: 14px;
    }
  }

}

.c_radio_wrap[disabled='disabled'] {
  background-color: #dcdcd8;
  cursor: not-allowed;
}

.c_radio {
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
  display: none;
}


.c_radio_wrap_selected {
  border: 1px solid @--main-blue;
  background: #FFFFFF;
  box-shadow: 0 8px 16px 0 rgba(33, 80, 151, 0.04), 0 4px 8px 0 rgba(33, 80, 151, 0.08), 0 2px 4px 0 rgba(33, 80, 151, 0.12);
}


.c_radio_wrap_blue{
  color: #1279F8;
  background-color: #D0E4FE;
}

.c_radio_wrap_b2{
  border-width: 2px;
}
</style>
