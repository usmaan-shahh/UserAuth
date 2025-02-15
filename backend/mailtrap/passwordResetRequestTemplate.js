export const passwordResetRequestTemplate = `<!DOCTYPE html>
<html>
<head>
  <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <table width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="text-align: center;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password.</p>
        <p style="color: #555; font-size: 16px;">If you didn't request this, please ignore this email.</p>
      </td>
    </tr>

    <tr>
      <td style="text-align: center; padding: 20px;">
        <a href="{resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </td>
    </tr>

    <tr>
      <td style="text-align: center; padding: 10px;">
        <p style="color: #555; font-size: 14px;">If the button above doesn’t work, copy and paste this link into your browser:</p>
        <p style="color: #007bff; font-size: 14px; word-wrap: break-word;">{resetLink}</p>
      </td>
    </tr>

    <tr>
      <td style="text-align: center; padding: 20px; font-size: 14px; color: #888;">
        <p>Thank you,<br> The [Your Company] Team</p>
      </td>
    </tr>
  </table>

</body>
</html>
`;
