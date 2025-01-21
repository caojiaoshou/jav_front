// Utilities
import {defineStore} from 'pinia'
import {SHA256} from "crypto-es/lib/sha256";
import Cookie from 'js-cookie';

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})
export const useGlobalFilter = defineStore('global-filter', {
  state: () => ({
    textValue: null
  }),
  actions: {
    update(newValue) {
      this.textValue = newValue
    },
    clear() {
      this.textValue = null
    }
  }
})
export const useGlobalPwd = defineStore('global-pwd', {
  state: () => ({
    pwdValue: null,
    salt: 'this is fucking salt'
  }),
  persist: true,
  actions: {
    update(newValue) {
      this.pwdValue = newValue
      this.updateCookie()
    },
    updateCookie() {
      if (this.pwdValue) {
        Cookie.set('x-access-token', this.sha256Pwd)
      } else {
        Cookie.remove('x-access-token')
      }
    }
  },
  getters: {
    sha256Pwd(state) {
      return SHA256(state.pwdValue + state.salt)
    }
  }
})

export const useSnackbar = defineStore('snackbar', {
  state: () => ({
    show: false,
    text: '',
    class: 'info'
  }),
  actions: {
    close() {
      this.show = false
      this.text = 'null'
      this.class = 'info'
    },
    add(text) {
      this.show = true
      this.text = text
      this.class = 'warning'
    },
    setShow(value) {
      this.show = value
    }
  }
})
