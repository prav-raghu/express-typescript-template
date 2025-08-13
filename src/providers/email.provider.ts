import fs from "fs";
import path from "path";

export class EmailProvider {
    public async sendMail(to: string, subject: string, templateName: string, variables: Record<string, string>): Promise<void> {
        const templatePath = path.join(__dirname, "../../mails/templates", `${templateName}.html`);
        let html = fs.readFileSync(templatePath, "utf8");
        for (const [key, value] of Object.entries(variables)) {
            html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
        console.log(`Sending email to ${to}: ${subject}\n${html}`);
    }
}
