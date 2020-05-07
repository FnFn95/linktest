<template>
  <div class="news">
    <zrHeader @toPageAnchor="handleToPageAnchor" />
    <div class="container">
      <div
        class="row mb-5 pb-5 list"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="col-12 col-sm-5">
          <img :src="item.pic" alt />
        </div>
        <div class="col-12 col-sm-7 right">
          <h2 class="title">{{ item.title }}</h2>
          <p class="time mt-1 mb-4">{{ util.dateTurnTimeQ(item.create_time,'YYYY.MM.DD') }}</p>
          <!-- <p class="text" v-html="item.content"></p> -->
          <p class="text">{{ item.text}}</p>
          <router-link :to="'/news/details?newsId=' + item.id">
            <button type="button" class="btn btn-link text-warning mt-5 p-0">
              More +
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="
        !$config.useI18n ||
          ($config.useI18n && langLocal === $config.languageDefine.test)
      "
    >
      {{ langLocal }}
    </div>
    <zrPagination
      :total="listTotals"
      :pageSize="5"
      @previous="previous"
      @next="next"
    />
    <zrFooter />
  </div>
</template>

<script>
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrPagination from "@/components/pagination";
import CommonService from "@/service/common-service";
import util from '../../utils/util';
export default {
  name: "news",
  components: {
    zrHeader,
    zrFooter,
    zrPagination,
    util
  },
  data() {
    return {
      page: 1,
      listTotals: 4,
      list: []
    };
  },
  created() {
    // console.log(this.$router.history.current.query.type);
    // this.$router.history.current.query.type == "intros"
    //   ? this.getIntros(this.page)
    //   : this.getCampaigns(this.page);
  },
  computed: {
    langLocal() {
      this.$router.history.current.query.type == "intros"
      ? this.getIntros(this.page)
      : this.getCampaigns(this.page);
      return this.$store.state.app.local;
    }
  },
  methods: {
    // 获取产品介绍列表
    getIntros(page) {
      CommonService.getProductInstructions({
        limit: "5",
        page: page
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.list = res.data.data;
            this.listTotals = res.data.count;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取推广活动列表
    getCampaigns(page) {
      CommonService.getPushActivity({
        limit: "5",
        page: page
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.list = res.data.data;
            this.listTotals = res.data.count;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    previous(page) {
      this.$router.history.current.query.type == "intros"
        ? this.getIntros(page)
        : this.getCampaigns(page);
      window.scrollTo(0, 0);
    },
    next(page) {
      this.$router.history.current.query.type == "intros"
        ? this.getIntros(page)
        : this.getCampaigns(page);
      window.scrollTo(0, 0);
    },
    handleToPageAnchor(anchorName) {
      const curPageRouteName = this.$route.name;
      this.$router.push({
        name: "Home",
        params: {
          fromPage: curPageRouteName,
          anchorName: anchorName
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  margin-top: 80px;
  .list {
    border-bottom: 1px solid #d6d6d6;
    img {
      width: 98%;
    }
    .right {
      .title {
        font-size: 32px;
        font-weight: 800;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time,
      .text {
        color: #808080;
      }
      /deep/.text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        img{
          display: none;
        }
      }
    }
  }
  .list:last-child {
    border-bottom: none;
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .list {
    .right {
      .title {
        margin-top: 20px;
        font-size: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
