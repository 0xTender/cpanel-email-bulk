import axios from "axios";
import fs from "fs";
import csv from "csv-parser";

// Configuration
const cpanelHost = process.env.CPANEL_HOST ?? ""; // Replace with your cPanel host
const apiToken = process.env.CPANEL_API_TOKEN ?? ""; // Replace with your API token
const csvFilePath = "email_accounts.csv";
const cpanelUsername = process.env.CPANEL_USERNAME ?? "";
// Function to create an email account in cPanel
async function createEmailAccount(
  email: string,
  password: string,
): Promise<void> {
  const [username, domain] = email.split("@");

  try {
    const response = await axios.post(
      `https://${cpanelHost}:2083/execute/Email/add_pop`,
      {
        domain: domain,
        email: username,
        password: password,
        quota: 250, // Quota in MB
      },
      {
        headers: {
          Authorization: `cpanel ${cpanelUsername}:${apiToken}`,
        },
      },
    );

    if (response.data.status === 1) {
      console.log(`Created email account for ${email}`);
    } else {
      console.error(
        `Error creating email account for ${email}: ${response.data.errors.join(", ")}`,
      );
    }
  } catch (error) {
    console.error(`Error creating email account for ${email}:`, error.message);
  }
}

// Read the CSV file and create email accounts
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const email = row["email"];
    const password = row["password"];
    if (email && password) {
      createEmailAccount(email, password);
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
