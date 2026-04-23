import { z } from "zod";

export const uploadSchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    skipDates: z.string().optional(),
    ojtTiming: z.string().min(1, "OJT timing is required"),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required"),
    name: z.string().min(1, "Name is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    programName: z.string().min(1, "Program name is required"),
    semester: z.string().min(1, "Semester is required"),
    location: z.string().min(1, "Location is required"),
    industryPartner: z.string().min(1, "Industry partner name is required"),
    workDesc: z.string().min(10, "Work description must be at least 10 characters"),
    apiKey: z.string().min(1, "API Key is required"),
    customRange: z.string().optional(),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
