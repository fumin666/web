var portletMixin = {
  methods: {
    goto(path) {
      this.$router.push('/AssetsAll/' + path)
    }
  }
};
export default portletMixin;
