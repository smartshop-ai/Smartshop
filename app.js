// app.js

const DB_NAME = "SmartShopDB";

let db;
let cart = [];
let html5QrCode;

const initDB = () => {

const request = indexedDB.open(DB_NAME, 1);

request.onupgradeneeded = (e) => {

db = e.target.result;

db.createObjectStore("products", {
keyPath: "id",
autoIncrement: true
});

};

request.onsuccess = (e) => {
db = e.target.result;
loadInventory();
};

};

const showSection = (id, btn) => {

document.querySelectorAll('.content-section')
.forEach(sec => sec.classList.add('hidden'));

document.getElementById(id)
.classList.remove('hidden');

document.querySelectorAll('.nav-btn')
.forEach(btn2 => btn2.classList.remove('active'));

btn.classList.add('active');

};

const toggleModal = () => {
document.getElementById('product-modal')
.classList.toggle('hidden');
};

const saveProduct = () => {

const product = {

name: document.getElementById('p-name').value,

barcode: document.getElementById('p-barcode').value,

price: parseFloat(document.getElementById('p-price').value)

};

const tx = db.transaction("products", "readwrite");

tx.objectStore("products").add(product);

tx.oncomplete = () => {

toggleModal();

loadInventory();

};

};

const loadInventory = () => {

const tx = db.transaction("products", "readonly");

const store = tx.objectStore("products");

store.getAll().onsuccess = (e) => {

const list = document.getElementById('inventory-list');

list.innerHTML = e.target.result.map(p => `

<div class="glass-card p-4">

<h3 class="font-bold">${p.name}</h3>

<p>₹${p.price}</p>

<p>${p.barcode}</p>

<button onclick="addToCart('${p.name}', ${p.price})"
class="bg-emerald-500 text-black p-2 rounded-lg mt-2">
Add To Bill
</button>

</div>

`).join('');

};

};

const addToCart = (name, price) => {

cart.push({name, price});

renderCart();

};

const renderCart = () => {

const cartDiv = document.getElementById('cart-items');

cartDiv.innerHTML = cart.map(item => `

<div class="flex justify-between border-b border-white/10 py-2">

<span>${item.name}</span>

<span>₹${item.price}</span>

</div>

`).join('');

const total = cart.reduce((sum, item) => sum + item.price, 0);

document.getElementById('bill-total')
.innerText = `₹${total}`;

};

const finalizeBill = () => {

const total = document.getElementById('bill-total').innerText;

const customer =
document.getElementById('cust-name').value || "Customer";

const msg =
`Customer: ${customer}%0ATotal: ${total}`;

window.open(`https://wa.me/?text=${msg}`, '_blank');

};

const toggleScanner = async () => {

const reader = document.getElementById('reader');

if(html5QrCode){

await html5QrCode.stop();

html5QrCode = null;

reader.classList.add('hidden');

}else{

reader.classList.remove('hidden');

html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
{ facingMode: "environment" },
{ fps: 10, qrbox: 250 },

(decodedText) => {

const tx = db.transaction("products","readonly");

const store = tx.objectStore("products");

store.getAll().onsuccess = (e) => {

const product = e.target.result.find(
p => p.barcode === decodedText
);

if(product){
addToCart(product.name, product.price);
}

};

}

);

}

};

initDB();
