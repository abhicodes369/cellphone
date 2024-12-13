const generatePDFHTML = (data: any, jobId: string, customerId: string) => {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; margin-bottom: 10px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Mobile Service Center - Service Request</h1>
              <p>Job ID: ${jobId} | Customer ID: ${customerId}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="field">
                <span class="label">Name:</span> ${data.name}
              </div>
              <div class="field">
                <span class="label">Phone:</span> ${data.phoneno}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${data.email || "Not provided"}
              </div>
            </div>
  
            <div class="section">
              <div class="section-title">Device Information</div>
              <div class="field">
                <span class="label">Device Model:</span> ${data.deviceModel}
              </div>
              <div class="field">
                <span class="label">Serial Number/IMEI:</span> ${
                  data.serialNumber
                }
              </div>
              <div class="field">
                <span class="label">Device Condition:</span> ${
                  data.deviceCondition
                }
              </div>
              <div class="field">
                <span class="label">Issue Description:</span> ${data.deviceIssue}
              </div>
            </div>
          </body>
        </html>
      `;
  };
  
  export default generatePDFHTML;
  