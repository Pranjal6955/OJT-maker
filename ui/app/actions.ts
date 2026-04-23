"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateDailyLogs(workDesc: string, apiKey: string, numDays: number) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a professional OJT training supervisor.

Divide the following work into EXACTLY ${numDays} day-wise entries.

RULES:
- No HR / meetings / company talk
- Only technical/project work
- Each day must be unique
- Maintain progression: understanding → planning → implementation → debugging → improvement
- Each day: 2–4 meaningful sentences
- No generic phrases
- No repetition
- No empty or incomplete entries
- Use college/student-level tools (avoid professional tools like Jira, Azure, enterprise software)

OUTPUT JSON ONLY:
[
  { "day": 1, "work": "..." }
]

WORK:
${workDesc}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse JSON from the response
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.map((item: any) => item.work);
        }

        // Fallback if not JSON
        return text.split("\n").filter(line => line.trim().length > 0).slice(0, numDays);
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate logs");
    }
}

export async function generateFullJournalEntries(apiKey: string, dailyLogs: { date: string, work: string }[]) {
    "use server";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const combinedInput = dailyLogs.map((d, i) => `Day ${i + 1} (${d.date}): ${d.work}`).join("\n");

    const prompt = `
Generate professional OJT daily journal entries for college students.

RULES:
- Each day must be unique
- No repetition
- No HR/company content
- Keep concise and realistic
- Avoid professional/enterprise tools (no Jira, Azure, Salesforce, etc.)
- Use college-friendly tools: Python, JavaScript, Git, SQL, VS Code, Linux, React, etc.

For EACH day return:
- my_space: Minimum 4 lines of detailed personal reflection
- tasks_carried_out: List items separated by NEWLINE (NOT array)
- key_learnings: List items separated by NEWLINE (NOT array)
- tools_used: comma-separated list
- special_achievements: 1-2 lines (NEVER "N/A")

OUTPUT JSON (use plain text with newlines for multi-line fields):
[
  {
    "day": 1,
    "my_space": "reflection text",
    "tasks_carried_out": "Task 1\\nTask 2\\nTask 3",
    "key_learnings": "Learning 1\\nLearning 2",
    "tools_used": "tool1, tool2, tool3",
    "special_achievements": "achievement text"
  }
]

INPUT:
${combinedInput}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid response format from AI");
    } catch (error) {
        console.error("Gemini Details Error:", error);
        throw new Error("Failed to generate detailed entries");
    }
}
