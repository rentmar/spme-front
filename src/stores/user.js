
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    userRole: null, // aqui 'admin', 'user', 'editor'
  }),
  actions: {
    setUserData(role) {
      this.isAuthenticated = true;
      this.userRole = role;
    },
    clearUserData() {
      this.isAuthenticated = false;
      this.userRole = null;
    },
  },
});
