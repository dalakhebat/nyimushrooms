/**
 * Format berat dengan auto-convert ke Ton jika >= 1000 kg
 * @param {number} kg - Berat dalam kilogram
 * @param {boolean} showUnit - Tampilkan satuan (default: true)
 * @returns {string} Formatted string
 */
export function formatBerat(kg, showUnit = true) {
    const num = parseFloat(kg) || 0;

    if (num >= 1000) {
        // Convert ke Ton, tapi tetap tampilkan kg asli
        const ton = num / 1000;
        const tonFormatted = ton % 1 === 0 ? ton.toString() : ton.toFixed(2).replace(/\.?0+$/, '');
        const kgFormatted = num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
        return showUnit ? `${tonFormatted} Ton (${kgFormatted} kg)` : tonFormatted;
    } else {
        // Tetap dalam kg
        const formatted = num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
        return showUnit ? formatted + ' kg' : formatted;
    }
}

/**
 * Format currency ke Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} Formatted string
 */
export function formatRupiah(amount) {
    const num = parseFloat(amount) || 0;
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format number dengan separator ribuan
 * @param {number} num - Angka
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(parseFloat(num) || 0);
}
