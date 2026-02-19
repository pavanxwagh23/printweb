export interface UploadedFile {
    id: string;
    file: File;
    preview?: string;
    pages?: number;
    size: number;
    name: string;
    type: string;
}

export interface PrintConfig {
    copies: number;
    colorMode: 'bw' | 'color';
    pageSelection: 'all' | 'include' | 'exclude';
    selectedPages?: string;
    paperSize: 'A4' | 'Legal' | 'Letter';
    orientation: 'portrait' | 'landscape';
    sides: 'single' | 'double';
    pagesPerSheet: 1 | 2 | 4;
}

export interface PriceBreakdown {
    totalPages: number;
    effectivePages: number;
    sheets: number;
    pricePerPage: number;
    copies: number;
    printCost: number;
    doubleSidedSavings: number;
    basePrice: number;
    colorSurcharge: number;
    total: number;
}

export const PRICING = {
    colorSingle: 6,   // ₹6 per page - color, single side
    colorDouble: 5,   // ₹5 per page - color, double side
    bwSingle: 3,      // ₹3 per page - B&W, single side
    bwDouble: 4,      // ₹4 per page - B&W, double side
};

export const SUPPORTED_FORMATS = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/jpeg': 'JPG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
