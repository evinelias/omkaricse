import { MailtrapClient } from "mailtrap";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getMailtrapClient = () => {
    const token = process.env.MAILTRAP_TOKEN;
    if (!token) {
        throw new Error("Mailtrap Token missing in environment.");
    }
    return new MailtrapClient({ token });
};

export const sendLeadNotification = async (lead: any) => {
    try {
        const config = await prisma.emailConfig.findUnique({ where: { id: 1 } });
        if (!config || !config.isEnabled) {
            console.log("Email notifications disabled or config missing.");
            return; // Emails disabled
        }

        const client = getMailtrapClient();

        // Parse recipients (comma separated)
        const recipientList = config.receiverEmail
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0)
            .map(email => ({ email: email })); // Mailtrap requires { email: "..." }

        if (recipientList.length === 0) {
            console.log("No valid recipients configured.");
            return;
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Lead Received!</h1>
                </div>
                <div style="padding: 20px;">
                    <p style="color: #333; font-size: 16px;">Hello,</p>
                    <p style="color: #555;">You have received a new inquiry via the website.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Parent Name</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Student Name</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.studentName || 'N/A'}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Email</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.phone}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Grade</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.grade || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Inquiry Type</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.inquiryType || 'General'}</td>
                        </tr>
                         <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">City</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.city || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Source</td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${lead.source}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; font-weight: bold;">Message</td>
                            <td style="padding: 12px;">${lead.message || 'No message provided.'}</td>
                        </tr>
                    </table>

                     <div style="margin-top: 30px; text-align: center;">
                        <a href="http://omkaricse.in/admin" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 10px; text-align: center; color: #888; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Omkar International School
                </div>
            </div>
        `;

        const sender = {
            email: "leads@omkaricse.in",
            name: "OIS Website Bot",
        };

        const response = await client.send({
            from: sender,
            to: recipientList,
            subject: `New Lead: ${lead.name}`,
            html: htmlContent,
            category: "New Lead Notification",
        });

        console.log(`Email sent. Success: ${response.success}`);

        // Mailtrap returns { success: true, message_ids: string[] }
        if (response.success && response.message_ids.length > 0) {
            // We just log success for each recipient (or map IDs if we knew which ID mapped to which email, but Mailtrap usually gives a list)
            // For simplicity, we log success for all recipients with the first ID or joined IDs
            const ids = response.message_ids.join(', ');

            for (const recipient of recipientList) {
                await prisma.emailLog.create({
                    data: {
                        recipient: recipient.email,
                        subject: `New Lead: ${lead.name} (IDs: ${ids})`,
                        status: 'SUCCESS'
                    }
                });
            }
        }

    } catch (error: any) {
        console.error("Failed to send email (Mailtrap):", error);

        // Log Failure
        const config = await prisma.emailConfig.findUnique({ where: { id: 1 } });
        if (config) {
            await prisma.emailLog.create({
                data: {
                    recipient: config.receiverEmail, // Log raw string
                    subject: `New Lead: ${lead.name}`,
                    status: 'FAILED',
                    error: error.message || 'Unknown Error'
                }
            });
        }
    }
};
