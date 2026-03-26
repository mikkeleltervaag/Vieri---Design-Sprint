function toggleFilters() {
    document.getElementById("order-filters").classList.toggle("open")
}

// ── Punchout-only filter (global so onclick can reach it) ──
let punchoutOnly = false
let _filterAndRender = null

function togglePunchoutFilter() {
    punchoutOnly = !punchoutOnly
    const btn = document.getElementById("nettbutikk-filter-btn")
    if (btn) btn.classList.toggle("active", punchoutOnly)
    // Clear search and filters when activating punchout filter
    if (punchoutOnly) {
        const clearBtn = document.getElementById("filter-clear-btn")
        if (clearBtn) clearBtn.click()
    }
    if (_filterAndRender) _filterAndRender()
}

document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    const productGrid = document.querySelector(".product-grid")
    const searchInput = document.querySelector(".order-search input[type='text']")
    const countEl = document.querySelector(".order-products__count")
    const filtersEl = document.getElementById("order-filters")
    const toolbarLeft = document.querySelector(".order-toolbar__left")

    // ── Filter state ──
    const allSuppliers = [...PRODUCTS.map((p) => p.supplier), ...PUNCHOUT_ITEMS.map((p) => p.supplier)]
    const filters = {
        category: new Set(),
        supplier: new Set(),
        catalogue: new Set(),
        manufacturer: new Set(),
        priceMax: Math.max(...PRODUCTS.map((p) => p.price)),
    }
    const maxPrice = filters.priceMax

    // ── Build filter sidebar ──
    buildFilters(filtersEl)

    // ── Help bar toggle ──
    const helpToggle = document.getElementById("order-help-toggle")
    const helpPanel = document.getElementById("order-help-panel")
    if (helpToggle && helpPanel) {
        helpToggle.addEventListener("click", () => {
            const isOpen = !helpPanel.hidden
            helpPanel.hidden = isOpen
            helpToggle.classList.toggle("active", !isOpen)
        })
    }

    // ── Check URL params ──
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("filter") === "nettbutikk") {
        punchoutOnly = true
        const btn = document.getElementById("nettbutikk-filter-btn")
        if (btn) btn.classList.add("active")
    }

    // Pre-fill search from dashboard query
    const urlQuery = urlParams.get("q")
    if (urlQuery) {
        searchInput.value = urlQuery
    }

    // ── Initial render ──
    filterAndRender()
    _filterAndRender = filterAndRender

    searchInput.addEventListener("input", filterAndRender)

    function getFilteredPunchoutItems() {
        const q = searchInput.value.toLowerCase().trim()
        return PUNCHOUT_ITEMS.filter((p) => {
            if (q) {
                const match =
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.supplier.toLowerCase().includes(q) ||
                    p.keywords.some((k) => k.includes(q))
                if (!match) return false
            }
            if (filters.supplier.size && !filters.supplier.has(p.supplier)) return false
            return true
        })
    }

    function getFilteredProducts() {
        const q = searchInput.value.toLowerCase().trim()
        return PRODUCTS.filter((p) => {
            if (q) {
                const match =
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.supplier.toLowerCase().includes(q) ||
                    p.manufacturer.toLowerCase().includes(q) ||
                    p.artNr.toLowerCase().includes(q)
                if (!match) return false
            }
            if (filters.category.size && !filters.category.has(p.category)) return false
            if (filters.supplier.size && !filters.supplier.has(p.supplier)) return false
            if (filters.catalogue.size && !filters.catalogue.has(p.catalogue)) return false
            if (filters.manufacturer.size && !filters.manufacturer.has(p.manufacturer)) return false
            if (p.price > filters.priceMax) return false
            return true
        })
    }

    function filterAndRender() {
        const punchoutFiltered = getFilteredPunchoutItems()
        const filtered = punchoutOnly ? [] : getFilteredProducts()
        const total = punchoutFiltered.length + filtered.length

        const helpBar = document.getElementById("order-help-bar")
        if (total === 0 && searchInput.value.trim()) {
            renderNoResults(productGrid, searchInput.value.trim())
            if (helpBar) helpBar.hidden = true
        } else {
            renderPunchoutCards(productGrid, punchoutFiltered)
            renderProducts(productGrid, filtered, true)
            initQtyControls()
            initAddToCartButtons()
            if (helpBar) helpBar.hidden = false
        }

        if (countEl) {
            countEl.textContent = punchoutOnly
                ? punchoutFiltered.length + " nettbutikker"
                : total + " produkter"
        }
        updateChips()
        updateFilterCounts()
    }

    // ── Build sidebar sections ──
    function buildFilters(container) {
        const sections = [
            { key: "category", label: "Kategori", open: true },
            { key: "supplier", label: "Leverandør", open: true },
            { key: "catalogue", label: "Katalog", open: false },
            { key: "manufacturer", label: "Produsent", open: true },
        ]

        let html = `
            <div class="filter-head">
                <h2>Filter</h2>
                <button class="filter-save">
                    <span class="material-symbols-outlined">bookmark_border</span>
                    Lagre filter
                </button>
            </div>
        `

        for (const s of sections) {
            const productValues = PRODUCTS.map((p) => p[s.key])
            const punchoutValues = s.key === "supplier" ? PUNCHOUT_ITEMS.map((p) => p.supplier) : []
            const values = [...new Set([...productValues, ...punchoutValues])].sort()
            const chevron = s.open ? "expand_less" : "expand_more"
            html += `
                <div class="filter-section" data-open="${s.open}" data-key="${s.key}">
                    <button class="filter-section__toggle">
                        <span>${s.label}</span>
                        <span class="material-symbols-outlined filter-section__chevron">${chevron}</span>
                    </button>
                    <div class="filter-section__body">
                        <div class="filter-options">
                            ${values
                                .map((v) => {
                                    const productCount = PRODUCTS.filter((p) => p[s.key] === v).length
                                    const punchoutCount = s.key === "supplier" ? PUNCHOUT_ITEMS.filter((p) => p.supplier === v).length : 0
                                    const count = productCount + punchoutCount
                                    const isPunchoutSupplier = s.key === "supplier" && punchoutCount > 0
                                    return `
                                    <label class="filter-option${isPunchoutSupplier ? " filter-option--punchout" : ""}" data-key="${s.key}" data-value="${v}">
                                        <input type="checkbox" />
                                        <span>${v}</span>
                                        ${isPunchoutSupplier ? '<span class="material-symbols-outlined filter-option__punchout-icon">storefront</span>' : ""}
                                        <span class="filter-option__count">${count}</span>
                                    </label>`
                                })
                                .join("")}
                        </div>
                    </div>
                </div>
            `
        }

        // Price filter
        html += `
            <div class="filter-section" data-open="true" data-key="price">
                <button class="filter-section__toggle">
                    <span>Pris</span>
                    <span class="material-symbols-outlined filter-section__chevron">expand_less</span>
                </button>
                <div class="filter-section__body">
                    <div class="filter-price">
                        <input type="number" id="price-min" placeholder="0" value="0" />
                        <span class="filter-price__sep">&ndash;</span>
                        <input type="number" id="price-max" placeholder="${maxPrice}" value="${maxPrice}" />
                    </div>
                    <input type="range" class="filter-price__slider" id="price-slider" min="0" max="${maxPrice}" value="${maxPrice}" />
                </div>
            </div>
        `

        html += `
            <button class="filter-clear" id="filter-clear-btn">
                <span class="material-symbols-outlined">filter_alt_off</span>
                Fjern filter
            </button>
        `

        container.innerHTML = html

        // Wire up checkbox filters
        container.querySelectorAll(".filter-option input[type='checkbox']").forEach((cb) => {
            cb.addEventListener("change", () => {
                const label = cb.closest(".filter-option")
                const key = label.dataset.key
                const value = label.dataset.value
                if (cb.checked) {
                    filters[key].add(value)
                } else {
                    filters[key].delete(value)
                }
                filterAndRender()
            })
        })

        // Wire up collapsible sections
        container.querySelectorAll(".filter-section__toggle").forEach((btn) => {
            btn.addEventListener("click", () => {
                const section = btn.closest(".filter-section")
                const isOpen = section.dataset.open === "true"
                section.dataset.open = isOpen ? "false" : "true"
                const chevron = btn.querySelector(".filter-section__chevron")
                if (chevron) {
                    chevron.textContent = isOpen ? "expand_more" : "expand_less"
                }
            })
        })

        // Wire up price filter
        const priceSlider = document.getElementById("price-slider")
        const priceMaxInput = document.getElementById("price-max")
        const priceMinInput = document.getElementById("price-min")

        priceSlider.addEventListener("input", () => {
            filters.priceMax = parseInt(priceSlider.value)
            priceMaxInput.value = priceSlider.value
            filterAndRender()
        })

        priceMaxInput.addEventListener("input", () => {
            const val = parseInt(priceMaxInput.value) || maxPrice
            filters.priceMax = Math.min(val, maxPrice)
            priceSlider.value = filters.priceMax
            filterAndRender()
        })

        priceMinInput.addEventListener("input", () => {
            filterAndRender()
        })

        // Wire up clear all
        document.getElementById("filter-clear-btn").addEventListener("click", () => {
            filters.category.clear()
            filters.supplier.clear()
            filters.catalogue.clear()
            filters.manufacturer.clear()
            filters.priceMax = maxPrice
            priceSlider.value = maxPrice
            priceMaxInput.value = maxPrice
            priceMinInput.value = 0
            searchInput.value = ""
            container.querySelectorAll("input[type='checkbox']").forEach((cb) => {
                cb.checked = false
            })
            filterAndRender()
        })

        // Close filters on outside click (mobile)
        document.addEventListener("click", (e) => {
            const toggle = document.querySelector(".order-toolbar__filter-toggle")
            if (
                toggle &&
                filtersEl.classList.contains("open") &&
                !filtersEl.contains(e.target) &&
                !toggle.contains(e.target)
            ) {
                filtersEl.classList.remove("open")
            }
        })
    }

    // ── Active filter chips ──
    function updateChips() {
        // Remove old chips and clear button
        toolbarLeft.querySelectorAll(".active-filter__chip, .active-filter__clear").forEach((el) => el.remove())

        const allActive = []
        for (const key of ["category", "supplier", "catalogue", "manufacturer"]) {
            for (const value of filters[key]) {
                allActive.push({ key, value })
            }
        }

        if (allActive.length === 0) return

        // Insert clear-all button after count
        const clearBtn = document.createElement("button")
        clearBtn.className = "active-filter__clear"
        clearBtn.textContent = "Fjern alle"
        clearBtn.addEventListener("click", () => {
            document.getElementById("filter-clear-btn").click()
        })
        toolbarLeft.appendChild(clearBtn)

        for (const { key, value } of allActive) {
            const chip = document.createElement("span")
            chip.className = "active-filter__chip"
            chip.innerHTML = `
                ${value}
                <button class="active-filter__remove">
                    <span class="material-symbols-outlined">close</span>
                </button>
            `
            chip.querySelector(".active-filter__remove").addEventListener("click", () => {
                filters[key].delete(value)
                // Uncheck the corresponding checkbox
                const cb = filtersEl.querySelector(`.filter-option[data-key="${key}"][data-value="${value}"] input`)
                if (cb) cb.checked = false
                filterAndRender()
            })
            toolbarLeft.appendChild(chip)
        }
    }

    // ── Update counts based on current other filters ──
    function updateFilterCounts() {
        filtersEl.querySelectorAll(".filter-option").forEach((label) => {
            const key = label.dataset.key
            const value = label.dataset.value
            const countEl = label.querySelector(".filter-option__count")
            if (!countEl) return

            // Count products matching this value with all OTHER filters applied
            const tempFilters = { ...filters }
            const productCount = PRODUCTS.filter((p) => {
                if (p[key] !== value) return false
                const q = searchInput.value.toLowerCase().trim()
                if (q) {
                    const match =
                        p.name.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.supplier.toLowerCase().includes(q) ||
                        p.manufacturer.toLowerCase().includes(q) ||
                        p.artNr.toLowerCase().includes(q)
                    if (!match) return false
                }
                for (const fk of ["category", "supplier", "catalogue", "manufacturer"]) {
                    if (fk === key) continue
                    if (tempFilters[fk].size && !tempFilters[fk].has(p[fk])) return false
                }
                if (p.price > tempFilters.priceMax) return false
                return true
            }).length

            // Count punchout items for supplier filter
            let punchoutCount = 0
            if (key === "supplier") {
                const q = searchInput.value.toLowerCase().trim()
                punchoutCount = PUNCHOUT_ITEMS.filter((p) => {
                    if (p.supplier !== value) return false
                    if (q) {
                        const match =
                            p.name.toLowerCase().includes(q) ||
                            p.description.toLowerCase().includes(q) ||
                            p.keywords.some((k) => k.includes(q))
                        if (!match) return false
                    }
                    return true
                }).length
            }

            countEl.textContent = productCount + punchoutCount
        })
    }

    // ── View toggle ──
    const viewBtns = document.querySelectorAll(".view-btn")
    let userView = productGrid ? productGrid.dataset.view : "grid"
    const wideEnough = window.matchMedia("(min-width: 1300px)")

    function setActiveViewBtn(view) {
        viewBtns.forEach((b) => b.classList.toggle("active", b.dataset.view === view))
    }

    function applyView() {
        if (!productGrid) return
        const effective = !wideEnough.matches && userView === "list" ? "grid" : userView
        productGrid.dataset.view = effective
        setActiveViewBtn(effective)
    }

    viewBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            userView = btn.dataset.view
            applyView()
        })
    })

    wideEnough.addEventListener("change", () => applyView())
    window.addEventListener("resize", () => applyView())
    applyView()
})

