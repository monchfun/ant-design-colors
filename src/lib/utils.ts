import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 将HSL颜色格式转换为HEX格式
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-100)
 * @param l 亮度 (0-100)
 * @returns HEX颜色字符串
 */
export function hslToHex(h: number, s: number, l: number): string {
  // 将HSL转换为RGB
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  
  let r = 0, g = 0, blue = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; blue = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; blue = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; blue = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; blue = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; blue = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; blue = x;
  }
  
  // 转换为0-255范围并转为HEX
  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((blue + m) * 255).toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}

/**
 * 将HEX颜色格式转换为HSL格式
 * @param hex HEX颜色字符串，格式如 "#1677FF"
 * @returns HSL值对象或null
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  // 移除#号并验证格式
  const cleanHex = hex.replace('#', '');
  if (!/^[A-Fa-f0-9]{6}$/.test(cleanHex) && !/^[A-Fa-f0-9]{3}$/.test(cleanHex)) {
    return null;
  }
  
  // 处理3位HEX格式
  let r: number, g: number, b: number;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substr(0, 2), 16);
    g = parseInt(cleanHex.substr(2, 2), 16);
    b = parseInt(cleanHex.substr(4, 2), 16);
  }
  
  // 转换为0-1范围
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  // 计算亮度
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (diff !== 0) {
    // 计算饱和度
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    // 计算色相
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 解析HSL颜色字符串
 * @param hslString HSL颜色字符串，格式如 "hsl(210, 91%, 50%)"
 * @returns 解析后的HSL值对象或null
 */
export function parseHsl(hslString: string): { h: number; s: number; l: number } | null {
  const match = hslString.match(/^hsl\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/);
  if (!match) return null;
  
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  
  // 验证范围
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    return null;
  }
  
  return { h, s, l };
}

/**
 * 将RGB颜色格式转换为HEX格式
 * @param r 红色 (0-255)
 * @param g 绿色 (0-255)
 * @param b 蓝色 (0-255)
 * @returns HEX颜色字符串
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
}

/**
 * 将HEX颜色格式转换为RGB格式
 * @param hex HEX颜色字符串，格式如 "#1677FF"
 * @returns RGB值对象或null
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (!/^[A-Fa-f0-9]{6}$/.test(cleanHex) && !/^[A-Fa-f0-9]{3}$/.test(cleanHex)) {
    return null;
  }
  
  let r: number, g: number, b: number;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substr(0, 2), 16);
    g = parseInt(cleanHex.substr(2, 2), 16);
    b = parseInt(cleanHex.substr(4, 2), 16);
  }
  
  return { r, g, b };
}

/**
 * 将RGB颜色格式转换为HSL格式
 * @param r 红色 (0-255)
 * @param g 绿色 (0-255)
 * @param b 蓝色 (0-255)
 * @returns HSL值对象
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将HSL颜色格式转换为RGB格式
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-100)
 * @param l 亮度 (0-100)
 * @returns RGB值对象
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  
  let r = 0, g = 0, blue = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; blue = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; blue = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; blue = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; blue = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; blue = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; blue = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((blue + m) * 255)
  };
}
