import { displayItems } from "./checkoutDisplay.js";
import { showMessage } from "../scripts/showMessage.js";

/* ================= WHATSAPP SENDER ================= */
function sendToWhatsApp(message) {
  const businessNumber = "254742037243"; // your number
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${businessNumber}?text=${encodedMessage}`;
  window.open(whatsappURL, "_blank");
}

/* ================= CHECKOUT HANDLER ================= */
function handleCheckoutProcess() {
  const checkoutForm = document.querySelector(".checkout-form");
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    /* ---------- USER / GUEST NAME ---------- */
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    const nameInput = document.querySelector(".customer-name");
    const customerName =
      loggedInUser?.userName || nameInput?.value.trim();

    if (!customerName) {
      showMessage('please login first', 'error')
      window.location.href = 'signup.html'
      return;
    }

    /* ---------- PHONE ---------- */
    const phoneNumber = document.querySelector(".phone-number").value.trim();
    const phoneRegex = /^(07\d{8}|01\d{8})$/;

    if (!phoneRegex.test(phoneNumber)) {
     showMessage('please enter a valid phone number', 'error')
      return;
    }

    /* ---------- PICKUP POINT ---------- */
    const pickupPoint = document.querySelector(".pickup-point").value.trim();
    if (!pickupPoint) {
      showMessage('please enter a pickup point', 'error')
      return;
    }

    /* ---------- DELIVERY ---------- */
    const deliveryOption = document.querySelector(
      'input[name="delivery"]:checked'
    );

    if (!deliveryOption) {
      showMessage('please enter pickup point', 'error')
      return;
    }

    const deliveryFee = deliveryOption.value === "thika" ? 50 : 150;
    const deliveryZoneText =
      deliveryOption.value === "thika"
        ? "Along Thika Road"
        : "Outside Thika Road";

    /* ---------- CART ---------- */
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      showMessage('your cart is empty', '')
      return;
    }

    /* ---------- PRODUCT DETAILS ---------- */
    const productDetails = cart
      .map(
        (item, index) => `
${index + 1}. ${item.productName}
Color: ${item.color}
Size: ${item.size}
Quantity: ${item.quantity}
Subtotal: Ksh ${item.productPrice * item.quantity}
`
      )
      .join("\n");

    const productsTotal = cart.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );

    const grandTotal = productsTotal + deliveryFee;

    /* ---------- WHATSAPP MESSAGE ---------- */
    const message = `
🛒 NEW ORDER (Cash on Delivery)
--------------------------------
Name: ${customerName}
Phone: ${phoneNumber}
Pickup Point: ${pickupPoint}
Delivery Zone: ${deliveryZoneText}
Delivery Fee: Ksh ${deliveryFee}

📦 PRODUCTS
${productDetails}

Products Total: Ksh ${productsTotal}
💰 TOTAL PAYABLE: Ksh ${grandTotal}
`;

    console.log(message);

    /* ---------- SEND ---------- */
    sendToWhatsApp(message);

    /* ---------- OPTIONAL LOCAL BACKUP ---------- */
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      name: customerName,
      phoneNumber,
      cart,
      total: grandTotal,
      date: new Date().toISOString(),
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    showMessage('Order sent successfully! You will receive a call shortly', error)

    /* ---------- CLEANUP ---------- */
    localStorage.removeItem("cart");
    checkoutForm.reset();
  });
}

/* ================= INIT ================= */
handleCheckoutProcess();
displayItems();
calculateToCheckoutJs();
updateUserName();