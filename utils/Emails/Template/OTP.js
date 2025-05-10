const generateOTPEmailContent = (otp, firstName) => {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 20px !important;
        }

        .otp-code {
          font-size: 28px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      color: #333;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="padding: 40px 0; background-color: #f4f4f4"
    >
      <tr>
        <td align="center">
          <table
            class="container"
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              max-width: 100%;
            "
          >
            <tr>
              <td style="padding: 30px; background-color: #F97316" align="center">
                <h2 style="color: #ffffff; margin: 0">🔐 Verification Code</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px">
                <p style="font-size: 16px; line-height: 1.6; margin: 0">
                  Hi ${firstName || "there"},
                </p>
                <p style="font-size: 16px; line-height: 1.6">
                  Your one-time password (OTP) is below. Please use this code to complete your verification process. This code is valid for a limited time only.
                </p>
                <div
                  class="otp-code"
                  style="
                    font-size: 36px;
                    font-weight: bold;
                    text-align: center;
                    margin: 30px 0;
                    letter-spacing: 8px;
                    color: #F97316;
                  "
                >
                  ${otp}
                </div>
                <p style="font-size: 14px; line-height: 1.6; color: #777">
                  If you didn't request this code, please ignore this message.
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #777; margin-top: 30px">
                  Thank you,<br />
                  <strong>Bahta Express</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px; background-color: #f9f9f9; font-size: 12px; color: #999">
                &copy; ${year} Bahta Express. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

module.exports = {
  generateOTPEmailContent,
};
