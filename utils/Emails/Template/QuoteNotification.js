const QuoteNotificationTemplate = (quote) => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>New Quote Alert</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 20px !important;
        }

        h1 {
          font-size: 20px !important;
        }

        td,
        p,
        a {
          font-size: 14px !important;
        }

        .button {
          padding: 10px 20px !important;
          font-size: 14px !important;
        }

        .inner-padding {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f7fa;
      font-family: Arial, sans-serif;
      color: #333;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
        padding: 40px 0;
      "
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
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
              overflow: hidden;
              max-width: 100%;
            "
          >
            <tr>
              <td
                align="center"
                style="padding: 30px; background-color: #ea580c"
              >
                <h1 style="color: #ffffff; font-size: 26px; margin: 0">
                  📦 New Quote Request Received
                </h1>
                <p style="color: #ffffff; font-size: 14px; margin-top: 10px">
                  You’ve got a new request for shipment quote!
                </p>
              </td>
            </tr>

            <tr>
              <td class="inner-padding" style="padding: 30px">
                <h3 style="color: #232526">Personal Info:</h3>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="margin-top: 10px; font-size: 14px"
                >
                  <tr>
                    <td style="padding: 8px 0"><strong>Name:</strong></td>
                    <td>${quote.first_name} ${quote.last_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0"><strong>Email:</strong></td>
                    <td>${quote.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0"><strong>Phone:</strong></td>
                    <td>${quote.phone_number}</td>
                  </tr>
                </table>

                <h3 style="margin-top: 30px; color: #232526">
                  Shipping Details:
                </h3>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="margin-top: 10px; font-size: 14px"
                >
                  <tr>
                    <td style="padding: 8px 0"><strong>Origin:</strong></td>
                    <td>${quote.origin_address}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0">
                      <strong>Destination:</strong>
                    </td>
                    <td>${quote.destination_address}</td>
                  </tr>
                </table>

                <h3 style="margin-top: 30px; color: #232526">Cargo Details:</h3>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="margin-top: 10px; font-size: 14px"
                >
                  <tr>
                    <td style="padding: 8px 0"><strong>Weight:</strong></td>
                    <td>${quote.weight} kg</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0"><strong>Dimensions:</strong></td>
                    <td>${quote.dimensions}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0">
                      <strong>No. of Pieces:</strong>
                    </td>
                    <td>${quote.number_of_pieces}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0"><strong>Commodity:</strong></td>
                    <td>${quote.commodity}</td>
                  </tr>
                </table>

                <h3 style="margin-top: 30px; color: #232526">
                  Selected Services:
                </h3>
                <p style="font-size: 14px; margin-bottom: 0">${quote.services}</p>

                <h3 style="margin-top: 30px; color: #232526">
                  Additional Info:
                </h3>
                <p
                  style="
                    font-size: 14px;
                    line-height: 1.6;
                    background: #f9f9f9;
                    padding: 10px;
                    border-left: 4px solid #ff6b00;
                  "
                >
                  ${quote.additional_information}
                </p>

                <div style="margin: 30px 0">
                  <a
                    href="https://youradminpanel.com/quotes"
                    class="button"
                    style="
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #ff6b00;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                    "
                  >
                    🔍 View in Admin Panel
                  </a>
                </div>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  background-color: #f4f7fa;
                  padding: 20px;
                  font-size: 12px;
                  color: #777;
                "
              >
                © ${year} Bahta Express. Internal Notification Only.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

module.exports = {
  QuoteNotificationTemplate,
};
