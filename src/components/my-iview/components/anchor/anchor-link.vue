<template>
  <div :class="anchorLinkClasses">
    <a
      :class="linkTitleClasses"
      :href="href"
      :data-scroll-offset="scrollOffset"
      :data-href="href"
      @click.prevent="goAnchor"
      >{{ title }}</a
    >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "AnchorLink",
  inject: ["anchorCom"],
  props: {
    href: String,
    title: String,
    scrollOffset: {
      type: Number,
      default() {
        return this.anchorCom.scrollOffset;
      }
    }
  },
  data() {
    return {
      prefix: "ivu-anchor-link"
    };
  },
  computed: {
    anchorLinkClasses() {
      return [
        this.prefix,
        this.anchorCom.currentLink === this.href ? `${this.prefix}-active` : ""
      ];
    },
    linkTitleClasses() {
      return [`${this.prefix}-title`];
    }
  },
  methods: {
    goAnchor() {
      // console.log("goAnchor");
      // console.log("goAnchor href", this.href);
      this.currentLink = this.href;
      this.anchorCom.handleHashChange();
      this.anchorCom.handleScrollTo();
      this.anchorCom.$emit("on-select", this.href);
      const isRoute = this.$router;
      if (isRoute) {
        // console.log("goAnchor isRoute", isRoute);
        // this.$router.push(this.href, () => {});
        this.$nextTick(() => {
          if (document.querySelector(this.currentLink)) {
            document.querySelector(this.currentLink).scrollIntoView(true);
          }
        });
      } else {
        window.location.href = this.href;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.anchorCom.init();
    });
  }
};
</script>
