// Common chart configurations for Recharts

export const lineChartOptions = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  lineStyle: {
    stroke: '#203a8f', // primary color
    strokeWidth: 2,
  },
  predictedLineStyle: {
    stroke: '#00a86b', // secondary color
    strokeWidth: 2,
    strokeDasharray: '5 5',
  },
  xAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  yAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  tooltipStyle: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    backgroundColor: 'white',
  },
  legendStyle: {
    fontSize: 12,
    iconSize: 10,
    iconType: 'circle',
  },
  gridStyle: {
    stroke: '#f0f0f0',
    strokeDasharray: '3 3',
  },
  dotStyle: {
    r: 0, // Hide dots by default
    strokeWidth: 1,
  },
  activeDotStyle: {
    r: 6,
    stroke: 'white',
    strokeWidth: 2,
    fill: '#203a8f',
  },
};

export const barChartOptions = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  barStyle: {
    fill: '#00a86b', // secondary color
    radius: [4, 4, 0, 0],
    barSize: 35,
  },
  xAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  yAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  tooltipStyle: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    backgroundColor: 'white',
  },
  gridStyle: {
    stroke: '#f0f0f0',
    strokeDasharray: '3 3',
  },
};

export const areaChartOptions = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  areaStyle: {
    fill: 'url(#colorGradient)',
    stroke: '#203a8f',
    fillOpacity: 0.2,
  },
  xAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  yAxisStyle: {
    fontSize: 12,
    stroke: '#e0e0e0',
  },
  tooltipStyle: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    backgroundColor: 'white',
  },
  gridStyle: {
    stroke: '#f0f0f0',
    strokeDasharray: '3 3',
  },
  gradientColors: {
    start: '#203a8f',
    end: '#00a86b',
  },
};

// Format values for tooltip
export const formatPrice = (value) => {
  return `₹${value}`;
};

// Format percentage change
export const formatPercentage = (value) => {
  return value >= 0 ? `+${value}%` : `${value}%`;
};

// Determine color based on value (for indicators)
export const getChangeColor = (value) => {
  return value >= 0 ? '#00a86b' : '#ef4444';
}; 