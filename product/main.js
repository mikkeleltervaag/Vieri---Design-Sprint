document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    const id = parseInt(new URLSearchParams(window.location.search).get("id"))
    const product = PRODUCTS.find((p) => p.id === id)

    if (!product) {
        document.getElementById("product-page").innerHTML = `
            <div class="product-not-found">
                <span class="material-symbols-outlined">error_outline</span>
                <h2>Produkt ikke funnet</h2>
                <p>Vi fant ikke produktet du leter etter.</p>
                <a href="../order/" class="product-not-found__link">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Tilbake til bestilling
                </a>
            </div>
        `
        return
    }

    // Update page title and breadcrumb
    document.title = product.name + " — Vieri Bestilling"
    document.getElementById("breadcrumb-name").textContent = product.name

    const icon = CATEGORY_ICONS[product.category] || "inventory_2"
    const favIcon = product.isFavorite ? "favorite" : "favorite_border"
    const favClass = product.isFavorite ? " active" : ""
    const cartQty = Cart.getItemQuantity(product.id)

    const page = document.getElementById("product-page")
    page.innerHTML = `
        <div class="product-detail">
            <div class="product-detail__image">
                <div class="product-detail__icon-wrap">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="product-detail__image-actions">
                    <button class="product-detail__action-btn${favClass}" title="Favoritt" id="fav-btn">
                        <span class="material-symbols-outlined">${favIcon}</span>
                        ${product.isFavorite ? "Favoritt" : "Legg til favoritt"}
                    </button>
                    <button class="product-detail__action-btn" title="Sammenlign">
                        <span class="material-symbols-outlined">compare_arrows</span>
                        Sammenlign
                    </button>
                </div>
            </div>

            <div class="product-detail__info">
                <span class="product-detail__supplier">${product.supplier}</span>
                <h1 class="product-detail__name">${product.name}</h1>
                <p class="product-detail__desc">${product.description}</p>

                <div class="product-detail__meta">
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">Art.nr</span>
                        <span class="product-detail__meta-value">${product.artNr}</span>
                    </div>
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">Kategori</span>
                        <span class="product-detail__meta-value">${product.category}</span>
                    </div>
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">Produsent</span>
                        <span class="product-detail__meta-value">${product.manufacturer}</span>
                    </div>
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">Katalog</span>
                        <span class="product-detail__meta-value">${product.catalogue}</span>
                    </div>
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">Enhet</span>
                        <span class="product-detail__meta-value">1 ${product.unit}</span>
                    </div>
                    <div class="product-detail__meta-row">
                        <span class="product-detail__meta-label">MVA</span>
                        <span class="product-detail__meta-value">${product.vatRate} %</span>
                    </div>
                </div>

                <div class="product-detail__price-block">
                    <div class="product-detail__price">${formatPrice(product.price)}</div>
                    <div class="product-detail__price-sub">per ${product.unit} &middot; + MVA ${product.vatRate} %</div>
                </div>

                <div class="product-detail__cart">
                    <div class="product-detail__qty">
                        <button class="product-detail__qty-btn" id="qty-decrease">−</button>
                        <input type="number" id="qty-input" value="${cartQty > 0 ? cartQty : 1}" min="1" />
                        <button class="product-detail__qty-btn" id="qty-increase">+</button>
                    </div>
                    <button class="product-detail__add-btn" id="add-to-cart-btn">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                        Legg i handlekurv
                    </button>
                </div>
            </div>
        </div>

        <div class="product-related" id="related-products">
            <h2>Lignende produkter</h2>
            <div class="product-related__grid" id="related-grid"></div>
        </div>
    `

    // ── Quantity controls ──
    const qtyInput = document.getElementById("qty-input")
    document.getElementById("qty-decrease").addEventListener("click", () => {
        const current = parseInt(qtyInput.value) || 1
        if (current > 1) qtyInput.value = current - 1
    })
    document.getElementById("qty-increase").addEventListener("click", () => {
        const current = parseInt(qtyInput.value) || 1
        qtyInput.value = current + 1
    })

    // ── Add to cart ──
    const addBtn = document.getElementById("add-to-cart-btn")
    addBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput.value) || 1
        Cart.addItem(product.id, qty)
        addBtn.innerHTML = `
            <span class="material-symbols-outlined">check</span>
            Lagt til i handlekurv
        `
        addBtn.classList.add("product-detail__add-btn--added")
        setTimeout(() => {
            addBtn.innerHTML = `
                <span class="material-symbols-outlined">add_shopping_cart</span>
                Legg i handlekurv
            `
            addBtn.classList.remove("product-detail__add-btn--added")
        }, 2000)
    })

    // ── Related products ──
    const related = PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4)

    const relatedGrid = document.getElementById("related-grid")
    for (const p of related) {
        const pIcon = CATEGORY_ICONS[p.category] || "inventory_2"
        const card = document.createElement("a")
        card.href = `?id=${p.id}`
        card.className = "related-card"
        card.innerHTML = `
            <div class="related-card__icon">
                <span class="material-symbols-outlined">${pIcon}</span>
            </div>
            <div class="related-card__info">
                <span class="related-card__supplier">${p.supplier}</span>
                <span class="related-card__name">${p.name}</span>
                <span class="related-card__price">${formatPriceShort(p.price)}</span>
            </div>
        `
        relatedGrid.appendChild(card)
    }

    if (related.length === 0) {
        document.getElementById("related-products").hidden = true
    }
})
