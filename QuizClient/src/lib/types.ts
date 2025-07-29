export type ApiResponse<T> = {
    total: number;
    items: T[];
    size: number;
    page: number;
    pages: number;
};