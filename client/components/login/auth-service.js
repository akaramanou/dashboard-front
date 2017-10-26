class AuthService {
  constructor($q, $auth, ApiService, AppStore, ResetPasswordValidator) {
    'ngInject';
    this._twitterUser = null;
    this._profile = null;
    this._$q = $q;
    this._$auth = $auth;
    this._ApiService = ApiService;
    this._AppStore = AppStore;
    this._ResetPasswordValidator = ResetPasswordValidator;

    this.loadTwitterUser()
  }

  getUser() {
    return this._twitterUser;
  }

  currentProfile(profile) {
    if (profile) {
      this._AppStore.set('profile', profile);
      this._profile = profile;
    } else {
      profile = this._AppStore.get('profile');
      if (profile) {
        this._profile = profile;
      }
    }
    return this._profile;
  }

  isAuthenticated() {
    return this._$auth.isAuthenticated();
  }

  getToken() {
    let token = this._$auth.getToken();
    return token.split(' ')[1];
  }

  login(data) {
    return this._$auth.login(data).then((response) => {
      var profile = response.data.user;
      
      return this.loadTwitterUser().then(() => {
        return this.currentProfile(profile);
      });
    });
  }

  signup(data) {
    return this._ApiService.post('/signup', data).then((response) => {
      var profile = response.data.user;
      
      return this.loadTwitterUser().then(() => {
        this._$auth.setToken(response.data.auth);
        return this.currentProfile(profile);
      });
    });
  }

  logout() {
    return this._ApiService.delete('/logout').then(() => {
      return this._$auth.logout().then(() => {
        this._AppStore.remove('profile');
      });
    });
  }

  forgotPassword(email) {
    return this._ApiService.post('/login/forgot', { email });
  }

  resetPassword(data) {
    let validator = new this._ResetPasswordValidator(data);

    if (validator.isValid()) {
      return this._ApiService.post('/login/reset', data).then((res) => {
        this.currentProfile(res.data.user);
        this._$auth.setToken(res.data.auth);
        return res;
      }).catch((res) => {
        return this._$q.reject(res.data.message);
      });
    } else {
      let deferred = this._$q.defer();
      deferred.reject(validator.getMessages());
      return deferred.promise;
    }
  }

  loadTwitterUser() {
    if (!this.isAuthenticated()) return this._$q.resolve();

    return this._ApiService.get('/profile').then((response) => {
      this._twitterUser = response.data;
      this._twitterUser.handle = this._twitterUser.handle[0];
      return this._twitterUser;
    })
  }

}

module.exports = AuthService;