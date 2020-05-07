<template>
  <div class="user">
    <zrHeader @toPageAnchor="handleToPageAnchor" />
    <div class="container">
      <div class="title">
        <h1 class="english">Profile</h1>
        <h1 class="chinese" v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">个人中心</h1>
      </div>
      <div class="row">
        <!-- 左侧 -->
        <div class="col-12 col-sm-4"><zrOptions types="用户资料" /></div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <div class="bg-white mb-5 border address">
            <div class="mb-5 head">
              <div>
                <span style="font-size:20px">{{ $t('addressShippingAddress') }}</span>
                <span class="text-black-50">({{ $t('addressOnlyAddThreeAddresses') }})</span>
              </div>
              <!--v-show="listUserAddress.length != 3"-->
              <Icon
                type="ios-add-circle-outline"
                size="18"
                @click="addDeliveryAddress"
                :class="listUserAddress.length < 3 ? 'cursor-link' : 'put-gray'"
                :title="$t('addressAddShippingAddress')"
                :alt="$t('addressAddShippingAddress')"
              />
            </div>
            <div class="list" v-for="(item, index) in listUserAddress" :key="index">
              <div class="mb-3">
                <div class="peplo">
                  <span class="text-black-50 text-right">{{ $t('addressRecipient') }}</span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="mobile">
                  <span class="text-black-50 text-right">{{ $t('addressContactInformation') }}</span>
                  <span>{{ item.mobile }}</span>
                </div>
              </div>
              <div class="adress">
                <div>
                  <span class="text-black-50 text-right">{{ $t('addressShippingAddress') }}</span>
                  <span>{{ item.address }}</span>
                </div>
                <div class="btns">
                  <button type="button" class="btn btn-link text-dark" @click="change(item)">{{ $t('addressModify') }}</button>
                  |
                  <button type="button" class="btn btn-link text-dark" @click="deletbtn(item)">{{ $t('addressDelete') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <zrFooter />
    <!-- 添加/修改地址的模态框 -->
    <Modal v-model="addressModal" class-name="address-modal" :mask-closable="false">
      <div class="mb-3 pb-3 title">
        {{ modalTitle }}
      </div>
      <Form ref="forms" :model="forms">
        <FormItem :label="$t('addressRecipient')" prop="name"><Input v-model="forms.name" :placeholder="$t('addressPlsEnterRecipient')" :maxlength="16" clearable /></FormItem>
        <FormItem :label="$t('addressReceiverMobilePhone')" prop="phone">
          <Input v-model="forms.phone" :placeholder="$t('addressPlsEnterReceiverPhone')" :maxlength="15" clearable />
        </FormItem>
        <FormItem :label="$t('addressShippingAddress')" prop="address">
          <Input
            :maxlength="100"
            @on-keydown="inputing"
            show-word-limit
            v-model="forms.address"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            :placeholder="$t('addressPlsEnterDeliveryAddress')"
          />
        </FormItem>
        <FormItem>
          <Button class="mt-4 btn" type="primary" @click="saveDeliveryAddress">{{ $t('commonSave') }}</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 删除地址的模态框 -->
    <Modal v-model="deletModal" class-name="delet-modal" width="360">
      <div style="font-size:16px">{{ $t('addressSureWantDeleteAddress') }}</div>
      <div slot="footer">
        <Button size="large" type="error" @click="deleing">{{ $t('commonConfirm1') }}</Button>
        <Button size="large" @click="deletModal = false">{{ $t('commonCancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonService from '@/service/common-service';
import zrHeader from '@/components/header';
import zrFooter from '@/components/footer';
import zrOptions from '@/components/user-options'; // 引入左侧导航选项卡
import CommonFunc from '@/utils/common';
export default {
  name: 'addres',
  components: {
    zrHeader,
    zrFooter,
    zrOptions
  },
  data() {
    return {
      listUserAddress: [], // 收货地址
      addressModal: false,
      modalTitle: '',
      forms: {
        name: '',
        phone: '',
        address: ''
      },
      deletModal: false,
      actionFlag: '', // "add"/ "edit"
      addressId: '',
      nowData: {}
    };
  },
  created() {
    // this.fetchAllDeliveryAddress();
  },
  computed: {
    langLocal() {
      this.fetchAllDeliveryAddress();
      return this.$store.state.app.local;
    }
  },
  methods: {
    fetchAllDeliveryAddress() {
      CommonService.getAddressList({
        headers: { 'Show-Loading': false }
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // console.log(res);
            const { data } = res;
            this.listUserAddress = [...data];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加地址
    addDeliveryAddress() {
      if (this.listUserAddress.length >= 3) {
        return false;
      }
      this.forms.name = '';
      this.forms.phone = '';
      this.forms.address = '';
      this.modalTitle = this.$t('addressAddShippingAddress');
      this.actionFlag = 'add';
      this.addressModal = true;
      // console.log("addDeliveryAddress");
    },
    // 修改地址
    change(data) {
      localStorage.setItem('address', JSON.stringify(data)); // 修改前的数据存到storage里，用于对比用户是否做了修改
      this.actionFlag = 'edit';
      this.modalTitle = this.$t('addressModifyShippingAddress');
      this.forms.name = data.name;
      this.forms.phone = data.mobile;
      this.forms.address = data.address;
      this.addressModal = true;
    },
    inputing() {
      const that = this;
      if (this.forms.address.length == 100) {
        // this.$Message.error("输入长度达到上限！");
        CommonFunc.displayMessageTip(this.$t('addressInputUpperLimit'), 'warning', that);
      }
    },
    // 新增/编辑 - 保存地址
    saveDeliveryAddress() {
      this.forms.name = this.forms.name.replace(/\s+/g, '');
      this.forms.phone = this.forms.phone.replace(/\s+/g, '');
      this.forms.address = this.forms.address.replace(/\s+/g, '');
      const that = this;
      if (this.actionFlag === 'add') {
        // 新增地址
        if (this.forms.name != '' && this.forms.phone != '' && this.forms.address != '') {
          const params = {
            country: 'country字段需要改为非必填',
            address: this.forms.address,
            name: this.forms.name,
            mobile: this.forms.phone,
            is_default: 0,
            status: 1
          };
          CommonService.addAddress(params)
            .then(res => {
              if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                // console.log(res);
                this.fetchAllDeliveryAddress();
                // this.$Message.success({
                //   content: `${this.modalTitle}成功！`,
                //   duration: 2
                // });
                CommonFunc.displayMessageTip(`${this.modalTitle}${this.$t('commonSuccessful')}`, 'success', that);
                this.addressModal = false;
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          // this.$Message.error({
          //   content: "所有输入框皆为必填项，请补充完整！",
          //   duration: 3
          // });
          CommonFunc.displayMessageTip(this.$t('addressAllInputCompleteIt'), 'warning', that);
        }
      } else {
        // 修改地址
        let old = JSON.parse(localStorage.getItem('address'));
        if (this.forms.name == old.name && this.forms.phone == old.mobile && this.forms.address == old.address) {
          // this.$Message.info("您没做任何修改");
          CommonFunc.displayMessageTip(this.$t('addressNotMakeAnyChanges'), 'info', that);
          this.addressModal = false;
          localStorage.removeItem('address');
        } else {
          if (this.forms.name != '' && this.forms.phone != '' && this.forms.address != '') {
            const params = {
              country: 'country字段需要改为非必填',
              address: this.forms.address,
              name: this.forms.name,
              mobile: this.forms.phone,
              is_default: 0,
              status: 1,
              id: old.id
            };
            CommonService.udpateAddress(params)
              .then(res => {
                if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                  // this.$Message.success({
                  //   content: `${this.modalTitle}成功！`,
                  //   duration: 2
                  // });
                  CommonFunc.displayMessageTip(`${this.modalTitle}${this.$t('commonSuccessful')}`, 'success', that);
                  this.addressModal = false;
                  this.fetchAllDeliveryAddress();
                  localStorage.removeItem('address');
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            // this.$Message.error({
            //   content: "所有输入框皆为必填项，请补充完整！",
            //   duration: 3
            // });
            CommonFunc.displayMessageTip(this.$t('addressAllInputCompleteIt'), 'warning', that);
          }
        }
      }
    },
    deletbtn(data) {
      console.log('要删除的地址：', data);
      this.addressId = data.id;
      this.deletModal = true;
    },
    // 删除地址
    deleing() {
      const that = this;
      this.deletModal = false;
      CommonService.removeAddress({ id: this.addressId })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.fetchAllDeliveryAddress();
            // this.$Message.success("删除成功！");
            CommonFunc.displayMessageTip(this.$t('addressDeleteSuccessful'), 'success', that);
          }
        })
        .catch(error => {
          console.log('fetchUserInfo error', error);
        });
    },
    handleToPageAnchor(anchorName) {
      const curPageRouteName = this.$route.name;
      this.$router.push({
        name: 'Home',
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
.put-gray {
  color: #e8eaec;
}
.put-gray:before {
  color: #e8eaec;
}
// 模态框
/deep/.address-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    width: 50% !important;
    top: 0;
    .ivu-modal-content {
      padding: 30px 80px;
      .title{
        font-size: 24px;
            border-bottom: 1px solid #eaeaea;
      }
      .ivu-modal-body {
        .ivu-form-item-content {
          text-align: right;
          .ivu-input-icon {
            line-height: 46px;
          }
          .ivu-input {
            padding: 22px 10px;
            font-size: 14px;
          }
          .ivu-btn {
            background-color: #ff8400;
            border-color: #ff8400;
            padding: 8px 30px;
            font-size: 16px;
            height: 42px;
            border-radius: 0.25rem;
          }
        }
      }
      .ivu-modal-footer {
        display: none;
      }
    }
  }
}
/deep/.delet-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
    .ivu-modal-content {
      padding: 20px;
    }
    .ivu-modal-footer {
      border-top: none;
      .ivu-btn {
        padding: 8px 30px;
        font-size: 16px;
      }
      .ivu-btn-error {
        background-color: #ff8400;
        border-color: #ff8400;
      }
    }
  }
}

.user {
  background-color: #f9f9f9;
  .container {
    padding-bottom: 213px;
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
      .address {
        padding: 24px 41px;
        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .ivu-icon {
            font-weight: 800;
            &:hover {
              color: #ff8b00;
            }
          }
        }
        .list {
          padding-bottom: 40px;
          margin-bottom: 40px;
          border-bottom: 1px solid #e6e6e6;
          .peplo,
          .mobile {
            display: inline-block;
          }
          .mobile {
            margin-left: 45px;
          }
          .adress {
            display: flex;
            justify-content: space-between;

            div {
              width: 70%;
            }

            .btns {
              width: 20%;
              text-align: right;
            }
          }
          .btn {
            padding: 0;
            &:hover {
              color: #ff8b00 !important;
            }
          }
          &:last-child {
            padding-bottom: 0;
            margin-bottom: 0;
            border-bottom: none;
          }
        }
      }
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  // 模态框
  /deep/.address-modal {
    .ivu-modal {
      width: 88% !important;
      .ivu-modal-content {
        padding: 0 !important;
      }
    }
  }
  .container {
    padding-bottom: 0 !important;
    .title {
      .english {
        font-size: 40px !important;
      }
      .chinese {
        font-size: 20px !important;
      }
    }
    .right {
      margin-top: 20px;
      .address {
        padding: 15px !important;
        .head {
          .text-black-50 {
            display: block;
          }
        }
        .list {
          .mb-3 {
            .peplo,
            .mobile {
              margin-left: 0 !important;
            }
          }
          .adress {
            display: block !important;
            div {
              width: auto !important;
            }
            .btns {
              width: auto !important;
              text-align: right;
              margin-top: 20px;
            }
          }
        }
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
