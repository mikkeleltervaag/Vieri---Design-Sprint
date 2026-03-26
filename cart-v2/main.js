document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    renderCartItems()
    bindCartInteractivity()

    // ── Collapsible sections (logistics, approval) ──
    document.querySelectorAll(".checkout-section__toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true"
            toggle.setAttribute("aria-expanded", !expanded)
        })
    })

    // ── Section nav — scroll spy ──
    const sections = document.querySelectorAll(".checkout-section")
    const navLinks = document.querySelectorAll(".section-nav__link")

    function updateScrollSpy() {
        const scrollY = window.scrollY + 120
        let current = ""
        sections.forEach((section) => {
            if (section.offsetTop <= scrollY) {
                current = section.id
            }
        })
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === current)
        })
    }

    window.addEventListener("scroll", updateScrollSpy, { passive: true })

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            const target = document.getElementById(link.dataset.section)
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        })
    })

    // ── Validation checklist — click to scroll ──
    document.querySelectorAll(".validation-item").forEach((item) => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target
            const target = document.getElementById(targetId)
            if (!target) return
            target.scrollIntoView({ behavior: "smooth", block: "start" })
            target.classList.add("highlight-pulse")
            setTimeout(() => target.classList.remove("highlight-pulse"), 1500)
        })
    })

    // ── Approver validation ──
    const approverSelect = document.getElementById("approver-select")
    if (approverSelect) {
        approverSelect.addEventListener("change", () => {
            const approverValidation = document.querySelector(
                '.validation-item[data-target="section-approval"].validation-item--error'
            )
            if (approverSelect.value && approverValidation) {
                approverValidation.className = "validation-item validation-item--ok"
                approverValidation.dataset.target = "section-approval"
                approverValidation.querySelector(".material-symbols-outlined").textContent = "check_circle"
                approverValidation.querySelector("span:last-child").textContent = "Godkjenner valgt"
                const field = document.getElementById("approver-field")
                if (field) field.classList.remove("approval-field--error")
            }
        })
    }

    // ── Submit order → show success overlay ──
    const submitBtn = document.getElementById("submit-order-btn")
    const overlay = document.getElementById("success-overlay")
    if (submitBtn && overlay) {
        submitBtn.addEventListener("click", () => {
            overlay.hidden = false
            document.body.style.overflow = "hidden"
        })
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.hidden = true
                document.body.style.overflow = ""
            }
        })
    }
})

// ── Render cart items from localStorage ──