function renderPunchoutCards(grid, items) {
    grid.innerHTML = ""
    for (const item of items) {
        const article = document.createElement("article")
        article.className = "product-card product-card--punchout"
        article.innerHTML = `
            <div class="product-card__img product-card__img--punchout">
                <span class="material-symbols-outlined">${item.icon}</span>
            </div>
            <div class="product-card__body">
                <span class="product-card__punchout-badge">
                    <span class="material-symbols-outlined">open_in_new</span>
                    Nettbutikk
                </span>
                <h4 class="product-card__name">${item.name}</h4>
                <p class="product-card__desc">${item.description}</p>
                <div class="product-card__footer">
                    <a href="${item.url}" class="punchout-btn">
                        Gå til nettbutikk
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
            </div>
        `
        article.addEventListener("click", (e) => {
            if (!e.target.closest(".punchout-btn")) {
                window.location.href = item.url
            }
        })
        grid.appendChild(article)
    }
}

function renderProducts(grid, products, append = false) {
    if (!append) grid.innerHTML = ""
    for (const p of products) {
        const icon = CATEGORY_ICONS[p.category] || "inventory_2"
        const favIcon = p.isFavorite ? "favorite" : "favorite_border"
        const favClass = p.isFavorite ? ' class="is-active"' : ""

        const article = document.createElement("article")
        article.className = "product-card"
        article.dataset.productId = p.id
        article.innerHTML = `
            <div class="product-card__top-actions">
                <button title="Produktinfo" class="product-card__info-btn">
                    <span class="material-symbols-outlined">info</span>
                </button>
                <button title="Favoritt"${favClass}>
                    <span class="material-symbols-outlined">${favIcon}</span>
                </button>
                <button title="Sammenlign">
                    <span class="material-symbols-outlined">compare_arrows</span>
                </button>
            </div>
            <div class="product-card__img product-card__img--icon">
                <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div class="product-card__body">
                <span class="product-card__supplier">${p.supplier}</span>
                <h4 class="product-card__name">${p.name}</h4>
                <p class="product-card__desc">${p.description}</p>
                <div class="product-card__meta">
                    <span>Art.nr: ${p.artNr}</span>
                    <span>Forpakning: 1 ${p.unit}</span>
                </div>
                <div class="product-card__footer">
                    <div class="product-card__price">
                        <span class="price-main">${formatPrice(p.price)}</span>
                        <span class="price-unit">per ${p.unit}</span>
                        <span class="price-vat">+ MVA ${p.vatRate},0 %</span>
                    </div>
                    <div class="product-card__actions">
                        <div class="qty-control">
                            <button class="qty-btn">-</button>
                            <input type="number" value="1" min="1" />
                            <button class="qty-btn">+</button>
                        </div>
                        <button class="add-btn" data-product-id="${p.id}">Legg til</button>
                    </div>
                </div>
            </div>
        `
        // Make card clickable (except actions area)
        article.addEventListener("click", (e) => {
            if (e.target.closest(".product-card__actions") || e.target.closest(".product-card__top-actions:not(.product-card__info-btn)")) return
            if (e.target.closest(".qty-control") || e.target.closest(".add-btn")) return
            window.location.href = `../product/?id=${p.id}`
        })
        article.style.cursor = "pointer"

        grid.appendChild(article)
    }
}

