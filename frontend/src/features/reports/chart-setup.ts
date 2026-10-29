import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

Chart.defaults.font.family = "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
Chart.defaults.font.size = 12
Chart.defaults.animation = { duration: 400, easing: 'easeOutQuart' }
