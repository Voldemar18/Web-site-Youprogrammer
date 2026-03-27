// js/main.js

// --- Управление корзиной (localStorage) ---
let cart = [];

function loadCart() {
    const saved = localStorage.getItem('techCart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('techCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId, name, price) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }
    saveCart();
    alert(`${name} добавлен в корзину`);
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-count');
    cartCounters.forEach(el => {
        if (el) el.textContent = count;
        if (count === 0 && el) el.style.display = 'none';
        else if (el) el.style.display = 'flex';
    });
    
    // Если мы на странице корзины, перерисовываем таблицу
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center">Корзина пуста</td></tr>';
        document.getElementById('cart-total').innerText = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <tr>
                <td>${item.name}</td>
                <td><input type="number" value="${item.quantity}" min="1" style="width:60px" data-idx="${index}" class="cart-qty"></td>
                <td>${item.price} ₽</td>
                <td>${itemTotal} ₽</td>
                <td><button class="btn-outline" data-idx="${index}" style="padding:4px 8px" id="remove-item-${index}">Удалить</button></td>
            </tr>
        `;
    });
    container.innerHTML = html;
    document.getElementById('cart-total').innerText = total;
    
    // Добавляем обработчики
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = e.target.dataset.idx;
            cart[idx].quantity = parseInt(e.target.value);
            saveCart();
        });
    });
    cart.forEach((_, idx) => {
        const btn = document.getElementById(`remove-item-${idx}`);
        if(btn) btn.onclick = () => {
            cart.splice(idx, 1);
            saveCart();
        };
    });
}

// --- Онлайн консультант (Виджет) ---
function initConsultant() {
    const widget = document.getElementById('consultantWidget');
    if (!widget) return;
    
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const closeChat = document.getElementById('closeChat');
    
    widget.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden') && chatMessages.children.length === 0) {
            addBotMessage("Здравствуйте! Соединяем вас со свободным консультантом. Среднее время ответа — 2 минуты. Задайте ваш вопрос.");
        }
    });
    if(closeChat) closeChat.addEventListener('click', () => chatWindow.classList.add('hidden'));
    
    function addBotMessage(text) {
        const div = document.createElement('div');
        div.style.background = '#2a2d36';
        div.style.padding = '8px';
        div.style.borderRadius = '12px';
        div.style.marginBottom = '8px';
        div.style.alignSelf = 'flex-start';
        div.style.maxWidth = '90%';
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.style.background = '#c084fc';
        div.style.color = '#111317';
        div.style.padding = '8px';
        div.style.borderRadius = '12px';
        div.style.marginBottom = '8px';
        div.style.alignSelf = 'flex-end';
        div.style.maxWidth = '90%';
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function sendMessage() {
        const text = chatInput.value.trim();
        if(!text) return;
        addUserMessage(text);
        chatInput.value = '';
        
        // Имитация ответа бота/специалиста
        setTimeout(() => {
            if(text.toLowerCase().includes('игровой') || text.toLowerCase().includes('ноутбук')) {
                addBotMessage("Рекомендую обратить внимание на серию ASUS ROG или MSI Katana. У нас есть модели с RTX 4060. Могу прислать ссылки?");
            } else if(text.toLowerCase().includes('совместимость')) {
                addBotMessage("Для проверки совместимости используйте наш Конфигуратор ПК. Если нужна помощь, живой специалист подключится через минуту.");
            } else {
                addBotMessage("Спасибо за вопрос! Наш специалист скоро ответит. А пока, посмотрите акционные товары на главной.");
            }
        }, 1000);
    }
    
    if(sendBtn) sendBtn.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
}

// --- Инициализация всех кнопок "В корзину" на странице ---
function initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            addToCart(id, name, price);
        });
    });
}

// --- Простая имитация сравнения (для демо) ---
function initCompare() {
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Товар добавлен в сравнение. Перейдите в раздел сравнения (в разработке)');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initConsultant();
    initAddToCartButtons();
    initCompare();
});