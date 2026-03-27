const PRODUCTS = [
    { id: 1, name: "Logitech MX Keys S", description: "Trådløst tastatur med bakgrunnsbelysning og smart belysning", price: 1290, category: "Tastatur", supplier: "Dustin", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "DUS-10234", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 2, name: "Keychron K8 Pro", description: "Mekanisk tastatur med hot-swap og RGB-belysning", price: 1490, category: "Tastatur", supplier: "Komplett", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "KOM-20456", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 3, name: "Apple Magic Keyboard", description: "Trådløst tastatur med Touch ID og numerisk tastatur", price: 1990, category: "Tastatur", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "IT-utstyr", artNr: "EPL-30789", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 4, name: "Logitech MX Mechanical", description: "Mekanisk tastatur med trådløs tilkobling og smart belysning", price: 1790, category: "Tastatur", supplier: "Dustin", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "DUS-10235", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 5, name: "Microsoft Ergonomic Keyboard", description: "Ergonomisk tastatur med delt design og polstring", price: 690, category: "Tastatur", supplier: "Elkjøp", manufacturer: "Microsoft", catalogue: "IT-utstyr", artNr: "ELK-40123", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 6, name: "Logitech MX Master 3S", description: "Trådløs mus med 8000 DPI og MagSpeed-hjul", price: 990, category: "Mus", supplier: "Dustin", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "DUS-10567", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: true },
    { id: 7, name: "Apple Magic Mouse", description: "Trådløs mus med Multi-Touch overflate", price: 1090, category: "Mus", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "IT-utstyr", artNr: "EPL-30456", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 8, name: "Logitech Lift", description: "Ergonomisk vertikal mus for komfort hele dagen", price: 790, category: "Mus", supplier: "Komplett", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "KOM-20789", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 9, name: "Razer DeathAdder V3", description: "Ultralettmus med Focus Pro 30K-sensor", price: 890, category: "Mus", supplier: "Komplett", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "KOM-20890", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 10, name: "Microsoft Surface Arc Mouse", description: "Tynn, bøybar reisemus med Bluetooth", price: 690, category: "Mus", supplier: "Elkjøp", manufacturer: "Microsoft", catalogue: "IT-utstyr", artNr: "ELK-40234", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 11, name: "Dell XPS 15", description: "15,6\" bærbar med Intel Core i7, 16GB RAM, 512GB SSD", price: 18990, category: "Bærbar PC", supplier: "Dustin", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "DUS-11001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 12, name: "MacBook Pro 14\"", description: "Apple M3 Pro-chip, 18GB RAM, 512GB SSD, Liquid Retina XDR", price: 24990, category: "Bærbar PC", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "IT-utstyr", artNr: "EPL-31001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: true },
    { id: 13, name: "Lenovo ThinkPad X1 Carbon", description: "14\" ultralett bærbar med Intel Core i7, 16GB RAM", price: 17990, category: "Bærbar PC", supplier: "Dustin", manufacturer: "HP", catalogue: "IT-utstyr", artNr: "DUS-11002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 14, name: "HP EliteBook 840 G10", description: "14\" forretnings-laptop med Intel Core i5, 16GB RAM", price: 14990, category: "Bærbar PC", supplier: "Atea", manufacturer: "HP", catalogue: "IT-utstyr", artNr: "ATE-50123", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 15, name: "ASUS ZenBook 14 OLED", description: "14\" OLED-skjerm, Intel Core i7, 16GB RAM, 512GB SSD", price: 12990, category: "Bærbar PC", supplier: "Komplett", manufacturer: "HP", catalogue: "IT-utstyr", artNr: "KOM-21001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 16, name: "Dell UltraSharp U2723QE", description: "27\" 4K USB-C IPS-skjerm med HDR400", price: 5990, category: "Skjerm", supplier: "Dustin", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "DUS-12001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 17, name: "Samsung Odyssey G7 32\"", description: "32\" buet QHD-skjerm med 240Hz og 1ms responstid", price: 4990, category: "Skjerm", supplier: "Komplett", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "KOM-22001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 18, name: "LG 27UP850N-W", description: "27\" 4K UHD IPS-skjerm med USB-C og HDR400", price: 4490, category: "Skjerm", supplier: "Elkjøp", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "ELK-41001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 19, name: "Apple Studio Display", description: "27\" 5K Retina-skjerm med innebygd kamera og høyttalere", price: 18990, category: "Skjerm", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "IT-utstyr", artNr: "EPL-32001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 20, name: "BenQ PD2706UA", description: "27\" 4K designerskjerm med USB-C og 90W lading", price: 5490, category: "Skjerm", supplier: "Dustin", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "DUS-12002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 21, name: "Sony WH-1000XM5", description: "Trådløst headset med bransjeledende støydemping", price: 3490, category: "Headset", supplier: "Elkjøp", manufacturer: "Sony", catalogue: "IT-utstyr", artNr: "ELK-42001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: true },
    { id: 22, name: "Jabra Evolve2 85", description: "Profesjonelt trådløst headset med ANC og Teams-sertifisering", price: 3990, category: "Headset", supplier: "Dustin", manufacturer: "Jabra", catalogue: "IT-utstyr", artNr: "DUS-13001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 23, name: "Apple AirPods Pro 2", description: "Trådløse ørepropper med aktiv støydemping og H2-chip", price: 2990, category: "Headset", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "IT-utstyr", artNr: "EPL-33001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 24, name: "Poly Voyager Focus 2", description: "Trådløst stereo-headset med ANC for kontor", price: 2490, category: "Headset", supplier: "Atea", manufacturer: "Jabra", catalogue: "IT-utstyr", artNr: "ATE-50234", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 25, name: "Bose QuietComfort Ultra", description: "Premium headset med romlig lyd og tilpassbar ANC", price: 4290, category: "Headset", supplier: "Elkjøp", manufacturer: "Sony", catalogue: "IT-utstyr", artNr: "ELK-42002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 26, name: "Logitech C920s HD Pro", description: "Full HD 1080p webkamera med autofokus og personvernlukker", price: 790, category: "Webkamera", supplier: "Dustin", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "DUS-14001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 27, name: "Logitech Brio 4K", description: "4K Ultra HD webkamera med HDR og Windows Hello", price: 1890, category: "Webkamera", supplier: "Komplett", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "KOM-23001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 28, name: "Jabra PanaCast 20", description: "Intelligent 4K AI-webkamera med personlig bildeoptimalisering", price: 3290, category: "Webkamera", supplier: "Dustin", manufacturer: "Jabra", catalogue: "IT-utstyr", artNr: "DUS-14002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 29, name: "Dell UltraSharp WB7022", description: "4K webkamera med Sony STARVIS-sensor og AI-funksjoner", price: 2490, category: "Webkamera", supplier: "Atea", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "ATE-50345", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 30, name: "CalDigit TS4", description: "Thunderbolt 4-dokkingstasjon med 18 porter og 98W lading", price: 4290, category: "Dokkingstasjon", supplier: "Komplett", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "KOM-24001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 31, name: "Dell WD22TB4", description: "Thunderbolt 4-dokkingstasjon med HDMI, DP og USB-C", price: 2990, category: "Dokkingstasjon", supplier: "Dustin", manufacturer: "Dell", catalogue: "IT-utstyr", artNr: "DUS-15001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 32, name: "Lenovo ThinkPad USB-C Dock Gen 2", description: "USB-C-dokkingstasjon med tre skjermutganger", price: 2490, category: "Dokkingstasjon", supplier: "Atea", manufacturer: "HP", catalogue: "IT-utstyr", artNr: "ATE-50456", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 33, name: "HP Thunderbolt Dock G4", description: "Thunderbolt 4-dokkingstasjon med 120W lading", price: 3290, category: "Dokkingstasjon", supplier: "Dustin", manufacturer: "HP", catalogue: "IT-utstyr", artNr: "DUS-15002", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 34, name: "Samsung T7 Shield 2TB", description: "Ekstern SSD med IP65-beskyttelse og 1050 MB/s hastighet", price: 1790, category: "Lagring", supplier: "Komplett", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "KOM-25001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 35, name: "SanDisk Extreme Pro 1TB", description: "Ekstern NVMe SSD med 2000 MB/s og IP65-beskyttelse", price: 1490, category: "Lagring", supplier: "Elkjøp", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "ELK-43001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 36, name: "Kingston DataTraveler Max 256GB", description: "USB-C minnepinne med opptil 1000 MB/s lesehastighet", price: 390, category: "Lagring", supplier: "Komplett", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "KOM-25002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 37, name: "WD My Passport 4TB", description: "Ekstern harddisk med maskinvarekryptering og USB 3.2", price: 1190, category: "Lagring", supplier: "Dustin", manufacturer: "Samsung", catalogue: "IT-utstyr", artNr: "DUS-16001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 38, name: "Ergotron LX", description: "Premium skjermarm med 11,3 kg kapasitet og full bevegelse", price: 1590, category: "Tilbehør", supplier: "Dustin", manufacturer: "Dell", catalogue: "Kontorutstyr", artNr: "DUS-17001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 39, name: "Twelve South BookArc", description: "Vertikalt MacBook-stativ i aluminium", price: 690, category: "Tilbehør", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "Kontorutstyr", artNr: "EPL-34001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 40, name: "Rain Design mStand", description: "Laptop-stativ i aluminium med kabelhåndtering", price: 490, category: "Tilbehør", supplier: "Komplett", manufacturer: "Apple", catalogue: "Kontorutstyr", artNr: "KOM-26001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 41, name: "Belkin BoostCharge Pro 3-i-1", description: "Trådløs ladestasjon for iPhone, Apple Watch og AirPods", price: 1490, category: "Tilbehør", supplier: "Elkjøp", manufacturer: "Anker", catalogue: "Kontorutstyr", artNr: "ELK-44001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: true },
    { id: 42, name: "Anker PowerConf S330", description: "USB-konferansehøyttaler med intelligent stemmeforbedring", price: 690, category: "Tilbehør", supplier: "Komplett", manufacturer: "Anker", catalogue: "Kontorutstyr", artNr: "KOM-26002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 43, name: "Logitech Spotlight", description: "Trådløs presentasjonsfjernkontroll med digital markør", price: 990, category: "Tilbehør", supplier: "Dustin", manufacturer: "Logitech", catalogue: "Kontorutstyr", artNr: "DUS-17002", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 44, name: "Elgato Key Light", description: "Profesjonell LED-panellampe med 2900 lumen for videosamtaler", price: 1790, category: "Tilbehør", supplier: "Komplett", manufacturer: "Logitech", catalogue: "Kontorutstyr", artNr: "KOM-26003", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 45, name: "APC Back-UPS 1600VA", description: "UPS med 8 uttak, overspenningsvern og USB-lading", price: 2490, category: "Strøm", supplier: "Dustin", manufacturer: "Anker", catalogue: "Strøm og kabler", artNr: "DUS-18001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 46, name: "Anker PowerPort III 65W", description: "Kompakt USB-C-lader med GaN-teknologi", price: 490, category: "Strøm", supplier: "Elkjøp", manufacturer: "Anker", catalogue: "Strøm og kabler", artNr: "ELK-45001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 47, name: "Anker 737 PowerCore 24K", description: "Bærbar lader med 24 000 mAh og 140W utgang", price: 1290, category: "Strøm", supplier: "Komplett", manufacturer: "Anker", catalogue: "Strøm og kabler", artNr: "KOM-27001", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: false },
    { id: 48, name: "Autonomous SmartDesk Pro", description: "Elektrisk hev-senk skrivebord med programmerte høyder", price: 8990, category: "Møbler", supplier: "Kontorbutikken", manufacturer: "Dell", catalogue: "Møbler og interiør", artNr: "KON-60001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 49, name: "Herman Miller Aeron", description: "Ergonomisk kontorstol med PostureFit-støtte og mesh", price: 15990, category: "Møbler", supplier: "Kontorbutikken", manufacturer: "HP", catalogue: "Møbler og interiør", artNr: "KON-60002", unit: "Stykk", vatRate: 25, isFavorite: true, recentlyOrdered: true },
    { id: 50, name: "Secretlab Titan Evo", description: "Premium kontorstol med 4-veis justerbare armlener", price: 5490, category: "Møbler", supplier: "Komplett", manufacturer: "Logitech", catalogue: "Møbler og interiør", artNr: "KOM-28001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 51, name: "Blomstrete musmatte", description: "Ergonomisk musmatte med blomstermønster og håndleddsstøtte", price: 249, category: "Tilbehør", supplier: "Dustin", manufacturer: "Logitech", catalogue: "Kontorutstyr", artNr: "DUS-19001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 52, name: "Blomster-etui til MacBook 14\"", description: "Beskyttende laptopveske med blomsterprint i neopren", price: 399, category: "Tilbehør", supplier: "Eplehuset", manufacturer: "Apple", catalogue: "Kontorutstyr", artNr: "EPL-35001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 53, name: "Blomstermønstret notisbok A5", description: "Premium notatblokk med blomsterdesign og prikket papir, 200 sider", price: 149, category: "Tilbehør", supplier: "Kontorbutikken", manufacturer: "Dell", catalogue: "Kontorutstyr", artNr: "KON-61001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 54, name: "Blomstret tastaturcover", description: "Silikoncover med blomstermotiv for standard tastatur", price: 199, category: "Tastatur", supplier: "Komplett", manufacturer: "Logitech", catalogue: "IT-utstyr", artNr: "KOM-29001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
    { id: 55, name: "Blomster-webkamerabakgrunn", description: "Sammenleggbar bakgrunnsskjerm med blomstereng-motiv for videosamtaler", price: 590, category: "Tilbehør", supplier: "Elkjøp", manufacturer: "Sony", catalogue: "Kontorutstyr", artNr: "ELK-46001", unit: "Stykk", vatRate: 25, isFavorite: false, recentlyOrdered: false },
]

const PUNCHOUT_ITEMS = [
    {
        id: "punchout-blomsterbutikken",
        name: "Blomsterbutikken",
        supplier: "Blomsterbutikken",
        description: "Bestill blomster, planter og dekorasjoner til kontoret",
        icon: "local_florist",
        url: "../punchout/blomsterbutikken/index.html",
        keywords: ["blomst", "blomster", "plante", "planter", "dekorasjon", "bukett", "rose", "tulipan", "kontor", "grønt", "interiør", "gave", "flower"],
        isPunchout: true,
    },
    {
        id: "punchout-kontorrekvisita-no",
        name: "Kontorrekvisita.no",
        supplier: "Kontorrekvisita.no",
        description: "Kontorrekvisita, penner, papir, arkivering og skrivebordsutstyr",
        icon: "edit_note",
        url: "#",
        keywords: ["kontor", "penn", "penner", "papir", "blekk", "post-it", "notat", "arkiv", "mappe", "mapper", "rekvisita", "skrivebordsartikler", "tape", "lim", "saks", "stiftemaskin", "tastatur", "keyboard"],
        isPunchout: true,
    },
    {
        id: "punchout-arbeidsklaer24",
        name: "Arbeidsklær24",
        supplier: "Arbeidsklær24",
        description: "Arbeidsklær, verneutstyr og sikkerhetsutstyr for alle bransjer",
        icon: "checkroom",
        url: "#",
        keywords: ["arbeidsklær", "verneutstyr", "hjelm", "vernesko", "sko", "jakke", "bukse", "hansker", "vernebriller", "refleks", "sikkerhet", "arbeidstøy", "overall"],
        isPunchout: true,
    },
    {
        id: "punchout-renholdseksperten",
        name: "Renholdseksperten",
        supplier: "Renholdseksperten",
        description: "Rengjøringsmidler, hygieneprodukter og renholdsartikler",
        icon: "cleaning_services",
        url: "#",
        keywords: ["rengjøring", "renhold", "såpe", "vaskemiddel", "mopp", "bøtte", "tørkepapir", "toalettpapir", "desinfeksjon", "hygiene", "avfallsposer", "søppelposer", "renholdsartikler"],
        isPunchout: true,
    },
]

// Combined lookup: find either a regular product or a punchout item
function findProductOrPunchout(id) {
    if (typeof id === "string" && id.startsWith("punchout-")) {
        return PUNCHOUT_ITEMS.find((p) => p.id === id) || null
    }
    return PRODUCTS.find((p) => p.id === id) || null
}

const CATEGORY_ICONS = {
    Tastatur: "keyboard",
    Mus: "mouse",
    "Bærbar PC": "laptop_mac",
    Skjerm: "monitor",
    Headset: "headphones",
    Webkamera: "videocam",
    Dokkingstasjon: "dock_to_bottom",
    Lagring: "hard_drive",
    Tilbehør: "devices",
    Strøm: "bolt",
    Møbler: "chair",
}

function formatPrice(price) {
    return "NOK " + price.toLocaleString("nb-NO") + ",00"
}

function formatPriceShort(price) {
    return price.toLocaleString("nb-NO") + ",-"
}
