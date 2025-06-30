import { prisma } from "@/lib";
import { randomInt } from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const permission = await prisma.permissions.findUnique({ where: { email } });

  if (!permission) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const code = randomInt(100000, 999999).toString();

  await prisma.permissions.update({
    where: { email },
    data: { code }
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"KTR North Digital Portal" <${process.env.SMTP_MAIL}>`,
    text: `Your login code is: ${code}`,
    subject: "Your One-Time Code",
    to: email
  });

  return NextResponse.json({ success: true });
}
