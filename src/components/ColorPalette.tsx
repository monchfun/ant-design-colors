import React from 'react';
import { Copy, Check, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { reverseDarkColor, reverseLightColor } from '../generate';
import ColorInput from './ColorInput';

interface ColorPaletteProps {
  colors: string[];
  title?: string;
  className?: string;
  isDarkTheme?: boolean;
  onReverseColor?: (seedColor: string) => void;
}

/**
 * 调色板展示组件
 * 显示10色梯度调色板，支持颜色值复制功能
 */
export default function ColorPalette({ colors, title, className = '', isDarkTheme = false, onReverseColor }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingColor, setEditingColor] = useState<string>('');

  /**
   * 复制颜色值到剪贴板
   */
  const copyToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      toast.success(`已复制 ${color}`);
      
      // 2秒后重置复制状态
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  /**
   * 打开颜色编辑器（仅用于暗色主题的主色编辑）
   */
  const openColorEditor = (color: string, index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingIndex(index);
    setEditingColor(color);
  };

  /**
   * 打开主色编辑器（专门用于暗色主题第6个颜色）
   */
  const openPrimaryColorEditor = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isDarkTheme && colors[5]) {
      setEditingIndex(5); // 第6个颜色的索引是5
      setEditingColor(colors[5]);
    }
  };

  /**
   * 关闭颜色编辑器
   */
  const closeColorEditor = () => {
    setEditingIndex(null);
    setEditingColor('');
  };

  /**
   * 处理颜色修改并反推原始颜色
   */
  const handleColorChange = (newColor: string) => {
    setEditingColor(newColor);
  };

  /**
   * 确认颜色修改
   */
  const confirmColorChange = () => {
    if (editingIndex === null || !onReverseColor) return;
    
    try {
      let seedColor: string;
      
      if (isDarkTheme) {
        // 从暗色主题反推
        seedColor = reverseDarkColor(editingColor, editingIndex);
      } else {
        // 从浅色主题反推
        seedColor = reverseLightColor(editingColor, editingIndex);
      }
      
      onReverseColor(seedColor);
      toast.success(`已更新颜色并反推出原始颜色: ${seedColor}`);
      closeColorEditor();
    } catch (err) {
      toast.error('反推颜色失败，请检查颜色值');
      console.error('Reverse color error:', err);
    }
  };

  /**
   * 复制整个调色板
   */
  const copyAllColors = async () => {
    try {
      const colorString = colors.join(', ');
      await navigator.clipboard.writeText(colorString);
      toast.success('已复制所有颜色值');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  /**
   * 获取文字颜色（根据背景色亮度）
   */
  const getTextColor = (backgroundColor: string): string => {
    // 移除#号
    const hex = backgroundColor.replace('#', '');
    
    // 转换为RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  if (!colors || colors.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 dark:text-gray-400 ${className}`}>
        <p>请输入颜色值生成调色板</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 标题和复制所有按钮 */}
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={copyAllColors}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <Copy className="w-4 h-4" />
            复制全部
          </button>
        </div>
      )}
      
      {/* 颜色块网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {colors.map((color, index) => {
          const textColor = getTextColor(color);
          const isCopied = copiedIndex === index;
          
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: color }}
            >
              {/* 颜色块内容 */}
              <div className="aspect-square flex flex-col items-center justify-center p-2 min-h-[80px]">
                {/* 索引号 */}
                <span 
                  className="text-xs font-medium mb-1"
                  style={{ color: textColor }}
                >
                  {index + 1}
                </span>
                
                {/* 颜色值 */}
                <span 
                  className="text-xs font-mono text-center leading-tight"
                  style={{ color: textColor }}
                >
                  {color.toUpperCase()}
                </span>
              </div>
              
              {/* 操作按钮覆盖层 */}
              <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${
                isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} style={{ backgroundColor: `${color}E6` }}>
                {isCopied ? (
                  <Check className="w-6 h-6" style={{ color: textColor }} />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(color, index);
                    }}
                    className="p-1 rounded hover:bg-black hover:bg-opacity-20 transition-colors"
                    title="复制颜色值"
                  >
                    <Copy className="w-4 h-4" style={{ color: textColor }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 主色标识 */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <span className="inline-flex items-center gap-2">
          第6个颜色 ({colors[5]?.toUpperCase()}) 为主色
          {isDarkTheme ? (
            <div 
              className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              style={{ backgroundColor: colors[5] }}
              onClick={openPrimaryColorEditor}
              title="点击编辑暗色主色"
            />
          ) : (
            <div 
              className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: colors[5] }}
            />
          )}
        </span>
      </div>

      {/* 颜色编辑器模态框 */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeColorEditor}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* 模态框头部 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                编辑第{editingIndex + 1}个颜色
              </h3>
              <button
                onClick={closeColorEditor}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* 颜色输入组件 */}
            <ColorInput
              value={editingColor}
              onChange={handleColorChange}
              className="mb-6"
            />

            {/* 操作按钮 */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeColorEditor}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmColorChange}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}