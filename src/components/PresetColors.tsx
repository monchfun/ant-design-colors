import React from 'react';

// Ant Design 预设颜色配置
const presetColors = [
  { name: 'red', color: '#F5222D', label: '红色' },
  { name: 'volcano', color: '#FA541C', label: '火山' },
  { name: 'orange', color: '#FA8C16', label: '橙色' },
  { name: 'gold', color: '#FAAD14', label: '金色' },
  { name: 'yellow', color: '#FADB14', label: '黄色' },
  { name: 'lime', color: '#A0D911', label: '青柠' },
  { name: 'green', color: '#52C41A', label: '绿色' },
  { name: 'cyan', color: '#13C2C2', label: '青色' },
  { name: 'blue', color: '#1677FF', label: '蓝色' },
  { name: 'geekblue', color: '#2F54EB', label: '极客蓝' },
  { name: 'purple', color: '#722ED1', label: '紫色' },
  { name: 'magenta', color: '#EB2F96', label: '洋红' },
  { name: 'grey', color: '#666666', label: '灰色' },
];

interface PresetColorsProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
  className?: string;
}

/**
 * 预设颜色选择组件
 * 展示Ant Design预设的13种颜色，支持快速选择
 */
export default function PresetColors({ onColorSelect, selectedColor, className = '' }: PresetColorsProps) {
  /**
   * 处理颜色选择
   */
  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  /**
   * 检查颜色是否被选中
   */
  const isSelected = (color: string): boolean => {
    return selectedColor?.toLowerCase() === color.toLowerCase();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          预设颜色
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          点击快速选择
        </span>
      </div>
      
      {/* 颜色网格 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-13 gap-3">
        {presetColors.map(({ name, color, label }) => {
          const selected = isSelected(color);
          
          return (
            <div
              key={name}
              className="group relative cursor-pointer flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => handleColorSelect(color)}
              title={`${label} (${color})`}
            >
              {/* 颜色圆形按钮 */}
              <div
                className={`w-10 h-10 rounded-full border-3 transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                  selected 
                    ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-110' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              >
                {/* 选中状态指示器 */}
                {selected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                  </div>
                )}
              </div>
              
              {/* 颜色名称 */}
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 block">
                  {label}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {color}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 说明文字 */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        这些是 Ant Design 官方推荐的品牌色彩，适用于不同的设计场景
      </div>
    </div>
  );
}

// 导出预设颜色数据，供其他组件使用
export { presetColors };