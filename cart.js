/* 植研所 Botanist Lab — 前端購物車（localStorage） */
(function () {
  var KEY = 'botanist_cart';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    render();
  }
  function count() {
    return read().reduce(function (s, i) { return s + i.qty; }, 0);
  }
  function total() {
    return read().reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }

  window.Cart = {
    add: function (id, name, price, img, qty) {
      qty = qty || 1;
      var items = read();
      var found = items.find(function (i) { return i.id === id; });
      if (found) found.qty += qty;
      else items.push({ id: id, name: name, price: price, img: img, qty: qty });
      write(items);
      openDrawer();
    },
    setQty: function (id, qty) {
      var items = read();
      var it = items.find(function (i) { return i.id === id; });
      if (it) { it.qty = Math.max(1, qty); write(items); }
    },
    remove: function (id) {
      write(read().filter(function (i) { return i.id !== id; }));
    },
    items: read,
    count: count,
    total: total,
  };

  function fmt(n) { return 'NT$ ' + n.toLocaleString('en-US'); }

  function render() {
    // 數量徽章
    var c = count();
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });
    // 抽屜內容
    var body = document.querySelector('.cart-drawer-body');
    if (!body) return;
    var items = read();
    if (!items.length) {
      body.innerHTML = '<div class="cart-empty">購物車是空的</div>';
    } else {
      body.innerHTML = items.map(function (i) {
        return '<div class="cart-item">' +
          '<img src="' + i.img + '" alt="' + i.name + '">' +
          '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + i.name + '</div>' +
          '<div class="cart-item-price">' + fmt(i.price) + '</div>' +
          '<div class="cart-qty">' +
          '<button onclick="Cart.setQty(\'' + i.id + '\',' + (i.qty - 1) + ')">−</button>' +
          '<span>' + i.qty + '</span>' +
          '<button onclick="Cart.setQty(\'' + i.id + '\',' + (i.qty + 1) + ')">+</button>' +
          '</div></div>' +
          '<button class="cart-item-remove" onclick="Cart.remove(\'' + i.id + '\')" aria-label="移除">×</button>' +
          '</div>';
      }).join('');
    }
    var tot = document.querySelector('.cart-total-amount');
    if (tot) tot.textContent = fmt(total());
    var foot = document.querySelector('.cart-drawer-foot');
    if (foot) foot.style.display = items.length ? 'block' : 'none';
  }

  function openDrawer() {
    var d = document.querySelector('.cart-drawer');
    var bd = document.querySelector('.cart-backdrop');
    if (d) d.classList.add('open');
    if (bd) bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    var d = document.querySelector('.cart-drawer');
    var bd = document.querySelector('.cart-backdrop');
    if (d) d.classList.remove('open');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openCart = openDrawer;
  window.closeCart = closeDrawer;

  document.addEventListener('DOMContentLoaded', function () {
    render();
    var bd = document.querySelector('.cart-backdrop');
    if (bd) bd.addEventListener('click', closeDrawer);
  });
})();
