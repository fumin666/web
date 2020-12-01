<template>
  <section class="main-err-page">
    <div class="err-page-wrapper">
      <div class="err-page-con">
        <p>很抱歉，此页面可能不存在或没有访问权限！</p>
        <p>您可以选择
          <router-link to="/">返回首页</router-link>
          或者
          <a @click="back" href="javascript:;">上一页</a>
        </p>
      </div>
    </div>
    <footer>
      <p v-copyright></p>
      <p v-copyright="{lang: 'en'}"></p>
    </footer>
  </section>
</template>

<script type="text/babel">
  export default {
    methods: {
      back () {
        window.history.back()
      }
    }
  }
</script>
