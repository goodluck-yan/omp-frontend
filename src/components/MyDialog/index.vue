<template>
  <transition name="fade">
    <div class="dialog theme-dialog" v-if="visible">
      <div class="dialog-close theme-dialog-close" @click="onClose">
        <i class="el-icon-close"></i>
      </div>
      <header class="dialog-header theme-dialog-header">
        <slot name="header" v-if="$slots.header"></slot>
        <span v-else class="dialog-header-title">{{ title }}</span>
      </header>
      <main class="dialog-content">
          <slot name="content"></slot>
      </main>
      <footer class="dialog-footer theme-dialog-footer">
        <slot name="footer" v-if="$slots.footer"></slot>
        <div v-else class="dialog-footer-default">
          <button class="footer-btn" @click="onConfirm">{{ okText }}</button>
          <button class="footer-btn" @click="onCancel">{{ cancelText }}</button>
        </div>
      </footer>
    </div>
  </transition>
</template>

<script>
  /*
   * props:
   *   visible     Boolean   对话框的消失隐藏（必须加修饰符 .sync）
   *   title       String    标题文字，超出隐藏
   *   okText      String    确定按钮文字内容
   *   cancelText  String    取消按钮文字内容
   *   on-close    Function  关闭按钮回调函数
   *   on-ok       Function  确定按钮回调函数
   *   on-cancel   Function  取消按钮回调函数
   *
   * */
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '标题'
      },
      okText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      }
    },

    methods: {
      onClose() {
        this.$emit('on-cancel')
        this.$emit('update:visible', false)
      },
      onConfirm() {
        // 触发父组件的on-ok事件
        this.$emit('on-ok')
      },
      onCancel() {
        this.$emit('on-cancel')
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style lang="scss">
  .fade-enter,.fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  .fade-enter-active,.fade-leave-active {
    transition: all 0.3s
  }

  .dialog {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 1200;
    overflow: hidden;
    &-close {
      font-weight: 400;
      position: absolute;
      top: 6px;
      right: 20px;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
      padding: 5px;
      &:hover {
        color: #409eff;
      }
    }
    &-header {
      height: 40px;
      line-height: 40px;
      &-title {
        font-size: 18px;
        font-weight: 700;
        padding-left: 20px;
      }
    }
    &-content {
      padding: 10px;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &-footer {
      height: 40px;
      box-sizing: border-box;
      text-align: center;
      line-height: 40px;
    }
    &-footer-default {
      text-align: center;
      line-height: 40px;
    }
    .footer-btn {
      display: inline-block;
      margin-bottom: 0;
      font-weight: 500;
      text-align: center;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      white-space: nowrap;
      line-height: 1.5;
      padding: 4px 15px;
      font-size: 12px;
      user-select: none;
      outline: 0;
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      border-radius: 4px;
      border: 1px solid #409eff;
      &:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #fff;
      }
    }
  }
</style>
