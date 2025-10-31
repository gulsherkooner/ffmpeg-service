const fetch = require("node-fetch");
const logger = require("../config/logger");

class HetznerService {
  async uploadBuffer(buffer, pathLower) {
    try {
      logger.info(`Uploading ${pathLower} to Hetzner...`);

      const uploadUrlResponse = await fetch(
        `http://auth-service:3002/URLs/upload-url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathLower,
            fileType: "application/octet-stream",
            expireIn: 600,
          }),
        }
      );

      if (!uploadUrlResponse.ok) {
        throw new Error(
          `Failed to get upload URL: ${uploadUrlResponse.statusText}`
        );
      }

      const { uploadUrl, publicUrl } = await uploadUrlResponse.json();
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: buffer,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      logger.info(`Upload successful for ${pathLower}`);

      return pathLower.includes("public") ? publicUrl : pathLower;
    } catch (error) {
      logger.error(`Hetzner upload error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new HetznerService();
