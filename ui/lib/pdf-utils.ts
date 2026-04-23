import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const FIELD_COORDS = {
    "date": { x: 121, y: 748, maxWidth: 150, fontSize: 10 },
    "ojt_timing_start": { x: 384, y: 748, maxWidth: 80, fontSize: 10 },
    "ojt_timing_end": { x: 480, y: 748, maxWidth: 80, fontSize: 10 },
    "department": { x: 150, y: 718, maxWidth: 150, fontSize: 10 },
    "designation": { x: 404, y: 718, maxWidth: 150, fontSize: 10 },
    "my_space": { x: 50, y: 650, maxWidth: 490, fontSize: 9, maxLines: 4 },
    "tasks_carried_out": { x: 50, y: 460, maxWidth: 490, fontSize: 9, maxLines: 6 },
    "key_learnings": { x: 50, y: 300, maxWidth: 490, fontSize: 9, maxLines: 5 },
    "tools_used": { x: 53, y: 170, maxWidth: 280, fontSize: 9, maxLines: 4 },
    "special_achievements": { x: 320, y: 170, maxWidth: 240, fontSize: 9, maxLines: 3 },
    "name": { x: 163, y: 285, maxWidth: 300, fontSize: 11 },
    "registration_number": { x: 163, y: 255, maxWidth: 300, fontSize: 11 },
    "start_date": { x: 383, y: 255, maxWidth: 300, fontSize: 11 },
    "program_name": { x: 163, y: 225, maxWidth: 300, fontSize: 11 },
    "semester": { x: 135, y: 193, maxWidth: 300, fontSize: 11 },
    "location": { x: 273, y: 193, maxWidth: 300, fontSize: 11 },
    "industry_partner_name": { x: 193, y: 163.5, maxWidth: 300, fontSize: 11 },
};

function parseOjtTiming(timingStr: string): [string, string] {
    if (!timingStr) return ["", ""];
    const parts = timingStr.split(/[–\-]|to/i);
    if (parts.length >= 2) {
        return [parts[0].trim(), parts[1].trim()];
    }
    return [timingStr.trim(), ""];
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

export async function fillPdfTemplate(
    pdfBuffer: ArrayBuffer,
    pagesData: any[],
    userDetails: any,
    journalStartPage: number = 8
) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const journalStartIdx = Math.max(0, journalStartPage - 1);
    const [ojtTimingStart, ojtTimingEnd] = parseOjtTiming(userDetails.ojtTiming);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // Scale factor if not A4 (hardcoded coords are based on A4 595x842)
        const scaleX = width / 595.27;
        const scaleY = height / 841.89;

        const data: any = {};

        // Fill user details on page 3 (index 2)
        if (i === 2) {
            data.name = userDetails.name;
            data.registration_number = userDetails.registrationNumber;
            data.start_date = userDetails.startDate;
            data.program_name = userDetails.programName;
            data.semester = userDetails.semester;
            data.location = userDetails.location;
            data.industry_partner_name = userDetails.industryPartner;
        }

        // Fill journal data starting from journalStartIdx
        if (i >= journalStartIdx) {
            const journalIdx = i - journalStartIdx;
            if (journalIdx < pagesData.length) {
                const dayData = pagesData[journalIdx];
                data.date = dayData.date;
                data.ojt_timing_start = ojtTimingStart;
                data.ojt_timing_end = ojtTimingEnd;
                data.department = userDetails.department;
                data.designation = userDetails.designation;
                data.my_space = dayData.my_space;
                data.tasks_carried_out = dayData.tasks_carried_out;
                data.key_learnings = dayData.key_learnings;
                data.tools_used = dayData.tools_used;
                data.special_achievements = dayData.special_achievements;
            }
        }

        // Draw fields
        for (const [key, text] of Object.entries(data)) {
            if (!text || !FIELD_COORDS[key as keyof typeof FIELD_COORDS]) continue;

            const coords = FIELD_COORDS[key as keyof typeof FIELD_COORDS];
            const fontSize = coords.fontSize;
            const x = coords.x * scaleX;
            const y = coords.y * scaleY;
            const maxWidth = coords.maxWidth * scaleX;
            const maxLines = (coords as any).maxLines || 1;

            const lines = wrapText(String(text), font, fontSize, maxWidth).slice(0, maxLines);

            for (let j = 0; j < lines.length; j++) {
                page.drawText(lines[j], {
                    x,
                    y: y - j * (fontSize * 1.2),
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            }
        }
    }

    return await pdfDoc.save();
}
