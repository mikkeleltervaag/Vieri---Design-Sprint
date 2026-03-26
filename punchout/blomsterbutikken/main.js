const FLOWERS = [
    {
        id: "flower-1",
        name: "Rosenbukett Klassisk",
        description: "12 røde roser med grønt tilbehør",
        price: 499,
        emoji: "🌹",
        icon: "local_florist",
    },
    {
        id: "flower-2",
        name: "Tulipanbukett Vår",
        description: "15 blandede tulipaner i sesongfarger",
        price: 349,
        emoji: "🌷",
        icon: "local_florist",
    },
    {
        id: "flower-3",
        name: "Solsikkebukett",
        description: "7 store solsikker med eucalyptus",
        price: 399,
        emoji: "🌻",
        icon: "local_florist",
    },
    {
        id: "flower-4",
        name: "Orkidé i potte",
        description: "Phalaenopsis orkidé i dekorativ keramikkpotte",
        price: 599,
        emoji: "🪻",
        icon: "potted_plant",
    },
    {
        id: "flower-5",
        name: "Suksulentmix",
        description: "3 sukkulenter i minimalistiske potter",
        price: 299,
        emoji: "🪴",
        icon: "potted_plant",
    },
    {
        id: "flower-6",
        name: "Liljearrangement",
        description: "Hvite og rosa liljer i elegant innpakning",
        price: 449,
        emoji: "🌸",
        icon: "local_florist",
    },
]

// ── Local cart state (for the flower shop only) ──
let shopCart = []

function formatKr(price) {
    return price.toLocaleString("nb-NO") + ",-"
}

// ── Render products ──
function renderProducts() {
    const list = document.getElementById("product-list")
    list.innerHTML = ""

    for (const flower of FLOWERS) {
        const inCart = shopCart.find((i) => i.id === flower.id)
        const card = document.createElement("div")
        card.className = "flower-card"
        card.innerHTML = `
            <div class="flower-card__img">
                <span>${flower.emoji}</span>
            </div>
            <div class="flower-card__body">
                <div class="flower-card__name">${flower.name}</div>
                <div class="flower-card__desc">${flower.description}</div>
                <div class="flower-card__footer">
                    <span class="flower-card__price">${formatKr(flower.price)}</span>
                    <button class="flower-card__add-btn${inCart ? " flower-card__add-btn--added" : ""}" data-id="${flower.id}">
                        <span class="material-symbols-outlined">${inCart ? "check" : "add"}</span>
                        ${inCart ? "Lagt til" : "Legg til"}
                    </button>
                </div>
            </div>
        `
        list.appendChild(card)
    }

    // Bind add buttons
    list.querySelectorAll(".flower-card__add-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id
            const flower = FLOWERS.find((f) => f.id === id)
            if (!flower) return

            const existing = shopCart.find((i) => i.id === id)
            if (existing) {
                existing.quantity++
            } else {
                shopCart.push({ ...flower, quantity: 1 })
            }

            btn.classList.add("flower-card__add-btn--added")
            btn.innerHTML = `
                <span class="material-symbols-outlined">check</span>
                Lagt til
            `

            updateBadge()
            renderCartPanel()
        })
    })
}

// ── Update badge ──
function updateBadge() {
    const badge = document.getElementById("cart-badge")
    const count = shopCart.reduce((sum, i) => sum + i.quantity, 0)
    if (count > 0) {
        badge.textContent = count
        badge.hidden = false
    } else {
        badge.hidden = true
    }
}

