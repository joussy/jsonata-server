<template>
    <div class="bg-body h-100">
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
    Legend,
    TimeScale
} from 'chart.js';

import 'chartjs-adapter-date-fns';

Chart.register(BarController, BarElement,
    CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineController, LineElement, TimeScale);

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
                    fontColor: '#222',
                    tooltipBg: '#fff',
                };
            } else {
                return {
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    gridColor: 'rgba(255,255,255,0.1)',
                    fontColor: '#fff',
                    tooltipBg: '#222',
                };
            }
        },

        getChartOptions(colors) {
            return {
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
                        backgroundColor: colors.tooltipBg,
                        titleColor: colors.fontColor,
                        bodyColor: colors.fontColor,
                    }
                },
                scales: {
                    x: {
                        type: 'time',
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
            };
        },
        getDatasetColors(colors) {
            return {
                borderWidth: 2,
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
                pointBackgroundColor: colors.borderColor,
                pointBorderColor: colors.borderColor,
            };
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
                        ...this.getDatasetColors(colors)
                    }]
                },
                options: this.getChartOptions(colors)
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
            // Update dataset colors using the same function as initialization
            Object.assign(chart.data.datasets[0], this.getDatasetColors(colors));
            // Update options using the same function as initialization
            chart.options = {
                ...chart.options,
                ...this.getChartOptions(colors)
            };
            chart.update();
        }
    }
});
</script>