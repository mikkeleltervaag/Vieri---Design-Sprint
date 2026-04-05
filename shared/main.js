async function loadComponent(selector, path) {
    const response = await fetch(path)
    const html = await response.text()
    document.querySelector(selector).innerHTML = html
}

function toggleMenu() {
    document.querySelector("#nav-slot").classList.toggle("open")
    document.querySelector(".nav-overlay").classList.toggle("open")
}

function closeMenu() {
    document.querySelector("#nav-slot").classList.remove("open")
    document.querySelector(".nav-overlay").classList.remove("open")
}

window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu()
})

async function loadSharedComponents() {
    await loadComponent("#header-slot", "../shared/components/header.html")
    await loadComponent("#nav-slot", "../shared/components/nav.html")
    updateCartBadge()
    updateActiveNav()
    initThemeSwitcher()
}

function updateActiveNav() {
    const nav = document.querySelector("#nav-slot .main-nav")
    if (!nav) return
    const path = window.location.pathname
    nav.querySelectorAll("a").forEach((link) => {
        link.classList.remove("active")
        const href = link.getAttribute("href")
        if (!href || href === "#") return
        // Resolve relative href to absolute for comparison
        const resolved = new URL(href, window.location.href).pathname
        if (path === resolved || path === resolved + "index.html" || path + "/" === resolved) {
            link.classList.add("active")
        }
    })
}

function updateCartBadge() {
    const count = typeof Cart !== "undefined" ? Cart.getCount() : 0

    // Header badge
    const badge = document.querySelector(".header__cart-badge")
    if (badge) {
        badge.textContent = count
        badge.hidden = count === 0
    }

    // Order page toolbar badge
    const toolbarBadge = document.querySelector(".order-toolbar__cart .cart-count")
    if (toolbarBadge) {
        toolbarBadge.textContent = count
        toolbarBadge.hidden = count === 0
    }
}

window.addEventListener("cart-updated", updateCartBadge)

/* ── Theme Switcher ── */

function initThemeSwitcher() {
    // Add theme-switcher.css (always active, for dropdown styles)
    const switcherCSS = document.createElement("link")
    switcherCSS.rel = "stylesheet"
    switcherCSS.href = "../shared/themes/theme-switcher.css"
    document.head.appendChild(switcherCSS)

    // Create <link> tags for each theme (disabled by default)
    const themes = {
        "ny-standard": "../shared/themes/ny-standard.css",
        "mork-modus": "../shared/themes/mork-modus.css",
    }

    for (const [name, href] of Object.entries(themes)) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = href
        link.dataset.theme = name
        link.disabled = true
        document.head.appendChild(link)
    }

    // Inject dropdown HTML after .header__user
    const userBtn = document.querySelector(".header__user")
    if (!userBtn) return

    const dropdown = document.createElement("div")
    dropdown.className = "theme-dropdown"
    dropdown.hidden = true
    dropdown.innerHTML = `
        <button class="theme-dropdown__item" data-theme="standard">
            <span class="material-symbols-outlined theme-dropdown__check">check</span>
            Standard
        </button>
        <button class="theme-dropdown__item" data-theme="ny-standard">
            <span class="material-symbols-outlined theme-dropdown__check">check</span>
            Ny standard
        </button>
        <button class="theme-dropdown__item" data-theme="mork-modus">
            <span class="material-symbols-outlined theme-dropdown__check">check</span>
            M\u00f8rk modus
        </button>
    `
    userBtn.parentElement.appendChild(dropdown)

    // Apply saved theme
    const saved = localStorage.getItem("vieri-theme") || "standard"
    applyTheme(saved)

    // Toggle dropdown on user button click
    userBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        if (dropdown.hidden) {
            positionThemeDropdown(dropdown, userBtn)
            dropdown.hidden = false
        } else {
            dropdown.hidden = true
        }
    })

    // Theme selection
    dropdown.querySelectorAll(".theme-dropdown__item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation()
            const theme = btn.dataset.theme
            applyTheme(theme)
            localStorage.setItem("vieri-theme", theme)
            dropdown.hidden = true
        })
    })

    // Close on outside click
    document.addEventListener("click", () => {
        dropdown.hidden = true
    })
    dropdown.addEventListener("click", (e) => e.stopPropagation())
}

function applyTheme(themeName) {
    // Disable all theme links
    document.querySelectorAll("link[data-theme]").forEach((link) => {
        link.disabled = true
    })

    // Enable the selected one (if not "standard")
    if (themeName !== "standard") {
        const link = document.querySelector(
            `link[data-theme="${themeName}"]`
        )
        if (link) link.disabled = false
    }

    // Update checkmarks
    document.querySelectorAll(".theme-dropdown__item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.theme === themeName)
    })

    // Set data attribute on body for potential CSS hooks
    document.body.dataset.theme = themeName
}

function positionThemeDropdown(dropdown, anchor) {
    const rect = anchor.getBoundingClientRect()
    dropdown.style.top = `${rect.bottom + 4}px`
    dropdown.style.right = `${window.innerWidth - rect.right}px`
    dropdown.style.left = "auto"
}
