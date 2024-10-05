function formatPdfUrl(cdnEndpoint, uploadKey, bucketName) {
  // Remove the bucket name from the start of the key if present
  const fileKey = uploadKey.startsWith(bucketName)
    ? uploadKey.slice(bucketName.length).replace(/^\//, "")
    : uploadKey;

  // Ensure the CDN endpoint doesn't end with a slash
  const cleanedCdnEndpoint = cdnEndpoint.replace(/\/$/, "");

  // Combine the CDN endpoint and file key, ensuring no double slashes
  const pdfUrl = `${cleanedCdnEndpoint}/${fileKey}`.replace(
    /([^:]\/)\/+/g,
    "$1"
  );

  return pdfUrl;
}
