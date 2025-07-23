import React, { useState } from 'react';
import { Download, ChevronDown, FileText, Code, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface ExportMenuProps {
  colors: string[];
  colorName?: string;
  className?: string;
}

/**
 * 导出菜单组件
 * 支持将调色板导出为CSS变量、JSON格式、设计工具格式等
 */
export default function ExportMenu({ colors, colorName = 'primary', className = '' }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * 生成CSS变量格式
   */
  const generateCSSVariables = (): string => {
    const cssVars = colors.map((color, index) => 
      `  --${colorName}-${index + 1}: ${color};`
    ).join('\n');
    
    return `:root {\n${cssVars}\n}`;
  };

  /**
   * 生成JSON格式
   */
  const generateJSON = (): string => {
    const colorObj = colors.reduce((acc, color, index) => {
      acc[`${colorName}-${index + 1}`] = color;
      return acc;
    }, {} as Record<string, string>);
    
    return JSON.stringify({
      name: colorName,
      colors: colorObj,
      primary: colors[5] // 第6个颜色为主色
    }, null, 2);
  };

  /**
   * 生成Tailwind配置格式
   */
  const generateTailwindConfig = (): string => {
    const tailwindColors = colors.reduce((acc, color, index) => {
      const key = index === 0 ? '50' : 
                 index === 1 ? '100' :
                 index === 2 ? '200' :
                 index === 3 ? '300' :
                 index === 4 ? '400' :
                 index === 5 ? '500' :
                 index === 6 ? '600' :
                 index === 7 ? '700' :
                 index === 8 ? '800' : '900';
      acc[key] = color;
      return acc;
    }, {} as Record<string, string>);
    
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${colorName}: ${JSON.stringify(tailwindColors, null, 8).replace(/"/g, "'")},\n      }\n    }\n  }\n}`;
  };

  /**
   * 生成SCSS变量格式
   */
  const generateSCSSVariables = (): string => {
    const scssVars = colors.map((color, index) => 
      `$${colorName}-${index + 1}: ${color};`
    ).join('\n');
    
    return `// SCSS Variables\n${scssVars}`;
  };

  /**
   * 复制内容到剪贴板
   */
  const copyToClipboard = async (content: string, format: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`已复制 ${format} 格式`);
      setIsOpen(false);
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  /**
   * 下载文件
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`已下载 ${filename}`);
    setIsOpen(false);
  };

  const exportOptions = [
    {
      label: 'CSS 变量',
      icon: Code,
      action: () => copyToClipboard(generateCSSVariables(), 'CSS 变量'),
      download: () => downloadFile(generateCSSVariables(), `${colorName}-colors.css`, 'text/css')
    },
    {
      label: 'JSON 格式',
      icon: FileText,
      action: () => copyToClipboard(generateJSON(), 'JSON'),
      download: () => downloadFile(generateJSON(), `${colorName}-colors.json`, 'application/json')
    },
    {
      label: 'Tailwind 配置',
      icon: Palette,
      action: () => copyToClipboard(generateTailwindConfig(), 'Tailwind 配置'),
      download: () => downloadFile(generateTailwindConfig(), `tailwind-${colorName}.js`, 'text/javascript')
    },
    {
      label: 'SCSS 变量',
      icon: Code,
      action: () => copyToClipboard(generateSCSSVariables(), 'SCSS 变量'),
      download: () => downloadFile(generateSCSSVariables(), `${colorName}-colors.scss`, 'text/scss')
    }
  ];

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 导出按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <Download className="w-4 h-4" />
        导出
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 菜单内容 */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2">
              {exportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className="flex items-center">
                    {/* 复制按钮 */}
                    <button
                      onClick={option.action}
                      className="flex-1 flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </button>
                    
                    {/* 下载按钮 */}
                    <button
                      onClick={option.download}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      title="下载文件"
                    >
                      <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
            
            {/* 说明文字 */}
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                点击复制到剪贴板，或点击下载图标保存文件
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}