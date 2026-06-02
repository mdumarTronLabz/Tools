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
    const outreachMail = `
    
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.08);padding:40px;">
        
        <!-- Header -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <img src="https://tronlabz.com/assets/company_symbol.png" width="60" alt="Tron Labz" style="border-radius:10px;">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="color:#333333;font-size:16px;line-height:1.7;">
            <p>Hi there,</p>

            <p>
              I was reviewing your dental clinic and noticed that your website appears slow and outdated.
            </p>

            <p>
              In many cases, the challenge is the same: potential patients can’t clearly see why they should contact you.
            </p>

            <p>
              If you’re looking to improve this and build a system that consistently delivers results, let’s connect soon.
            </p>
          </td>
        </tr>

        

        <!-- Signature -->
        <tr>
          <td style="color:#333333;font-size:16px;line-height:1.6;">
            <p>Best regards,<br><strong>Md Umar</strong><br>Tron Labz Team</p>
          </td>
        </tr>
        <!-- CTA Button -->
        <tr>
          <td align="center" style="padding:30px 0;">
            <a href="https://tronlabz.com"
               style="background:#facc15;color:#111827;text-decoration:none;
                      padding:14px 32px;border-radius:8px;
                      font-weight:600;display:inline-block;">
              Visit Us
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #e5e7eb;padding-top:20px;font-size:12px;color:#6b7280;text-align:center;">
            <p>
              Tron Labz • Building the Digital Future<br>
              <a href="https://tronlabz.com" style="color:#2563eb;text-decoration:none;">tronlabz.com</a>
            </p>

            <p style="margin-top:10px;">
              If you prefer not to receive emails from us, you can
              <a href="https://tronlabz.com/unsubscribe" style="color:#ef4444;text-decoration:none;">unsubscribe here</a>.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>


`;

    // Dark Glass Welcome mail
    const welcomeMailSubject = `Tron Labz Welcomes you to the family!🎉`;
    const welcomeMail = `
    <!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no" />
<title>Welcome — Let's Build Something Remarkable</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet" />



<style>
  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; }
  body, #body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { padding: 0; }
  img { border: 0; display: block; line-height: 100%; max-width: 100%; -ms-interpolation-mode: bicubic; }
  a { text-decoration: none; }

  /* ── Web font fallback ── */
  body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

  /* ── Responsive: mobile overrides ── */
  @media screen and (max-width: 600px) {
    .email-wrapper { width: 100% !important; }
    .outer-pad { padding-left: 0 !important; padding-right: 0 !important; }

    /* Hero headline */
    .hero-h1 { font-size: 38px !important; line-height: 1.1 !important; }

    /* Image trio — stack on mobile */
    .img-trio-table { display: block !important; width: 100% !important; }
    .img-trio-table tbody, .img-trio-table tr { display: block !important; width: 100% !important; }
    .img-trio-left, .img-trio-right { display: block !important; width: 100% !important; padding: 0 16px 8px !important; }
    .img-trio-left img, .img-trio-right img { height: 180px !important; border-radius: 12px !important; }
    .img-stack-top, .img-stack-bottom { display: none !important; }
    .img-trio-right-full { display: block !important; }

    /* Stats — all 3 in a row still, smaller */
    .stat-num { font-size: 24px !important; }

    /* CTA section padding */
    .cta-inner-pad { padding: 36px 24px !important; }
    .cta-h2 { font-size: 28px !important; }
    .cta-btn-td { padding: 0 24px !important; }

    /* Glass cards padding */
    .glass-pad { padding: 28px 20px !important; }

    /* Steps */
    .step-orb-td { width: 36px !important; }

    /* Commit grid — stack */
    .commit-row td { display: block !important; width: 100% !important; padding: 6px 16px !important; }
    .commit-cell { border-radius: 16px !important; }

    /* Section padding */
    .sec-pad { padding-left: 16px !important; padding-right: 16px !important; }

    /* Full image */
    .full-img { height: 170px !important; }

    /* Signoff */
    .signoff-pad { padding: 28px 20px !important; }

    /* Footer */
    .footer-td { padding: 20px 16px !important; }
    .footer-links-td { text-align: right !important; }
  }
</style>
</head>


<body id="body" style="margin:0;padding:0;background-color:#0d0d1a;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Gradient mesh background simulation via gradient bg on outer table -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#0d0d1a;background-image:linear-gradient(135deg,rgba(99,102,241,0.18) 0%,rgba(236,72,153,0.10) 50%,rgba(16,185,129,0.08) 100%);">
  <tr>
    <td align="center" style="padding:0;">

      <!-- Email wrapper: max 600px -->
      <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
        style="width:600px;max-width:600px;">

        <!-- ══ NAVBAR ══ -->
        <tr>
          <td style="background:rgba(255,255,255,0.04);padding:16px 28px; border-radius:32px; ">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-weight:700;font-size:15px;letter-spacing:-0.01em;color:rgba(255,255,255,0.95);">
                  <img src="https://tronlabz.com/assets/company_symbol.png" width="40" alt="Tron Labz" style="border-radius:10px;">
                </td>
                <td align="right">
                  <span style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:5px 14px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.04em;color:rgba(255,255,255,0.6);text-transform:uppercase;">
                    Website Design &amp; Dev
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ HERO ══ -->
        <tr>
          <td align="center" style="padding:60px 36px 48px;text-align:center;">

            <!-- Badge -->
            <div style="display:inline-block;margin-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                style="background:rgba(255,255,255,0.08);border-radius:100px;">
                <tr>
                  <td style="padding:7px 16px 7px 10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:8px;">
                          <div style="width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,0.8);"></div>
                        </td>
                        <td style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:0.02em;white-space:nowrap;">
                          Welcome aboard, you're in good hands now!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Headline -->
            <h1 class="hero-h1" style="margin:0 0 16px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:52px;font-weight:700;letter-spacing:-0.03em;line-height:1.06;color:#ffffff;">
              Let's build<br>something<br>
              <span style="background:linear-gradient(135deg,#a78bfa 0%,#ec4899 50%,#f59e0b 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#a78bfa;">amazing.</span>
            </h1>

            <!-- Subtext -->
            <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:15px;font-weight:300;line-height:1.75;color:rgba(255,255,255,0.45);max-width:360px;margin-left:auto;margin-right:auto; text-align: justify;">
              You've made a great decision. Here's everything that happens from here on. Before we move ahead, there's one small thing we need from you.
            </p>

          </td>
        </tr>

        <!-- ══ IMAGE TRIO ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 28px;">
            <table class="img-trio-table" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Left large image -->
                <td class="img-trio-left" width="57%" style="padding-right:4px;vertical-align:top;">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85&auto=format&fit=crop"
                    alt="Studio workspace"
                    width="320" height="240"
                    style="width:100%;height:240px;object-fit:cover;border-radius:16px;border:1px solid rgba(255,255,255,0.08);display:block;filter:brightness(0.85) saturate(0.9);" />
                </td>
                <!-- Right stacked images -->
                <td class="img-trio-right" width="43%" style="padding-left:4px;vertical-align:top;">
                  <img class="img-stack-top" src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=85&auto=format&fit=crop"
                    alt="Design"
                    width="240" height="116"
                    style="width:100%;height:116px;object-fit:cover;border-radius:16px;border:1px solid rgba(255,255,255,0.08);display:block;filter:brightness(0.85) saturate(0.9);margin-bottom:8px;" />
                  <img class="img-stack-bottom" src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=85&auto=format&fit=crop"
                    alt="Process"
                    width="240" height="116"
                    style="width:100%;height:116px;object-fit:cover;border-radius:16px;border:1px solid rgba(255,255,255,0.08);display:block;filter:brightness(0.85) saturate(0.9);" />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ STATS ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>

                <!-- Stat 1 -->
                <td width="33%" style="padding-right:4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;">
                    <tr>
                      <td align="center" style="padding:22px 12px 20px;border-top:1px solid rgba(255,255,255,0.15);background:linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%);">
                        <div class="stat-num" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1;margin-bottom:6px;color:#a78bfa;">50+</div>
                        <div style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:400;letter-spacing:0.06em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Projects</div>
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- Stat 2 -->
                <td width="33%" style="padding:0 2px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;">
                    <tr>
                      <td align="center" style="padding:22px 12px 20px;border-top:1px solid rgba(255,255,255,0.15);background:linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%);">
                        <div class="stat-num" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1;margin-bottom:6px;color:#ec4899;">98%</div>
                        <div style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:400;letter-spacing:0.06em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Satisfaction</div>
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- Stat 3 -->
                <td width="33%" style="padding-left:4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;">
                    <tr>
                      <td align="center" style="padding:22px 12px 20px;border-top:1px solid rgba(255,255,255,0.15);background:linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%);">
                        <div class="stat-num" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1;margin-bottom:6px;color:#f59e0b;">2 yr</div>
                        <div style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:400;letter-spacing:0.06em;color:rgba(255,255,255,0.35);text-transform:uppercase;">In the craft</div>
                      </td>
                    </tr>
                  </table>
                </td>

              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ WELCOME COPY ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.11);border-radius:24px;overflow:hidden;">
              <!-- Top shine line -->
              <tr>
                <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="glass-pad" style="padding:32px 32px 32px; text-align: justify;">
                  <p style="margin:0 0 16px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">A note from our Founder</p>
                  <p style="margin:0 0 14px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:15px;font-weight:300;line-height:1.8;color:rgba(255,255,255,0.6);">Thanks for giving us this opportunity to redesign and develop your website. This is definitely a big step for you, and we appreciate your confidence in us.</p>
                  <p style="margin:0 0 14px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:15px;font-weight:300;line-height:1.8;color:rgba(255,255,255,0.6);">Our approach focuses on clear communication, craftsmanship, and collaboration. At all times, we will keep you aware of our process, our decisions, and future steps.</p>
                  <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:15px;font-weight:300;line-height:1.8;color:rgba(255,255,255,0.6);">For us to start on this project, all we ask from you now is just a little of your time. Complete the brief below.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ CTA CARD ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:linear-gradient(135deg,rgba(124,58,237,0.7) 0%,rgba(236,72,153,0.6) 100%);border:1px solid rgba(255,255,255,0.18);border-radius:28px;overflow:hidden;">
              <!-- Shine line -->
              <tr>
                <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="cta-inner-pad" align="center" style="padding:48px 36px;text-align:center;">
                  <p style="margin:0 0 12px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.5);">One step before we begin</p>
                  <h2 class="cta-h2" style="margin:0 0 14px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:34px;font-weight:700;letter-spacing:-0.025em;line-height:1.12;color:#ffffff;">Fill in your<br>project brief</h2>
                  <p style="margin:0 0 28px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.55);max-width:300px;margin-left:auto;margin-right:auto;">Your answers shape every design decision we make. It's the single most valuable thing you can do right now.</p>
                  <!-- Button -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;">
                    <tr>
                      <td style="border-radius:100px;background:rgba(255,255,255,0.95);">
                        <a href="https://forms.gle/Jufbp2danF9wJWrv7"
                          style="display:inline-block;padding:16px 40px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:700;color:#1a0a3c;text-decoration:none;letter-spacing:-0.01em;border-radius:100px;">
                          Complete the Brief &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:400;color:rgba(255,255,255,0.3);letter-spacing:0.04em;">Takes 5 &ndash; 8 minutes</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ FULL IMAGE ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <img class="full-img"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop"
              alt="Design process"
              width="560" height="200"
              style="width:100%;height:200px;object-fit:cover;object-position:center 35%;border-radius:20px;display:block;border:1px solid rgba(255,255,255,0.08);filter:brightness(0.8) saturate(0.9);" />
          </td>
        </tr>

        <!-- ══ PROCESS STEPS ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.11);border-radius:24px;overflow:hidden;">
              <tr>
                <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="glass-pad" style="padding:32px 28px;">
                  <p style="margin:0 0 24px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">What happens next</p>

                  <!-- Step 1 -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:18px;margin-bottom:18px;">
                    <tr>
                      <td class="step-orb-td" width="44" valign="top" style="padding-right:14px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(167,139,250,0.25);border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;text-align:center;line-height:36px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:700;color:#c4b5fd;">01</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.88);">Brief &amp; Discovery</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.65;">We'll review your brief and schedule a 45-minute discovery call to align on goals, audience, and scope.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 2 -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:18px;margin-bottom:18px;">
                    <tr>
                      <td class="step-orb-td" width="44" valign="top" style="padding-right:14px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(236,72,153,0.22);border:1px solid rgba(255,255,255,0.12);text-align:center;line-height:36px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:700;color:#f9a8d4;">02</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.88);">Strategy &amp; Moodboarding</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.65;">Visual direction and site architecture for your review. Thinking before code.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 3 -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:18px;margin-bottom:18px;">
                    <tr>
                      <td class="step-orb-td" width="44" valign="top" style="padding-right:14px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(52,211,153,0.2);border:1px solid rgba(255,255,255,0.12);text-align:center;line-height:36px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:700;color:#6ee7b7;">03</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.88);">Design &amp; Prototyping</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.65;">High  fidelity mockups for every key page, with one rounds of revision included.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 4 -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:18px;margin-bottom:18px;">
                    <tr>
                      <td class="step-orb-td" width="44" valign="top" style="padding-right:14px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(251,191,36,0.2);border:1px solid rgba(255,255,255,0.12);text-align:center;line-height:36px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:700;color:#fcd34d;">04</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.88);">Development &amp; QA</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.65;">Pixel perfect, performance optimised, and tested across every browser and device.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 5 -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="step-orb-td" width="44" valign="top" style="padding-right:14px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(99,102,241,0.22);border:1px solid rgba(255,255,255,0.12);text-align:center;line-height:36px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:700;color:#a5b4fc;">05</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.88);">Launch &amp; Handover</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.65;">Deployment, CMS walkthrough, and 30 days of post-launch support included.</p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ COMMITMENTS GRID ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table class="commit-row" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Commit 1 -->
                <td class="commit-cell" width="50%" valign="top" style="padding-right:4px;padding-bottom:8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden;">
                    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);font-size:0;">&nbsp;</td></tr>
                    <tr>
                      <td style="padding:22px 20px 22px;">
                        <div style="width:32px;height:32px;border-radius:10px;background:rgba(167,139,250,0.18);margin-bottom:12px;text-align:center;line-height:32px;font-size:15px;color:#a78bfa;">&#9678;</div>
                        <p style="margin:0 0 6px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);">Weekly Updates</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,0.38);line-height:1.6;">Progress reports every Friday, you're never left wondering.</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Commit 2 -->
                <td class="commit-cell" width="50%" valign="top" style="padding-left:4px;padding-bottom:8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden;">
                    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);font-size:0;">&nbsp;</td></tr>
                    <tr>
                      <td style="padding:22px 20px 22px;">
                        <div style="width:32px;height:32px;border-radius:10px;background:rgba(236,72,153,0.16);margin-bottom:12px;text-align:center;line-height:32px;font-size:15px;color:#ec4899;">&#9632;</div>
                        <p style="margin:0 0 6px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);">One Point of Contact</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,0.38);line-height:1.6;">A dedicated lead who knows your brief inside and out.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <!-- Commit 3 -->
                <td class="commit-cell" width="50%" valign="top" style="padding-right:4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden;">
                    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);font-size:0;">&nbsp;</td></tr>
                    <tr>
                      <td style="padding:22px 20px 22px;">
                        <div style="width:32px;height:32px;border-radius:10px;background:rgba(52,211,153,0.16);margin-bottom:12px;text-align:center;line-height:32px;font-size:15px;color:#34d399;">&#9670;</div>
                        <p style="margin:0 0 6px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);">No Surprise Costs</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,0.38);line-height:1.6;">Scope, timeline, and budget locked in upfront. In writing.</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Commit 4 -->
                <td class="commit-cell" width="50%" valign="top" style="padding-left:4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden;">
                    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);font-size:0;">&nbsp;</td></tr>
                    <tr>
                      <td style="padding:22px 20px 22px;">
                        <div style="width:32px;height:32px;border-radius:10px;background:rgba(251,191,36,0.16);margin-bottom:12px;text-align:center;line-height:32px;font-size:15px;color:#f59e0b;">&#9651;</div>
                        <p style="margin:0 0 6px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);">Full Ownership</p>
                        <p style="margin:0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,0.38);line-height:1.6;">All code, assets, and accounts transferred to you on delivery.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ SIGN OFF ══ -->
        <tr>
          <td class="sec-pad" style="padding:0 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:24px;overflow:hidden;">
              <tr>
                <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);font-size:0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="signoff-pad" style="padding:36px 32px;">
                  <p style="margin:0 0 28px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:15px;font-weight:300;line-height:1.8;color:rgba(255,255,255,0.5);">We're genuinely excited about what we'll build together. Fill in the brief whenever you're ready we'll take care of everything from there.</p>
                  <span style="display:block;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:rgba(255,255,255,0.88);margin-bottom:4px;">Tron Labz</span>
                  <span style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Design &amp; Development</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td class="footer-td" style="padding:20px 28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.18);">TRON LABZ</td>
                <td class="footer-links-td" align="right">
                  <a href="https://tronlabz.com/unsubscribe" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:400;color:rgba(255,255,255,0.2);text-decoration:none;margin-left:20px;">Unsubscribe</a>
                  <a href="https://tronlabz.com/privacy" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:400;color:rgba(255,255,255,0.2);text-decoration:none;margin-left:20px;">Privacy</a>
                  <a href="https://tronlabz.com/contact" style="font-family:'Plus Jakarta Sans',-apple-system,sans-serif;font-size:11px;font-weight:400;color:rgba(255,255,255,0.2);text-decoration:none;margin-left:20px;">Contact</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
    `;
    // Premium Dark Theme
    const welcomeMailTwo = `
    <!doctype html>
<html
  lang="en"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no, address=no, email=no, date=no, url=no"
    />
    <title>Welcome — Let's Build Something Remarkable</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
      rel="stylesheet"
    />

    <style>
      /* ── Reset ── */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body,
      #body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
        display: block;
        line-height: 100%;
        max-width: 100%;
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
      }
      body {
        font-family: "DM Sans", Georgia, sans-serif;
        background-color: #0e0e0c;
      }

      /* ── Mobile overrides ── */
      @media screen and (max-width: 600px) {
        .email-wrapper {
          width: 100% !important;
        }

        /* Hero */
        .hero-headline {
          font-size: 38px !important;
          line-height: 1.1 !important;
        }
        .hero-pad {
          padding: 40px 24px 36px !important;
        }
        .wordmark-td {
          padding: 0 24px 36px !important;
        }

        /* Image band — stack on mobile */
        .img-band-table {
          display: block !important;
          width: 100% !important;
        }
        .img-band-table tbody,
        .img-band-table tr {
          display: block !important;
          width: 100% !important;
        }
        .img-band-left,
        .img-band-right {
          display: block !important;
          width: 100% !important;
          padding: 0 !important;
        }
        .img-band-left img {
          height: 200px !important;
        }
        .img-band-stack-top {
          margin-bottom: 3px !important;
        }
        .img-band-stack-top img,
        .img-band-stack-bottom img {
          height: 140px !important;
        }

        /* Sections */
        .sec-pad {
          padding: 36px 24px !important;
        }
        .cta-pad {
          padding: 40px 24px !important;
        }

        /* CTA */
        .cta-h2 {
          font-size: 28px !important;
        }

        /* Steps */
        .step-num-td {
          width: 32px !important;
          padding-right: 14px !important;
        }
        .step-num-text {
          font-size: 22px !important;
        }

        /* Expect grid — stack */
        .expect-row td {
          display: block !important;
          width: 100% !important;
        }
        .expect-cell {
          border-right: none !important;
          border-bottom: 1px solid #1a1a17 !important;
        }

        /* Sign off */
        .signoff-pad {
          padding: 32px 24px 28px !important;
        }

        /* Footer */
        .footer-pad {
          padding: 20px 24px !important;
        }
        .footer-links-td {
          display: block !important;
          text-align: left !important;
          margin-top: 12px !important;
        }

        /* Full image */
        .full-img {
          height: 160px !important;
        }
      }
    </style>
  </head>

  <body
    id="body"
    style="
      margin: 0;
      padding: 0;
      background-color: #0e0e0c;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #0e0e0c"
    >
      <tr>
        <td align="center">
          <!-- Email wrapper -->
          <table
            class="email-wrapper"
            role="presentation"
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 600px; max-width: 600px; background-color: #0e0e0c"
          >
            <!-- ══ GOLD BAR TOP ══ -->
            <tr>
              <td
                style="
                  height: 2px;
                  background: linear-gradient(
                    90deg,
                    transparent,
                    #c9a96e 30%,
                    #c9a96e 70%,
                    transparent
                  );
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>

            <!-- ══ WORDMARK ══ -->
            <tr>
              <td
                class="wordmark-td"
                style="padding: 36px 48px 0; border-bottom: 0"
              >
                <p
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 11px;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: #89714c;
                    background: rgba(255, 255, 255, 0.04);
                    padding: 8px 16px;
                    border-radius: 32px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                    border-left: 2px solid rgba(255, 255, 255, 0.1);
                  "
                >
                  <img
                    src="https://tronlabz.com/assets/company_symbol.png"
                    width="40"
                    alt="Tron Labz"
                    style="border-radius: 10px"
                  />
                  Website Design &amp; Development
                </p>
              </td>
            </tr>

            <!-- ══ HERO ══ -->
            <tr style="margin-top: 32px">
              <td
                class="hero-pad"
                style="
                  padding: 48px 48px 52px;
                  background-color: #0e0e0c;
                  border-bottom: 1px solid #2a2a26;
                  position: relative;
                "
              >
                <p
                  style="
                    margin: 0 0 18px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 11px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #c9a96e;
                  "
                >
                  Welcome aboard, you're in good hands now!
                </p>
                <h1
                  class="hero-headline"
                  style="
                    margin: 0;
                    font-family: &quot;Cormorant Garamond&quot;, Georgia, serif;
                    font-weight: 300;
                    font-size: 50px;
                    line-height: 1.08;
                    color: #f0ede6;
                  "
                >
                  Let's build<br />something <br />
                  <em style="font-style: italic; color: #c9a96e">remarkable</em
                  ><br />together.
                </h1>
                <p
                  style="
                    margin: 22px 0 0;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #7a7468;
                    max-width: auto;
                    text-align: justify;
                  "
                >
                  You've made a great decision. Here's everything that happens
                  from here on. Before we move ahead, there's one small thing we
                  need from you.
                </p>
              </td>
            </tr>

            <!-- ══ IMAGE BAND ══ -->
            <tr>
              <td style="background-color: #0e0e0c; padding: 0">
                <table
                  class="img-band-table"
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <!-- Left tall image -->
                    <td
                      class="img-band-left"
                      width="58%"
                      valign="top"
                      style="padding-right: 3px; border-radius: 32px"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop"
                        alt="Design workspace"
                        width="348"
                        height="280"
                        style="
                          width: 100%;
                          height: 280px;
                          object-fit: cover;
                          display: block;
                          filter: brightness(0.72) saturate(0.8);
                          border-radius: 0 0 0 32px;
                        "
                      />
                    </td>
                    <!-- Right stacked -->
                    <td class="img-band-right" width="42%" valign="top">
                      <div
                        class="img-band-stack-top"
                        style="margin-bottom: 3px; border-radius: 32px"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80&auto=format&fit=crop"
                          alt="Creative process"
                          width="252"
                          height="138"
                          style="
                            width: 100%;
                            height: 138px;
                            object-fit: cover;
                            display: block;
                            filter: brightness(0.72) saturate(0.8);
                            border-radius: 32px 32px 0 0;
                          "
                        />
                      </div>
                      <div class="img-band-stack-bottom">
                        <img
                          src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80&auto=format&fit=crop"
                          alt="Digital design"
                          width="252"
                          height="138"
                          style="
                            width: 100%;
                            height: 138px;
                            object-fit: cover;
                            display: block;
                            filter: brightness(0.72) saturate(0.8);
                            border-radius: 0 0 32px 0;
                          "
                        />
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td
                style="
                  height: 1px;
                  background-color: #1e1e1a;
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>

            <!-- ══ WELCOME COPY ══ -->
            <tr>
              <td class="sec-pad" style="padding: 48px 48px">
                <p
                  style="
                    margin: 0 0 24px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #4a4840;
                  "
                >
                  A note from our founder
                </p>
                <p
                  style="
                    margin: 0 0 18px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #b8b2a8;
                  "
                >
                  Thanks for giving us this opportunity to redesign and develop
                  your website. This is definitely a big step for you, and we
                  appreciate your confidence in us.
                </p>
                <p
                  style="
                    margin: 0 0 18px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #b8b2a8;
                  "
                >
                  Our approach focuses on clear communication, craftsmanship,
                  and collaboration. At all times, we will keep you aware of our
                  process, our decisions, and future steps.
                </p>
                <p
                  style="
                    margin: 0;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #b8b2a8;
                  "
                >
                  For us to start on this project, all we ask from you now is
                  just a little of your time. Complete the brief below.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td
                style="
                  height: 1px;
                  background-color: #1e1e1a;
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>

            <!-- ══ CTA BLOCK ══ -->
            <tr>
              <td
                class="cta-pad"
                style="
                  padding: 52px 48px;
                  background-color: #111110;
                  border-top: 1px solid #1e1e1a;
                  border-bottom: 1px solid #1e1e1a;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0 0 14px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #4a4840;
                  "
                >
                  Next step
                </p>
                <h2
                  class="cta-h2"
                  style="
                    margin: 0 0 14px;
                    font-family: &quot;Cormorant Garamond&quot;, Georgia, serif;
                    font-weight: 300;
                    font-size: 34px;
                    color: #f0ede6;
                    line-height: 1.2;
                  "
                >
                  Fill in your<br /><em
                    style="font-style: italic; color: #c9a96e"
                    >project brief</em
                  >
                </h2>
                <p
                  style="
                    margin: 0 0 28px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 14px;
                    color: #6a6460;
                    line-height: 1.7;
                    max-width: 360px;
                    margin-left: auto;
                    margin-right: auto;
                  "
                >
                  Your answers guide our strategy, design direction, and
                  technical decisions. The more detail you share, the better we
                  can serve you.
                </p>
                <!-- Button -->
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="margin: 0 auto 16px"
                >
                  <tr>
                    <td
                      style="
                        background-color: #c9a96e;
                        border-radius: 32px;
                        box-shadow: 0 2px 6px #838380;
                      "
                    >
                      <a
                        href="https://forms.gle/Jufbp2danF9wJWrv7"
                        style="
                          display: inline-block;
                          padding: 16px 40px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 12px;
                          letter-spacing: 0.18em;
                          text-transform: uppercase;
                          color: #0e0e0c;
                          text-decoration: none;
                        "
                      >
                        Complete the Brief
                      </a>
                    </td>
                  </tr>
                </table>
                <span
                  style="
                    display: block;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 11px;
                    color: #3a3830;
                    letter-spacing: 0.05em;
                  "
                  >Takes approximately 5 &ndash; 8 minutes</span
                >
              </td>
            </tr>

            <!-- ══ FULL WIDTH IMAGE ══ -->
            <tr>
              <td style="padding: 0; line-height: 0">
                <img
                  class="full-img"
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80&auto=format&fit=crop"
                  alt="Collaborative workspace"
                  width="600"
                  height="200"
                  style="
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    object-position: center 30%;
                    display: block;
                    filter: brightness(0.55) saturate(0.6);
                    border-radius: 0 0 32px 32px;
                  "
                />
              </td>
            </tr>

            <!-- ══ PROCESS STEPS ══ -->
            <tr>
              <td class="sec-pad" style="padding: 48px 48px">
                <p
                  style="
                    margin: 0 0 28px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #847f6c;
                  "
                >
                  What happens next
                </p>

                <!-- Step 1 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    border-bottom: 1px solid #1a1a17;
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                  "
                >
                  <tr>
                    <td
                      class="step-num-td"
                      width="40"
                      valign="top"
                      style="padding-right: 18px"
                    >
                      <span
                        class="step-num-text"
                        style="
                          font-family:
                            &quot;Cormorant Garamond&quot;, Georgia, serif;
                          font-weight: 300;
                          font-size: 26px;
                          color: #847f6c;
                          line-height: 1;
                          display: block;
                          margin-top: 2px;
                        "
                        >01</span
                      >
                    </td>
                    <td valign="top">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 14px;
                          color: #d8d3cb;
                          letter-spacing: 0.01em;
                        "
                      >
                        Brief &amp; Discovery
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #6a6460;
                          line-height: 1.65;
                        "
                      >
                        Once we receive your completed form, we carefully
                        reviews it and schedules a 45-minute discovery call to
                        align project goals, deliverables, and scope.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 2 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    border-bottom: 1px solid #1a1a17;
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                  "
                >
                  <tr>
                    <td
                      class="step-num-td"
                      width="40"
                      valign="top"
                      style="padding-right: 18px"
                    >
                      <span
                        class="step-num-text"
                        style="
                          font-family:
                            &quot;Cormorant Garamond&quot;, Georgia, serif;
                          font-weight: 300;
                          font-size: 26px;
                          color: #847f6c;
                          line-height: 1;
                          display: block;
                          margin-top: 2px;
                        "
                        >02</span
                      >
                    </td>
                    <td valign="top">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 14px;
                          color: #d8d3cb;
                          letter-spacing: 0.01em;
                        "
                      >
                        Strategy &amp; Moodboarding
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #6a6460;
                          line-height: 1.65;
                        "
                      >
                        We develop a visual direction and sitemap for your
                        review. You'll see the thinking before we write a single
                        line of code.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 3 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    border-bottom: 1px solid #1a1a17;
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                  "
                >
                  <tr>
                    <td
                      class="step-num-td"
                      width="40"
                      valign="top"
                      style="padding-right: 18px"
                    >
                      <span
                        class="step-num-text"
                        style="
                          font-family:
                            &quot;Cormorant Garamond&quot;, Georgia, serif;
                          font-weight: 300;
                          font-size: 26px;
                          color: #847f6c;
                          line-height: 1;
                          display: block;
                          margin-top: 2px;
                        "
                        >03</span
                      >
                    </td>
                    <td valign="top">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 14px;
                          color: #d8d3cb;
                          letter-spacing: 0.01em;
                        "
                      >
                        Design &amp; Prototyping
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #6a6460;
                          line-height: 1.65;
                        "
                      >
                        High fidelity mockups are delivered for every key page.
                        Two rounds of revisions are included in your engagement.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 4 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    border-bottom: 1px solid #1a1a17;
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                  "
                >
                  <tr>
                    <td
                      class="step-num-td"
                      width="40"
                      valign="top"
                      style="padding-right: 18px"
                    >
                      <span
                        class="step-num-text"
                        style="
                          font-family:
                            &quot;Cormorant Garamond&quot;, Georgia, serif;
                          font-weight: 300;
                          font-size: 26px;
                          color: #847f6c;
                          line-height: 1;
                          display: block;
                          margin-top: 2px;
                        "
                        >04</span
                      >
                    </td>
                    <td valign="top">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 14px;
                          color: #d8d3cb;
                          letter-spacing: 0.01em;
                        "
                      >
                        Development &amp; QA
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #6a6460;
                          line-height: 1.65;
                        "
                      >
                        Pixel perfect build, performance-optimised, responsive
                        across every device. Rigorous cross-browser testing
                        before anything goes live.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 5 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="step-num-td"
                      width="40"
                      valign="top"
                      style="padding-right: 18px"
                    >
                      <span
                        class="step-num-text"
                        style="
                          font-family:
                            &quot;Cormorant Garamond&quot;, Georgia, serif;
                          font-weight: 300;
                          font-size: 26px;
                          color: #847f6c;
                          line-height: 1;
                          display: block;
                          margin-top: 2px;
                        "
                        >05</span
                      >
                    </td>
                    <td valign="top">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 14px;
                          color: #d8d3cb;
                          letter-spacing: 0.01em;
                        "
                      >
                        Launch &amp; Handover
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #6a6460;
                          line-height: 1.65;
                        "
                      >
                        We handle the deployment, then walk you through the CMS
                        so you're fully in control. Post-launch support is
                        included for 30 days.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td
                style="
                  height: 1px;
                  background-color: #1e1e1a;
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>

            <!-- ══ COMMITMENTS LABEL ══ -->
            <tr>
              <td style="padding: 48px 48px 24px">
                <p
                  style="
                    margin: 0;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #4a4840;
                  "
                >
                  Our commitments to you
                </p>
              </td>
            </tr>

            <!-- ══ EXPECT GRID ══ -->
            <tr>
              <td style="padding: 0">
                <table
                  class="expect-row"
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="border-top: 1px solid #1a1a17"
                >
                  <tr>
                    <!-- Cell 1 -->
                    <td
                      class="expect-cell"
                      width="50%"
                      valign="top"
                      style="
                        background-color: #0e0e0c;
                        padding: 28px 24px;
                        border-right: 1px solid #1a1a17;
                        border-bottom: 1px solid #1a1a17;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-size: 18px;
                          color: #c9a96e;
                        "
                      >
                        &#9632;
                      </p>
                      <p
                        style="
                          margin: 0 0 8px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 13px;
                          color: #d0cbc2;
                          letter-spacing: 0.01em;
                        "
                      >
                        Weekly Updates
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a5650;
                          line-height: 1.6;
                        "
                      >
                        Progress reports every Friday so you're never left
                        wondering.
                      </p>
                    </td>
                    <!-- Cell 2 -->
                    <td
                      class="expect-cell"
                      width="50%"
                      valign="top"
                      style="
                        background-color: #0e0e0c;
                        padding: 28px 24px;
                        border-bottom: 1px solid #1a1a17;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-size: 18px;
                          color: #c9a96e;
                        "
                      >
                        &#9632;
                      </p>
                      <p
                        style="
                          margin: 0 0 8px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 13px;
                          color: #d0cbc2;
                          letter-spacing: 0.01em;
                        "
                      >
                        One Point of Contact
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a5650;
                          line-height: 1.6;
                        "
                      >
                        A dedicated project lead who knows your brief
                        inside & out.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <!-- Cell 3 -->
                    <td
                      class="expect-cell"
                      width="50%"
                      valign="top"
                      style="
                        background-color: #0e0e0c;
                        padding: 28px 24px;
                        border-right: 1px solid #1a1a17;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-size: 18px;
                          color: #c9a96e;
                        "
                      >
                        &#9632;
                      </p>
                      <p
                        style="
                          margin: 0 0 8px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 13px;
                          color: #d0cbc2;
                          letter-spacing: 0.01em;
                        "
                      >
                        No Surprise Costs
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a5650;
                          line-height: 1.6;
                        "
                      >
                        Scope, timeline, and budget agreed upfront. In writing.
                      </p>
                    </td>
                    <!-- Cell 4 -->
                    <td
                      class="expect-cell"
                      width="50%"
                      valign="top"
                      style="background-color: #0e0e0c; padding: 28px 24px"
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-size: 18px;
                          color: #c9a96e;
                        "
                      >
                        &#9632;
                      </p>
                      <p
                        style="
                          margin: 0 0 8px;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 500;
                          font-size: 13px;
                          color: #d0cbc2;
                          letter-spacing: 0.01em;
                        "
                      >
                        Full Ownership
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a5650;
                          line-height: 1.6;
                        "
                      >
                        All code, assets, and accounts transferred to you on
                        delivery.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ SIGN OFF ══ -->
            <tr>
              <td class="signoff-pad" style="padding: 44px 48px 36px">
                <p
                  style="
                    margin: 0 0 20px;
                    font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 14px;
                    color: #5a5650;
                    line-height: 1.7;
                  "
                >
                  We look forward to understanding your world and building
                  something you're proud to share. Fill in the brief when you're
                  ready & we'll take it from there.
                </p>
                <span
                  style="
                    display: block;
                    font-family: &quot;Cormorant Garamond&quot;, Georgia, serif;
                    font-style: italic;
                    font-size: 26px;
                    font-weight: 300;
                    color: #d8d3cb;
                    margin-bottom: 4px;
                  "
                  >Tron Labz Team</span
                >
                
                >
              </td>
            </tr>

            <!-- ══ FOOTER ══ -->
            <tr>
              <td
                class="footer-pad"
                style="padding: 20px 48px; border-top: 1px solid #1a1a17"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                        font-weight: 300;
                        font-size: 11px;
                        letter-spacing: 0.18em;
                        text-transform: uppercase;
                        color: #2e2e2a;
                      "
                    >
                      Tron Labz
                    </td>
                    <td class="footer-links-td" align="right">
                      <a
                        href="https://tronlabz.com/unsubscribe"
                        style="
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: #3a3830;
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 20px;
                        "
                        >Unsubscribe</a
                      >
                      <a
                        href="https://tronlabz.com/privacy"
                        style="
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: #3a3830;
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 20px;
                        "
                        >Privacy</a
                      >
                      <a
                        href="https://tronlabz.com/contact"
                        style="
                          font-family: &quot;DM Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: #3a3830;
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 20px;
                        "
                        >Contact</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ GOLD BAR BOTTOM ══ -->
            <tr>
              <td
                style="
                  height: 2px;
                  background: linear-gradient(
                    90deg,
                    transparent,
                    #c9a96e 30%,
                    #c9a96e 70%,
                    transparent
                  );
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>
          </table>
          <!-- /email-wrapper -->
        </td>
      </tr>
    </table>
  </body>
</html>
    `;
    // Neo Brutalism Theme
    const welcomeMailThree = `
    <!doctype html>
<html
  lang="en"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no, address=no, email=no, date=no, url=no"
    />
    <title>Welcome — Let's Build Something Remarkable</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
      rel="stylesheet"
    />

    <style>
      /* ── Reset ── */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body,
      #body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
        display: block;
        line-height: 100%;
        max-width: 100%;
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
      }
      body {
        font-family: "Instrument Sans", Arial, sans-serif;
        background-color: #f2f0ec;
      }

      /* ── Mobile overrides ── */
      @media screen and (max-width: 600px) {
        .email-wrapper {
          width: 100% !important;
        }

        /* Hero */
        .hero-h1 {
          font-size: 40px !important;
          line-height: 1.05 !important;
        }
        .hero-pad {
          padding: 40px 24px 44px !important;
        }
        .topbar-pad {
          padding: 14px 24px !important;
        }

        /* Image strip — stack to single column */
        .img-strip-table {
          display: block !important;
          width: 100% !important;
        }
        .img-strip-table tbody,
        .img-strip-table tr {
          display: block !important;
          width: 100% !important;
        }
        .img-strip-td {
          display: block !important;
          width: 100% !important;
          padding: 0 0 4px !important;
        }
        .img-strip-td img {
          height: 160px !important;
        }

        /* Stats — shrink font */
        .stat-num {
          font-size: 26px !important;
        }
        .stat-td {
          padding: 20px 10px !important;
        }

        /* Section padding */
        .sec-pad {
          padding: 36px 24px !important;
        }

        /* CTA */
        .cta-pad {
          padding: 44px 24px !important;
        }
        .cta-h2 {
          font-size: 30px !important;
        }

        /* Process steps */
        .p-num-td {
          width: 44px !important;
        }

        /* Commitments grid — stack */
        .commit-row td {
          display: block !important;
          width: 100% !important;
        }
        .commit-cell-r {
          border-left: none !important;
          border-top: 2px solid #e6e4de !important;
        }
        .commit-cell-br {
          border-left: none !important;
          border-top: 2px solid #e6e4de !important;
        }

        /* Sign off */
        .signoff-pad {
          padding: 36px 24px 28px !important;
        }

        /* Footer */
        .footer-pad {
          padding: 20px 24px !important;
        }
        .footer-links-td {
          display: block !important;
          text-align: left !important;
          padding-top: 10px !important;
        }

        /* Full image */
        .full-img {
          height: 170px !important;
        }
      }
    </style>
  </head>

  <body
    id="body"
    style="
      margin: 0;
      padding: 0;
      background-color: #f2f0ec;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #f2f0ec"
    >
      <tr>
        <td align="center">
          <!-- Email wrapper: max 600px -->
          <table
            class="email-wrapper"
            role="presentation"
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 600px; max-width: 600px; background-color: #f2f0ec"
          >
            <!-- ══ TOP BAR ══ -->
            <tr>
              <td
                class="topbar-pad"
                style="background-color: #1246f0; padding: 14px 40px"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        font-family: &quot;Syne&quot;, Arial, sans-serif;
                        font-weight: 700;
                        font-size: 15px;
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                        color: #ffffff;
                      "
                    >
                      <img
                        src="https://tronlabz.com/assets/company_symbol.png"
                        width="40"
                        alt="Tron Labz"
                        style="border-radius: 10px"
                      />
                    </td>
                    <td
                      align="right"
                      style="
                        font-family:
                          &quot;Instrument Sans&quot;, Arial, sans-serif;
                        font-weight: 300;
                        font-size: 11px;
                        letter-spacing: 0.14em;
                        text-transform: uppercase;
                        color: rgba(255, 255, 255, 0.45);
                      "
                    >
                      Website Design &amp; Development
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ HERO ══ -->
            <tr>
              <td
                class="hero-pad"
                style="background-color: #1246f0; padding: 52px 40px 56px"
              >
                <!-- Lime pill -->
                <div style="margin-bottom: 26px">
                  <span
                    style="
                      display: inline-block;
                      background-color: #c8f23c;
                      color: #0a0f1e;
                      font-family: &quot;Syne&quot;, Arial, sans-serif;
                      font-weight: 600;
                      font-size: 10px;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                      padding: 6px 14px;
                      border-radius: 100px;
                    "
                    >Welcome aboard, you're in good hands now!</span
                  >
                </div>
                <!-- Headline -->
                <h1
                  class="hero-h1"
                  style="
                    margin: 0 0 18px;
                    font-family: &quot;Syne&quot;, Arial, sans-serif;
                    font-weight: 800;
                    font-size: 54px;
                    line-height: 1;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                  "
                >
                  Let's build<br /><span style="color: #c8f23c">something</span
                  ><br />amazing.
                </h1>
                <!-- Sub -->
                <p
                  style="
                    margin: 0;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 15px;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.5);
                    max-width: 380px;
                  "
                >
                  You've made a great decision. Here's everything that happens
                  from here on. Before we move ahead, there's one small thing we
                  need from you.
                </p>
              </td>
            </tr>

            <!-- ══ IMAGE STRIP (3-up) ══ -->
            <tr>
              <td style="padding: 0; background-color: #f2f0ec">
                <table
                  class="img-strip-table"
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="img-strip-td"
                      width="33%"
                      style="padding-right: 4px; padding-top: 4px"
                      valign="top"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop"
                        alt="Studio workspace"
                        width="197"
                        height="180"
                        style="
                          width: 100%;
                          height: 180px;
                          object-fit: cover;
                          display: block;
                          filter: saturate(0.9);
                          border-radius: 14px 0 0 14px;
                        "
                      />
                    </td>
                    <td
                      class="img-strip-td"
                      width="33%"
                      style="
                        padding-right: 2px;
                        padding-left: 2px;
                        padding-top: 4px;
                      "
                      valign="top"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80&auto=format&fit=crop"
                        alt="Collaboration"
                        width="197"
                        height="180"
                        style="
                          width: 100%;
                          height: 180px;
                          object-fit: cover;
                          display: block;
                          filter: saturate(0.9);
                        "
                      />
                    </td>
                    <td
                      class="img-strip-td"
                      width="33%"
                      style="padding-left: 4px; padding-top: 4px"
                      valign="top"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80&auto=format&fit=crop"
                        alt="Design screens"
                        width="197"
                        height="180"
                        style="
                          width: 100%;
                          height: 180px;
                          object-fit: cover;
                          display: block;
                          filter: saturate(0.9);
                          border-radius: 0 14px 14px 0;
                        "
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ STATS ══ -->
            <tr>
              <td
                style="
                  border-top: 1px solid #e6e4de;
                  border-bottom: 1px solid #e6e4de;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="stat-td"
                      width="33%"
                      align="center"
                      style="
                        padding: 26px 20px;
                        border-right: 1px solid #e6e4de;
                      "
                    >
                      <div
                        class="stat-num"
                        style="
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 800;
                          font-size: 34px;
                          color: #1246f0;
                          letter-spacing: -0.03em;
                          line-height: 1;
                          margin-bottom: 6px;
                        "
                      >
                        50+
                      </div>
                      <div
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          letter-spacing: 0.1em;
                          text-transform: uppercase;
                          color: #9a9faa;
                        "
                      >
                        Projects delivered
                      </div>
                    </td>
                    <td
                      class="stat-td"
                      width="33%"
                      align="center"
                      style="
                        padding: 26px 20px;
                        border-right: 1px solid #e6e4de;
                      "
                    >
                      <div
                        class="stat-num"
                        style="
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 800;
                          font-size: 34px;
                          color: #1246f0;
                          letter-spacing: -0.03em;
                          line-height: 1;
                          margin-bottom: 6px;
                        "
                      >
                        98%
                      </div>
                      <div
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          letter-spacing: 0.1em;
                          text-transform: uppercase;
                          color: #9a9faa;
                        "
                      >
                        Client satisfaction
                      </div>
                    </td>
                    <td
                      class="stat-td"
                      width="33%"
                      align="center"
                      style="padding: 26px 20px"
                    >
                      <div
                        class="stat-num"
                        style="
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 800;
                          font-size: 34px;
                          color: #1246f0;
                          letter-spacing: -0.03em;
                          line-height: 1;
                          margin-bottom: 6px;
                        "
                      >
                        2 yr
                      </div>
                      <div
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          letter-spacing: 0.1em;
                          text-transform: uppercase;
                          color: #9a9faa;
                        "
                      >
                        In the craft
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ WELCOME COPY ══ -->
            <tr>
              <td class="sec-pad" style="padding: 48px 40px">
                <!-- Badge -->
                <div style="margin-bottom: 22px">
                  <span
                    style="
                      display: inline-block;
                      border: 1px solid #1246f0;
                      color: #1246f0;
                      font-family: &quot;Syne&quot;, Arial, sans-serif;
                      font-weight: 600;
                      font-size: 9px;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                      padding: 5px 12px;
                      border-radius: 100px;
                    "
                    >A note from our founder</span
                  >
                </div>
                <p
                  style="
                    margin: 0 0 16px;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #3a3f52;
                  "
                >
                  Thanks for giving us this opportunity to redesign and develop
                  your website. This is definitely a big step for you, and we
                  appreciate your confidence in us.
                </p>
                <p
                  style="
                    margin: 0 0 16px;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #3a3f52;
                  "
                >
                  Our approach focuses on clear communication, craftsmanship,
                  and collaboration. At all times, we will keep you aware of our
                  process, our decisions, and future steps.
                </p>
                <p
                  style="
                    margin: 0;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #3a3f52;
                  "
                >
                  For us to start on this project, all we ask from you now is
                  just a little of your time. Complete the brief below.
                </p>
              </td>
            </tr>

            <!-- ══ CTA BLOCK ══ -->
            <tr>
              <td
                class="cta-pad"
                style="
                  background-color: #c8f23c;
                  padding: 56px 40px;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0 0 14px;
                    font-family: &quot;Syne&quot;, Arial, sans-serif;
                    font-weight: 600;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: rgba(10, 15, 30, 0.45);
                  "
                >
                  One step before we begin
                </p>
                <h2
                  class="cta-h2"
                  style="
                    margin: 0 0 14px;
                    font-family: &quot;Syne&quot;, Arial, sans-serif;
                    font-weight: 800;
                    font-size: 36px;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    color: #0a0f1e;
                  "
                >
                  Fill in your<br />project brief
                </h2>
                <p
                  style="
                    margin: 0 0 28px;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 14px;
                    color: rgba(10, 15, 30, 0.55);
                    line-height: 1.7;
                    max-width: 340px;
                    margin-left: auto;
                    margin-right: auto;
                  "
                >
                  Your answers guide our strategy, design direction, and
                  technical decisions. The more detail you share, the better we
                  can serve you.
                </p>
                <!-- Button -->
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="margin: 0 auto 16px;"
                >
                  <tr>
                    <td style="background-color: #0a0f1e; border-radius: 100px">
                      <a
                        href="https://forms.gle/Jufbp2danF9wJWrv7"
                        style="
                          display: inline-block;
                          padding: 18px 44px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 12px;
                          letter-spacing: 0.14em;
                          text-transform: uppercase;
                          color: #c8f23c;
                          text-decoration: none;
                          border-radius: 100px;
                        "
                      >
                        Complete the Brief &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <span
                  style="
                    display: block;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 11px;
                    color: rgba(10, 15, 30, 0.35);
                    letter-spacing: 0.06em;
                  "
                  >Takes 5 &ndash; 10 minutes </span
                >
              </td>
            </tr>

            <!-- ══ FULL IMAGE ══ -->
            <tr>
              <td style="padding: 0; line-height: 0">
                <img
                  class="full-img"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop"
                  alt="Design process"
                  width="600"
                  height="220"
                  style="
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    object-position: center 40%;
                    display: block;
                    filter: saturate(0.85);
                    border-radius: 0 0 14px 14px;
                  "
                />
              </td>
            </tr>

            <!-- ══ PROCESS STEPS ══ -->
            <tr>
              <td class="sec-pad" style="padding: 48px 40px">
                <!-- Badge -->
                <div style="margin-bottom: 28px">
                  <span
                    style="
                      display: inline-block;
                      border: 1px solid #1246f0;
                      color: #1246f0;
                      font-family: &quot;Syne&quot;, Arial, sans-serif;
                      font-weight: 600;
                      font-size: 9px;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                      padding: 5px 12px;
                      border-radius: 100px;
                    "
                    >What happens next</span
                  >
                </div>

                <!-- Step 1 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e4de;
                  "
                >
                  <tr>
                    <td
                      class="p-num-td"
                      width="52"
                      valign="top"
                      style="padding-right: 14px"
                    >
                      <div
                        style="
                          width: 40px;
                          height: 40px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 40px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 13px;
                          color: #ffffff;
                        "
                      >
                        01
                      </div>
                    </td>
                    <td valign="top" style="padding-top: 8px">
                      <p
                        style="
                          margin: 0 0 5px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 14px;
                          color: #0a0f1e;
                        "
                      >
                        Brief &amp; Discovery
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #5a6080;
                          line-height: 1.65;
                        "
                      >
                        We review your brief, then schedule a 45-minute
                        discovery call to align project goals, deliverables, and scope.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 2 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e4de;
                  "
                >
                  <tr>
                    <td
                      class="p-num-td"
                      width="52"
                      valign="top"
                      style="padding-right: 14px"
                    >
                      <div
                        style="
                          width: 40px;
                          height: 40px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 40px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 13px;
                          color: #ffffff;
                        "
                      >
                        02
                      </div>
                    </td>
                    <td valign="top" style="padding-top: 8px">
                      <p
                        style="
                          margin: 0 0 5px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 14px;
                          color: #0a0f1e;
                        "
                      >
                        Strategy &amp; Moodboarding
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #5a6080;
                          line-height: 1.65;
                        "
                      >
                        Visual direction and site architecture for your review.
                        You see the thinking before we write any code.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 3 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e4de;
                  "
                >
                  <tr>
                    <td
                      class="p-num-td"
                      width="52"
                      valign="top"
                      style="padding-right: 14px"
                    >
                      <div
                        style="
                          width: 40px;
                          height: 40px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 40px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 13px;
                          color: #ffffff;
                        "
                      >
                        03
                      </div>
                    </td>
                    <td valign="top" style="padding-top: 8px">
                      <p
                        style="
                          margin: 0 0 5px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 14px;
                          color: #0a0f1e;
                        "
                      >
                        Design &amp; Prototyping
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #5a6080;
                          line-height: 1.65;
                        "
                      >
                        High-fidelity mockups for every key page. Two rounds of
                        revision include, no surprises and no extra charges.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 4 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e4de;
                  "
                >
                  <tr>
                    <td
                      class="p-num-td"
                      width="52"
                      valign="top"
                      style="padding-right: 14px"
                    >
                      <div
                        style="
                          width: 40px;
                          height: 40px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 40px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 13px;
                          color: #ffffff;
                        "
                      >
                        04
                      </div>
                    </td>
                    <td valign="top" style="padding-top: 8px">
                      <p
                        style="
                          margin: 0 0 5px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 14px;
                          color: #0a0f1e;
                        "
                      >
                        Development &amp; QA
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #5a6080;
                          line-height: 1.65;
                        "
                      >
                        Pixel perfect build, optimised for speed and every
                        device. Rigorous cross-browser testing before anything
                        goes live.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Step 5 -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="p-num-td"
                      width="52"
                      valign="top"
                      style="padding-right: 14px"
                    >
                      <div
                        style="
                          width: 40px;
                          height: 40px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 40px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 700;
                          font-size: 13px;
                          color: #ffffff;
                        "
                      >
                        05
                      </div>
                    </td>
                    <td valign="top" style="padding-top: 8px">
                      <p
                        style="
                          margin: 0 0 5px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 14px;
                          color: #0a0f1e;
                        "
                      >
                        Launch &amp; Handover
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 13px;
                          color: #5a6080;
                          line-height: 1.65;
                        "
                      >
                        We handle the deployment, walk you through your CMS, and
                        provide 30 days of post-launch support.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ COMMITMENTS LABEL ══ -->
            <tr>
              <td style="padding: 0 40px 18px">
                <span
                  style="
                    display: inline-block;
                    border: 1px solid #1246f0;
                    color: #1246f0;
                    font-family: &quot;Syne&quot;, Arial, sans-serif;
                    font-weight: 600;
                    font-size: 9px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 100px;
                  "
                  >Our commitments</span
                >
              </td>
            </tr>

            <!-- ══ COMMITMENTS GRID ══ -->
            <tr>
              <td style="padding: 0">
                <table
                  class="commit-row"
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <!-- Cell 1 -->
                    <td
                      width="50%"
                      valign="top"
                      style="
                        background-color: #f2f0ec;
                        padding: 26px 28px;
                        border-right: 2px solid #e6e4de;
                        border-bottom: 2px solid #e6e4de;
                      "
                    >
                      <div
                        style="
                          width: 8px;
                          height: 8px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          margin-bottom: 14px;
                        "
                      ></div>
                      <p
                        style="
                          margin: 0 0 7px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 13px;
                          color: #0a0f1e;
                        "
                      >
                        Weekly Updates
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a6080;
                          line-height: 1.6;
                        "
                      >
                        Progress reports every Friday, you're never left in the
                        dark.
                      </p>
                    </td>
                    <!-- Cell 2 -->
                    <td
                      class="commit-cell-r"
                      width="50%"
                      valign="top"
                      style="
                        background-color: #f2f0ec;
                        padding: 26px 28px;
                        border-bottom: 2px solid #e6e4de;
                      "
                    >
                      <div
                        style="
                          width: 8px;
                          height: 8px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          margin-bottom: 14px;
                        "
                      ></div>
                      <p
                        style="
                          margin: 0 0 7px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 13px;
                          color: #0a0f1e;
                        "
                      >
                        One Point of Contact
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a6080;
                          line-height: 1.6;
                        "
                      >
                        A dedicated lead who knows your brief inside and out.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <!-- Cell 3 -->
                    <td
                      width="50%"
                      valign="top"
                      style="
                        background-color: #f2f0ec;
                        padding: 26px 28px;
                        border-right: 2px solid #e6e4de;
                      "
                    >
                      <div
                        style="
                          width: 8px;
                          height: 8px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          margin-bottom: 14px;
                        "
                      ></div>
                      <p
                        style="
                          margin: 0 0 7px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 13px;
                          color: #0a0f1e;
                        "
                      >
                        No Surprise Costs
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a6080;
                          line-height: 1.6;
                        "
                      >
                        Scope, timeline, and budget locked in upfront. In
                        writing.
                      </p>
                    </td>
                    <!-- Cell 4 -->
                    <td
                      class="commit-cell-br"
                      width="50%"
                      valign="top"
                      style="background-color: #f2f0ec; padding: 26px 28px"
                    >
                      <div
                        style="
                          width: 8px;
                          height: 8px;
                          background-color: #1246f0;
                          border-radius: 50%;
                          margin-bottom: 14px;
                        "
                      ></div>
                      <p
                        style="
                          margin: 0 0 7px;
                          font-family: &quot;Syne&quot;, Arial, sans-serif;
                          font-weight: 600;
                          font-size: 13px;
                          color: #0a0f1e;
                        "
                      >
                        Full Ownership
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 12px;
                          color: #5a6080;
                          line-height: 1.6;
                        "
                      >
                        All code, assets, and accounts transferred to you on
                        delivery.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ SIGN OFF ══ -->
            <tr>
              <td
                class="signoff-pad"
                style="padding: 44px 40px 36px; border-top: 2px solid #1246f0"
              >
                <p
                  style="
                    margin: 0 0 22px;
                    font-family: &quot;Instrument Sans&quot;, Arial, sans-serif;
                    font-weight: 300;
                    font-size: 14px;
                    color: #3a3f52;
                    line-height: 1.8;
                  "
                >
                  We look forward to understanding your world and building
                  something you're proud to share. Fill in the brief when you're
                  ready & we'll take it from there.
                </p>
                <span
                  style="
                    display: block;
                    font-family: &quot;Syne&quot;, Arial, sans-serif;
                    font-weight: 800;
                    font-size: 21px;
                    color: #0a0f1e;
                    letter-spacing: -0.01em;
                    margin-bottom: 4px;
                  "
                  >The Tron Labz Team</span
                >
                
              </td>
            </tr>

            <!-- ══ FOOTER ══ -->
            <tr>
              <td
                class="footer-pad"
                style="background-color: #0a0f1e; padding: 22px 40px"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        font-family: &quot;Syne&quot;, Arial, sans-serif;
                        font-weight: 700;
                        font-size: 13px;
                        letter-spacing: 0.06em;
                        text-transform: uppercase;
                        color: rgba(255, 255, 255, 0.25);
                      "
                    >
                      Tron Labz
                    </td>
                    <td class="footer-links-td" align="right">
                      <a
                        href="https://tronlabz.com/unsubscribe"
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: rgba(255, 255, 255, 0.25);
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 18px;
                        "
                        >Unsubscribe</a
                      >
                      <a
                        href="https://tronlabz.com/privacy"
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: rgba(255, 255, 255, 0.25);
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 18px;
                        "
                        >Privacy</a
                      >
                      <a
                        href="https://tronlabz.com/contact"
                        style="
                          font-family:
                            &quot;Instrument Sans&quot;, Arial, sans-serif;
                          font-weight: 300;
                          font-size: 11px;
                          color: rgba(255, 255, 255, 0.25);
                          text-decoration: none;
                          letter-spacing: 0.06em;
                          margin-left: 18px;
                        "
                        >Contact</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!-- /email-wrapper -->
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    try {
      await transporter.sendMail({
        from: `"TRON LABZ" <${process.env.SMTP_EMAIL}>`,
        to: recipient.email,
        subject: welcomeMailSubject,
        html: welcomeMailThree,
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
