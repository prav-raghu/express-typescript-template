export class SmsProvider {
    public async sendSms(to: string, message: string): Promise<void> {
        console.log(`Sending SMS to ${to}: ${message}`);
    }
}
