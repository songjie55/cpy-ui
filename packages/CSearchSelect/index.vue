<!--搜索下拉框-->
<template>
  <a-select
      :disabled="disabled"
      :size="size"
      show-search
      :mode="mode"
      v-model="selectId"
      :placeholder="placeholder"
      :filter-option="false"
      @search="searchOptions"
      @popupScroll="popupScroll"
      @dropdownVisibleChange="dropdownVisibleChange"
      @change="valueChange"
      :not-found-content="isFetching ? undefined : null"
      :class="{empty:!value||value===''}"
  >
    <div
        slot="dropdownRender"
        slot-scope="menu">
      <v-nodes :vnodes="menu"/>
      <slot name="extraContent">
      </slot>
    </div>
    <!--    <a-spin-->
    <!--        v-if="isFetching"-->
    <!--        slot="notFoundContent"-->
    <!--        size="small"/>-->
    <a-select-option
        v-if="mode!=='multiple'&&options.length!==0"
        value="">
      {{ $T('public.Dontchoose') }}
    </a-select-option>
    <a-select-option
        v-if="options.length===0"
        disabled
        value="">
      {{ $T('public.queryNoOption') }}
    </a-select-option>
    <a-select-option
        v-for="item in options"
        :key="item.id"
        :value="item.id">
      <a-tooltip
          placement="topLeft"
          :title="item.name">
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ item.name }}</div>
      </a-tooltip>
    </a-select-option>
    <a-select-option
        disabled
        v-if="isSelectLoading"
        key="loading"
        value="loading">
      {{ $T('public.Loading') }}...
    </a-select-option>
  </a-select>
</template>
<script>
import {debounce} from "@/utils";

export default {
  name: 'CSearchSelect',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      queryName: '',
      selectId: undefined,
      isFetching: false,
      isSelectLoading: false,
      options: [],
      loadedList: [],
      totalSize: 0,
      selectCurPage: 0,
      isLoadedAll: false//是否加载完全部
    }
  },
  props: {
    extraParams: {
      default: () => {
      }, type: Object
    },
    mode: {default: 'default', type: String},//单选还是多选
    queryPromise: {type: Function, required: true},
    placeholder: {type: String},
    disabled: {default: false, type: Boolean},
    size: {default: 'large', type: String},
    value: {default: ''},
    // 额外结果集  为了满足能添加自定义的选项的功能需求
    extraResult: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  model: {
    prop: "value",
    event: 'change'
  },
  watch: {
    value: {
      handler(n) {
        this.selectId = n;
      },
      immediate: true
    }
  },
  beforeMount() {
    if (!this.$T) {
      this.$T = this.translateText;
    }
  },
  mounted() {
    this.queryData();
    this.selectId = this.value;
  },
  methods: {
    /**
     * @description:兼容处理
     */
    translateText(code) {
      //console端没有字典翻译兼容
      let textObj = {
        'public.Dontchoose': '不选择',
        'public.queryNoOption': '查无对应选项',
        'public.Loading': '加载中'
      }
      return textObj[code] || code
    },
    /**
     * @description:选项容器张开关闭监听
     */
    dropdownVisibleChange(isOpen) {
      if (!isOpen) {
        return;
      }
      if (this.options === this.loadedList) return;
      this.options = this.loadedList;
    },
    /**
     * @description:值变化回调
     */
    valueChange() {
      // 返回选择实例的选项信息
      let res = null
      // 返回选择的选项信息
      if (this.mode !== 'multiple') {
        res = this.options.find((i) => i.id === this.selectId) || {}
      } else {
        res = this.options.filter((i) => this.selectId.includes(i.id))
      }
      this.$emit('itemInfo', res || {});
      this.$emit('change', this.selectId);
    },

    /**
     * @description:选项容器滚动监听
     */
    popupScroll(e) {
      const {
        clientHeight,
        scrollHeight,
        scrollTop
      } = e.target;
      if (clientHeight + scrollTop + 30 >= scrollHeight && !this.isSelectLoading) {
        this.selectCurPage += 1;
        if (Math.ceil(this.totalSize / 10) >= this.selectCurPage) {
          this.isSelectLoading = true;
          this.queryData();
        } else {
          this.isLoadedAll = true;
        }
      }
    },
    /**
     * @description: 分页获取数据
     */
    queryData() {
      const result = {
        pageNo: this.selectCurPage,
        pageSize: 10,
        queryName: this.queryName,
        ...this.extraParams
      };
      this.isFetching = true;
      this.queryPromise(result)
          .then((res) => {
            this.isFetching = false;
            this.isSelectLoading = false;
            let payload = res.data.payload || [];
            if (this.extraResult.length > 0) {
              payload = this.extraResult.concat(payload)
            }
            this.addList(payload);
            this.options = this.loadedList;
            this.totalSize = res.data && res.data.totalSize;
          });
    },
    /**
     * @description:去重
     */
    addList(payload) {
      const obj = {};
      const tmp = this.loadedList.concat(payload);
      const result = [];
      for (const item of tmp) {
        if (!obj[item.id]) {
          obj[item.id] = true;
          result.push(item);
        }
      }
      this.loadedList = result;
    },
    /**
     * @description: 通过搜索获取实例列表
     * @param {Object} params 输入框参数
     */
    searchOptions: debounce(function (params) {
      this.queryName = params;
      const result = {
        pageNo: 1,
        pageSize: 10,
        queryName: this.queryName,
        ...this.extraParams
      };
      this.isFetching = true;
      this.queryPromise(result)
          .then((res) => {
            this.isFetching = false;
            const payload = res.data && res.data.payload;
            this.options = payload;
            if (!this.isLoadedAll && payload) {
              this.addList(payload);
            }
          });
    })
  }
};
</script>
<style lang="less">
.empty {
  background-color: transparent;
  color: #bfbfbf;
}
</style>
