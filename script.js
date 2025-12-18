// Defensive global page toggler
function showPage(id) {
  try {
    const target = document.getElementById(id);
    if (!target) {
      console.error(`showPage: no element found with id="${id}"`);
      return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    target.classList.add('active');
    window.scrollTo(0, 0);

    // ✅ IMPORTANT: Render cart when cart page opens
    if (id === "page3") {
      renderCart();
    }

  } catch (err) {
    console.error('showPage error:', err);
  }
}


// Wire up data-target buttons (works with category cards, service cards, and btn/back-btn)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-target]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-target');
      if (!id) return console.warn('data-target missing on', el);
      showPage(id);
    });
  });
  console.log('script loaded — page navigation active');
});

// FEEDBACK FORM (keeps feedback in-page)
function submitFeedback() {
  const name = document.getElementById('customerName').value.trim();
  const text = document.getElementById('feedbackText').value.trim();
  if (!text) {
    alert('Please enter your feedback before submitting!');
    return;
  }

  const container = document.getElementById('feedbackContainer');
  if (container.querySelector('p')) container.innerHTML = '';

  const item = document.createElement('div');
  item.className = 'feedback-item';

  const displayName = name || 'Anonymous Customer';
  const timestamp = new Date().toLocaleString();

  item.innerHTML = `<strong>${escapeHtml(displayName)}</strong><small style="color:#999;margin-left:8px">${escapeHtml(timestamp)}</small><p style="margin-top:8px">${escapeHtml(text)}</p>`;

  container.insertBefore(item, container.firstChild);

  document.getElementById('customerName').value = '';
  document.getElementById('feedbackText').value = '';
  alert('Thank you for your feedback!');
}

// small escape helper to avoid simple injection
function escapeHtml(str) {
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}
// CART STORAGE
// CART DATA
let cart = [];

// ADD TO CART
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  alert(`${name} added to cart`);
}


// RENDER CART TABLE
function renderCart() {
  const tbody = document.getElementById("cartTableBody");
  const grandTotalEl = document.getElementById("grandTotal");

  tbody.innerHTML = "";
  let grandTotal = 0;

  if (cart.length === 0) {
    grandTotalEl.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    grandTotal += itemTotal;

    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
          <button onclick="updateQty(${index}, -1)">−</button>
          ${item.qty}
          <button onclick="updateQty(${index}, 1)">+</button>
        </td>
        <td>${itemTotal}</td>
        <td>
          <button onclick="removeItem(${index})">❌</button>
        </td>
      </tr>
    `;
  });

  grandTotalEl.textContent = grandTotal;
}


// UPDATE QUANTITY
function updateQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

// REMOVE ITEM
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// DONE BUTTON
function finishCart() {
  alert("✅ Thank you! Your cart is ready. Continue shopping ❤️");
  showPage("page2");
}

// LOAD CART WHEN PAGE OPENS
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('[data-target="page3"]')?.addEventListener("click", () => {
    setTimeout(renderCart, 50);
  });
});
