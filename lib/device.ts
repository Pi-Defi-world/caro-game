export function getDeviceInfo(): string {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  
    if (/android/i.test(ua)) return "Android";
    if (/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)) return "iOS";
    if (/Win/i.test(ua)) return "Windows";
    if (/Mac/i.test(ua)) return "MacOS";
    if (/Linux/i.test(ua)) return "Linux";
  
    return "Unknown";
  }
  