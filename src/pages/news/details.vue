<template>
  <div class="details">
    <zrHeader @toPageAnchor="handleToPageAnchor" />
    <div class="container pt-5 pb-5" style="margin-bottom: 30px;">
      <div class="title pb-3 mb-3">
        <h1>{{ info.title }}</h1>
        <span class="text-black-50">{{ util.dateTurnTimeQ(info.update_time,'YYYY.MM.DD') }}</span>
      </div>
      <div class="content" v-html="info.content"></div>
    </div>
    <div
      v-if="
        !$config.useI18n ||
          ($config.useI18n && langLocal === $config.languageDefine.test)
      "
    >
      {{ langLocal }}
    </div>
    <zrFooter />
  </div>
</template>

<script>
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import CommonService from "@/service/common-service";
import util from '../../utils/util';
export default {
  name: "Details",
  components: {
    zrHeader,
    zrFooter,
    util
  },
  data() {
    return {
      info: {}
    };
  },
  created() {
    // CommonService.getDetail({
    //   id: this.$router.history.current.query.newsId
    // })
    //   .then(res => {
    //     if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
    //       this.info = res.data;
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  },
  computed: {
    langLocal() {
      this.fetchDetail();
      return this.$store.state.app.local;
    }
  },
  methods: {
    fetchDetail() {
      if (this.$router.history.current.query.newsId) {
        CommonService.getDetail({
          id: this.$router.history.current.query.newsId
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              this.info = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
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
  .title {
    border-bottom: 1px solid #d6d6d6;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    h1 {
      font-size: 28px;
    }
  }
  /deep/ .content {
    img {
      width: 100%;
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .container {
    .title {
      h1 {
        font-size: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
