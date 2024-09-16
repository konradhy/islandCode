function formatPdfUrl(cdnEndpoint, uploadKey, bucketName) {
  // Remove the bucket name from the start of the key if present
  const fileKey = uploadKey.startsWith(bucketName) 
    ? uploadKey.slice(bucketName.length).replace(/^\//, '')
    : uploadKey;

  // Ensure the CDN endpoint doesn't end with a slash
  const cleanedCdnEndpoint = cdnEndpoint.replace(/\/$/, '');

  // Combine the CDN endpoint and file key, ensuring no double slashes
  const pdfUrl = `${cleanedCdnEndpoint}/${fileKey}`.replace(/([^:]\/)\/+/g, "$1");

  return pdfUrl;
}

console.log(formatPdfUrl("nyc3.cdn.digitaloceanspaces.com", "nyc3.cdn.digitaloceanspaces.com/pdfs/2024/Adjudah%2C%20Silvera%20v%20Ministry%20of%20Justice%2C%20Delroy%20Chuck-Minister%20of%20Justice%20and%20Andrew%20Holness%20-%20Prime%20Minister%20of%20Jamaica.pdf", "island-code"));
