/** Indexing is allowed only when NEXT_PUBLIC_ENV=production. */
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
