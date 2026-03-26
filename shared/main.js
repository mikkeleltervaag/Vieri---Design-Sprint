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