function initQtyControls() {
    document.querySelectorAll(".qty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input")
            const current = parseInt(input.value) || 1
            if (btn.textContent.trim() === "+") {
                input.value = current + 1
            } else if (current > 1) {
                input.value = current - 1
            }
        })
    })
}

function renderNoResults(grid, query) {
    grid.innerHTML = `
        <div class="order-no-results">
            <div class="order-no-results__icon">
                <span class="material-symbols-outlined">search_off</span>
            </div>
            <h3 class="order-no-results__title">Ingen resultater for «${query}»</h3>
            <p class="order-no-results__text">Vi fant ingen produkter som matcher søket ditt. Her er noen alternativer:</p>
            <div class="order-no-results__options">
                <div class="order-no-results__option" onclick="togglePunchoutFilter()">
                    <span class="material-symbols-outlined order-no-results__option-icon order-no-results__option-icon--punchout">storefront</span>
                    <div>
                        <strong>Søk i nettbutikker</strong>
                        <p>Produktet kan finnes i en av våre tilknyttede nettbutikker</p>
                    </div>
                </div>
                <div class="order-no-results__option" onclick="FreetextModal.open()">
                    <span class="material-symbols-outlined order-no-results__option-icon order-no-results__option-icon--freetext">edit_note</span>
                    <div>
                        <strong>Legg til som fritekst</strong>
                        <p>Beskriv produktet manuelt og legg det til i handlekurven</p>
                    </div>
                </div>
                <div class="order-no-results__option">
                    <span class="material-symbols-outlined order-no-results__option-icon order-no-results__option-icon--agreement">handshake</span>
                    <div>
                        <strong>Sjekk våre avtaler</strong>
                        <p>Bestill fra en eksisterende rammeavtale med leverandør</p>
                    </div>
                </div>
                <div class="order-no-results__option" onclick="alert('Forespørsel sendt! Innkjøpsavdelingen vil vurdere å legge til produktet.')">
                    <span class="material-symbols-outlined order-no-results__option-icon order-no-results__option-icon--request">send</span>
                    <div>
                        <strong>Be om å legge til produkt</strong>
                        <p>Send en forespørsel til innkjøpsavdelingen om å finne en leverandør</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function initAddToCartButtons() {
    document.querySelectorAll(".add-btn[data-product-id]").forEach((btn) => {
        const productId = parseInt(btn.dataset.productId)
        if (Cart.getItemQuantity(productId) > 0) {
            btn.textContent = "Lagt til"
            btn.classList.add("add-btn--added")
        }
        btn.addEventListener("click", () => {
            const qtyInput = btn.closest(".product-card__actions").querySelector("input")
            const qty = parseInt(qtyInput.value) || 1
            Cart.addItem(productId, qty)
            btn.textContent = "Lagt til ✓"
            btn.classList.add("add-btn--added")
            setTimeout(() => {
                btn.textContent = "Legg til"
                btn.classList.remove("add-btn--added")
            }, 1500)
        })
    })
}
