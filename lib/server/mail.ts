import { getCloudflareContext } from "@opennextjs/cloudflare";

type SecretBinding = {
  get: () => Promise<string>;
};

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function getRuntimeEnv(name: string): Promise<string | undefined> {
  const processValue = process.env[name];
  if (processValue) {
    return processValue;
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const workerEnv = env as unknown as Record<string, unknown> | undefined;
    const value = workerEnv?.[name];

    if (typeof value === "string" && value) {
      return value;
    }

    if (
      value &&
      typeof value === "object" &&
      "get" in value &&
      typeof (value as SecretBinding).get === "function"
    ) {
      const secretValue = await (value as SecretBinding).get();
      if (secretValue) {
        return secretValue;
      }
    }
  } catch {
    // Ignore when Cloudflare context is unavailable (e.g. local node runtime)
  }

  return undefined;
}

async function sendWithResend(
  apiKey: string,
  from: string,
  input: SendEmailInput
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API failed (${response.status}): ${body}`);
  }
}

async function sendWithSmtp(from: string, input: SendEmailInput) {
  const smtpUser = await getRuntimeEnv("EMAIL_USER");
  const smtpPass = await getRuntimeEnv("EMAIL_PASS");

  if (!smtpUser || !smtpPass) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS. Configure RESEND_API_KEY or SMTP credentials."
    );
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  const sender =
    input.from ??
    (await getRuntimeEnv("EMAIL_FROM")) ??
    (await getRuntimeEnv("EMAIL_USER"));

  if (!sender) {
    throw new Error(
      "Missing sender address. Configure EMAIL_FROM or EMAIL_USER."
    );
  }

  const resendApiKey = await getRuntimeEnv("RESEND_API_KEY");
  if (resendApiKey) {
    await sendWithResend(resendApiKey, sender, input);
    return "resend" as const;
  }

  await sendWithSmtp(sender, input);
  return "smtp" as const;
}
