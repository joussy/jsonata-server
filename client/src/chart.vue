<template>
    <div class="bg-body h-100">
        Chart.js
        <canvas ref="chart"></canvas>
    </div>
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(BarController, BarElement,
    CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineController, LineElement);

export default defineComponent({
    components: {},
    data() {
        return {
            chartInstance: null as Chart | null,
        };
    },
    props: {
        chartData: {
            type: Object,
            required: true
        },
        isLight: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    mounted() {
        this.renderChart();
    },

    watch: {
        chartData: {
            handler() {
                this.updateChart();
            },
            deep: true
        },
        isLight: {
            handler() {
                this.updateChartTheme();
            }
        }
    },

    methods: {
        getChartColors() {
            if (this.isLight) {
                return {
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    gridColor: 'rgba(0,0,0,0.1)',
                    fontColor: '#222'
                };
            } else {
                return {
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    gridColor: 'rgba(255,255,255,0.1)',
                    fontColor: '#fff'
                };
            }
        },
        renderChart() {
            const canvas = this.$refs.chart as HTMLCanvasElement;
            if (!canvas) return;
            if (this.chartInstance) return;
            const colors = this.getChartColors();
            this.chartInstance = shallowRef(new Chart(canvas, {
                type: 'line',
                data: {
                    datasets: [{
                        data: [],
                        borderWidth: 2,
                        borderColor: colors.borderColor,
                        backgroundColor: colors.backgroundColor,
                        pointBackgroundColor: colors.borderColor,
                        pointBorderColor: colors.borderColor,
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: colors.fontColor
                            }
                        },
                        title: {
                            color: colors.fontColor
                        },
                        tooltip: {
                            backgroundColor: this.isLight ? '#fff' : '#222',
                            titleColor: colors.fontColor,
                            bodyColor: colors.fontColor,
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: colors.gridColor
                            },
                            ticks: {
                                color: colors.fontColor
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: colors.gridColor
                            },
                            ticks: {
                                color: colors.fontColor
                            }
                        }
                    }
                }
            }));
        },
        updateChart() {
            if (!this.chartInstance) return;
            this.chartInstance.data.datasets[0].data = this.chartData;
            this.chartInstance.update();
        },
        updateChartTheme() {
            if (!this.chartInstance) return;
            const colors = this.getChartColors();
            const chart = this.chartInstance;
            // Update dataset colors
            chart.data.datasets[0].borderColor = colors.borderColor;
            chart.data.datasets[0].backgroundColor = colors.backgroundColor;
            chart.data.datasets[0].pointBackgroundColor = colors.borderColor;
            chart.data.datasets[0].pointBorderColor = colors.borderColor;
            // Update options
            chart.options.plugins = chart.options.plugins || {};
            chart.options.plugins.legend = chart.options.plugins.legend || {};
            chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
            chart.options.plugins.legend.labels.color = colors.fontColor;
            chart.options.plugins.title = chart.options.plugins.title || {};
            chart.options.plugins.title.color = colors.fontColor;
            chart.options.plugins.tooltip = chart.options.plugins.tooltip || {};
            chart.options.plugins.tooltip.backgroundColor = this.isLight ? '#fff' : '#222';
            chart.options.plugins.tooltip.titleColor = colors.fontColor;
            chart.options.plugins.tooltip.bodyColor = colors.fontColor;
            chart.options.scales = chart.options.scales || {};
            if (chart.options.scales.x) {
                chart.options.scales.x.grid = chart.options.scales.x.grid || {};
                chart.options.scales.x.grid.color = colors.gridColor;
                chart.options.scales.x.ticks = chart.options.scales.x.ticks || {};
                chart.options.scales.x.ticks.color = colors.fontColor;
            }
            if (chart.options.scales.y) {
                chart.options.scales.y.grid = chart.options.scales.y.grid || {};
                chart.options.scales.y.grid.color = colors.gridColor;
                chart.options.scales.y.ticks = chart.options.scales.y.ticks || {};
                chart.options.scales.y.ticks.color = colors.fontColor;
            }
            chart.update();
        }
    }
});
</script>