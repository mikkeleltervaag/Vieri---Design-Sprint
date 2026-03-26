document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    // Quantity controls
    document.querySelectorAll(".qty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input")
            const current = parseInt(input.value) || 1
            if (btn.dataset.action === "increase") {
                input.value = current + 1
            } else if (current > 1) {
                input.value = current - 1
            }
            updateTotals()
        })
    })

    // Also update when manually editing qty
    document.querySelectorAll(".cart-item__qty input").forEach((input) => {
        input.addEventListener("change", () => {
            if (parseInt(input.value) < 1) input.value = 1
            updateTotals()
        })
    })

    // Delete item
    document.querySelectorAll(".cart-item__action--delete").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".cart-item")
            item.style.opacity = "0"
            item.style.transform = "translateX(-1rem)"
            item.style.transition = "all 0.25s ease"
            setTimeout(() => {
                item.remove()
                updateTotals()
            }, 250)
        })
    })

    // Clear cart
    const clearBtn = document.querySelector(".cart-toolbar__btn--danger")
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            const items = document.querySelectorAll(".cart-item")
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.style.opacity = "0"
                    item.style.transform = "translateX(-1rem)"
                    item.style.transition = "all 0.2s ease"
                }, i * 60)
            })
            setTimeout(() => {
                items.forEach((item) => item.remove())
                updateTotals()
            }, items.length * 60 + 200)
        })
    }

    function updateTotals() {
        const items = document.querySelectorAll(".cart-item")
        let subtotal = 0

        items.forEach((item) => {
            const qty = parseInt(
                item.querySelector(".cart-item__qty input").value
            )
            const unitText = item.querySelector(
                ".cart-item__unit-price"
            ).textContent
            const unitPrice = parseFloat(
                unitText
                    .replace(/[^\d,]/g, "")
                    .replace(/\s/g, "")
                    .replace(",", ".")
            )
            const lineTotal = qty * unitPrice

            item.querySelector(".cart-item__total-price").textContent =
                formatNOK(lineTotal)
            subtotal += lineTotal
        })

        const vat = subtotal * 0.25
        const total = subtotal + vat

        // Update summary
        const rows = document.querySelectorAll(".cart-summary__row")
        if (rows[0])
            rows[0].querySelector("span:first-child").textContent =
                `Subtotal (${items.length} varer)`
        if (rows[0])
            rows[0].querySelector("span:last-child").textContent =
                formatNOK(subtotal)
        if (rows[2])
            rows[2].querySelector("span:last-child").textContent =
                formatNOK(vat)

        const totalEl = document.querySelector(".cart-summary__total")
        if (totalEl)
            totalEl.querySelector("span:last-child").textContent =
                formatNOK(total)

        // Update item count
        const countEl = document.querySelector(".cart-toolbar__count")
        if (countEl) countEl.textContent = `${items.length} varer`
    }

    function formatNOK(n) {
        return n
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
})
