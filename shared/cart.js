const Cart = (() => {
    const STORAGE_KEY = "vieri-cart"
    const PUNCHOUT_STORAGE_KEY = "vieri-punchout-cart"

    function read() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
        } catch {
            return []
        }
    }

    function write(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        window.dispatchEvent(new CustomEvent("cart-updated"))
    }

    function readPunchout() {
        try {
            return JSON.parse(localStorage.getItem(PUNCHOUT_STORAGE_KEY)) || []
        } catch {
            return []
        }
    }

    function writePunchout(items) {
        localStorage.setItem(PUNCHOUT_STORAGE_KEY, JSON.stringify(items))
        window.dispatchEvent(new CustomEvent("cart-updated"))
    }

    return {
        getItems() {
            return read()
        },

        addItem(productId, quantity = 1) {
            const items = read()
            const existing = items.find((i) => i.productId === productId)
            if (existing) {
                existing.quantity += quantity
            } else {
                items.push({ productId, quantity })
            }
            write(items)
        },

        updateQuantity(productId, quantity) {
            const items = read()
            const existing = items.find((i) => i.productId === productId)
            if (existing) {
                existing.quantity = Math.max(1, quantity)
                write(items)
            }
        },

        removeItem(productId) {
            const items = read().filter((i) => i.productId !== productId)
            write(items)
        },

        clear() {
            write([])
            writePunchout([])
        },

        getCount() {
            const regularTotal = read().reduce((sum, i) => sum + (i.quantity || 1), 0)
            const punchoutTotal = readPunchout().reduce((sum, i) => sum + (i.quantity || 1), 0)
            return regularTotal + punchoutTotal
        },

        getItemQuantity(productId) {
            const item = read().find((i) => i.productId === productId)
            return item ? item.quantity : 0
        },

        // Punchout cart methods
        getPunchoutItems() {
            return readPunchout()
        },

        addPunchoutItem(item) {
            // item: { id, name, price, quantity, supplier, icon }
            const items = readPunchout()
            const existing = items.find((i) => i.id === item.id)
            if (existing) {
                existing.quantity += item.quantity
            } else {
                items.push(item)
            }
            writePunchout(items)
        },

        updatePunchoutQuantity(id, quantity) {
            const items = readPunchout()
            const existing = items.find((i) => i.id === id)
            if (existing) {
                existing.quantity = Math.max(1, quantity)
                writePunchout(items)
            }
        },

        removePunchoutItem(id) {
            const items = readPunchout().filter((i) => i.id !== id)
            writePunchout(items)
        },

        getPunchoutCount() {
            return readPunchout().length
        },

        clearPunchout() {
            writePunchout([])
        },
    }
})()
