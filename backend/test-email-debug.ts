import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const sendTestEmail = async () => {
    console.log("Testing Mailtrap Connection...");

    const token = process.env.MAILTRAP_TOKEN;
    if (!token || token.includes("YOUR_MAILTRAP_TOKEN")) {
        console.error("Error: MAILTRAP_TOKEN is missing or is still a placeholder in .env");
        process.exit(1);
    }
    console.log("Token present: Yes");

    const client = new MailtrapClient({ token });

    const sender = {
        email: "leads@omkaricse.in",
        name: "OIS Debugger (Mailtrap)",
    };

    const recipients = [
        {
            email: "evinelias@gmail.com",
            name: "Evin Gmail"
        },
        {
            email: "evin@b360.in",
            name: "Evin B360"
        }
    ];

    try {
        console.log("Attempting to send email via Mailtrap...");

        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "B360 Debug Email (Via Mailtrap)",
            text: "This is a test email sent using Mailtrap Node SDK.",
            html: "<h3>Mailtrap Test</h3><p>If you see this, the migration is successful.</p>",
            category: "Debug Test",
        });

        console.log("Response received!");
        console.log(`Success: ${response.success}`);

        if (response.message_ids && response.message_ids.length > 0) {
            console.log("Message IDs:", response.message_ids);
        } else {
            console.log("No Message IDs returned (Sandbox mode?)");
        }

    } catch (error: any) {
        console.error("Error sending email:");
        console.error(error);
    }
};

sendTestEmail();
