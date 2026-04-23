export function calculateOJTDays(startDate: string, endDate: string, skipDates: string = "") {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const skip = skipDates.split(",").map(d => d.trim()).filter(d => d.length > 0);

    const days: string[] = [];
    let current = new Date(start);

    while (current <= end) {
        const dayOfWeek = current.getDay();
        const dateStr = current.toISOString().split("T")[0];

        // Skip weekends (0 = Sunday, 6 = Saturday)
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isSkipped = skip.includes(dateStr);

        if (!isWeekend && !isSkipped) {
            days.push(dateStr);
        }

        current.setDate(current.getDate() + 1);
    }

    return days;
}
