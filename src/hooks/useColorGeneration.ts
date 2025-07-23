import { useState, useEffect, useMemo } from 'react';
import { generate } from '@ant-design/colors';

interface UseColorGenerationProps {
  initialColor?: string;
  theme?: 'light' | 'dark';
  initialBackgroundColor?: string;
}

interface UseColorGenerationReturn {
  currentColor: string;
  backgroundColor: string;
  lightColors: string[];
  darkColors: string[];
  setColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  isValidColor: boolean;
  isValidBackgroundColor: boolean;
}

/**
 * 颜色生成Hook
 * 封装颜色生成逻辑，支持浅色和深色主题
 */
export function useColorGeneration({ 
  initialColor = '#1677FF', 
  theme = 'light',
  initialBackgroundColor = '#141414'
}: UseColorGenerationProps = {}): UseColorGenerationReturn {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [backgroundColor, setBackgroundColorState] = useState(initialBackgroundColor);
  const [isValidColor, setIsValidColor] = useState(true);
  const [isValidBackgroundColor, setIsValidBackgroundColor] = useState(true);

  /**
   * 验证颜色格式是否有效
   */
  const validateColor = (color: string): boolean => {
    try {
      // 创建一个临时元素来验证颜色
      const tempElement = document.createElement('div');
      tempElement.style.color = color;
      
      // 如果颜色无效，浏览器会忽略设置
      return tempElement.style.color !== '';
    } catch {
      return false;
    }
  };

  /**
   * 生成浅色主题调色板
   */
  const lightColors = useMemo(() => {
    if (!isValidColor) return [];
    
    try {
      return generate(currentColor, { theme: 'default' });
    } catch (error) {
      console.error('生成浅色调色板失败:', error);
      return [];
    }
  }, [currentColor, isValidColor]);

  /**
   * 生成深色主题调色板
   */
  const darkColors = useMemo(() => {
    if (!isValidColor || !isValidBackgroundColor) return [];
    
    try {
      return generate(currentColor, { 
        theme: 'dark',
        backgroundColor: backgroundColor
      });
    } catch (error) {
      console.error('生成深色调色板失败:', error);
      return [];
    }
  }, [currentColor, backgroundColor, isValidColor, isValidBackgroundColor]);

  /**
   * 设置新颜色
   */
  const setColor = (color: string) => {
    const valid = validateColor(color);
    setIsValidColor(valid);
    
    if (valid) {
      setCurrentColor(color);
    }
  };

  /**
   * 设置新背景色
   */
  const setBackgroundColor = (color: string) => {
    const valid = validateColor(color);
    setIsValidBackgroundColor(valid);
    
    if (valid) {
      setBackgroundColorState(color);
    }
  };

  // 初始化时验证默认颜色和背景色
  useEffect(() => {
    const validColor = validateColor(initialColor);
    const validBgColor = validateColor(initialBackgroundColor);
    
    setIsValidColor(validColor);
    setIsValidBackgroundColor(validBgColor);
    
    if (validColor) {
      setCurrentColor(initialColor);
    }
    if (validBgColor) {
      setBackgroundColorState(initialBackgroundColor);
    }
  }, [initialColor, initialBackgroundColor]);

  return {
    currentColor,
    backgroundColor,
    lightColors,
    darkColors,
    setColor,
    setBackgroundColor,
    isValidColor,
    isValidBackgroundColor
  };
}