/**
 * Converts a Google Drive sharing/page URL to a direct image rendering URL.
 * If the URL is not a Google Drive link, it returns the URL unchanged.
 * 
 * Supported Formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/edit
 * 
 * Target Format:
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function getDirectImageLink(url) {
  if (!url) return "";
  
  const trimmed = url.trim();

  // If it's a data URL or blob, return as-is
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    // Attempt format: /file/d/FILE_ID/...
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileDMatch[1]}`;
    }
    
    // Attempt format: ?id=FILE_ID or &id=FILE_ID
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
    }
  }

  return trimmed;
}

/**
 * Resizes and compresses an image client-side, returning a base64 encoded JPEG Data URL.
 * Max width and height default to 300px, which is optimal for QR codes and keeps file size under 15KB.
 */
export function resizeAndCompressImage(file, maxWidth = 300, maxHeight = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with quality 0.7 for optimal compression
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
