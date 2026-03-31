document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents()

    const STORAGE_KEY = "vieri-req-settings"

    // ── Mock data ──
    const requisitions = [
        {
            id: "REK-000253",
            title: "Kontorrekvisita Q1",
            desc: "Bestilling av kontorrekvisita for første kvartal, inkludert penner, papir og mapper.",
            category: "Kontorrekvisita",
            status: "open",
            statusLabel: "Åpen",
            location: "Oslo HK",
            requester: "Kari Nordmann",
            requesterDept: "Innkjøp",
            approval: "waiting",
            approvalLabel: "Venter på T. Hansen",
            updated: "2026-03-18",
            updatedTime: "14:32",
            amount: 24500,
            deliveryDate: "28.03.2026",
            activity: [
                { date: "18.03", text: "Sendt til godkjenning av Kari N." },
                { date: "17.03", text: "Oppdatert mengder på 3 linjer" },
                { date: "15.03", text: "Opprettet av Kari Nordmann" },
            ],
        },
        {
            id: "REK-000252",
            title: "Verneutstyr lager",
            desc: "Påfyll av verneutstyr til lageret: hansker, vernebriller og hørselsvern.",
            category: "HMS / Vern",
            status: "pending",
            statusLabel: "Til godkjenning",
            location: "Drammen lager",
            requester: "Ole Bakken",
            requesterDept: "Lager",
            approval: "waiting",
            approvalLabel: "Venter på avd.leder",
            updated: "2026-03-17",
            updatedTime: "09:15",
            amount: 18200,
            deliveryDate: "25.03.2026",
            activity: [
                { date: "17.03", text: "Sendt til godkjenning" },
                { date: "16.03", text: "Lagt til hørselsvern" },
                { date: "16.03", text: "Opprettet av Ole Bakken" },
            ],
        },
        {
            id: "REK-000251",
            title: "IT-utstyr nyansatte",
            desc: "Bærbare PC-er, skjermer og headset til 5 nyansatte i mars.",
            category: "IT / Elektronikk",
            status: "approved",
            statusLabel: "Godkjent",
            location: "Oslo HK",
            requester: "Marte Lie",
            requesterDept: "IT",
            approval: "done",
            approvalLabel: "Godkjent av S. Berg",
            updated: "2026-03-16",
            updatedTime: "16:45",
            amount: 127800,
            deliveryDate: "22.03.2026",
            activity: [
                { date: "16.03", text: "Godkjent av Silje Berg" },
                { date: "15.03", text: "Sendt til godkjenning" },
                { date: "14.03", text: "Opprettet av Marte Lie" },
            ],
        },
        {
            id: "REK-000250",
            title: "Rengjøringsmidler",
            desc: "Rengjøringsmidler og utstyr til kontorlokalene i Bergen.",
            category: "Renhold",
            status: "open",
            statusLabel: "Åpen",
            location: "Bergen kontor",
            requester: "Jonas Vik",
            requesterDept: "Drift",
            approval: "none",
            approvalLabel: "Ikke sendt",
            updated: "2026-03-16",
            updatedTime: "11:20",
            amount: 8450,
            deliveryDate: "30.03.2026",
            activity: [
                { date: "16.03", text: "Oppdatert leveringsdato" },
                { date: "15.03", text: "Opprettet av Jonas Vik" },
            ],
        },
        {
            id: "REK-000249",
            title: "Møbelinnkjøp 3. etg",
            desc: "Nye kontorstoler og skrivepulter til oppgradert kontorlandskap.",
            category: "Inventar",
            status: "pending",
            statusLabel: "Til godkjenning",
            location: "Oslo HK",
            requester: "Lena Strand",
            requesterDept: "Administrasjon",
            approval: "waiting",
            approvalLabel: "Venter på dir. godkj.",
            updated: "2026-03-15",
            updatedTime: "13:00",
            amount: 345000,
            deliveryDate: "15.04.2026",
            activity: [
                { date: "15.03", text: "Sendt til direktørgodkjenning" },
                { date: "14.03", text: "Ferdigstilt av Lena Strand" },
                { date: "10.03", text: "Opprettet" },
            ],
        },
        {
            id: "REK-000248",
            title: "Kaffemaskin service",
            desc: "Servicekontrakt og reservedeler til kaffemaskin i kantinen.",
            category: "Kantine",
            status: "rejected",
            statusLabel: "Avvist",
            location: "Trondheim kontor",
            requester: "Erik Haugen",
            requesterDept: "Drift",
            approval: "done",
            approvalLabel: "Avvist av K. Moen",
            updated: "2026-03-14",
            updatedTime: "10:30",
            amount: 12300,
            deliveryDate: "20.03.2026",
            activity: [
                {
                    date: "14.03",
                    text: "Avvist av Kristin Moen – bruk eksisterende avtale",
                },
                { date: "13.03", text: "Sendt til godkjenning" },
                { date: "12.03", text: "Opprettet av Erik Haugen" },
            ],
        },
        {
            id: "REK-000247",
            title: "Emballasje Q2",
            desc: "Bestilling av emballasjematerialer for andre kvartal.",
            category: "Emballasje",
            status: "approved",
            statusLabel: "Godkjent",
            location: "Drammen lager",
            requester: "Ingrid Dahl",
            requesterDept: "Logistikk",
            approval: "done",
            approvalLabel: "Godkjent av P. Nilsen",
            updated: "2026-03-13",
            updatedTime: "08:45",
            amount: 56700,
            deliveryDate: "01.04.2026",
            activity: [
                { date: "13.03", text: "Godkjent av Per Nilsen" },
                { date: "12.03", text: "Sendt til godkjenning" },
                { date: "11.03", text: "Opprettet av Ingrid Dahl" },
            ],
        },
        {
            id: "REK-000246",
            title: "Skilting nybygg",
            desc: "Innvendig og utvendig skilting for det nye kontorbygget.",
            category: "Bygg / Vedlikehold",
            status: "draft",
            statusLabel: "Kladd",
            location: "Stavanger kontor",
            requester: "Thomas Fjeld",
            requesterDept: "Prosjekt",
            approval: "none",
            approvalLabel: "Ikke sendt",
            updated: "2026-03-12",
            updatedTime: "15:10",
            amount: 89000,
            deliveryDate: "10.04.2026",
            activity: [
                { date: "12.03", text: "Lagret som kladd" },
                { date: "12.03", text: "Opprettet av Thomas Fjeld" },
            ],
        },
        {
            id: "REK-000245",
            title: "Førstehjelpsutstyr",
            desc: "Fornyelse av førstehjelpsskrin og øyedusjer for alle lokasjoner.",
            category: "HMS / Vern",
            status: "ordered",
            statusLabel: "Bestilt",
            location: "Alle lokasjoner",
            requester: "Silje Berg",
            requesterDept: "HMS",
            approval: "done",
            approvalLabel: "Godkjent av T. Hansen",
            updated: "2026-03-11",
            updatedTime: "12:00",
            amount: 32400,
            deliveryDate: "20.03.2026",
            activity: [
                { date: "11.03", text: "Ordre opprettet hos leverandør" },
                { date: "10.03", text: "Godkjent av T. Hansen" },
                { date: "09.03", text: "Opprettet av Silje Berg" },
            ],
        },
        {
            id: "REK-000244",
            title: "Programvarelisenser",
            desc: "Fornyelse av Adobe CC og Microsoft 365-lisenser for hele avdelingen.",
            category: "IT / Lisenser",
            status: "approved",
            statusLabel: "Godkjent",
            location: "Oslo HK",
            requester: "Marte Lie",
            requesterDept: "IT",
            approval: "done",
            approvalLabel: "Godkjent av dir.",
            updated: "2026-03-10",
            updatedTime: "09:30",
            amount: 198500,
            deliveryDate: "01.04.2026",
            activity: [
                { date: "10.03", text: "Godkjent av direktør" },
                { date: "09.03", text: "Sendt til godkjenning" },
                { date: "08.03", text: "Opprettet av Marte Lie" },
            ],
        },
        {
            id: "REK-000243",
            title: "Printerpapir lager",
            desc: "Bulkbestilling av A4-papir til alle skrivere i kontorlandskapet.",
            category: "Kontorrekvisita",
            status: "open",
            statusLabel: "Åpen",
            location: "Oslo HK",
            requester: "Kari Nordmann",
            requesterDept: "Innkjøp",
            approval: "none",
            approvalLabel: "Ikke sendt",
            updated: "2026-03-09",
            updatedTime: "14:00",
            amount: 6800,
            deliveryDate: "25.03.2026",
            activity: [
                { date: "09.03", text: "Opprettet av Kari Nordmann" },
            ],
        },
        {
            id: "REK-000242",
            title: "Catering årsmøte",
            desc: "Lunsj og forfriskninger til årsmøte med 80 deltakere.",
            category: "Kantine",
            status: "pending",
            statusLabel: "Til godkjenning",
            location: "Oslo HK",
            requester: "Lena Strand",
            requesterDept: "Administrasjon",
            approval: "waiting",
            approvalLabel: "Venter på økonomisjef",
            updated: "2026-03-08",
            updatedTime: "16:15",
            amount: 42000,
            deliveryDate: "05.04.2026",
            activity: [
                { date: "08.03", text: "Sendt til godkjenning" },
                { date: "07.03", text: "Opprettet av Lena Strand" },
            ],
        },
    ]

    // ── State ──
    let currentTab = "oversikt"
    let currentSort = { key: "id", dir: "desc" }
    let selectedIds = new Set()
    let activeRowIdx = null
    let density = "default"
    let hiddenCols = new Set()
    let previewCollapsed = false

    // Restore from localStorage
    const saved = loadSettings()
    if (saved) {
        if (saved.density) density = saved.density
        if (saved.hiddenCols) hiddenCols = new Set(saved.hiddenCols)
        if (saved.tab) currentTab = saved.tab
    }

    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY))
        } catch {
            return null
        }
    }

    function saveSettings() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                density,
                hiddenCols: [...hiddenCols],
                tab: currentTab,
            })
        )
    }

    // ── Filtering ──
    function getFiltered() {
        const search = document
            .getElementById("req-search")
            .value.toLowerCase()
        let items = [...requisitions]

        // Tab filtering
        if (currentTab === "oversikt") {
            items = items.filter(
                (r) =>
                    r.status !== "archived" &&
                    r.status !== "rejected"
            )
        } else if (currentTab === "handling") {
            items = items.filter(
                (r) =>
                    r.status === "pending" || r.approval === "waiting"
            )
        } else if (currentTab === "mine") {
            items = items.filter(
                (r) =>
                    r.requester === "Kari Nordmann" ||
                    r.requester === "Marte Lie"
            )
        } else if (currentTab === "arkiv") {
            items = items.filter(
                (r) =>
                    r.status === "archived" ||
                    r.status === "rejected" ||
                    r.status === "ordered"
            )
        }

        // Search
        if (search) {
            items = items.filter(
                (r) =>
                    r.id.toLowerCase().includes(search) ||
                    r.title.toLowerCase().includes(search) ||
                    r.requester.toLowerCase().includes(search) ||
                    r.location.toLowerCase().includes(search) ||
                    r.category.toLowerCase().includes(search)
            )
        }

        // Sort
        items.sort((a, b) => {
            let valA, valB
            if (currentSort.key === "amount") {
                valA = a.amount
                valB = b.amount
                const cmp = valA - valB
                return currentSort.dir === "asc" ? cmp : -cmp
            } else if (currentSort.key === "updated") {
                valA = a.updated
                valB = b.updated
                const cmp = valA.localeCompare(valB)
                return currentSort.dir === "asc" ? cmp : -cmp
            } else {
                const keyMap = {
                    id: "id",
                    status: "statusLabel",
                    location: "location",
                    requester: "requester",
                    approval: "approvalLabel",
                }
                const key = keyMap[currentSort.key] || currentSort.key
                valA = String(a[key]).toLowerCase()
                valB = String(b[key]).toLowerCase()
                const cmp = valA.localeCompare(valB, "nb")
                return currentSort.dir === "asc" ? cmp : -cmp
            }
        })

        return items
    }

    // ── Format helpers ──
    function formatAmount(amount) {
        return (
            new Intl.NumberFormat("nb-NO").format(amount) + " NOK"
        )
    }

    function formatDate(dateStr) {
        const [y, m, d] = dateStr.split("-")
        return `${d}.${m}.${y}`
    }

    function getApprovalIcon(type) {
        if (type === "waiting")
            return '<span class="material-symbols-outlined req-approval__icon">schedule</span>'
        if (type === "done")
            return '<span class="material-symbols-outlined req-approval__icon">check_circle</span>'
        return '<span class="material-symbols-outlined req-approval__icon">remove_circle_outline</span>'
    }

    function getApprovalClass(type) {
        if (type === "waiting") return "req-approval--waiting"
        if (type === "done") return "req-approval--done"
        return "req-approval--none"
    }

    // ── Render table ──
    function render() {
        const tbody = document.getElementById("req-tbody")
        tbody.innerHTML = ""

        const items = getFiltered()

        items.forEach((item, idx) => {
            const tr = document.createElement("tr")
            if (selectedIds.has(item.id)) tr.classList.add("is-selected")
            if (activeRowIdx === idx) tr.classList.add("is-active")

            const lokasjonHidden = hiddenCols.has("lokasjon")
            const godkjenningHidden = hiddenCols.has("godkjenning")

            tr.innerHTML = `
                <td><input type="checkbox" data-id="${item.id}" ${selectedIds.has(item.id) ? "checked" : ""} /></td>
                <td>
                    <div class="req-cell__primary">${item.id}</div>
                    <div class="req-cell__secondary">${item.title}</div>
                    <div class="req-cell__tertiary">${item.category}</div>
                </td>
                <td>
                    <span class="req-badge req-badge--${item.status}">${item.statusLabel}</span>
                </td>
                ${lokasjonHidden ? "" : `<td class="req-col-optional" data-col="lokasjon">
                    <div class="req-cell__primary">${item.location}</div>
                </td>`}
                <td>
                    <div class="req-cell__primary">${item.requester}</div>
                    <div class="req-cell__secondary">${item.requesterDept}</div>
                </td>
                ${godkjenningHidden ? "" : `<td class="req-col-optional" data-col="godkjenning">
                    <div class="req-approval ${getApprovalClass(item.approval)}">
                        ${getApprovalIcon(item.approval)}
                        <span class="req-cell__secondary">${item.approvalLabel}</span>
                    </div>
                </td>`}
                <td>
                    <div class="req-cell__primary">${formatDate(item.updated)}</div>
                    <div class="req-cell__secondary">${item.updatedTime}</div>
                </td>
                <td>
                    <span class="req-amount">${formatAmount(item.amount)}</span>
                </td>
            `

            // Row click -> preview
            tr.addEventListener("click", (e) => {
                if (e.target.type === "checkbox") return
                activeRowIdx = idx
                showPreview(item)
                render()
            })

            tbody.appendChild(tr)
        })

        updateBatch()
        applyDensity()
        applyHiddenCols()
        bindRowCheckboxes()
    }

    // ── Preview panel ──
    function getActionsForStatus(status) {
        const open = { icon: "open_in_new", label: "Åpne detaljside", cls: "", action: "open-detail" }
        const send = { icon: "send", label: "Send til godkjenning", cls: "" }
        const approve = { icon: "check_circle", label: "Godkjenn", cls: "req-preview__action-btn--approve" }
        const reject = { icon: "cancel", label: "Avvis", cls: "req-preview__action-btn--reject" }
        const dup = { icon: "content_copy", label: "Dupliser", cls: "" }
        const archive = { icon: "inventory_2", label: "Arkiver", cls: "" }

        switch (status) {
            case "draft":
                return [open, send, dup]
            case "pending":
                return [open, approve, reject]
            case "open":
                return [open, send, dup]
            case "approved":
                return [open, dup, archive]
            case "ordered":
                return [open, dup]
            case "rejected":
                return [open, dup]
            case "archived":
                return [open]
            default:
                return [open, dup]
        }
    }

    function showPreview(item) {
        document.getElementById("preview-empty").hidden = true
        document.getElementById("preview-content").hidden = false

        document.getElementById("preview-id").textContent = item.id
        document.getElementById("preview-title").textContent = item.title
        document.getElementById("preview-status").innerHTML = `
            <span class="req-badge req-badge--${item.status}">${item.statusLabel}</span>
        `
        document.getElementById("preview-amount").textContent =
            formatAmount(item.amount)
        document.getElementById("preview-location").textContent =
            item.location
        document.getElementById("preview-requester").textContent =
            `${item.requester} (${item.requesterDept})`
        document.getElementById("preview-delivery").textContent =
            item.deliveryDate
        document.getElementById("preview-approval").textContent =
            item.approvalLabel
        document.getElementById("preview-desc").textContent = item.desc

        // Timeline
        const timeline = document.getElementById("preview-timeline")
        timeline.innerHTML = item.activity
            .map(
                (a) => `
            <li>
                <span class="req-timeline__date">${a.date}</span>
                <span>${a.text}</span>
            </li>
        `
            )
            .join("")

        // Dynamic actions based on status
        const actionsEl = document.getElementById("preview-actions")
        const actions = getActionsForStatus(item.status)
        actionsEl.innerHTML = actions
            .map(
                (a) => `
            <button class="req-preview__action-btn ${a.cls}" ${a.action ? `data-action="${a.action}"` : ""}>
                <span class="material-symbols-outlined">${a.icon}</span>
                ${a.label}
            </button>
        `
            )
            .join("")

        actionsEl.querySelectorAll("[data-action='open-detail']").forEach((btn) => {
            btn.addEventListener("click", () => {
                window.location.href = "../requisition-detail/"
            })
        })

        // If collapsed, expand the preview
        if (previewCollapsed) {
            previewCollapsed = false
            applyPreviewCollapse()
        }

        // Open slide-over on narrow screens
        const preview = document.getElementById("req-preview")
        preview.classList.add("is-open")
    }

    function hidePreview() {
        document.getElementById("preview-empty").hidden = false
        document.getElementById("preview-content").hidden = true
        activeRowIdx = null
        const preview = document.getElementById("req-preview")
        preview.classList.remove("is-open")
        previewCollapsed = true
        applyPreviewCollapse()
        render()
    }

    document
        .getElementById("preview-close")
        .addEventListener("click", hidePreview)

    // ── Selection / batch ──
    function bindRowCheckboxes() {
        document
            .querySelectorAll('#req-tbody input[type="checkbox"]')
            .forEach((cb) => {
                cb.addEventListener("change", (e) => {
                    const id = e.target.dataset.id
                    if (e.target.checked) selectedIds.add(id)
                    else selectedIds.delete(id)
                    updateBatch()
                    // Update row classes without full re-render
                    const row = e.target.closest("tr")
                    if (e.target.checked) row.classList.add("is-selected")
                    else row.classList.remove("is-selected")
                })
            })
    }

    function updateBatch() {
        const bar = document.getElementById("batch-bar")
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

    // Select all
    document
        .getElementById("select-all")
        .addEventListener("change", (e) => {
            const items = getFiltered()
            if (e.target.checked) {
                items.forEach((r) => selectedIds.add(r.id))
            } else {
                selectedIds.clear()
            }
            render()
        })

    document
        .getElementById("batch-select-all")
        .addEventListener("change", (e) => {
            const items = getFiltered()
            if (e.target.checked) {
                items.forEach((r) => selectedIds.add(r.id))
            } else {
                selectedIds.clear()
            }
            render()
        })

    // ── Tabs ──
    document.querySelectorAll(".req-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".req-tab")
                .forEach((t) => t.classList.remove("active"))
            tab.classList.add("active")
            currentTab = tab.dataset.tab
            selectedIds.clear()
            activeRowIdx = null
            hidePreview()
            saveSettings()
            render()
        })
    })

    // Restore active tab
    if (currentTab) {
        document
            .querySelectorAll(".req-tab")
            .forEach((t) => t.classList.remove("active"))
        const activeTab = document.querySelector(
            `.req-tab[data-tab="${currentTab}"]`
        )
        if (activeTab) activeTab.classList.add("active")
    }

    // ── Sort buttons ──
    document.querySelectorAll(".req-sort-btn").forEach((btn) => {
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

            // Update icons
            document.querySelectorAll(".req-sort-btn").forEach((b) => {
                b.classList.remove("active")
                const icon = b.querySelector(".sort-icon")
                if (icon) icon.textContent = "unfold_more"
            })

            document
                .querySelectorAll(
                    `.req-sort-btn[data-sort="${key}"]`
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

    // ── Search ──
    document
        .getElementById("req-search")
        .addEventListener("input", () => render())

    // ── Density toggle ──
    function applyDensity() {
        const table = document.getElementById("req-table")
        table.classList.remove(
            "density-compact",
            "density-default",
            "density-comfortable"
        )
        if (density !== "default") {
            table.classList.add(`density-${density}`)
        }
    }

    document.querySelectorAll('input[name="density"]').forEach((radio) => {
        if (radio.value === density) radio.checked = true
        radio.addEventListener("change", () => {
            density = radio.value
            saveSettings()
            applyDensity()
        })
    })

    // ── Column toggle ──
    function applyHiddenCols() {
        // Hide header columns
        document.querySelectorAll("th.req-col-optional").forEach((th) => {
            th.hidden = hiddenCols.has(th.dataset.col)
        })
    }

    document
        .querySelectorAll("[data-toggle-col]")
        .forEach((checkbox) => {
            const col = checkbox.dataset.toggleCol
            checkbox.checked = !hiddenCols.has(col)
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    hiddenCols.delete(col)
                } else {
                    hiddenCols.add(col)
                }
                saveSettings()
                render()
            })
        })

    // ── Dropdowns ──
    function positionDropdown(dropdown, trigger) {
        const rect = trigger.getBoundingClientRect()
        dropdown.style.top = rect.bottom + 6 + "px"
        dropdown.style.left =
            Math.min(
                rect.left,
                window.innerWidth - dropdown.offsetWidth - 16
            ) + "px"
    }

    function toggleDropdown(id, triggerId) {
        const dropdown = document.getElementById(id)
        const trigger = document.getElementById(triggerId)
        const wasHidden = dropdown.hidden
        // Close all dropdowns first
        document
            .querySelectorAll(".req-dropdown")
            .forEach((d) => (d.hidden = true))
        if (wasHidden) {
            dropdown.hidden = false
            positionDropdown(dropdown, trigger)
        }
    }

    document
        .getElementById("btn-columns")
        .addEventListener("click", () =>
            toggleDropdown("columns-dropdown", "btn-columns")
        )
    document
        .getElementById("btn-density")
        .addEventListener("click", () =>
            toggleDropdown("density-dropdown", "btn-density")
        )

    document
        .getElementById("columns-close")
        .addEventListener("click", () => {
            document.getElementById("columns-dropdown").hidden = true
        })
    document
        .getElementById("density-close")
        .addEventListener("click", () => {
            document.getElementById("density-dropdown").hidden = true
        })

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !e.target.closest(".req-dropdown") &&
            !e.target.closest("#btn-columns") &&
            !e.target.closest("#btn-density")
        ) {
            document
                .querySelectorAll(".req-dropdown")
                .forEach((d) => (d.hidden = true))
        }
    })

    // ── Preview collapse toggle ──
    function applyPreviewCollapse() {
        const content = document.getElementById("req-content")
        if (previewCollapsed) {
            content.classList.add("preview-hidden")
        } else {
            content.classList.remove("preview-hidden")
        }
    }

    // Collapse button inside the empty state
    document
        .getElementById("preview-collapse")
        .addEventListener("click", () => {
            previewCollapsed = true
            applyPreviewCollapse()
        })

    // ── Expand to full page width ──
    let fullWidth = false
    const expandBtn = document.getElementById("btn-expand-full")
    expandBtn.addEventListener("click", () => {
        fullWidth = !fullWidth
        document.body.classList.toggle("full-width", fullWidth)
        const icon = expandBtn.querySelector(".material-symbols-outlined")
        if (fullWidth) {
            icon.textContent = "width_normal"
            expandBtn.title = "Tilbake til normal bredde"
            expandBtn.classList.add("req-toolbar__btn--active")
        } else {
            icon.textContent = "width_full"
            expandBtn.title = "Utvid til fullbredde"
            expandBtn.classList.remove("req-toolbar__btn--active")
        }
    })

    // ── Filter chip removal ──
    document.querySelectorAll(".req-chip__remove").forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.closest(".req-chip").remove()
        })
    })

    // ── Initial render ──
    render()
})
