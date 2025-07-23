import React from 'react';
import { Toaster } from 'sonner';
import ColorInput from '@/components/ColorInput';
import BackgroundColorInput from '@/components/BackgroundColorInput';
import ColorPalette from '@/components/ColorPalette';
import PresetColors from '@/components/PresetColors';
import ThemeToggle from '@/components/ThemeToggle';
import ExportMenu from '@/components/ExportMenu';
import { useColorGeneration } from '@/hooks/useColorGeneration';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Github, Heart } from 'lucide-react';

/**
 * 主页面组件
 * 整合所有功能模块，提供完整的颜色生成器界面
 */
export default function Home() {
  const { theme, isDark } = useTheme();
  const {
    currentColor,
    backgroundColor,
    lightColors,
    darkColors,
    setColor,
    setBackgroundColor,
    isValidColor,
    isValidBackgroundColor
  } = useColorGeneration({ initialColor: '#1677FF' });

  // 不再根据主题选择，而是同时显示两种主题的调色板

  /**
   * 处理反向调色功能
   * 从调色板中的颜色反推原始seed颜色
   */
  const handleReverseColor = (seedColor: string) => {
    setColor(seedColor);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Toast 通知 */}
      <Toaster 
        position="top-right" 
        theme={theme}
        richColors
      />
      
      {/* 头部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Ant Design 颜色生成器
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  基于官方算法的10色梯度调色板生成工具
                </p>
              </div>
            </div>
            
            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {/* GitHub 链接 */}
              <a
                href="https://github.com/ant-design/ant-design-colors"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                title="查看 GitHub 仓库"
              >
                <Github className="w-5 h-5" />
              </a>
              
              {/* 主题切换 */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 颜色输入区域 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  颜色输入
                </h2>
                <div className="flex items-center gap-4">
                  <ExportMenu 
                    colors={lightColors} 
                    colorName="primary"
                  />
                </div>
              </div>
              
              <ColorInput
                value={currentColor}
                onChange={setColor}
                className="max-w-2xl"
              />
              
              {/* 背景色设置 */}
              <BackgroundColorInput
                value={backgroundColor}
                onChange={setBackgroundColor}
                isValid={isValidBackgroundColor}
                className="max-w-2xl"
              />
            </div>
          </section>

          {/* 调色板展示区域 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-8">
              {/* 浅色主题调色板 */}
              <ColorPalette
                colors={lightColors}
                title="浅色主题调色板"
                isDarkTheme={false}
                onReverseColor={handleReverseColor}
              />
              
              {/* 暗色主题调色板 */}
              <ColorPalette
                colors={darkColors}
                title="暗色主题调色板"
                isDarkTheme={true}
                onReverseColor={handleReverseColor}
              />
            </div>
          </section>

          {/* 预设颜色选择区域 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <PresetColors
              onColorSelect={setColor}
              selectedColor={currentColor}
            />
          </section>

          {/* 使用说明 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              使用说明
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">功能特性</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    支持多种颜色格式输入 (HEX, RGB, HSL)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    实时生成10色梯度调色板
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    同时展示浅色和暗色主题调色板
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    一键复制颜色值到剪贴板
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    反向调色：从调色板颜色反推原始seed颜色
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    自定义暗色主题背景色，生成更和谐的调色板
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">导出格式</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    CSS 变量格式
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    JSON 数据格式
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    Tailwind CSS 配置
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    SCSS 变量格式
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2">
              基于 
              <a 
                href="https://github.com/ant-design/ant-design-colors" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                @ant-design/colors
              </a>
              构建，用
              <Heart className="w-4 h-4 text-red-500 mx-1" />
              制作
            </p>
            <p className="mt-2">
              © 2024 Ant Design Colors Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}