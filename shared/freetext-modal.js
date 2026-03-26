// ── Freetext modal: add custom product to cart ──

const FreetextModal = (() => {
    let modal = null
    let backdrop = null
    let counter = 0

    const SUPPLIERS = [
        "Dustin",
        "Komplett",
        "Eplehuset",
        "Elkjøp",
        "Atea",
        "Kontorbutikken",
    ]

    const UNITS = [
        "Stykk",
        "Meter",
        "Liter",
        "Kilogram",
        "Pakke",
        "Kartong",
        "Pall",
        "Time",
        "Dag",
    ]

    const VAT_RATES = [
        { label: "25 % (standard)", value: 25 },
        { label: "15 % (mat og drikke)", value: 15 },
        { label: "12 % (transport, kino)", value: 12 },
        { label: "0 % (fritatt)", value: 0 },
    ]

    function createModal() {
        // Backdrop
        backdrop = document.createElement("div")
        backdrop.className = "freetext-backdrop"
        backdrop.addEventListener("click", close)

        // Modal
        modal = document.createElement("div")
        modal.className = "freetext-modal"
        modal.innerHTML = `
            <div class="freetext-modal__header">
                <div class="freetext-modal__title">
                    <span class="material-symbols-outlined">edit_note</span>
                    <h2>Legg til fritekstvare</h2>
                </div>
                <button class="freetext-modal__close" id="freetext-close">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <form class="freetext-modal__form" id="freetext-form">
                <div class="freetext-field">
                    <label for="freetext-supplier">Leverandør</label>
                    <select id="freetext-supplier" required>
                        <option value="" disabled selected>Velg leverandør...</option>
                        ${SUPPLIERS.map((s) => `<option value="${s}">${s}</option>`).join("")}
                        <option value="__other">Annen...</option>
                    </select>
                </div>
                <div class="freetext-field freetext-field--other-supplier" id="freetext-other-supplier-field" hidden>
                    <label for="freetext-other-supplier">Annen leverandør</label>
                    <input type="text" id="freetext-other-supplier" placeholder="Skriv inn leverandørnavn..." />
                </div>
                <div class="freetext-field">
                    <label for="freetext-desc">Beskrivelse</label>
                    <textarea id="freetext-desc" rows="3" placeholder="Beskriv varen du ønsker å bestille..." required></textarea>
                </div>
                <div class="freetext-field-row">
                    <div class="freetext-field">
                        <label for="freetext-qty">Antall</label>
                        <input type="number" id="freetext-qty" min="1" value="1" required />
                    </div>
                    <div class="freetext-field">
                        <label for="freetext-unit">Enhet</label>
                        <select id="freetext-unit" required>
                            ${UNITS.map((u, i) => `<option value="${u}"${i === 0 ? " selected" : ""}>${u}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="freetext-field-row">
                    <div class="freetext-field">
                        <label for="freetext-price">Enhetspris (NOK)</label>
                        <input type="number" id="freetext-price" min="0" step="0.01" placeholder="0,00" required />
                    </div>
                    <div class="freetext-field">
                        <label for="freetext-vat">MVA</label>
                        <select id="freetext-vat" required>
                            ${VAT_RATES.map((v) => `<option value="${v.value}"${v.value === 25 ? " selected" : ""}>${v.label}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="freetext-modal__summary" id="freetext-summary">
                    <div class="freetext-summary__row">
                        <span>Sum eksl. MVA</span>
                        <strong id="freetext-subtotal">0,00</strong>
                    </div>
                    <div class="freetext-summary__row freetext-summary__row--muted">
                        <span>MVA (<span id="freetext-vat-pct">25</span> %)</span>
                        <span id="freetext-vat-amount">0,00</span>
                    </div>
                    <div class="freetext-summary__row freetext-summary__row--total">
                        <span>Totalt</span>
                        <strong id="freetext-total">0,00</strong>
                    </div>
                </div>
                <div class="freetext-modal__actions">
                    <button type="button" class="freetext-btn freetext-btn--secondary" id="freetext-cancel">Avbryt</button>
                    <button type="submit" class="freetext-btn freetext-btn--primary">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                        Legg i handlekurv
                    </button>
                </div>
            </form>
        `

        document.body.appendChild(backdrop)
        document.body.appendChild(modal)

        // Bind events
        modal.querySelector("#freetext-close").addEventListener("click", close)
        modal.querySelector("#freetext-cancel").addEventListener("click", close)

        // Supplier "other" toggle
        const supplierSelect = modal.querySelector("#freetext-supplier")
        const otherField = modal.querySelector("#freetext-other-supplier-field")
        const otherInput = modal.querySelector("#freetext-other-supplier")
        supplierSelect.addEventListener("change", () => {
            if (supplierSelect.value === "__other") {
                otherField.hidden = false
                otherInput.required = true
                otherInput.focus()
            } else {
                otherField.hidden = true
                otherInput.required = false
            }
        })

        // Live price summary
        const qtyInput = modal.querySelector("#freetext-qty")
        const priceInput = modal.querySelector("#freetext-price")
        const vatSelect = modal.querySelector("#freetext-vat")
        const update = () => updateSummary(qtyInput, priceInput, vatSelect)
        qtyInput.addEventListener("input", update)
        priceInput.addEventListener("input", update)
        vatSelect.addEventListener("change", update)

        // Form submit
        modal.querySelector("#freetext-form").addEventListener("submit", (e) => {
            e.preventDefault()
            handleSubmit()
        })

        // Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("open")) {
                close()
            }
        })
    }

    function updateSummary(qtyInput, priceInput, vatSelect) {
        const qty = parseFloat(qtyInput.value) || 0
        const price = parseFloat(priceInput.value) || 0
        const vatPct = parseFloat(vatSelect.value) || 0

        const subtotal = qty * price
        const vatAmount = subtotal * (vatPct / 100)
        const total = subtotal + vatAmount

        modal.querySelector("#freetext-subtotal").textContent = formatNOKLocal(subtotal)
        modal.querySelector("#freetext-vat-pct").textContent = vatPct
        modal.querySelector("#freetext-vat-amount").textContent = formatNOKLocal(vatAmount)
        modal.querySelector("#freetext-total").textContent = formatNOKLocal(total)
    }

    function formatNOKLocal(n) {
        return n
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    function handleSubmit() {
        const supplierSelect = modal.querySelector("#freetext-supplier")
        let supplier = supplierSelect.value
        if (supplier === "__other") {
            supplier = modal.querySelector("#freetext-other-supplier").value.trim()
        }

        const description = modal.querySelector("#freetext-desc").value.trim()
        const qty = parseInt(modal.querySelector("#freetext-qty").value) || 1
        const unit = modal.querySelector("#freetext-unit").value
        const price = parseFloat(modal.querySelector("#freetext-price").value) || 0
        const vatRate = parseInt(modal.querySelector("#freetext-vat").value)

        if (!supplier || !description) return

        counter++
        const item = {
            id: "freetext-" + Date.now() + "-" + counter,
            name: description.length > 60 ? description.substring(0, 57) + "..." : description,
            description: description,
            price: price,
            quantity: qty,
            supplier: supplier,
            unit: unit,
            vatRate: vatRate,
            icon: "edit_note",
            isFreetext: true,
        }

        Cart.addPunchoutItem(item)
        close()
    }

    function open() {
        if (!modal) createModal()

        // Reset form
        modal.querySelector("#freetext-form").reset()
        modal.querySelector("#freetext-other-supplier-field").hidden = true
        modal.querySelector("#freetext-subtotal").textContent = "0,00"
        modal.querySelector("#freetext-vat-pct").textContent = "25"
        modal.querySelector("#freetext-vat-amount").textContent = "0,00"
        modal.querySelector("#freetext-total").textContent = "0,00"

        // Show
        requestAnimationFrame(() => {
            backdrop.classList.add("open")
            modal.classList.add("open")
            document.body.style.overflow = "hidden"
        })
    }

    function close() {
        if (!modal) return
        backdrop.classList.remove("open")
        modal.classList.remove("open")
        document.body.style.overflow = ""
    }

    return { open }
})()
