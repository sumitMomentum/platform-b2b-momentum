import { brand, orange, red, green, gray } from "./themePrimitives";

const chartColorTheme = [
  brand[500], // Main brand color - hsl(93, 50%, 49%)
  orange[400], // Orange - for contrast
  brand[700], // Darker brand - hsl(93, 50%, 30%)
  red[400], // Red - for emphasis
  brand[300], // Lighter brand - hsl(93, 50%, 70%)
  green[400], // Green - for variety
  gray[500], // Gray - for neutral
  orange[600], // Darker orange - for depth
];

const sevierityChartsPalette = {
  primary: brand[500],
  error: red[400],
  warning: orange[400],
  info: gray[300],
  success: green[400],
};

export { chartColorTheme, sevierityChartsPalette };
