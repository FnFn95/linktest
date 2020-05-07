<template>
  <div class="box-orders">
    <zrHeader />
    <div class="container">
      <div class="title">
        <h1 class="english">Profile</h1>
        <h1 class="chinese">个人中心</h1>
      </div>
      <div class="row">
        <!-- 左侧 -->
        <div class="col-12 col-sm-4 left">
          <zrOptions types="购买订单" />
        </div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <zrFirst type="盒子订单" />
          <zrSecond type="待付款" />
          <div class="list-head">
            <div class="name">产品名称</div>
            <div class="number">数量</div>
            <div class="price">金额</div>
            <div class="state">订单状态</div>
          </div>
          <div class="list" v-for="(list,index) in lists" :key="index">
            <div class="tittle">
              <time class="mr-4">{{ list.time }}</time>
              <span class="no">
                订单编号：
                <span style="color:#333333">{{ list.order_no }}</span>
              </span>
            </div>
            <div class="goods-info">
              <div class="goods">
                <div class="info">
                  <div class="img">
                    <img src="../../assets/images/test.jpeg" alt />
                  </div>
                  <div style="padding-left: 10px; width:60%">{{ list.name }}</div>
                  <div class="text-center text-black-50 number">{{ list.number }}</div>
                </div>
                <div class="account-number">
                  <div v-for="(account,i) in list.account_number" :key="i" class="item">
                    <div class="text-black-50">
                      <span>{{ $t("openDeviceId") }}</span>
                      <span class="text-dark">{{ account.id }}</span>
                    </div>
                    <span class="text-black-50">
                      <span>Password:</span>
                      <span class="text-dark">{{ account.password }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-center text-muted price">￥{{ list.price }}</div>
              <div class="text-center state">
                <div v-if="list.state=='1'">待付款</div>
                <div v-if="list.state=='2'">待发货</div>
                <div v-if="list.state=='3'">待收货</div>
                <div v-if="list.state=='4'">物流已送达</div>
                <div v-if="list.state=='5'">作废订单</div>
                <button type="button" class="btn btn-link text-dark mt-3">
                  <router-link to="/orders/order-detail?no=666">订单详情</router-link>
                </button>
              </div>
            </div>
          </div>
          <zrPagination @previous="previous" @next="next" />
          <div class="navs">
            <router-link to="/orders/box-orders">全部订单</router-link>
            <router-link to="/orders/box-orders">待付款</router-link>
            <router-link to="/orders/box-orders">待发货</router-link>
            <router-link to="/orders/box-orders">待收货</router-link>
            <router-link to="/orders/box-orders">物流已送达</router-link>
            <router-link to="/orders/box-orders">作废订单</router-link>
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
import zrOptions from "@/components/user-options"; // 引入左侧选项卡
import zrFirst from "@/components/orders/first-options"; // 引入右侧一级选项卡
import zrSecond from "@/components/orders/second-options.vue"; // 引入右二级选项卡
import zrPagination from "@/components/pagination";

export default {
  name: "boxOrder",
  components: {
    zrHeader,
    zrFooter,
    zrOptions,
    zrFirst,
    zrSecond,
    zrPagination
  },
  data() {
    return {
      lists: [
        // 订单列表 测试数据
        {
          time: "2020-03-20 00:19:32",
          order_no: "763234325323453",
          pic: "../../assets/images/test.jpeg",
          name: "聚一块撒饿啊为",
          number: 2,
          price: 91,
          state: "1",
          account_number: [
            { id: "984342366724", password: "5422423" },
            { id: "09875434234", password: "787433" }
          ]
        },
        {
          time: "2020-03-20 00:19:32",
          order_no: "8986521234364",
          pic: "../../assets/images/test.jpeg",
          name: "个人首个觉得你突然",
          number: 5,
          price: 932,
          state: "1",
          account_number: [{ id: "4546524234", password: "8543414" }]
        },
        {
          time: "2020-03-20 00:19:32",
          order_no: "8986521234364",
          pic: "../../assets/images/test.jpeg",
          name: "个人首个觉得你突然",
          number: 5,
          price: 932,
          state: "1",
          account_number: [{ id: "4546524234", password: "8543414" }]
        }
      ]
    };
  },
  methods: {
    previous(page) {
      console.log("上一页", page);
    },
    next(page) {
      console.log("下一页", page);
    }
  }
};
</script>

<style lang="less" scoped>
.box-orders {
  background-color: #f9f9f9;
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
    .right {
      padding-right: 0;
      .list-head {
        display: grid;
        margin: 20px 0;
        grid-template-columns: 45% 15% 20% 20%;
        justify-items: center;
        background-color: #f1f1f1;
        padding: 10px 0;
        color: #666666;
        font-size: 12px;
      }
      .list {
        font-size: 12px;
        margin-bottom: 20px;
        border: 1px solid #e6e6e6;
        .tittle {
          padding: 10px;
          background-color: #f1f1f1;
          color: #969696;
        }
        .goods-info {
          display: grid;
          grid-template-columns: 60% 20% 20%;
          background-color: #ffffff;
          .goods {
            .info {
              display: flex;
              padding: 20px;
              .img {
                width: 25%;
                img {
                  width: 72px;
                }
              }
              .number {
                width: 15%;
              }
            }
            .account-number {
              .item {
                padding: 10px 20px;
                border-top: 1px solid #e6e6e6;
                display: flex;
                justify-content: space-around;
                .text-black-50 {
                  width: 50%;
                }
              }
            }
          }
          .price {
            border-left: 1px solid #e6e6e6;
            padding: 20px;
          }
          .state {
            color: #ff8b00;
            border-left: 1px solid #e6e6e6;
            padding: 20px;
          }
        }
      }
      .pagination {
        display: flex;
        justify-content: center;
        margin: 30px 15px 0;
        margin-bottom: 120px;
        .righting {
          padding: 15px;
          background-color: #d9d8db;
        }
        .page-num {
          padding: 15px 20px;
        }
        .lefting {
          padding: 15px;
          background-color: #fe8c01;
        }
      }
      .navs {
        color: #fe8c01;
        text-align: center;
        margin-bottom: 100px;
        a {
          color: #fe8c01;
          border-bottom: 1px solid #fe8c01;
        }
      }
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
    .row {
      margin: 0 !important;
    }
    .left {
      padding: 0;
    }
    .right {
      padding-left: 0;
      .goods-info {
        .goods {
          .item {
            padding: 10px !important;
            display: block !important;
            .text-black-50 {
              width: unset !important;
            }
          }
          .info {
            padding: 20px 8px !important;
            img {
              width: 50px !important;
            }
          }
        }
        .price {
          padding: 20px 8px !important;
        }
        .state {
          padding: 20px 8px !important;
        }
      }
      .navs {
        margin-left: -10px;
        margin-right: -10px;
      }
    }
  }
}
/* 小屏幕（平板，大于等于 768px） */
@media screen and (min-width: 768px) {
  /* 你的样式 */
}

/* 中等屏幕（桌面显示器，大于等于 992px） */
@media screen and (min-width: 992px) {
  /* 你的样式 */
}

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media screen and (min-width: 1200px) {
  /* 你的样式 */
}

/*  769px到992px之间  */
@media (min-width: 768px) and (max-width: 992px) {
  /* 你的样式 */
}
</style>