function renderCartItems() {
    const container = document.getElementById("cart-items-container")
    if (!container) return

    const cartItems = Cart.getItems()
    const punchoutItems = Cart.getPunchoutItems()

    if (cartItems.length === 0 && punchoutItems.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <span class="material-symbols-outlined">shopping_cart</span>
                <p>Handlekurven er tom</p>
                <a href="../order/index.html" class="cart-empty__link">Gå til bestilling</a>
            </div>
        `
        updateTotals()
        return
    }

    let html = ""

    // Render punchout and freetext items first (priority, on top)
    if (punchoutItems.length > 0) {
        // Separate freetext items from punchout items
        const freetextItems = punchoutItems.filter((i) => i.isFreetext)
        const realPunchoutItems = punchoutItems.filter((i) => !i.isFreetext)

        // Group real punchout items by supplier
        const punchoutGroups = {}
        for (const item of realPunchoutItems) {
            const supplier = item.supplier || "Nettbutikk"
            if (!punchoutGroups[supplier]) punchoutGroups[supplier] = []
            punchoutGroups[supplier].push(item)
        }

        for (const [supplier, items] of Object.entries(punchoutGroups)) {
            const groupKey = "punchout-" + supplier.toLowerCase().replace(/\s+/g, "-")
            html += `
                <div class="item-group item-group--punchout" data-group="${groupKey}">
                    <button class="item-group__header item-group__header--punchout" aria-expanded="true">
                        <span class="item-group__chevron material-symbols-outlined">expand_more</span>
                        <span class="item-group__icon material-symbols-outlined">open_in_new</span>
                        <span class="item-group__name">${supplier}</span>
                        <span class="item-group__punchout-tag">Nettbutikk</span>
                        <span class="item-group__badge">${items.length} varer</span>
                        <span class="item-group__subtotal"></span>
                    </button>
                    <div class="item-group__body">
                        <div class="item-table__head">
                            <span>Produkt</span>
                            <span>Antall</span>
                            <span>Pris / enhet</span>
                            <span>Sum</span>
                            <span></span>
                        </div>
                        ${items.map((i) => buildPunchoutItemRow(i)).join("")}
                    </div>
                </div>
            `
        }

        // Group freetext items by supplier
        if (freetextItems.length > 0) {
            const freetextGroups = {}
            for (const item of freetextItems) {
                const supplier = item.supplier || "Ukjent leverandør"
                if (!freetextGroups[supplier]) freetextGroups[supplier] = []
                freetextGroups[supplier].push(item)
            }

            for (const [supplier, items] of Object.entries(freetextGroups)) {
                const groupKey = "freetext-" + supplier.toLowerCase().replace(/\s+/g, "-")
                html += `
                    <div class="item-group item-group--freetext" data-group="${groupKey}">
                        <button class="item-group__header item-group__header--freetext" aria-expanded="true">
                            <span class="item-group__chevron material-symbols-outlined">expand_more</span>
                            <span class="item-group__icon material-symbols-outlined">edit_note</span>
                            <span class="item-group__name">${supplier}</span>
                            <span class="item-group__freetext-tag">Fritekst</span>
                            <span class="item-group__badge">${items.length} varer</span>
                            <span class="item-group__subtotal"></span>
                        </button>
                        <div class="item-group__body">
                            <div class="item-table__head">
                                <span>Produkt</span>
                                <span>Antall</span>
                                <span>Pris / enhet</span>
                                <span>Sum</span>
                                <span></span>
                            </div>
                            ${items.map((i) => buildPunchoutItemRow(i)).join("")}
                        </div>
                    </div>
                `
            }
        }
    }

    // Group regular items by supplier
    const groups = {}
    for (const item of cartItems) {
        const product = PRODUCTS.find((p) => p.id === item.productId)
        if (!product) continue
        if (!groups[product.supplier]) groups[product.supplier] = []
        groups[product.supplier].push({ product, quantity: item.quantity })
    }

    for (const [supplier, items] of Object.entries(groups)) {
        const groupKey = supplier.toLowerCase().replace(/\s+/g, "-")
        html += `
            <div class="item-group" data-group="${groupKey}">
                <button class="item-group__header" aria-expanded="true">
                    <span class="item-group__chevron material-symbols-outlined">expand_more</span>
                    <span class="item-group__icon material-symbols-outlined">storefront</span>
                    <span class="item-group__name">${supplier}</span>
                    <span class="item-group__badge">${items.length} varer</span>
                    <span class="item-group__subtotal"></span>
                </button>
                <div class="item-group__body">
                    <div class="item-table__head">
                        <span>Produkt</span>
                        <span>Antall</span>
                        <span>Pris / enhet</span>
                        <span>Sum</span>
                        <span></span>
                    </div>
                    ${items.map((i) => buildItemRow(i.product, i.quantity)).join("")}
                </div>
            </div>
        `
    }

    container.innerHTML = html
    updateTotals()
}

function buildPunchoutItemRow(item) {
    const icon = item.icon || "local_florist"
    return `
        <div class="item-row item-row--punchout" data-unit-price="${item.price}" data-punchout-id="${item.id}">
            <div class="item-row__product">
                <div class="item-row__image-icon item-row__image-icon--punchout">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="item-row__info">
                    <span class="item-row__name">${item.name}</span>
                    <span class="item-row__meta">Nettbutikk &middot; ${item.supplier}</span>
                </div>
            </div>
            <div class="item-row__qty">
                <button class="qty-btn" data-action="decrease">−</button>
                <input type="number" value="${item.quantity}" min="1" />
                <button class="qty-btn" data-action="increase">+</button>
            </div>
            <span class="item-row__unit-price">${formatNOK(item.price)}</span>
            <span class="item-row__total">${formatNOK(item.price * item.quantity)}</span>
            <div class="item-row__actions">
                <button class="item-row__expand-btn" title="Vis detaljer">
                    <span class="material-symbols-outlined">expand_more</span>
                </button>
                <button class="item-row__delete-btn" title="Fjern">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
            <div class="item-row__details" hidden>
                <div class="item-row__detail-field">
                    <label>Notat</label>
                    <input type="text" placeholder="Legg til notat..." />
                </div>
                <div class="item-row__detail-field">
                    <label>Leveringsdato</label>
                    <div class="item-row__override">
                        <input type="date" />
                        <span class="item-row__default-badge">Bruker standard</span>
                    </div>
                </div>
            </div>
        </div>
    `
}

function buildItemRow(product, quantity) {
    const icon = CATEGORY_ICONS[product.category] || "inventory_2"
    return `
        <div class="item-row" data-unit-price="${product.price}" data-product-id="${product.id}">
            <div class="item-row__product">
                <div class="item-row__image-icon">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="item-row__info">
                    <span class="item-row__name">${product.name}</span>
                    <span class="item-row__meta">Art.nr: ${product.artNr} &middot; 1 ${product.unit}</span>
                </div>
            </div>
            <div class="item-row__qty">
                <button class="qty-btn" data-action="decrease">−</button>
                <input type="number" value="${quantity}" min="1" />
                <button class="qty-btn" data-action="increase">+</button>
            </div>
            <span class="item-row__unit-price">${formatNOK(product.price)}</span>
            <span class="item-row__total">${formatNOK(product.price * quantity)}</span>
            <div class="item-row__actions">
                <button class="item-row__expand-btn" title="Vis detaljer">
                    <span class="material-symbols-outlined">expand_more</span>
                </button>
                <button class="item-row__delete-btn" title="Fjern">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
            <div class="item-row__details" hidden>
                <div class="item-row__detail-field">
                    <label>Notat</label>
                    <input type="text" placeholder="Legg til notat..." />
                </div>
                <div class="item-row__detail-field">
                    <label>Leveringsdato</label>
                    <div class="item-row__override">
                        <input type="date" />
                        <span class="item-row__default-badge">Bruker standard</span>
                    </div>
                </div>
            </div>
        </div>
    `
}

// ── Bind all interactivity to dynamically rendered items ──

function bindCartInteractivity() {
    const container = document.getElementById("cart-items-container")
    if (!container) return

    // Quantity controls (event delegation)
    container.addEventListener("click", (e) => {
        const qtyBtn = e.target.closest(".qty-btn")
        if (qtyBtn) {
            const input = qtyBtn.parentElement.querySelector("input")
            const row = qtyBtn.closest(".item-row")
            const current = parseInt(input.value) || 1
            let newQty = current
            if (qtyBtn.dataset.action === "increase") {
                newQty = current + 1
            } else if (current > 1) {
                newQty = current - 1
            }
            input.value = newQty

            if (row.dataset.punchoutId) {
                Cart.updatePunchoutQuantity(row.dataset.punchoutId, newQty)
            } else {
                const productId = parseInt(row.dataset.productId)
                Cart.updateQuantity(productId, newQty)
            }
            updateTotals()
            return
        }

        // Delete item
        const deleteBtn = e.target.closest(".item-row__delete-btn")
        if (deleteBtn) {
            const row = deleteBtn.closest(".item-row")
            row.style.opacity = "0"
            row.style.transform = "translateX(-0.5rem)"
            row.style.transition = "all 0.2s ease"
            setTimeout(() => {
                const group = row.closest(".item-group")
                row.remove()
                if (row.dataset.punchoutId) {
                    Cart.removePunchoutItem(row.dataset.punchoutId)
                } else {
                    const productId = parseInt(row.dataset.productId)
                    Cart.removeItem(productId)
                }
                updateGroupCount(group)
                updateTotals()
            }, 200)
            return
        }

        // Expand/collapse item details
        const expandBtn = e.target.closest(".item-row__expand-btn")
        if (expandBtn) {
            const row = expandBtn.closest(".item-row")
            const details = row.querySelector(".item-row__details")
            if (!details) return
            const isOpen = !details.hidden
            details.hidden = isOpen
            expandBtn.setAttribute("aria-expanded", !isOpen)
            return
        }

        // Group header collapse/expand
        const groupHeader = e.target.closest(".item-group__header")
        if (groupHeader) {
            const expanded = groupHeader.getAttribute("aria-expanded") === "true"
            groupHeader.setAttribute("aria-expanded", !expanded)
            const body = groupHeader.nextElementSibling
            if (body) body.hidden = expanded
        }
    })

    // Quantity input manual change
    container.addEventListener("change", (e) => {
        if (e.target.matches(".item-row__qty input")) {
            const input = e.target
            if (parseInt(input.value) < 1) input.value = 1
            const row = input.closest(".item-row")
            if (row.dataset.punchoutId) {
                Cart.updatePunchoutQuantity(row.dataset.punchoutId, parseInt(input.value))
            } else {
                const productId = parseInt(row.dataset.productId)
                Cart.updateQuantity(productId, parseInt(input.value))
            }
            updateTotals()
        }
    })

    // Clear cart
    const clearBtn = document.getElementById("clear-cart-btn")
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            const rows = container.querySelectorAll(".item-row")
            rows.forEach((row, i) => {
                setTimeout(() => {
                    row.style.opacity = "0"
                    row.style.transform = "translateX(-0.5rem)"
                    row.style.transition = "all 0.15s ease"
                }, i * 40)
            })
            setTimeout(() => {
                Cart.clear()
                renderCartItems()
                updateTotals()
            }, rows.length * 40 + 200)
        })
    }
}

// ── Helpers ──

function updateGroupCount(group) {
    if (!group) return
    const rows = group.querySelectorAll(".item-row")
    const badge = group.querySelector(".item-group__badge")
    if (badge) badge.textContent = `${rows.length} varer`

    let groupTotal = 0
    rows.forEach((row) => {
        const qty = parseInt(row.querySelector(".item-row__qty input").value)
        const unitPrice = parseFloat(row.dataset.unitPrice) || 0
        groupTotal += qty * unitPrice
    })
    const subtotalEl = group.querySelector(".item-group__subtotal")
    if (subtotalEl) subtotalEl.textContent = formatNOK(groupTotal)

    if (rows.length === 0) {
        group.style.opacity = "0"
        group.style.transition = "opacity 0.2s ease"
        setTimeout(() => group.remove(), 200)
    }
}

function updateTotals() {
    const rows = document.querySelectorAll(".item-row")
    let subtotal = 0
    let count = 0

    rows.forEach((row) => {
        const input = row.querySelector(".item-row__qty input")
        if (!input) return
        const qty = parseInt(input.value) || 0
        const unitPrice = parseFloat(row.dataset.unitPrice) || 0
        const lineTotal = qty * unitPrice

        const totalEl = row.querySelector(".item-row__total")
        if (totalEl && unitPrice > 0) {
            totalEl.textContent = formatNOK(lineTotal)
        }

        subtotal += lineTotal
        count++
    })

    const vat = subtotal * 0.25
    const total = subtotal + vat

    const countEl = document.getElementById("sidebar-item-count")
    if (countEl) countEl.textContent = count

    const subtotalEl = document.getElementById("sidebar-subtotal")
    if (subtotalEl) subtotalEl.textContent = formatNOK(subtotal)

    const vatEl = document.getElementById("sidebar-vat")
    if (vatEl) vatEl.textContent = formatNOK(vat)

    const totalEl = document.getElementById("sidebar-total")
    if (totalEl) totalEl.textContent = formatNOK(total)

    const toolbarCount = document.querySelector(".checkout-toolbar__count")
    if (toolbarCount) toolbarCount.textContent = `${count} varer`

    const sectionCount = document.querySelector(".checkout-section__count")
    const groups = document.querySelectorAll(".item-group")
    if (sectionCount)
        sectionCount.textContent = `${count} varer i ${groups.length} grupper`

    groups.forEach((group) => updateGroupCount(group))
}

function formatNOK(n) {
    return n
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