// ── Render cart panel ──
function renderCartPanel() {
    const itemsContainer = document.getElementById("cart-items")
    const footer = document.getElementById("cart-footer")

    if (shopCart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-panel__empty">
                <span class="material-symbols-outlined">shopping_basket</span>
                <p>Handlekurven er tom</p>
            </div>
        `
        footer.hidden = true
        return
    }

    footer.hidden = false

    let html = ""
    let total = 0
    for (const item of shopCart) {
        total += item.price * item.quantity
        html += `
            <div class="cart-item" data-id="${item.id}">
                <span class="cart-item__icon">${item.emoji}</span>
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__price">${formatKr(item.price)}</div>
                </div>
                <div class="cart-item__qty">
                    <button data-action="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button data-action="increase">+</button>
                </div>
                <button class="cart-item__remove" data-remove="${item.id}">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `
    }

    itemsContainer.innerHTML = html
    document.getElementById("cart-total").textContent = formatKr(total)

    // Bind qty buttons
    itemsContainer.querySelectorAll(".cart-item__qty button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const itemEl = btn.closest(".cart-item")
            const id = itemEl.dataset.id
            const item = shopCart.find((i) => i.id === id)
            if (!item) return

            if (btn.dataset.action === "increase") {
                item.quantity++
            } else if (item.quantity > 1) {
                item.quantity--
            } else {
                shopCart = shopCart.filter((i) => i.id !== id)
            }

            updateBadge()
            renderCartPanel()
            renderProducts()
        })
    })

    // Bind remove buttons
    itemsContainer.querySelectorAll(".cart-item__remove").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.remove
            shopCart = shopCart.filter((i) => i.id !== id)
            updateBadge()
            renderCartPanel()
            renderProducts()
        })
    })
}

// ── Cart panel open/close ──
function openCart() {
    document.getElementById("cart-panel").classList.add("open")
    document.getElementById("cart-overlay").hidden = false
}

function closeCart() {
    document.getElementById("cart-panel").classList.remove("open")
    document.getElementById("cart-overlay").hidden = true
}

// ── Send to Vieri ──
function sendToVieri() {
    // Read the Vieri punchout cart from localStorage
    const PUNCHOUT_STORAGE_KEY = "vieri-punchout-cart"
    let existingItems = []
    try {
        existingItems = JSON.parse(localStorage.getItem(PUNCHOUT_STORAGE_KEY)) || []
    } catch {
        existingItems = []
    }

    // Add each shop cart item to Vieri punchout cart
    for (const item of shopCart) {
        const existing = existingItems.find((i) => i.id === item.id)
        if (existing) {
            existing.quantity += item.quantity
        } else {
            existingItems.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                supplier: "Blomsterbutikken",
                icon: item.icon,
            })
        }
    }

    localStorage.setItem(PUNCHOUT_STORAGE_KEY, JSON.stringify(existingItems))

    // Also trigger cart-updated for badge count
    window.dispatchEvent(new CustomEvent("cart-updated"))

    // Close cart panel
    closeCart()

    // Show success toast
    showSuccessToast()
}

function showSuccessToast() {
    // Create backdrop
    const backdrop = document.createElement("div")
    backdrop.className = "success-backdrop"
    document.body.appendChild(backdrop)

    // Create toast
    const toast = document.createElement("div")
    toast.className = "success-toast"
    const count = shopCart.reduce((sum, i) => sum + i.quantity, 0)
    toast.innerHTML = `
        <div class="success-toast__icon">
            <span class="material-symbols-outlined" style="font-size:3rem;color:#4a9e6e">check_circle</span>
        </div>
        <h3>${count} produkt${count > 1 ? "er" : ""} sendt til Vieri</h3>
        <p>Produktene er lagt til i din Vieri-handlekurv og er klar for godkjenning.</p>
        <a href="../../cart-v2/index.html" class="success-toast__btn">
            Gå til handlekurv
            <span class="material-symbols-outlined">arrow_forward</span>
        </a>
    `
    document.body.appendChild(toast)

    // Animate in
    requestAnimationFrame(() => {
        backdrop.classList.add("visible")
        toast.classList.add("visible")
    })

    // Clear shop cart
    shopCart = []
    updateBadge()
    renderCartPanel()
    renderProducts()

    // Click backdrop to go back to dashboard
    backdrop.addEventListener("click", () => {
        window.location.href = "../../dashboard/index.html"
    })
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
    renderProducts()

    document.getElementById("cart-toggle").addEventListener("click", openCart)
    document.getElementById("cart-close").addEventListener("click", closeCart)
    document.getElementById("cart-overlay").addEventListener("click", closeCart)
    document.getElementById("send-to-vieri").addEventListener("click", sendToVieri)
})
