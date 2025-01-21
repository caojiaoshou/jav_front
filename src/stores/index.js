// Utilities
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
  createPersistedState(
    {
      afterRestore: (context) => {
        const globalPwd = context.store.useGlobalPwd
        globalPwd.updateCookie()
      },
    }
  )
)
export default pinia
