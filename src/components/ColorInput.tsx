import React, { useState, useEffect } from 'react';
import { hslToHex, hexToHsl, rgbToHex, hexToRgb, rgbToHsl, hslToRgb } from '../lib/utils';

type ColorMode = 'hsl' | 'rgb' | 'hex';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * 多格式颜色输入组件
 * 支持HSL/RGB/HEX三种格式切换，每个数值都可以精确输入和滑块调节
 */
export default function ColorInput({ value, onChange, className = '', placeholder }: ColorInputProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('hsl');
  const [hsl, setHsl] = useState({ h: 210, s: 91, l: 50 });
  const [rgb, setRgb] = useState({ r: 22, g: 119, b: 255 });
  const [hexValue, setHexValue] = useState(value);

  /**
   * 从HSL值更新所有颜色格式
   */
  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    const hexColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    const rgbColor = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setHsl(newHsl);
    setRgb(rgbColor);
    setHexValue(hexColor);
    onChange(hexColor);
  };

  /**
   * 从RGB值更新所有颜色格式
   */
  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hslColor = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setRgb(newRgb);
    setHsl(hslColor);
    setHexValue(hexColor);
    onChange(hexColor);
  };

  /**
   * 从HEX值更新所有颜色格式
   */
  const updateFromHex = (newHex: string) => {
    const rgbColor = hexToRgb(newHex);
    const hslColor = hexToHsl(newHex);
    if (rgbColor && hslColor) {
      setHexValue(newHex);
      setRgb(rgbColor);
      setHsl(hslColor);
      onChange(newHex);
    }
  };

  /**
   * 处理HSL值变化
   */
  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [component]: value };
    updateFromHsl(newHsl);
  };

  /**
   * 处理RGB值变化
   */
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [component]: value };
    updateFromRgb(newRgb);
  };

  /**
   * 处理HEX输入框变化
   */
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    
    // 验证HEX格式
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(newHex)) {
      updateFromHex(newHex);
    }
  };

  // 同步外部value变化
  useEffect(() => {
    if (value !== hexValue) {
      updateFromHex(value);
    }
  }, [value, hexValue]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 颜色预览和格式切换 */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: hexValue }}
          title="颜色预览"
        />
        
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            {(['hsl', 'rgb', 'hex'] as ColorMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  colorMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 颜色控制区域 */}
      {colorMode === 'hsl' && (
        <div className="space-y-4">
          {/* 色相 (Hue) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                色相 (H)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">°</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`
              }}
            />
          </div>

          {/* 饱和度 (Saturation) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                饱和度 (S)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`
              }}
            />
          </div>

          {/* 亮度 (Lightness) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                亮度 (L)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`
              }}
            />
          </div>
        </div>
      )}

      {colorMode === 'rgb' && (
        <div className="space-y-4">
          {/* 红色 (Red) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                红色 (R)
              </label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`
              }}
            />
          </div>

          {/* 绿色 (Green) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                绿色 (G)
              </label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`
              }}
            />
          </div>

          {/* 蓝色 (Blue) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                蓝色 (B)
              </label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`
              }}
            />
          </div>
        </div>
      )}

      {colorMode === 'hex' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            HEX 颜色值
          </label>
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            placeholder={placeholder || "#1677FF"}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 transition-colors duration-200"
          />
        </div>
      )}

      {/* 颜色值显示 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          HSL: <span className="font-mono text-gray-900 dark:text-gray-100">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          RGB: <span className="font-mono text-gray-900 dark:text-gray-100">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          HEX: <span className="font-mono text-gray-900 dark:text-gray-100">
            {hexValue}
          </span>
        </div>
      </div>
    </div>
  );
}