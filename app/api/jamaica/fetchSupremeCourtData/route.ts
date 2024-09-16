import { NextResponse } from "next/server";

export async function GET() {
  const dummyData = {
    totalCases: 150,
    downloadedFiles: {
      2024: ["https://example.com/case1.pdf", "https://example.com/case2.pdf"],
      2023: ["https://example.com/case3.pdf", "https://example.com/case4.pdf"],
    },
  };

  return NextResponse.json(dummyData);
}

// import { NextResponse } from "next/server";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { extractTextFromPDF } from "@/lib/serverUtils";
// import { createPool } from "mysql2/promise";
// import AWS from "aws-sdk";

// import moment from "moment";

// // Create a MySQL connection pool
// const pool = createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   connectionLimit: 10,
//   port: 25060,
// });

// if (!process.env.DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT) {
//   throw new Error("DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT is not set");
// }

// // Configure AWS SDK for DigitalOcean Spaces
// const spacesEndpoint = new AWS.Endpoint(
//   process.env.DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT,
// );
// const s3 = new AWS.S3({
//   endpoint: spacesEndpoint,
//   accessKeyId: process.env.DIGITAL_OCEAN_SPACE_ACCESS_KEY,
//   secretAccessKey: process.env.DIGITAL_OCEAN_SPACE_SECRET_KEY,
//   region: "us-east-1", // DigitalOcean Spaces use this region
//   signatureVersion: "v4",
// });

// export async function GET() {
//   async function testDatabaseConnection() {
//     try {
//       const connection = await pool.getConnection();
//       console.log("Successfully connected to the database");
//       connection.release();
//     } catch (error) {
//       console.error("Failed to connect to the database:", error);
//     }
//   }

//   // Call this function at the start of your GET function
//   await testDatabaseConnection();
//   const baseUrl = "https://supremecourt.gov.jm";
//   const years = [2024, 2023, 2022 /* ... other years ... */];
//   const allDownloadedFiles: Record<number, string[]> = {};
//   let totalCases = 0;

//   // @ts-expect-error: TypeScript does not recognize the entries() method on arrays
//   for (const [index, year] of years.entries()) {
//     console.log(`Processing year ${year}...`);
//     try {
//       const url = `${baseUrl}/content/judgments?qt-judgment=${index}`;
//       const response = await axios.get(url);
//       const $ = cheerio.load(response.data);

//       const cases = $("table.custom-stripe tbody tr")
//         .map((_, element) => {
//           const $el = $(element);
//           return {
//             caseNumber: $el.find("td:nth-child(1)").text().trim(),
//             caseTitle: $el.find("td:nth-child(2)").text().trim(),
//             presidingJudge: $el.find("td:nth-child(3)").text().trim(),
//             dateOfDelivery: $el.find("td:nth-child(4)").text().trim(),
//             link: baseUrl + $el.find("td:nth-child(2) a").attr("href"),
//           };
//         })
//         .get();

//       console.log(`Number of cases for year ${year}: ${cases.length}`);
//       totalCases += cases.length;

//       for (const caseInfo of cases) {
//         try {
//           const casePage = await axios.get(caseInfo.link);
//           const $casePage = cheerio.load(casePage.data);
//           const pdfLink = $casePage(".field-name-field-pdf a").attr("href");
//           const neutralCitation = $casePage(
//             ".field-name-field-neutral-citation .field-item",
//           )
//             .text()
//             .trim();
//           const keywordsSummary = $casePage(".field-name-body .field-item.even")
//             .text()
//             .trim();

//           if (pdfLink) {
//             const pdfResponse = await axios.get(pdfLink, {
//               responseType: "arraybuffer",
//               headers: { Accept: "application/pdf" },
//             });

//             let extractedText = "";
//             try {
//               extractedText = await extractTextFromPDF(
//                 Buffer.from(pdfResponse.data),
//               );
//             } catch (pdfError) {
//               console.error(`Error extracting text from PDF: ${pdfError}`);
//             }

//             if (typeof process.env.DIGITAL_OCEAN_SPACE_NAME !== "string") {
//               throw new Error(
//                 "DIGITAL_OCEAN_SPACE_NAME environment variable is not set or is not a string",
//               );
//             }
//             // Upload PDF to DigitalOcean Spaces
//             const uploadResult =
//               await new Promise<AWS.S3.ManagedUpload.SendData>(
//                 (resolve, reject) => {
//                   s3.upload(
//                     {
//                       Bucket: process.env.DIGITAL_OCEAN_SPACE_NAME as string,
//                       Key: `pdfs/${year}/${pdfLink.split("/").pop() || "default.pdf"}`,
//                       Body: pdfResponse.data,
//                       ACL: "public-read",
//                       ContentType: "application/pdf",
//                     },
//                     (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
//                       if (err) reject(err);
//                       else resolve(data);
//                     },
//                   );
//                 },
//               );

//             const pdfUrl = uploadResult.Location;

//             let formattedDate = null;
//             if (caseInfo.dateOfDelivery) {
//               const parsedDate = moment(caseInfo.dateOfDelivery, "DD.MM.YYYY");
//               if (parsedDate.isValid()) {
//                 formattedDate = parsedDate.format("YYYY-MM-DD");
//               } else {
//                 console.warn(
//                   `Invalid date: ${caseInfo.dateOfDelivery} for case ${caseInfo.caseNumber}`,
//                 );
//               }
//             }

//             // Save data to MySQL database
//             await pool.execute(
//               "INSERT INTO cases (caseNumber, caseTitle, dateOfDelivery, presidingJudge, neutralCitation, year, pdfUrl, keywordsSummary, fileSize, jurisdiction, court, searchableText) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//               [
//                 caseInfo.caseNumber,
//                 caseInfo.caseTitle,
//                 formattedDate,
//                 caseInfo.presidingJudge,
//                 neutralCitation,
//                 year,
//                 pdfUrl,
//                 keywordsSummary,
//                 pdfResponse.data.byteLength,
//                 "Jamaica",
//                 "Supreme Court",
//                 extractedText,
//               ],
//             );

//             allDownloadedFiles[year] = allDownloadedFiles[year] || [];
//             allDownloadedFiles[year].push(pdfUrl);
//           }
//         } catch (error) {
//           console.error(
//             `Failed to process ${caseInfo.link}: ${error instanceof Error ? error.message : "Unknown error"}`,
//           );

//           // Save failed case to MySQL
//           await pool.execute(
//             "INSERT INTO failed_cases (caseNumber, caseTitle, year, link, errorMessage, retryCount, lastAttempt) VALUES (?, ?, ?, ?, ?, ?, ?)",
//             [
//               caseInfo.caseNumber,
//               caseInfo.caseTitle,
//               year,
//               caseInfo.link,
//               error instanceof Error ? error.message : String(error),
//               0,
//               new Date(),
//             ],
//           );
//         }
//       }
//     } catch (error) {
//       console.error(
//         `Failed to process year ${year}: ${(error as Error).message}`,
//       );
//     }
//   }

//   console.log(`Total number of cases across all years: ${totalCases}`);
//   return NextResponse.json({ downloadedFiles: allDownloadedFiles });
// }
