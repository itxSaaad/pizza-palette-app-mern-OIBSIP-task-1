function emailBaseTemplate({
  title = '',
  greeting = '',
  message = '',
  actionText = '',
  actionUrl = '',
  closing = 'Thank you',
  signature = 'Team Pizza Palette',
  extra = '',
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      /* Reset styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* Base styles */
      body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        outline: none;
        text-decoration: none;
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .email-container {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        .email-body {
          background-color: #2d2d2d !important;
          color: #ffffff !important;
        }
        .text-color {
          color: #ffffff !important;
        }
        .secondary-text {
          color: #cccccc !important;
        }
        .footer-text {
          color: #888888 !important;
        }
      }
      
      /* Mobile responsive styles */
      @media only screen and (max-width: 600px) {
        .email-container {
          padding: 1rem !important;
        }
        
        .email-wrapper {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        
        .header-content {
          padding: 1.5rem 1rem !important;
        }
        
        .logo {
          font-size: 2rem !important;
          padding: 0.4rem 1.5rem !important;
        }
        
        .main-title {
          font-size: 1.5rem !important;
          line-height: 1.3 !important;
        }
        
        .main-content {
          padding: 2rem 1.5rem 1.5rem 1.5rem !important;
        }
        
        .greeting {
          font-size: 1.1rem !important;
        }
        
        .message-text {
          font-size: 1rem !important;
        }
        
        .action-button {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          padding: 1rem 1.5rem !important;
          font-size: 1rem !important;
          margin: 1.5rem 0 !important;
        }
        
        .footer-content {
          padding: 1.5rem 1rem !important;
          font-size: 0.85rem !important;
        }
      }
      
      /* Ultra-small screens */
      @media only screen and (max-width: 360px) {
        .email-container {
          padding: 0.5rem !important;
        }
        
        .header-content {
          padding: 1rem 0.5rem !important;
        }
        
        .main-content {
          padding: 1.5rem 1rem !important;
        }
        
        .logo {
          font-size: 1.8rem !important;
          padding: 0.3rem 1rem !important;
        }
        
        .main-title {
          font-size: 1.3rem !important;
        }
      }
      
      /* High DPI displays */
      @media only screen and (-webkit-min-device-pixel-ratio: 1.5) {
        .email-wrapper {
          border-radius: 12px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; width: 100%; word-wrap: break-word; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    
    <!-- Email Container -->
    <div class="email-container" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; padding: 2rem; color: #222222; line-height: 1.6; width: 100%; min-height: 100vh;">
      
      <!-- Email Wrapper Table -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td>
            
            <!-- Main Email Content -->
            <div class="email-wrapper" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="header-content" style="background: linear-gradient(135deg, #ff914d 0%, #ffb347 100%); padding: 2.5rem 2rem; text-align: center; position: relative;">
                    
                    <!-- Logo -->
                    <div class="logo" style="display: inline-block; background-color: #fff3e6; color: #ff914d; font-size: 2.2rem; font-weight: 800; border-radius: 12px; padding: 0.5rem 2rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(255, 145, 77, 0.2); margin-bottom: 1rem;">
                      🍕 Pizza Palette
                    </div>
                    
                    <!-- Title -->
                    ${
                      title
                        ? `<h1 class="main-title" style="margin: 1rem 0 0 0; color: #ffffff; font-size: 1.8rem; font-weight: 700; letter-spacing: 0.3px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">${title}</h1>`
                        : ''
                    }
                    
                  </td>
                </tr>
              </table>
              
              <!-- Main Content -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="main-content email-body" style="padding: 2.5rem 2.5rem 2rem 2.5rem; background-color: #ffffff;">
                    
                    <!-- Greeting -->
                    ${
                      greeting
                        ? `<p class="greeting text-color" style="font-size: 1.15rem; margin: 0 0 1.5rem 0; font-weight: 600; color: #1a1a1a; line-height: 1.4;">${greeting}</p>`
                        : ''
                    }
                    
                    <!-- Message -->
                    ${
                      message
                        ? `<p class="message-text secondary-text" style="margin: 0 0 2rem 0; font-size: 1.05rem; color: #4a5568; line-height: 1.7;">${message}</p>`
                        : ''
                    }
                    
                    <!-- Action Button -->
                    ${
                      actionText && actionUrl
                        ? `
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 2rem 0;">
                        <tr>
                          <td style="text-align: center;">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="#ff914d">
                            <w:anchorlock/>
                            <center>
                            <![endif]-->
                            <a href="${actionUrl}" class="action-button" style="display: inline-block; background: linear-gradient(135deg, #ff914d 0%, #ffb347 100%); color: #ffffff; text-decoration: none; padding: 0.9rem 2.5rem; border-radius: 12px; font-weight: 700; font-size: 1.05rem; box-shadow: 0 4px 16px rgba(255, 145, 77, 0.3); transition: all 0.2s ease; border: none; cursor: pointer; text-align: center; min-width: 200px;">${actionText}</a>
                            <!--[if mso]>
                            </center>
                            </v:roundrect>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    `
                        : ''
                    }
                    
                    <!-- Extra Content -->
                    ${extra ? `<div style="margin: 2rem 0 1rem 0;">${extra}</div>` : ''}
                    
                    <!-- Closing -->
                    <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
                      <p class="secondary-text" style="margin: 0; color: #718096; font-size: 1rem; line-height: 1.5;">
                        ${closing},<br>
                        <span style="font-weight: 600; color: #ff914d; margin-top: 0.5rem; display: inline-block;">${signature}</span>
                      </p>
                    </div>
                    
                  </td>
                </tr>
              </table>
              
            </div>
            
            <!-- Footer -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td class="footer-content" style="text-align: center; padding: 2rem 1rem; color: #a0aec0; font-size: 0.9rem; line-height: 1.4;">
                  <p class="footer-text" style="margin: 0 0 0.5rem 0;">&copy; ${new Date().getFullYear()} Pizza Palette. All rights reserved.</p>
                  <p class="footer-text" style="margin: 0; font-size: 0.85rem;">
                    If you no longer wish to receive these emails, you can 
                    <a href="#" style="color: #ff914d; text-decoration: none; font-weight: 500;">unsubscribe here</a>.
                  </p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
      
    </div>
    
  </body>
  </html>
  `;
}

module.exports = emailBaseTemplate;
