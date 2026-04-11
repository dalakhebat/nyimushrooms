/**
 * Icon component using Flaticon Uicons (Regular Rounded + Solid Rounded).
 * Icons chosen to match mushroom farm business context.
 */

const iconMap = {
    // === Layout & Navigation ===
    dashboard: 'apps',
    menu: 'menu-burger',
    close: 'cross',
    expand_more: 'angle-down',
    chevron_left: 'angle-left',
    chevron_right: 'angle-right',
    search: 'search',
    settings: 'settings',
    logout: 'sign-out-alt',
    login: 'sign-in-alt',
    person: 'circle-user',
    account_circle: 'circle-user',
    external_link: 'arrow-up-right-from-square',
    more_vert: 'menu-dots-vertical',

    // === Notifikasi ===
    notifications: 'bell',
    notifications_active: 'bell-ring',
    notifications_none: 'bell',
    notifications_off: 'bell-slash',

    // === PRODUKSI & BUDIDAYA (Mushroom Farm context) ===
    // Kumbung = rumah jamur → house/greenhouse
    house: 'home',
    // Baglog = media tanam, kantong tepung → sack/bag
    layers: 'bag-seedling',
    // Produksi Baglog = proses lab → flask/test tube
    science: 'flask',
    // Jamur = mushroom
    mushroom: 'mushroom',
    // Panen = hasil panen → basket
    eco: 'basket',
    scale: 'balance-scale-right',
    // Bahan Baku = bahan mentah → wheat/grain sack
    archive: 'jar-wheat',
    // Monitoring = suhu & kelembapan
    thermostat: 'thermometer-half',
    water_drop: 'raindrops',
    light_mode: 'sun',
    // Stok/Inventory
    inventory_2: 'box',
    potted_plant: 'hand-holding-seeding',
    // Biotech/Microscope (logo)
    biotech: 'flask',

    // === SALES & CUSTOMER ===
    shopping_cart: 'shopping-cart',
    storefront: 'shop',
    groups: 'users',

    // === SUPPLIER & PEMBELIAN ===
    domain: 'building',
    truck: 'truck-container',

    // === KEUANGAN (Money context) ===
    // Kas = uang kas → money/cash
    account_balance: 'coin',
    // Wallet
    account_balance_wallet: 'wallet',
    // Pembayaran → uang kertas
    payments: 'money-bill-wave',
    credit_card: 'credit-card',
    // Income → uang naik
    trending_up: 'chart-line-up',
    // Outcome → uang turun
    trending_down: 'cheap-bill',
    // Savings
    savings: 'piggy-bank',
    dollar: 'badge-dollar',
    attach_money: 'badge-dollar',
    // Kasbon
    hand_coins: 'hand-holding-usd',

    // === SDM & HR ===
    // Karyawan
    employee: 'employee-alt',
    user: 'user',
    // Absensi → kalender check
    schedule: 'clock',
    event_available: 'calendar-check',
    date_range: 'calendar-days',
    calendar_today: 'calendar-day',
    event: 'calendar-plus',
    // QR Absensi
    qr_code_scanner: 'qrcode',
    qr_code: 'qrcode',
    // Penggajian → uang + document
    receipt_long: 'file-invoice-dollar',
    // KPI
    leaderboard: 'chart-histogram',

    // === LAPORAN & CHART ===
    analytics: 'chart-pie',
    show_chart: 'chart-mixed',
    target: 'bullseye-arrow',
    description: 'document',
    receipt: 'receipt',

    // === TOOLS & CONFIG ===
    tune: 'settings-sliders',
    diamond: 'diamond',
    calculate: 'calculator',
    phone: 'phone-call',
    mail: 'envelope',
    location_on: 'marker',
    timer: 'stopwatch',
    summarize: 'clipboard-list',
    checklist: 'clipboard-list-check',
    assignment: 'clipboard-list',

    // === ACTIONS ===
    remove_circle: 'minus-circle',
    add_circle: 'add',
    add: 'add',
    arrow_back: 'arrow-left',
    arrow_forward: 'arrow-right',
    keyboard_double_arrow_left: 'angle-double-left',
    keyboard_double_arrow_right: 'angle-double-right',
    open_in_full: 'expand',
    close_fullscreen: 'compress',
    download: 'download',
    upload: 'upload',
    refresh: 'refresh',
    restart_alt: 'rotate-right',
    filter_list: 'filter',
    sort: 'sort',
    print: 'print',
    link: 'link',
    content_copy: 'copy',
    save: 'disk',
    send: 'paper-plane',
    edit: 'pencil',
    edit_note: 'edit',
    delete: 'trash',
    visibility: 'eye',
    history: 'time-past',
    list: 'list',
    photo_library: 'picture',
    photo_camera: 'camera',
    fingerprint: 'fingerprint',

    // === STATUS & ALERTS ===
    info: 'info',
    warning: 'triangle-warning',
    error: 'exclamation',
    check_circle: 'check-circle',
    cancel: 'cross-circle',
    done_all: 'check-double',
    check: 'check',
    verified: 'badge-check',

    // === FILES ===
    insert_drive_file: 'document',
    file_check: 'assept-document',
    file_plus: 'add-document',
    article: 'document',
    note: 'note',

    // === MISC ===
    activity: 'pulse',
    gauge: 'dashboard',
    zap: 'bolt',
    award: 'trophy',
    medal: 'medal',
    star: 'star',
    heart: 'heart',
    bookmark: 'bookmark',
    share: 'share',
    scan: 'barcode-scan',
    dot: 'rec',
    boxes: 'boxes',
    warehouse: 'warehouse-alt',
};

// Size mapping from text classes to font-size
const sizeMap = {
    'text-xs': '0.75rem',
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
    'text-xl': '1.25rem',
    'text-2xl': '1.5rem',
    'text-3xl': '1.875rem',
    'text-4xl': '2.25rem',
    'text-5xl': '3rem',
};

export default function MIcon({ name, fill, className = '' }) {
    const uiconName = iconMap[name] || name;
    const prefix = fill ? 'fi-sr' : 'fi-rr';

    // Extract size from className
    let fontSize = null;
    for (const [cls, size] of Object.entries(sizeMap)) {
        if (className.includes(cls)) {
            fontSize = size;
            break;
        }
    }

    // Handle inline style sizes like !text-[200px]
    const inlineSizeMatch = className.match(/!?text-\[(\d+)px\]/);
    if (inlineSizeMatch) {
        fontSize = `${inlineSizeMatch[1]}px`;
    }

    // Clean className: remove text-size classes
    const cleanClass = className
        .replace(/!?text-\[\d+px\]/g, '')
        .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return (
        <i
            className={`${prefix}-${uiconName} ${cleanClass}`}
            style={fontSize ? { fontSize } : undefined}
        />
    );
}
