<template>
  <div class="pagination">
    <div
      :class="['text-white p-2', page == 1 ? 'no' : 'yes']"
      @click="previous"
      :title="$t('commonPrevious')"
    >
      <Icon type="ios-arrow-back" color="#ffffff" size="36" />
    </div>
    <div class="text-center page-num">{{ page }}</div>
    <div
      :class="[
        'text-white p-2',
        page == Math.ceil(total / pageSize) ? 'no' : 'yes'
      ]"
      @click="next"
      :title="$t('commonNextPage')"
    >
      <Icon type="ios-arrow-forward" color="#ffffff" size="36" />
    </div>
  </div>
</template>

<script>
export default {
  name: "zr-pagination",
  props: ["total", "pageSize"],
  data() {
    return {
      page: 1
    };
  },
  methods: {
    previous() {
      if (this.page > 1) {
        this.page--;
        this.$emit("previous", this.page);
      }
    },
    next() {
      if (this.page < Math.ceil(this.total / this.pageSize)) {
        this.page++;
        this.$emit("next", this.page);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 30px 15px 0;
  margin-bottom: 120px;
  .yes,
  .no {
    cursor: pointer;
  }
  .yes {
    background-color: #fe8c01;
  }
  .page-num {
    width: 50px;
    line-height: 50px;
  }
  .no {
    background-color: #d9d8db;
  }
}
</style>
