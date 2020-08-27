import * as types from './mutation-types'

const mutations = {
  [types.SET_COLLAPSE](state, flag) {
    state.isCollapse = flag;
  },
  [types.SET_MENU_LIST](state, menuList) {
    state.menuList = menuList;
  },
  [types.SET_SKIN](state, skin) {
    state.skin = skin;
  },
  [types.SET_USER_INFO](state, userinfo) {
    state.userinfo = userinfo;
  },
  [types.SET_PERMISSION_TREE_LIST](state, permissionTreeList) {
    state.permissionTreeList = permissionTreeList;
  },
  [types.SET_TOP_ACTIVE_INDEX](state, topActiveIndex) {
    state.topActiveIndex = topActiveIndex;
  },
  [types.SET_LEFT_ACTIVE_INDEX](state, leftActiveIndex) {
    state.leftActiveIndex = leftActiveIndex;
  },
}
export default mutations
