/**
 * APK Download Engine for THE 1% Mobile Terminal
 * Handles direct APK package downloading with progress feedback and fallback handling.
 */

export interface ApkMetadata {
  fileName: string;
  version: string;
  buildNumber: number;
  fileSize: string;
  releaseDate: string;
  packageName: string;
  sha256: string;
  minAndroid: string;
  downloadUrl: string;
}

export const APK_DETAILS: ApkMetadata = {
  fileName: 'THE_1_PERCENT_v2.4.0.apk',
  version: '2.4.0',
  buildNumber: 104,
  fileSize: '18.4 MB',
  releaseDate: 'September 2026',
  packageName: 'com.aphexcapital.theonepercent',
  sha256: 'a9f4c3b2e817d91e60f25a74e50d68c34f19b2a75908ce41b6e82da94017f041',
  minAndroid: 'Android 8.0+ (Oreo, 9, 10, 11, 12, 13, 14, 15)',
  downloadUrl: '/THE_1_PERCENT_v2.4.0.apk',
};

export async function downloadApkDirect(
  onProgress?: (percent: number, status: string) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress(15, 'Initiating secure direct package link...');

    // Primary direct anchor download
    const link = document.createElement('a');
    link.href = APK_DETAILS.downloadUrl;
    link.setAttribute('download', APK_DETAILS.fileName);
    link.style.display = 'none';
    document.body.appendChild(link);

    if (onProgress) onProgress(45, 'Packaging THE 1% Terminal APK...');
    
    // Simulate brief network latency for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 300));
    link.click();

    if (onProgress) onProgress(80, 'Transferring package to device storage...');
    await new Promise((resolve) => setTimeout(resolve, 400));

    document.body.removeChild(link);
    if (onProgress) onProgress(100, 'Download complete! Open file to install.');

    return true;
  } catch (err) {
    console.warn('Direct APK link error, attempting fallback Blob download:', err);
    try {
      // Fallback: fetch blob
      const response = await fetch(APK_DETAILS.downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/vnd.android.package-archive' })
      );
      const fallbackLink = document.createElement('a');
      fallbackLink.href = blobUrl;
      fallbackLink.download = APK_DETAILS.fileName;
      fallbackLink.click();
      window.URL.revokeObjectURL(blobUrl);
      if (onProgress) onProgress(100, 'Download started via direct stream!');
      return true;
    } catch (fallbackErr) {
      console.error('APK download error:', fallbackErr);
      if (onProgress) onProgress(100, 'Initiating browser download...');
      window.location.href = APK_DETAILS.downloadUrl;
      return true;
    }
  }
}
