<!--卡片-->
<template>
  <div class="c_card">
    <div
        v-if="isMoreSlot || isTitleSlot || isMoreProp || isTitleProp"
        class="c_card_header"
        :class="{ 'borderBottom': isBorder }">
      <div>
        <slot
            v-if="isTitleSlot"
            name="title"/>
        <template v-else>
          {{ title }}
        </template>
      </div>
      <div
          v-if="isMoreSlot || isMoreProp"
          class="c_card_more"
          @click="handleClickMore">
        <slot
            v-if="isMoreSlot"
            name="more"/>
        <template v-else>
          {{ more }}
        </template>
      </div>
    </div>
    <slot/>
  </div>
</template>
<script>


export default {
  name: 'CCard',
  props: {
    title: {
      type: String,
      default:''
    },
    isBorder: {
      type: Boolean,
      default: false
    },
    more: {
      type: String,
      default:''
    }
  },
  methods: {
    /**
     * @description:点击更多
     */
    handleClickMore() {
      this.$emit('more');
    }
  },
  computed: {
    isMoreSlot() {
      return Boolean(this.$slots.more);
    },
    isTitleSlot() {
      return Boolean(this.$slots.title);
    },
    isMoreProp() {
      return this.more!=='';
    },
    isTitleProp() {
      return this.title!=='';
    }
  }
};
</script>
<style lang="less">
.c_card {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 4px rgba(37, 90, 168, 0.1), 0 4px 8px rgba(37, 90, 168, 0.05);
  padding-bottom: 16px;
  margin-bottom: 24px;
  .borderBottom {
    border-bottom: 1px solid #E6E6E6;
  }

  &_header {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 16px 24px;
    font-weight: bold;
  }

  &_more {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @--main-blue;
    cursor: pointer;

    &:hover {
      color: #255AA8;
    }

    .icon {
      display: block;
      margin-left: 8px;
    }
  }

}
</style>
