document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    // ── Mock data ──
    const products = [
        {
            id: 1,
            leverandor: "Staples Norge AS",
            avtale: "RA-2024-015",
            artikkelnummer: "1001234",
            beskrivelse:
                "Kopipapir A4 80g 500 ark — Hvit, FSC-sertifisert, egnet for laser og blekk",
            kontering:
                "6540 Kontorrekvisita / Avd. 310 Administrasjon / Prosjekt P-2024-089",
            leveringsdato: "28.03.2026",
            antall: 10,
            enhet: "kartong",
            enhetspris: 289.0,
            mvaSats: 25,
        },
        {
            id: 2,
            leverandor: "Lyreco Norway",
            avtale: "RA-2024-015",
            artikkelnummer: "2005678",
            beskrivelse: "Post-it blokk 76x76mm gul, 12-pk",
            kontering: "6540 Kontorrekvisita",
            leveringsdato: "28.03.2026",
            antall: 5,
            enhet: "pk",
            enhetspris: 145.0,
            mvaSats: 25,
        },
        {
            id: 3,
            leverandor: "Kaffebrenneriet AS",
            avtale: "RA-2023-042",
            artikkelnummer: "3009012",
            beskrivelse:
                "Kaffe hele bønner økologisk mørk brent 1kg — Fairtrade-sertifisert, spesiallaget blanding for kontor",
            kontering:
                "6560 Kantine og velferd / Avd. 100 Fellestjenester / Kostnadssted K-KANTINE",
            leveringsdato: "01.04.2026",
            antall: 8,
            enhet: "pose",
            enhetspris: 219.0,
            mvaSats: 15,
        },
        {
            id: 4,
            leverandor: "Nilfisk AS",
            avtale: "",
            artikkelnummer: "4007890",
            beskrivelse:
                "Gulvrengjøring allrengjøringsmiddel 5L kanne — Konsentrert, pH-nøytral, egnet for alle gulvtyper inkl. vinyl og laminat.\n\nBrukes fortynnet 1:20 for daglig renhold, 1:10 for periodisk grunnvask. Ikke bland med klorbaserte midler.\n\nSikkerhetsdatablad vedlagt som vedlegg 2. Produktet er Svanemerket og oppfyller kravene i NS-INSTA 800.\n\nMerk: Erstatter tidligere brukt produkt art. 4005123 som er utgått fra leverandør. Ny formulering gir tilsvarende resultat.\n\nBestilles i henhold til rammeavtale for renholdsartikler. Estimert årsforbruk: 48 kanner.\n\nLeveres på pall, minimum 12 kanner per bestilling for fraktfri levering.",
            kontering:
                "6610 Renhold / Avd. 310 Administrasjon / Prosjekt P-2024-089 / Aktivitet A-VEDLIKEHOLD\n\nFordeling: 60% belastes kostnadssted K-RENHOLD-HK (hovedkontor), 40% belastes kostnadssted K-RENHOLD-LAGER (lagerlokaler Alnabru).\n\nPeriodisering: Kostnad fordeles likt over Q2 og Q3 2026.\n\nGodkjent av økonomileder 12.03.2026, ref. e-post. Avviker fra standard konteringsregel pga. delt bruk mellom avdelinger.\n\nMerk: Prosjekt P-2024-089 avsluttes 30.06.2026. Resterende forbruk etter denne dato konteres direkte på 6610 uten prosjektreferanse.",
            leveringsdato: "01.04.2026",
            antall: 4,
            enhet: "stk",
            enhetspris: 389.0,
            mvaSats: 25,
        },
        {
            id: 5,
            leverandor: "Staples Norge AS",
            avtale: "RA-2024-015",
            artikkelnummer: "1004567",
            beskrivelse: "Kulepenn blå 0.7mm, 50-pk",
            kontering: "6540 Kontorrekvisita / Avd. 310 Administrasjon",
            leveringsdato: "28.03.2026",
            antall: 2,
            enhet: "pk",
            enhetspris: 399.0,
            mvaSats: 25,
        },
        {
            id: 6,
            leverandor: "Lyreco Norway",
            avtale: "RA-2024-015",
            artikkelnummer: "2008901",
            beskrivelse:
                "Ringperm A4 2-rings 40mm hvit, resirkulert papp — Svanemerket, med utskiftbar ryggskilt og lomme på innsiden",
            kontering:
                "6540 Kontorrekvisita / Avd. 320 HR / Kostnadssted K-ONBOARDING / Prosjekt P-2025-NYE-ANSATTE",
            leveringsdato: "28.03.2026",
            antall: 25,
            enhet: "stk",
            enhetspris: 42.0,
            mvaSats: 25,
        },
    ]

    // ── State ──
    let selectedIds = new Set()
    let expandedIds = new Set()
    let currentTab = "detaljer"
    let currentView =
        localStorage.getItem("vieri-reqdetail-view") || "standard"

    // ── Format helpers ──
    const fmt = new Intl.NumberFormat("nb-NO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    function formatAmount(n) {
        return fmt.format(n)
    }

    function nl2br(str) {
        return str.replace(/\n/g, "<br>")
    }

    function firstLine(str) {
        return str.split("\n")[0]
    }

    // ── DOM refs ──
    const productList = document.getElementById("product-list")
    const batchBar = document.getElementById("batch-bar")
    const batchCount = document.getElementById("batch-count")
    const batchSelectAll = document.getElementById("batch-select-all")
    const productCount = document.getElementById("product-count")
    const addDropdown = document.getElementById("add-product-dropdown")
    const actionDropdown = document.getElementById("product-action-dropdown")
    const viewToggle = document.getElementById("view-toggle")

    // ══════════════════════════════════════════
    //  STANDARD VIEW renderer
    // ══════════════════════════════════════════
    function renderStandard() {
        productList.innerHTML = products
            .map((p) => {
                const lineTotal = p.antall * p.enhetspris
                const checked = selectedIds.has(p.id) ? "checked" : ""
                const cls = [
                    "rd-std-row",
                    selectedIds.has(p.id) ? "is-selected" : "",
                    expandedIds.has(p.id) ? "is-expanded" : "",
                ]
                    .filter(Boolean)
                    .join(" ")

                return `
                <div class="${cls}" data-id="${p.id}">
                    <div class="rd-std-row__primary" data-expand="${p.id}">
                        <div class="rd-std-row__check">
                            <input type="checkbox" data-id="${p.id}" ${checked} />
                        </div>
                        <div class="rd-std-row__content">
                            <span class="rd-std-row__artno">${p.artikkelnummer}</span>
                            <span class="rd-std-row__desc">${firstLine(p.beskrivelse)}</span>
                        </div>
                        <span class="rd-std-row__amount">${formatAmount(lineTotal)}</span>
                        <div class="rd-std-row__menu">
                            <button class="rd-std-row__menu-btn rd-menu-trigger" data-id="${p.id}" title="Handlinger">
                                <span class="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="rd-std-row__secondary">
                        <span class="rd-std-row__meta">
                            <span class="rd-std-row__meta-label">Lev.</span>
                            <span class="rd-std-row__meta-value">${p.leverandor}</span>
                        </span>
                        <span class="rd-std-row__meta">
                            <span class="rd-std-row__meta-label">Antall</span>
                            <span class="rd-std-row__meta-value">${p.antall} ${p.enhet} × ${formatAmount(p.enhetspris)}</span>
                        </span>
                        <span class="rd-std-row__meta">
                            <span class="rd-std-row__meta-label">MVA</span>
                            <span class="rd-std-row__meta-value">${p.mvaSats}%</span>
                        </span>
                        <span class="rd-std-row__meta">
                            <span class="rd-std-row__meta-label">Levering</span>
                            <span class="rd-std-row__meta-value">${p.leveringsdato}</span>
                        </span>
                        ${p.avtale ? `<span class="rd-std-row__meta">
                            <span class="rd-std-row__meta-label">Avtale</span>
                            <span class="rd-std-row__meta-value">${p.avtale}</span>
                        </span>` : ""}
                        <span class="rd-std-row__meta rd-std-row__meta--kontering">
                            <span class="rd-std-row__meta-label">Kont.</span>
                            <span class="rd-std-row__meta-value">${firstLine(p.kontering)}</span>
                        </span>
                    </div>
                    <div class="rd-std-row__detail">
                        <div class="rd-std-row__detail-inner">
                            <div class="rd-std-row__detail-section">
                                <span class="rd-std-row__detail-label">Beskrivelse</span>
                                <span class="rd-std-row__detail-value">${nl2br(p.beskrivelse)}</span>
                            </div>
                            <div class="rd-std-row__detail-section">
                                <span class="rd-std-row__detail-label">Kontering</span>
                                <span class="rd-std-row__detail-value">${nl2br(p.kontering)}</span>
                            </div>
                        </div>
                    </div>
                </div>`
            })
            .join("")
    }

    // ══════════════════════════════════════════
    //  COMPACT VIEW renderer
    // ══════════════════════════════════════════
    function renderCompact() {
        const rows = products
            .map((p) => {
                const lineTotal = p.antall * p.enhetspris
                const checked = selectedIds.has(p.id) ? "checked" : ""
                const isExpanded = expandedIds.has(p.id)
                const cls = [
                    selectedIds.has(p.id) ? "is-selected" : "",
                    isExpanded ? "is-expanded" : "",
                ]
                    .filter(Boolean)
                    .join(" ")
                const expandCls = isExpanded
                    ? "rd-compact__expand-row is-visible"
                    : "rd-compact__expand-row"

                return `
                <tr class="${cls}" data-id="${p.id}">
                    <td class="rd-compact__td-check">
                        <input type="checkbox" data-id="${p.id}" ${checked} />
                    </td>
                    <td class="rd-compact__td-artno">${p.artikkelnummer}</td>
                    <td class="rd-compact__td-desc" data-expand="${p.id}">
                        <span class="rd-compact__desc-text">${firstLine(p.beskrivelse)}</span>
                    </td>
                    <td class="rd-compact__td-supplier">${p.leverandor}</td>
                    <td class="rd-compact__td-num">${p.antall} ${p.enhet}</td>
                    <td class="rd-compact__td-num">${formatAmount(p.enhetspris)}</td>
                    <td class="rd-compact__td-num">${p.mvaSats}%</td>
                    <td class="rd-compact__td-amount">${formatAmount(lineTotal)}</td>
                    <td class="rd-compact__td-date">${p.leveringsdato}</td>
                    <td class="rd-compact__td-avtale">${p.avtale || "—"}</td>
                    <td class="rd-compact__td-menu">
                        <button class="rd-compact__menu-btn rd-menu-trigger" data-id="${p.id}" title="Handlinger">
                            <span class="material-symbols-outlined">more_vert</span>
                        </button>
                    </td>
                </tr>
                <tr class="${expandCls}" data-expand-for="${p.id}">
                    <td colspan="11">
                        <div class="rd-compact__expand-content">
                            <div class="rd-compact__expand-field">
                                <span class="rd-compact__expand-label">Beskrivelse</span>
                                <span class="rd-compact__expand-value">${nl2br(p.beskrivelse)}</span>
                            </div>
                            <div class="rd-compact__expand-field">
                                <span class="rd-compact__expand-label">Kontering</span>
                                <span class="rd-compact__expand-value">${nl2br(p.kontering)}</span>
                            </div>
                        </div>
                    </td>
                </tr>`
            })
            .join("")

        productList.innerHTML = `
            <div class="rd-compact">
                <table class="rd-compact__table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Art.nr</th>
                            <th>Beskrivelse</th>
                            <th>Leverandør</th>
                            <th class="rd-compact__th-right">Antall</th>
                            <th class="rd-compact__th-right">Enhetspris</th>
                            <th class="rd-compact__th-right">MVA</th>
                            <th class="rd-compact__th-right">Beløp</th>
                            <th>Levering</th>
                            <th>Avtale</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`
    }

    // ── Render dispatcher ──
    function renderProducts() {
        if (currentView === "compact") {
            renderCompact()
        } else {
            renderStandard()
        }
    }

    function render() {
        renderProducts()
        productCount.textContent = products.length
        updateBatch()
        updateTotals()
        updateViewToggle()
        bindInteractions()
    }

    // ── Totals ──
    function updateTotals() {
        let totalExMva = 0
        let totalMva = 0
        products.forEach((p) => {
            const line = p.antall * p.enhetspris
            totalExMva += line
            totalMva += line * (p.mvaSats / 100)
        })
        document.getElementById("total-ex-mva").textContent =
            formatAmount(totalExMva)
        document.getElementById("total-mva").textContent =
            formatAmount(totalMva)
        document.getElementById("total-incl-mva").textContent = formatAmount(
            totalExMva + totalMva
        )
    }

    // ── Batch bar ──
    function updateBatch() {
        const count = selectedIds.size
        if (count > 0) {
            batchBar.hidden = false
            batchCount.textContent = `${count} valgt`
            batchSelectAll.checked = count === products.length
            batchSelectAll.indeterminate =
                count > 0 && count < products.length
        } else {
            batchBar.hidden = true
        }
    }

    // ── View toggle ──
    function updateViewToggle() {
        viewToggle.querySelectorAll(".rd-view-toggle__btn").forEach((btn) => {
            btn.classList.toggle(
                "is-active",
                btn.dataset.view === currentView
            )
        })
    }

    viewToggle.addEventListener("click", (e) => {
        const btn = e.target.closest(".rd-view-toggle__btn")
        if (!btn || btn.dataset.view === currentView) return
        currentView = btn.dataset.view
        localStorage.setItem("vieri-reqdetail-view", currentView)
        render()
    })

    // ── Bind interactions (after each render) ──
    function bindInteractions() {
        // Checkboxes
        productList
            .querySelectorAll('input[type="checkbox"]')
            .forEach((cb) => {
                cb.addEventListener("change", (e) => {
                    e.stopPropagation()
                    const id = Number(e.target.dataset.id)
                    if (e.target.checked) {
                        selectedIds.add(id)
                    } else {
                        selectedIds.delete(id)
                    }
                    render()
                })
            })

        if (currentView === "standard") {
            // Standard: expand/collapse on primary row click
            productList.querySelectorAll("[data-expand]").forEach((el) => {
                el.addEventListener("click", (e) => {
                    if (
                        e.target.closest(".rd-std-row__check") ||
                        e.target.closest(".rd-std-row__menu")
                    )
                        return
                    const id = Number(el.dataset.expand)
                    toggleExpand(id)
                })
            })
        } else {
            // Compact: expand/collapse on description cell click
            productList
                .querySelectorAll("td[data-expand]")
                .forEach((el) => {
                    el.addEventListener("click", () => {
                        const id = Number(el.dataset.expand)
                        toggleExpand(id)
                    })
                })
        }

        // Action menus (shared class)
        productList.querySelectorAll(".rd-menu-trigger").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation()
                positionDropdown(actionDropdown, btn)
                actionDropdown.hidden = false
                addDropdown.hidden = true
            })
        })
    }

    function toggleExpand(id) {
        if (expandedIds.has(id)) {
            expandedIds.delete(id)
        } else {
            expandedIds.add(id)
        }
        render()
    }

    // ── Select all ──
    batchSelectAll.addEventListener("change", (e) => {
        if (e.target.checked) {
            products.forEach((p) => selectedIds.add(p.id))
        } else {
            selectedIds.clear()
        }
        render()
    })

    // ── Tab switching ──
    document.querySelectorAll(".rd-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".rd-tab")
                .forEach((t) => t.classList.remove("active"))
            tab.classList.add("active")
            currentTab = tab.dataset.tab
            document.querySelectorAll(".rd-tab-content").forEach((el) => {
                el.hidden = true
            })
            document.getElementById(`tab-${currentTab}`).hidden = false
        })
    })

    // ── Dropdown: add product ──
    const btnAdd = document.getElementById("btn-add-product")

    btnAdd.addEventListener("click", (e) => {
        e.stopPropagation()
        if (addDropdown.hidden) {
            positionDropdown(addDropdown, btnAdd)
            addDropdown.hidden = false
        } else {
            addDropdown.hidden = true
        }
        actionDropdown.hidden = true
    })

    // ── Dropdown positioning ──
    function positionDropdown(dropdown, anchor) {
        const rect = anchor.getBoundingClientRect()
        dropdown.style.top = `${rect.bottom + 4}px`
        dropdown.style.left = `${rect.left}px`

        requestAnimationFrame(() => {
            const dRect = dropdown.getBoundingClientRect()
            if (dRect.right > window.innerWidth - 8) {
                dropdown.style.left = `${window.innerWidth - dRect.width - 8}px`
            }
            if (dRect.bottom > window.innerHeight - 8) {
                dropdown.style.top = `${rect.top - dRect.height - 4}px`
            }
        })
    }

    // Close dropdowns on outside click
    document.addEventListener("click", () => {
        addDropdown.hidden = true
        actionDropdown.hidden = true
    })

    addDropdown.addEventListener("click", (e) => e.stopPropagation())
    actionDropdown.addEventListener("click", (e) => e.stopPropagation())

    // ── Initial render ──
    render()
})
