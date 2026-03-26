document.addEventListener("DOMContentLoaded", async () => {
    loadSharedComponents()
    await loadComponent(".order-hero", "components/order-hero.html")
    loadComponent("#tasks-slot", "components/tasks.html")
    loadComponent("#best-sellers-slot", "components/best-sellers.html")
    loadComponent("#news-featured-slot", "components/news-featured.html")
    loadComponent("#news-list-slot", "components/news-list.html")

    const hero = document.querySelector(".order-hero")
    const input = hero.querySelector("input")
    const full = input.placeholder
    const short = "Søk..."

    new ResizeObserver(([entry]) => {
        input.placeholder = entry.contentRect.width <= 1000 ? short : full
    }).observe(hero)

    initSearch(hero, input)
})

function initSearch(hero, input) {
    const dropdown = hero.querySelector(".search-dropdown")
    const resultsList = hero.querySelector(".search-dropdown__results")
    const cartBar = hero.querySelector(".search-dropdown__cart-bar")
    const cartCount = hero.querySelector(".search-dropdown__cart-count")
    const helpToggle = hero.querySelector("#help-toggle")
    const helpPanel = hero.querySelector("#help-panel")

    if (helpToggle && helpPanel) {
        helpToggle.addEventListener("click", (e) => {
            e.stopPropagation()
            const isOpen = !helpPanel.hidden
            helpPanel.hidden = isOpen
            helpToggle.classList.toggle("active", !isOpen)
        })
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim()

        // Search punchout items
        const punchoutMatches = q
            ? PUNCHOUT_ITEMS.filter(
                  (p) =>
                      p.name.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.keywords.some((k) => k.includes(q))
              )
            : PUNCHOUT_ITEMS

        // Search regular products
        const productMatches = q
            ? PRODUCTS.filter(
                  (p) =>
                      p.name.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q)
              )
            : PRODUCTS.slice(0, 8)

        resultsList.innerHTML = ""

        if (punchoutMatches.length === 0 && productMatches.length === 0) {
            resultsList.innerHTML = `
                <li class="search-dropdown__no-results">
                    <div class="no-results__icon">
                        <span class="material-symbols-outlined">search_off</span>
                    </div>
                    <p class="no-results__title">Ingen resultater for «${q}»</p>
                    <p class="no-results__subtitle">Fant du ikke det du lette etter? Prøv en av disse:</p>
                    <div class="no-results__actions">
                        <a href="../order/?filter=nettbutikk" class="no-results__btn no-results__btn--punchout">
                            <span class="material-symbols-outlined">storefront</span>
                            Søk i nettbutikker
                        </a>
                        <button class="no-results__btn no-results__btn--freetext" onclick="FreetextModal.open()">
                            <span class="material-symbols-outlined">edit_note</span>
                            Legg til som fritekst
                        </button>
                        <a href="#" class="no-results__btn no-results__btn--agreement" onclick="event.preventDefault()">
                            <span class="material-symbols-outlined">handshake</span>
                            Sjekk våre avtaler
                        </a>
                        <button class="no-results__btn no-results__btn--request" onclick="alert('Forespørsel sendt! Innkjøpsavdelingen vil vurdere å legge til produktet.')">
                            <span class="material-symbols-outlined">send</span>
                            Be om å legge til produkt
                        </button>
                    </div>
                </li>
            `
            return
        }

        // Render punchout items first (priority)
        for (const item of punchoutMatches) {
            const li = document.createElement("li")
            li.className = "search-result search-result--punchout"
            li.innerHTML = `
                <div class="search-result__image search-result__image--punchout">
                    <span class="material-symbols-outlined">${item.icon}</span>
                </div>
                <div class="search-result__info">
                    <div class="search-result__name">${item.name}</div>
                    <div class="search-result__desc">${item.description}</div>
                </div>
                <div class="search-result__right">
                    <span class="search-result__punchout-badge">
                        <span class="material-symbols-outlined">open_in_new</span>
                        Nettbutikk
                    </span>
                    <a href="${item.url}" class="search-result__go-btn" title="Gå til nettbutikk">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
            `
            li.addEventListener("click", () => {
                window.location.href = item.url
            })
            resultsList.appendChild(li)
        }

        // Render regular products
        const shown = productMatches.slice(0, 8)
        for (const product of shown) {
            const li = document.createElement("li")
            li.className = "search-result"
            li.style.cursor = "pointer"
            const icon = CATEGORY_ICONS[product.category] || "inventory_2"
            li.innerHTML = `
                <div class="search-result__image">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="search-result__info">
                    <div class="search-result__name">${product.name}</div>
                    <div class="search-result__desc">${product.description}</div>
                </div>
                <div class="search-result__right">
                    <span class="search-result__price">${formatPriceShort(product.price)}</span>
                    <button class="search-result__add-btn" data-id="${product.id}" title="Legg i handlekurv">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                </div>
            `
            li.addEventListener("click", (e) => {
                // Don't navigate if clicking the add/qty controls
                if (e.target.closest(".search-result__add-btn") || e.target.closest(".search-result__qty-control")) return
                window.location.href = `../product/?id=${product.id}`
            })
            resultsList.appendChild(li)
        }

        // Set up add-to-cart buttons with quantity controls
        resultsList.querySelectorAll(".search-result__add-btn").forEach((btn) => {
            const productId = parseInt(btn.dataset.id)
            const qty = Cart.getItemQuantity(productId)

            if (qty > 0) {
                replaceWithQtyControl(btn, productId, qty)
            } else {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation()
                    Cart.addItem(productId, 1)
                    cartCount.textContent = Cart.getCount()
                    cartBar.hidden = false
                    replaceWithQtyControl(btn, productId, 1)
                })
            }
        })

        function replaceWithQtyControl(btn, productId, qty) {
            const control = document.createElement("div")
            control.className = "search-result__qty-control"
            control.innerHTML = `
                <button class="search-result__qty-btn" data-action="decrease">−</button>
                <span class="search-result__qty-value">${qty}</span>
                <button class="search-result__qty-btn" data-action="increase">+</button>
            `

            const valueEl = control.querySelector(".search-result__qty-value")

            control.querySelectorAll(".search-result__qty-btn").forEach((qBtn) => {
                qBtn.addEventListener("click", (e) => {
                    e.stopPropagation()
                    const current = Cart.getItemQuantity(productId)
                    if (qBtn.dataset.action === "increase") {
                        Cart.addItem(productId, 1)
                        valueEl.textContent = current + 1
                    } else if (current > 1) {
                        Cart.updateQuantity(productId, current - 1)
                        valueEl.textContent = current - 1
                    } else {
                        Cart.removeItem(productId)
                        // Replace back with add button
                        const newBtn = document.createElement("button")
                        newBtn.className = "search-result__add-btn"
                        newBtn.dataset.id = productId
                        newBtn.title = "Legg i handlekurv"
                        newBtn.innerHTML = '<span class="material-symbols-outlined">add_shopping_cart</span>'
                        newBtn.addEventListener("click", (ev) => {
                            ev.stopPropagation()
                            Cart.addItem(productId, 1)
                            cartCount.textContent = Cart.getCount()
                            cartBar.hidden = false
                            replaceWithQtyControl(newBtn, productId, 1)
                        })
                        control.replaceWith(newBtn)
                    }
                    cartCount.textContent = Cart.getCount()
                    if (Cart.getCount() === 0) cartBar.hidden = true
                })
            })

            btn.replaceWith(control)
        }
    }

    function showDropdown() {
        dropdown.hidden = false
        renderResults(input.value)
        const count = Cart.getCount()
        if (count > 0) {
            cartCount.textContent = count
            cartBar.hidden = false
        }
    }

    function hideDropdown() {
        dropdown.hidden = true
    }

    input.addEventListener("focus", showDropdown)

    input.addEventListener("input", () => {
        renderResults(input.value)
    })

    document.addEventListener("click", (e) => {
        if (!hero.querySelector(".order-hero__search").contains(e.target)) {
            hideDropdown()
        }
    })

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideDropdown()
            input.blur()
        }
    })
}
