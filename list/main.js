document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    // ── Sample data ──
    const suppliers = [
        {
            name: "Staples Norge AS",
            orgnr: "912 345 678",
            country: "Norge",
            phone: "+47 22 33 44 55",
            email: "ordre@staples.no",
            integration: true,
            freetext: true,
            status: "active",
        },
        {
            name: "Lyreco AS",
            orgnr: "987 654 321",
            country: "Norge",
            phone: "+47 33 44 55 66",
            email: "bestilling@lyreco.no",
            integration: true,
            freetext: false,
            status: "active",
        },
        {
            name: "Dustin Norway AS",
            orgnr: "923 456 789",
            country: "Norge",
            phone: "+47 44 55 66 77",
            email: "salg@dustin.no",
            integration: true,
            freetext: true,
            status: "active",
        },
        {
            name: "Komplett Bedrift AS",
            orgnr: "934 567 890",
            country: "Norge",
            phone: "+47 55 66 77 88",
            email: "bedrift@komplett.no",
            integration: false,
            freetext: true,
            status: "active",
        },
        {
            name: "Würth Norge AS",
            orgnr: "945 678 901",
            country: "Norge",
            phone: "+47 66 77 88 99",
            email: "ordre@wurth.no",
            integration: true,
            freetext: false,
            status: "active",
        },
        {
            name: "Clas Ohlson AB",
            orgnr: "SE556035-8672",
            country: "Sverige",
            phone: "+46 247 444 00",
            email: "foretag@clasohlson.se",
            integration: false,
            freetext: true,
            status: "active",
        },
        {
            name: "3M Norge AS",
            orgnr: "956 789 012",
            country: "Norge",
            phone: "+47 77 88 99 00",
            email: "order@3m.no",
            integration: true,
            freetext: false,
            status: "active",
        },
        {
            name: "Tingstad AB",
            orgnr: "SE556070-3414",
            country: "Sverige",
            phone: "+46 31 750 00 00",
            email: "order@tingstad.se",
            integration: true,
            freetext: true,
            status: "active",
        },
        {
            name: "Office Depot International",
            orgnr: "DE123456789",
            country: "Tyskland",
            phone: "+49 89 998 280",
            email: "orders@officedepot.de",
            integration: false,
            freetext: false,
            status: "inactive",
        },
        {
            name: "Viking Kontorsupply AS",
            orgnr: "967 890 123",
            country: "Norge",
            phone: "+47 88 99 00 11",
            email: "kundeservice@viking.no",
            integration: false,
            freetext: true,
            status: "inactive",
        },
        {
            name: "Papyrus Norge AS",
            orgnr: "978 901 234",
            country: "Norge",
            phone: "+47 99 00 11 22",
            email: "salg@papyrus.no",
            integration: true,
            freetext: false,
            status: "active",
        },
        {
            name: "Fellowes GmbH",
            orgnr: "DE987654321",
            country: "Tyskland",
            phone: "+49 511 123 456",
            email: "verkauf@fellowes.de",
            integration: false,
            freetext: false,
            status: "inactive",
        },
    ]

    let currentTab = "active"
    let currentSort = { key: "name", dir: "asc" }
    let currentView = "default"
    let selectedIds = new Set()

    // ── Filtering ──
    function getFiltered() {
        const search = document
            .querySelector(".list-search input")
            .value.toLowerCase()
        let items = suppliers

        if (currentTab === "active")
            items = items.filter((s) => s.status === "active")
        else if (currentTab === "inactive")
            items = items.filter((s) => s.status === "inactive")

        if (search) {
            items = items.filter(
                (s) =>
                    s.name.toLowerCase().includes(search) ||
                    s.orgnr.toLowerCase().includes(search) ||
                    s.email.toLowerCase().includes(search) ||
                    s.phone.includes(search)
            )
        }

        return items.sort((a, b) => {
            const valA = String(a[currentSort.key]).toLowerCase()
            const valB = String(b[currentSort.key]).toLowerCase()
            const cmp = valA.localeCompare(valB, "nb")
            return currentSort.dir === "asc" ? cmp : -cmp
        })
    }

    // ── Render default view ──
    function renderDefault() {
        const container = document.getElementById("list-default-view")
        // Keep the sort bar, remove old items
        container
            .querySelectorAll(".list-item")
            .forEach((el) => el.remove())

        const items = getFiltered()
        updateCount(items.length)

        items.forEach((item, idx) => {
            const row = document.createElement("div")
            row.className = "list-item"
            row.innerHTML = `
                <div class="list-item__check">
                    <input type="checkbox" data-idx="${idx}" ${selectedIds.has(idx) ? "checked" : ""} />
                </div>
                <div class="list-item__name">${item.name}</div>
                <div class="list-item__cell">${item.orgnr}</div>
                <div class="list-item__cell">${item.country}</div>
                <div class="list-item__cell">${item.phone}</div>
                <div class="list-item__cell"><a href="mailto:${item.email}">${item.email}</a></div>
                <div class="list-item__cell">
                    <span class="list-badge ${item.integration ? "list-badge--yes" : "list-badge--no"}">
                        ${item.integration ? "Ja" : "Nei"}
                    </span>
                </div>
                <div class="list-item__cell">
                    <span class="list-badge ${item.freetext ? "list-badge--yes" : "list-badge--no"}">
                        ${item.freetext ? "Ja" : "Nei"}
                    </span>
                </div>
                <div class="list-item__cell list-item__cell--mobile">
                    <span>${item.orgnr}</span>
                    <span>${item.country}</span>
                    <span>${item.phone}</span>
                </div>
                <div class="list-item__actions">
                    <button class="list-item__action" title="Mer">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            `
            container.appendChild(row)
        })

        bindCheckboxes()
    }

    // ── Render table view ──
    function renderTable() {
        const tbody = document.getElementById("table-body")
        tbody.innerHTML = ""

        const items = getFiltered()
        updateCount(items.length)

        items.forEach((item, idx) => {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td><input type="checkbox" data-idx="${idx}" ${selectedIds.has(idx) ? "checked" : ""} /></td>
                <td><span class="list-item__name">${item.name}</span></td>
                <td>${item.orgnr}</td>
                <td>${item.country}</td>
                <td>${item.phone}</td>
                <td><a href="mailto:${item.email}" style="color:#5a8f99;text-decoration:none">${item.email}</a></td>
                <td>
                    <span class="list-badge ${item.integration ? "list-badge--yes" : "list-badge--no"}">
                        ${item.integration ? "Ja" : "Nei"}
                    </span>
                </td>
                <td>
                    <span class="list-badge ${item.freetext ? "list-badge--yes" : "list-badge--no"}">
                        ${item.freetext ? "Ja" : "Nei"}
                    </span>
                </td>
                <td>
                    <button class="row-action" title="Mer">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </td>
            `
            tbody.appendChild(tr)
        })

        bindCheckboxes()
    }

    function render() {
        if (currentView === "default") {
            renderDefault()
        } else {
            renderTable()
        }
    }

    function updateCount(count) {
        document.querySelector(
            ".list-toolbar__count"
        ).textContent = `${count} leverandører`
        document.querySelector(
            ".list-pagination__info"
        ).innerHTML = `Viser <strong>1–${count}</strong> av <strong>${count}</strong>`
    }

    // ── Selection / batch ──
    function bindCheckboxes() {
        document.querySelectorAll(
            ".list-item__check input, .list-table td:first-child input"
        ).forEach((cb) => {
            cb.addEventListener("change", (e) => {
                const idx = parseInt(e.target.dataset.idx)
                if (e.target.checked) selectedIds.add(idx)
                else selectedIds.delete(idx)
                updateBatch()
            })
        })
    }

    function updateBatch() {
        const bar = document.getElementById("batch-toolbar")
        const count = selectedIds.size
        if (count > 0) {
            bar.hidden = false
            document.getElementById(
                "batch-count"
            ).textContent = `${count} valgt`
        } else {
            bar.hidden = true
        }
    }

    // Select-all checkboxes
    ;["select-all-default", "select-all-table", "batch-select-all"].forEach(
        (id) => {
            const el = document.getElementById(id)
            if (!el) return
            el.addEventListener("change", (e) => {
                const items = getFiltered()
                if (e.target.checked) {
                    items.forEach((_, idx) => selectedIds.add(idx))
                } else {
                    selectedIds.clear()
                }
                render()
                updateBatch()
            })
        }
    )

    // ── Tabs ──
    document.querySelectorAll(".list-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".list-tab")
                .forEach((t) => t.classList.remove("active"))
            tab.classList.add("active")
            currentTab = tab.dataset.tab
            selectedIds.clear()
            updateBatch()
            render()
        })
    })

    // ── Sort buttons ──
    document.querySelectorAll(".list-sort-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.sort
            if (!key) return

            if (currentSort.key === key) {
                currentSort.dir =
                    currentSort.dir === "asc" ? "desc" : "asc"
            } else {
                currentSort.key = key
                currentSort.dir = "asc"
            }

            // Update all sort button icons
            document.querySelectorAll(".list-sort-btn").forEach((b) => {
                b.classList.remove("active")
                const icon = b.querySelector(".sort-icon")
                if (icon) icon.textContent = "unfold_more"
            })

            // Set active icons
            document
                .querySelectorAll(
                    `.list-sort-btn[data-sort="${key}"]`
                )
                .forEach((b) => {
                    b.classList.add("active")
                    const icon = b.querySelector(".sort-icon")
                    if (icon)
                        icon.textContent =
                            currentSort.dir === "asc"
                                ? "arrow_upward"
                                : "arrow_downward"
                })

            render()
        })
    })

    // ── View toggle ──
    document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document
                .querySelectorAll(".view-btn")
                .forEach((b) => b.classList.remove("active"))
            btn.classList.add("active")

            const view = btn.dataset.view
            currentView = view

            document.getElementById("list-default-view").hidden =
                view !== "default"
            document.getElementById("list-table-view").hidden =
                view !== "table"

            render()
        })
    })

    // ── Search ──
    document
        .querySelector(".list-search input")
        .addEventListener("input", () => {
            render()
        })

    // ── Initial render ──
    render()
})
