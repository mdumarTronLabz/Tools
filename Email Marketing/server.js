import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs/promises"; // Use promises for non-blocking I/O
import path from "path";

const app = express();
app.use(express.json());

dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });

const PORT = process.env.PORT || 3000;

// Reusable transporter with POOLING enabled
const transporter = nodemailer.createTransport({
  pool: true, // Crucial for bulk sending
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

// Better logging: Append to a file instead of rewriting a whole JSON array
const logToFile = async (data) => {
  const filePath = path.resolve("sent-log.txt");
  const logEntry = `${new Date().toISOString()} - ${data.email} - ${data.status}\n`;
  await fs.appendFile(filePath, logEntry);
};

app.get("/", (req, res) => {
  res.send("Email Marketing Server is running.");
});

app.post("/email-marketing", async (req, res) => {
  const { recipients } = req.body;

  if (!recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ message: "Recipients array required" });
  }

  // Send response immediately or use a tracking ID
  // because bulk sending can take longer than the Postman timeout
  res.json({ message: "Email process started in background..." });

  let successCount = 0;
  let failCount = 0;

  // USE A SEQUENTIAL LOOP
  for (const recipient of recipients) {
    console.log(`Sending email to: ${recipient.email}`);
    const outreachMailSubject = `${recipient.firstName}, let's transform your online presence!`;
    const outreachMail = await fs.readFile(
      "./email_html/outreach_mail.html",
      "utf8",
    );

    // Dark Glass Welcome mail
    const welcomeMailSubject = `Tron Labz Welcomes you to the family!🎉`;
    const welcomeMail = await fs.readFile(
      "./email_html/welcome_mail_dark_glass_theme.html",
      "utf8",
    );

    // Premium Dark Theme
    const welcomeMailTwo = await fs.readFile(
      "./email_html/welcome_mail_dark_premium_theme.html",
      "utf8",
    );

    // Neo Brutalism Theme
    const welcomeMailThree = await fs.readFile(
      "./email_html/welcome_mail_neo_brutalism_theme.html",
      "utf8",
    );

    /* 
    
    // Thank You Mail Details
    
    */

    const emailData = {
      clientName: "Katrina",
      companyName: "Bloom Beauty",
      projectName: "Website Redesign & Development",
      launchDate: "July 2026",
      futureScope: [
        {
          title: "E-commerce Integration",
          desc: "Add a full online store with inventory sync and secure checkout.",
        },
        {
          title: "SEO & Content Strategy",
          desc: "Ongoing optimisation to grow organic search traffic month over month.",
        },

        {
          title: "Performance Monitoring",
          desc: "Monthly speed and uptime reports with proactive fixes.",
        },
        {
          title: "Seasonal Campaign Pages",
          desc: "Custom landing pages for product launches and promotions.",
        },
      ],
    };

    const futureScopeHTML = emailData.futureScope
      .map(
        (item, index) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f1efe9;">
  <tr>
    <td width="38" valign="top" style="padding-right:18px;">
      <span
        style="display:block;font-family:'Cormorant Garamond',Georgia,serif;
        font-weight:500;font-size:24px;color:#e3d8be;">
        ${String(index + 1).padStart(2, "0")}
      </span>
    </td>

    <td valign="top" style="padding-top:4px;">
      <p style="margin:0 0 5px;
        font-family:'Inter',Arial,sans-serif;
        font-size:14.5px;
        font-weight:600;
        color:#1a1812;">
        ${item.title}
      </p>

      <p style="margin:0;
        font-family:'Inter',Arial,sans-serif;
        font-size:13px;
        line-height:1.65;
        color:#7a766c;">
        ${item.desc}
      </p>
    </td>
  </tr>
</table>
`,
      )
      .join("");

    const thankYouSubject = "A heartfelt thank you & what's next";
    let thankYouMail = await fs.readFile(
      "./email_html/thank_you_mail.html",
      "utf8",
    );

    thankYouMail = thankYouMail
      .replace(/{{CLIENT_NAME}}/g, emailData.clientName)
      .replace(/{{COMPANY_NAME}}/g, emailData.companyName)
      .replace(/{{PROJECT_NAME}}/g, emailData.projectName)
      .replace(/{{LAUNCH_DATE}}/g, emailData.launchDate)
      .replace("{{FUTURE_SCOPE}}", futureScopeHTML);

    

    try {
      await transporter.sendMail({
        from: `"TRON LABZ" <${process.env.SMTP_EMAIL}>`,
        to: recipient.email,
        subject: thankYouSubject,
        html: thankYouMail,
      });

      successCount++;
      console.log(`✅ Sent to: ${recipient.email}`);
      await logToFile({ email: recipient.email, status: "SUCCESS" });

      // Small delay to prevent SMTP throttling (500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failCount++;
      console.error(`❌ Failed: ${recipient.email} - ${error.message}`);
      await logToFile({
        email: recipient.email,
        status: `FAILED: ${error.message}`,
      });
    }
  }

  console.log(`Finished! Success: ${successCount}, Fail: ${failCount}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
