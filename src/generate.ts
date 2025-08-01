import type { ColorInput } from '@ant-design/fast-color';
import { FastColor } from '@ant-design/fast-color';

const hueStep = 2; // 色相阶梯
const saturationStep = 0.16; // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05; // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05; // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15; // 亮度阶梯，深色部分
const lightColorCount = 5; // 浅色数量，主色上
const darkColorCount = 4; // 深色数量，主色下

// 暗色主题颜色映射关系表
const darkColorMap = [
  { index: 7, amount: 15 },
  { index: 6, amount: 25 },
  { index: 5, amount: 30 },
  { index: 5, amount: 45 },
  { index: 5, amount: 65 },
  { index: 5, amount: 85 },
  { index: 4, amount: 90 },
  { index: 3, amount: 95 },
  { index: 2, amount: 97 },
  { index: 1, amount: 98 },
];

interface HsvObject {
  h: number;
  s: number;
  v: number;
}

function getHue(hsv: HsvObject, i: number, light?: boolean): number {
  let hue: number;
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}

function getSaturation(hsv: HsvObject, i: number, light?: boolean): number {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation: number;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  // 边界值修正
  if (saturation > 1) {
    saturation = 1;
  }
  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Math.round(saturation * 100) / 100;
}

function getValue(hsv: HsvObject, i: number, light?: boolean): number {
  let value: number;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  // Clamp value between 0 and 1
  value = Math.max(0, Math.min(1, value));
  return Math.round(value * 100) / 100;
}

interface Opts {
  theme?: 'dark' | 'default';
  backgroundColor?: string;
}

/**
 * 从暗色主题调色板反推原始颜色
 * @param darkColor 暗色主题中的颜色
 * @param darkIndex 该颜色在暗色调色板中的索引 (0-9)
 * @param backgroundColor 暗色主题背景色
 * @returns 反推出的原始seed颜色
 */
export function reverseDarkColor(darkColor: ColorInput, darkIndex: number, backgroundColor: string = '#141414'): string {
  const darkColorObj = new FastColor(darkColor);
  const bgColor = new FastColor(backgroundColor);
  
  // 获取对应的映射关系
  const mapping = darkColorMap[darkIndex];
  if (!mapping) {
    throw new Error('Invalid dark color index');
  }
  
  // 反向计算：从混合色中提取原始色
  // darkColor = backgroundColor.mix(originalColor, amount)
  // 需要解出 originalColor
  const amount = mapping.amount / 100;
  
  // 使用颜色混合的逆运算
  // mixed = bg * (1 - amount) + original * amount
  // original = (mixed - bg * (1 - amount)) / amount
  
  const darkRgb = darkColorObj.toRgb();
  const bgRgb = bgColor.toRgb();
  
  const originalR = Math.round((darkRgb.r - bgRgb.r * (1 - amount)) / amount);
  const originalG = Math.round((darkRgb.g - bgRgb.g * (1 - amount)) / amount);
  const originalB = Math.round((darkRgb.b - bgRgb.b * (1 - amount)) / amount);
  
  // 边界值处理
  const clampedR = Math.max(0, Math.min(255, originalR));
  const clampedG = Math.max(0, Math.min(255, originalG));
  const clampedB = Math.max(0, Math.min(255, originalB));
  
  const originalColor = new FastColor({ r: clampedR, g: clampedG, b: clampedB });
  
  // 这个颜色是浅色调色板中对应索引的颜色，需要反推到seed颜色
  const lightIndex = mapping.index;
  
  // 如果是主色（索引5），直接返回
  if (lightIndex === 5) {
    return originalColor.toHexString();
  }
  
  // 否则需要反推到主色
  return reverseLightColor(originalColor.toHexString(), lightIndex);
}

/**
 * 从浅色调色板中的某个颜色反推主色
 * @param lightColor 浅色调色板中的颜色
 * @param lightIndex 该颜色在浅色调色板中的索引 (0-9)
 * @returns 反推出的主色
 */
export function reverseLightColor(lightColor: ColorInput, lightIndex: number): string {
  const color = new FastColor(lightColor);
  const hsv = color.toHsv();
  
  // 如果就是主色（索引5），直接返回
  if (lightIndex === 5) {
    return color.toHexString();
  }
  
  let targetHsv = { ...hsv };
  
  if (lightIndex < 5) {
    // 浅色部分，需要反推到主色
    const steps = 5 - lightIndex;
    
    // 反向计算色相
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      targetHsv.h = hsv.h + hueStep * steps;
    } else {
      targetHsv.h = hsv.h - hueStep * steps;
    }
    
    // 处理色相边界
    if (targetHsv.h < 0) {
      targetHsv.h += 360;
    } else if (targetHsv.h >= 360) {
      targetHsv.h -= 360;
    }
    
    // 反向计算饱和度
    if (hsv.h === 0 && hsv.s === 0) {
      // 灰色不变
      targetHsv.s = hsv.s;
    } else {
      targetHsv.s = hsv.s + saturationStep * steps;
      targetHsv.s = Math.max(0.06, Math.min(1, targetHsv.s));
    }
    
    // 反向计算亮度
    targetHsv.v = hsv.v - brightnessStep1 * steps;
    targetHsv.v = Math.max(0, Math.min(1, targetHsv.v));
    
  } else {
    // 深色部分，需要反推到主色
    const steps = lightIndex - 5;
    
    // 反向计算色相
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      targetHsv.h = hsv.h - hueStep * steps;
    } else {
      targetHsv.h = hsv.h + hueStep * steps;
    }
    
    // 处理色相边界
    if (targetHsv.h < 0) {
      targetHsv.h += 360;
    } else if (targetHsv.h >= 360) {
      targetHsv.h -= 360;
    }
    
    // 反向计算饱和度
    if (hsv.h === 0 && hsv.s === 0) {
      // 灰色不变
      targetHsv.s = hsv.s;
    } else {
      if (steps === darkColorCount) {
        targetHsv.s = hsv.s - saturationStep;
      } else {
        targetHsv.s = hsv.s - saturationStep2 * steps;
      }
      targetHsv.s = Math.max(0.06, Math.min(1, targetHsv.s));
    }
    
    // 反向计算亮度
    targetHsv.v = hsv.v + brightnessStep2 * steps;
    targetHsv.v = Math.max(0, Math.min(1, targetHsv.v));
  }
  
  const targetColor = new FastColor({
    h: Math.round(targetHsv.h),
    s: Math.round(targetHsv.s * 100) / 100,
    v: Math.round(targetHsv.v * 100) / 100,
  });
  
  return targetColor.toHexString();
}

export default function generate(color: ColorInput, opts: Opts = {}): string[] {
  const patterns: FastColor[] = [];
  const pColor = new FastColor(color);
  const hsv = pColor.toHsv();
  for (let i = lightColorCount; i > 0; i -= 1) {
    const c = new FastColor({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true),
    });
    patterns.push(c);
  }
  patterns.push(pColor);
  for (let i = 1; i <= darkColorCount; i += 1) {
    const c = new FastColor({
      h: getHue(hsv, i),
      s: getSaturation(hsv, i),
      v: getValue(hsv, i),
    });
    patterns.push(c);
  }

  // dark theme patterns
  if (opts.theme === 'dark') {
    return darkColorMap.map(({ index, amount }) =>
      new FastColor(opts.backgroundColor || '#141414').mix(patterns[index], amount).toHexString(),
    );
  }

  return patterns.map((c) => c.toHexString());
}
