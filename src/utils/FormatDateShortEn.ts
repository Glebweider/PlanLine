function formatDateShortEn(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthShort = date.toLocaleString('en', { month: 'short' });
    const yearShort = date.getFullYear().toString().slice(2);
    return `${day} ${monthShort} ${yearShort}`;
}

export default formatDateShortEn;