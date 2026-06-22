/* 植研所 Botanist Lab — 展示用 demo 會員系統（localStorage）
   ⚠️ 這是作品集展示用途，非真實認證。密碼不做真實加密，請勿輸入真實密碼。 */
(function () {
  var UKEY = 'botanist_users';     // 註冊的帳號（demo）
  var SKEY = 'botanist_session';   // 目前登入者
  var OKEY = 'botanist_orders';    // 訂單紀錄

  function users() { try { return JSON.parse(localStorage.getItem(UKEY)) || {}; } catch (e) { return {}; } }
  function saveUsers(u) { localStorage.setItem(UKEY, JSON.stringify(u)); }

  window.Auth = {
    register: function (email, name, pw) {
      var u = users();
      if (u[email]) return { ok: false, msg: '此 Email 已註冊' };
      // demo：僅作示意，不做真實雜湊
      u[email] = { name: name, email: email, pw: pw, created: Date.now() };
      saveUsers(u);
      localStorage.setItem(SKEY, email);
      return { ok: true };
    },
    login: function (email, pw) {
      var u = users();
      if (!u[email] || u[email].pw !== pw) return { ok: false, msg: 'Email 或密碼錯誤' };
      localStorage.setItem(SKEY, email);
      return { ok: true };
    },
    logout: function () { localStorage.removeItem(SKEY); },
    current: function () {
      var e = localStorage.getItem(SKEY);
      if (!e) return null;
      var u = users()[e];
      return u ? { name: u.name, email: u.email } : null;
    },
    orders: function () { try { return JSON.parse(localStorage.getItem(OKEY)) || []; } catch (e) { return []; } },
    addOrder: function (order) {
      var o = this.orders();
      o.unshift(order);
      localStorage.setItem(OKEY, JSON.stringify(o));
    },
  };

  // header 會員圖示狀態（登入後顯示名字縮寫）
  document.addEventListener('DOMContentLoaded', function () {
    var cur = window.Auth.current();
    document.querySelectorAll('.account-btn').forEach(function (el) {
      el.setAttribute('href', cur ? 'account.html' : 'login.html');
      el.setAttribute('title', cur ? cur.name : '登入');
    });
  });
})();
