import { createObjectCsvWriter } from "csv-writer";
import { faker } from "@faker-js/faker";

const csvWriter = createObjectCsvWriter({
  path: "email_accounts.csv",
  header: [
    { id: "email", title: "email" },
    { id: "password", title: "password" },
  ],
});

const generateEmailAndPassword = (
  domain: string,
): { email: string; password: string } => {
  const email = faker.internet.userName() + "@" + domain;
  const password = faker.internet.password({
    length: 20,
  });
  return { email, password };
};

const emailAccounts: { email: string; password: string }[] = [];


const domains: string[] = []

for (const domain of domains) {

  for (let i = 0; i < 10; i++) {
    emailAccounts.push(generateEmailAndPassword(domain));
  }
}

// Write to CSV
csvWriter.writeRecords(emailAccounts).then(() => {
  console.log("CSV file was written successfully");
});
