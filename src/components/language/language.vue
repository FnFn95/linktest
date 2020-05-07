<template>
  <div>
    <!-- <Dropdown trigger="click" @on-click="selectLang">
      <span class="cursor-link">
        {{ title }}
        <Icon :size="18" type="md-arrow-dropdown" />
      </span>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localList" :name="key" :key="`lang-${key}`">{{ value }}</DropdownItem>
      </DropdownMenu>
    </Dropdown> -->
    <span class="login">
      <!-- <span class="cursor-link" @click="selectLang(lang)">
        <img class="ml-3" :src="imgSrc" alt />
      </span> -->
      <!-- {{ lang }} -->
      <span
        v-show="lang === 'zh-CN'"
        class="cursor-link"
        @click="debounceSelectLang('en-US')"
      >
        <Tooltip content="English" theme="light" :delay="300">
          <img class="ml-3" src="@/assets/images/language_en.png" alt />
        </Tooltip>
      </span>
      <span
        v-show="lang === 'en-US'"
        class="cursor-link"
        @click="debounceSelectLang('zh-CN')"
      >
        <Tooltip content="中文" theme="light" :delay="300">
          <img class="ml-3" src="@/assets/images/language_ch.png" alt />
        </Tooltip>
      </span>
    </span>
  </div>
</template>

<script>
import { localRead } from '@/libs/util'
export default {
  name: "Language",
  props: {
    lang: String,
    default: "zh-CN"
  },
  data() {
    return {
      langList: {
        "zh-CN": "语言",
        // 'zh-TW': '語言',
        "en-US": "Lang"
      },
      langImgList: {
        "zh-CN": require("@/assets/images/language_en.png"),
        // 'zh-TW': '語言',
        "en-US": require("@/assets/images/language_ch.png")
      },
      localList: {
        "zh-CN": "中文简体",
        // 'zh-TW': '中文繁体',
        "en-US": "English"
      }
    };
  },
  watch: {
    // lang (lang) {
    //   console.log('language.vue watch lang', lang);

    //   this.$i18n.locale = lang
    // }
    lang: {
      handler(newName, oldName) {
        // console.log("language.vue watch lang", newName);
        if (!newName) {
          // 自动根据浏览器系统语言设置语言
          const navLang = navigator.language;
          const localLang =
            navLang === "zh-CN" || navLang === "en-US" ? navLang : false;
          let lang = localRead("local") || localLang || "zh-CN";
          this.$i18n.locale = lang;
        } else {
          this.$i18n.locale = newName;
        }
      },
      immediate: true
    }
  },
  computed: {
    // title() {
    //   return this.langList[this.lang];
    // },
    // imgSrc() {
    //   return this.langImgList[this.lang];
    // }
  },
  methods: {
    debounceSelectLang: _.debounce(function(name) {
      this.handleSelectLang(name);
    }, 500),
    handleSelectLang(name) {
      // console.log("selectLang name", name);
      this.$emit("on-lang-change", name);
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  display: flex;
  align-items: center;
  .text {
    display: inline;
  }
  img {
    width: 18px;
  }
}
</style>
