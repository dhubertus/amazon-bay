$(document).ready(() => {
  receiveInventory();
  persistCart();
  receiveAllOrders();
});


const receiveInventory = () => {
  fetch('/api/v1/inventory')
    .then((res) => res.json())
    .then((array) => {
      prependInventory(array);
    });
};

const prependInventory = (array) => {
  $('#card-holder').empty();

  array.forEach((item) => {
    const adjustedPrice = `$${item.price / 1000}.00`;

    $('#card-holder').prepend(
      `<article class="card">
        <h5 class='card-title'>${item.title}</h5>
        <h5 class='card-desc'>${item.description}</h5>
        <img class='card-img' src=${item.link}>
        <h5 class='card-price'>${adjustedPrice}</h5>
        <button class='add-to-cart-btn' type="button" name="button">ADD TO CART</button>
      </article>`
    );
  });
};

const persistCart = () => {

  if (!localStorage.getItem('cartArray')) {
    return;
  }

  const currentLS = JSON.parse(localStorage.getItem('cartArray'));

  currentLS.map((obj) => {
    prependCartItem(obj);
    adjustTotal(obj.price);
  });
};

$('.cart-toggle').on('click', function() {
  $('.cart-full').toggleClass('toggle-cart-display');
});

$('.history-toggle').on('click', function() {
  $('.history-full').toggleClass('toggle-history-display');
});



const prependCartItem = (obj) => {
  $('.item-list').prepend(
    `<div class="single-item">
      <p>${obj.title}</p>
      <p>${obj.price}</p>
    </div>`
  );
};

const addItemToCart = (obj) => {
  prependCartItem(obj);
  adjustTotal(obj.price);
  setCartItemInLS(obj);
};

const adjustTotal = (price) => {
  const priceInCents = dollarsToCents(price);
  const currentTotal = $('.total-value-price').text();
  const currentTotalInCents = dollarsToCents(currentTotal);
  const newTotalInCents = priceInCents + currentTotalInCents;
  const newTotalInDollars = centsToDollars(newTotalInCents);

  $('.total-value-price').text(newTotalInDollars);
};

const dollarsToCents = (string) => {
  return parseInt(string.split('').filter((item) => {
    if (item !== '$' && item !== '.') {
      return item;
    }
  }).join(''));
};

const centsToDollars = (int) => {
  return `$${int / 100}.00`;
};

const setCartItemInLS = (obj) => {

  if (!localStorage.getItem('cartArray')) {
    const stringArray = JSON.stringify([]);

    localStorage.setItem('cartArray', stringArray);
  }
  const cartArray = JSON.parse(localStorage.getItem('cartArray'));

  cartArray.push(obj);
  const stringCartArray = JSON.stringify(cartArray);

  localStorage.setItem('cartArray', stringCartArray);
};


$('#card-holder').on('click', '.add-to-cart-btn', function () {
  const title = this.closest('.card').children[0].innerText;
  const price = this.closest('.card').children[3].innerText;
  const cartObj = { title, price };

  addItemToCart(cartObj);
});


$('.purchase-btn').on('click', function() {
  createOrder();
});


const createOrder = () => {
  const orderTotal = dollarsToCents($('.total-value-price').text());

  fetch('/api/v1/history', {
    method: 'POST',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ total: orderTotal })
  })
    .then(() => {
      receiveAllOrders();
      localStorage.clear();
      $('.total-value-price').text('$0.00');
      $('.item-list').empty();
    });
};

const receiveAllOrders = () => {
  fetch('/api/v1/history')
    .then((res) => res.json())
    .then((result) => {
      prependAllOrders(result);
    });
};

const prependAllOrders = (array) => {
  $('.order-list').empty();
  array.forEach((obj, i) => {
    const orderTotal = centsToDollars(obj.total);

    $('.order-list').prepend(
      `<div class="single-order">
        <p>Order#:<span>${i + 1}</span></p>
        <p>${obj.created_at}</p>
        <p>Total:<span>${orderTotal}</span></p>
      </div>`
    );
  });
};
