import { PrintConfig, PriceBreakdown, PRICING, UploadedFile } from '@/types';

export function calculatePrice(
    files: UploadedFile[],
    config: PrintConfig
): PriceBreakdown {
    const totalPages = files.reduce((sum, file) => sum + (file.pages || 1), 0);
    let effectivePages = 0;

    // Calculate effective pages after page selection
    files.forEach((file) => {
        let filePages = file.pages || 1;

        if (config.pageSelection === 'include' && config.selectedPages) {
            filePages = parseSelectedPages(config.selectedPages, filePages);
        } else if (config.pageSelection === 'exclude' && config.selectedPages) {
            const excludedCount = parseSelectedPages(config.selectedPages, filePages);
            filePages = Math.max(0, filePages - excludedCount);
        }

        effectivePages += filePages;
    });

    // Per-page rate based on color mode + sides combination
    const pricePerPage =
        config.colorMode === 'color'
            ? (config.sides === 'double' ? PRICING.colorDouble : PRICING.colorSingle)
            : (config.sides === 'double' ? PRICING.bwDouble : PRICING.bwSingle);

    // Total cost = effective pages × rate × copies
    const basePrice = effectivePages * pricePerPage * config.copies;

    // Sheets needed (for display purposes)
    const sheets = config.sides === 'double'
        ? Math.ceil(effectivePages / 2)
        : effectivePages;

    const colorSurcharge = 0;
    const doubleSidedSavings = 0;
    const printCost = basePrice;
    const total = basePrice;

    return {
        totalPages,
        effectivePages,
        sheets,
        pricePerPage,
        copies: config.copies,
        printCost,
        doubleSidedSavings,
        basePrice,
        colorSurcharge,
        total,
    };
}

function parseSelectedPages(selectedPages: string, maxPages: number): number {
    let count = 0;
    const parts = selectedPages.split(',');

    parts.forEach((part) => {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
            if (start && end && start <= maxPages) {
                count += Math.min(end, maxPages) - start + 1;
            }
        } else {
            const page = parseInt(part);
            if (page && page <= maxPages) {
                count++;
            }
        }
    });

    return count;
}

export function estimatePrintTime(totalPages: number, config: PrintConfig): string {
    // Rough estimate: 4 pages per minute for single-sided, 2.5 for double-sided
    const pagesPerMinute = config.sides === 'single' ? 4 : 2.5;
    const minutes = Math.ceil((totalPages * config.copies) / pagesPerMinute);

    if (minutes < 60) {
        return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
        ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`
        : `${hours} hour${hours > 1 ? 's' : ''}`;
}
