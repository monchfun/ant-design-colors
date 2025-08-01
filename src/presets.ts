// Ant Design 预设颜色
export const presetColors = {
  red: '#f5222d',
  volcano: '#fa541c',
  orange: '#fa8c16',
  gold: '#faad14',
  yellow: '#fadb14',
  lime: '#a0d911',
  green: '#52c41a',
  cyan: '#13c2c2',
  blue: '#1890ff',
  geekblue: '#2f54eb',
  purple: '#722ed1',
  magenta: '#eb2f96',
  grey: '#666666'
};

export const presetColorNames = Object.keys(presetColors) as Array<keyof typeof presetColors>;

export type PresetColorName = keyof typeof presetColors;