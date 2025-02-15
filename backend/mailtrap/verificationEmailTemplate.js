export const verificationEmailTemplate = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; text-align: center;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p style="color: #555;">Use the code below to verify your email address:</p>
                <h3 style="background: #007bff; color: #fff; padding: 10px; display: inline-block;">{verificationCode}</h3>
                <p style="color: #777;">If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="color: #aaa; font-size: 12px;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>`;
