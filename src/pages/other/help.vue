<template>
  <div class="help">
    <zrHeader ref="zrheader" @toPageAnchor="handleToPageAnchor" />
    <div class="container">
      <div class="title">
        <h1 class="english">Support</h1>
        <h1
          class="chinese"
          v-if="
            !$config.useI18n ||
              ($config.useI18n && langLocal === $config.languageDefine.zhCN)
          "
        >
          帮助中心
        </h1>
      </div>
      <div class="row">
        <!-- 左侧 -->
        <div class="col-12 col-sm-2">
          <!-- <zrOptions type="用户资料" /> -->
        </div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 mb-5">
          <div style="padding-bottom: 2rem;">
          <div
            class="mb-4 bg-white border list"
            v-for="(item, index) in list"
            :key="index"
          >
            <div
              :class="['p-4 tittle', item.show ? 'orange' : '']"
              @click="open(item)"
            >
              <span>{{ item.title }}</span>
              <Icon
                :type="item.show ? 'ios-arrow-up' : 'ios-arrow-down'"
                color="#cfcccf"
              />
            </div>
            <div
              v-show="item.show"
              class="p-4 body"
              v-html="item.content"
            ></div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <zrFooter />
  </div>
</template>

<script>
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import CommonService from "@/service/common-service";

export default {
  name: "Help",
  components: {
    zrHeader,
    zrFooter
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    // this.getArticle();
  },
  computed: {
    langLocal() {
      this.getArticle();
      return this.$store.state.app.local;
    }
  },
  methods: {
    //展开折叠文章
    open(data) {
      // console.log(data);
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id == data.id) {
          // console.log(this.list[i].show == data.show);
          if (this.list[i].show) {
            this.list[i].show = false;
          } else {
            this.list[i].show = true;
          }
        }
      }
    },
    //数据接口
    getArticle() {
      CommonService.getHelpWeb()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            let datas = res.data;
            for (let i in datas) {
              datas[i].show = false;
              datas[0].show = true;
            }
            this.list = datas;
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    padding: 50px 0 30px;
    border-bottom: 1px solid #d6d6d6;
    margin-bottom: 30px;
    .english {
      font-size: 66px;
    }
    .chinese {
      font-size: 30px;
    }
  }
  .list {
    .tittle {
      cursor: pointer;
      font-size: 22px;
      border-bottom: 1px solid #d6d6d6;
      display: flex;
      justify-content: space-between;
      &:hover {
        .ivu-icon {
          color: #ff8b00 !important;
        }
        color: #ff8b00;
      }
    }
    /deep/.body {
      img {
        width: 100%;
      }
    }
    .orange {
      .ivu-icon {
        color: #ff8b00 !important;
      }
      color: #ff8b00;
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .container {
    .title {
      .english {
        font-size: 40px !important;
      }
      .chinese {
        font-size: 20px !important;
      }
    }
    .list {
      .tittle {
        font-size: 16px;
      }
    }
  }
}
</style>
