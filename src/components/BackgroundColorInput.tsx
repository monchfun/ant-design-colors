import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette } from 'lucide-react';
import ColorInput from './ColorInput';

interface BackgroundColorInputProps {
  value: string;
  onChange: (color: string) => void;
  isValid: boolean;
  className?: string;
}

/**
 * 背景色设置组件
 * 提供暗色主题背景色的设置功能
 */
export default function BackgroundColorInput({
  value,
  onChange,
  isValid,
  className = ''
}: BackgroundColorInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 折叠/展开按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-600 dark:bg-gray-500 rounded">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              暗色主题背景色设置
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              调整暗色主题的背景色以生成更和谐的调色板
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 当前背景色预览 */}
          <div 
            className="w-6 h-6 rounded border-2 border-white shadow-sm"
            style={{ backgroundColor: value }}
            title={`当前背景色: ${value}`}
          />
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* 展开的设置区域 */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              背景色
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              暗色主题调色板生成时会将颜色与此背景色混合，影响最终的色彩效果。默认值为 Ant Design 官方的暗色背景色 #141414。
            </p>
          </div>
          
          <ColorInput
            value={value}
            onChange={onChange}
            placeholder="输入背景色 (如: #141414)"
            className="max-w-md"
          />
          
          {!isValid && (
            <p className="text-sm text-red-500 dark:text-red-400">
              请输入有效的颜色值
            </p>
          )}
          
          {/* 预设背景色选项 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              常用背景色
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Ant Design 默认', color: '#141414' },
                { name: '纯黑', color: '#000000' },
                { name: '深灰', color: '#1a1a1a' },
                { name: '暖灰', color: '#1c1917' },
                { name: '冷灰', color: '#0f172a' },
                { name: '深蓝', color: '#0c1222' }
              ].map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => onChange(preset.color)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors duration-200 ${
                    value === preset.color
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  title={`${preset.name}: ${preset.color}`}
                >
                  <div 
                    className="w-3 h-3 rounded border border-gray-300 dark:border-gray-500"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 说明文字 */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• 背景色会影响暗色主题调色板的生成效果</p>
            <p>• 较深的背景色通常能产生更好的对比度</p>
            <p>• 建议使用接近实际应用背景的颜色</p>
          </div>
        </div>
      )}
    </div>
  );
}