export function formatDateShortRu(date: Date): string {
    const months = [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];

    return `${day} ${month}`;
}
