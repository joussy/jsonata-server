<template>
        <div class="card mb-1">
            <div class="card-body row d-flex align-items-center">
                <div class="col-auto">
                    <label>
                        Input Format
                    </label>
                    <select v-model="inputFormat" class="form-select">
                        <option value="json" default>Json</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <div class="col-auto">
                    <label v-show="inputFormat == 'csv'">
                        Input Delimiter
                        <select class="form-select" v-model="csvInputDelimiter" :disabled="!inputFormat">
                            <option value=";">;</option>
                            <option value=",">,</option>
                        </select>
                    </label>
                </div>
                <div class="col-auto">
                    <label>
                        Output Format
                    </label>
                    <select v-model="outputFormat" class="form-select">
                        <option value="json">Json</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <div class="col-auto">
                    <label v-show="outputFormat == 'csv'">
                        Output Delimiter
                        <select class="form-select" v-model="csvOutputDelimiter" :disabled="!outputFormat">
                            <option value=";">;</option>
                            <option value=",">,</option>
                        </select>
                    </label>
                </div>
                <div class="col-auto">
                    <div class="form-check form-switch">
                        <input v-model="autoRefresh" class="form-check-input" type="checkbox" role="switch"
                            id="autorefresh">
                        <label class="form-check-label" for="autorefresh">Auto-Refresh</label>
                    </div>
                    <div class="form-check form-switch col-auto">
                        <input v-model="darkMode" class="form-check-input" type="checkbox" role="switch" id="darkmode">
                        <label class="form-check-label" for="darkmode">Dark Mode</label>
                    </div>
                </div>
                <div class="col-auto">
                    <button v-show="!processing" type="button" class="btn border border-primary" @click="compute">
                        Convert <i class="bi bi-play"></i>
                    </button>
                    <span v-show="processing" class="spinner-border text-primary" role="status"></span>
                </div>
                <div class="col-auto ms-auto">
                    <a class="btn border" href="https://docs.jsonata.org/simple" target="_blank">
                        <i class="p-2 bi bi-box-arrow-up-right"></i><span>Jsonata Docs</span>
                    </a>
                </div>
            </div>
        </div>
        <div id="cont">
            <div ref="monacoInput" id="monaco-input" style="min-height: 400px;border: 1px solid black"></div>
            <div ref="monacoExpression" id="monaco-expression" style="min-height: 400px;border: 1px solid black"></div>
        </div>
        <div ref="monacoResult" id="monaco-result" style="min-height: 400px;border: 1px solid black"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as monaco from 'monaco-editor'

export default defineComponent({
            data() {
                return {
                    outputFormat: "json",
                    inputFormat: "json",
                    isResizing: false,
                    autoRefresh: true,
                    csvInputDelimiter: ',',
                    csvOutputDelimiter: ',',
                    initialized: false,
                    processing: false,
                    darkMode: false,
                }
            },
            mounted() {
              let config = localStorage.getItem("config");
                if (config) {
                    config = JSON.parse(config);
                    this.autoRefresh = config.autoRefresh;
                    this.outputFormat = config.outputFormat;
                    this.inputFormat = config.inputFormat;
                    this.csvInputDelimiter = config.csvInputDelimiter;
                    this.csvOutputDelimiter = config.csvOutputDelimiter;
                    this.darkMode = config.darkMode;
                }
                this.initializeEditors();
                this.updateDarkMode();
                this.initialized = true;
            },
            methods: {
                updateDarkMode() {
                    const mode = this.darkMode ? 'dark' : 'light';
                    document.querySelector('html').setAttribute('data-bs-theme', mode)
                    monaco.editor.setTheme(`vs-${mode}`);
                },
                saveConfigurationToLocalStorage() {
                    let configAsString = JSON.stringify({
                        outputFormat: this.outputFormat,
                        inputFormat: this.inputFormat,
                        autoRefresh: this.autoRefresh,
                        csvInputDelimiter: this.csvInputDelimiter,
                        csvOutputDelimiter: this.csvOutputDelimiter,
                        darkMode: this.darkMode
                    })
                    localStorage.setItem("config", configAsString);
                },
                initializeEditors() {
                    const conf = {
                        theme: document.querySelector('html[data-bs-theme="dark"]') ? 'vs-dark' : 'vs-light'
                    };


                    this.monacoInput = monaco.editor.create(this.$refs.monacoInput, {
                        ...conf,
                        value: localStorage.getItem('inputText') ??
                            `[{
    "sample1": "test1",
    "sample2": "test2",
    "sample3": "test3"
},
{
    "sample1": "test4",
    "sample2": "test5",
    "sample3": "test6"
}]`
                    });
                    this.monacoExpression = monaco.editor.create(this.$refs.monacoExpression, {
                        ...conf,
                        value: localStorage.getItem('expressionText') ?? `$`
                    });
                    this.monacoResult = monaco.editor.create(this.$refs.monacoResult, {
                        ...conf,
                        value: "",
                        readOnly: true
                    });
                    this.monacoInput.onDidChangeModelContent(function () {
                        this.onEditorChange()
                    }.bind(this));
                    this.monacoExpression.onDidChangeModelContent(function () {
                        this.onEditorChange()
                    }.bind(this));
                    window.addEventListener('mousemove', this.onMouseMove)
                },
                onEditorChange() {
                    if (this.autoRefresh && this.initialized) {
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                        this.timer = setTimeout(this.compute.bind(this), 800);
                    }
                },
                async compute() {
                    this.processing = true;
                    const inputText = this.monacoInput.getValue();
                    const expressionText = this.monacoExpression.getValue();
                    try {
                        localStorage.setItem("inputText", inputText);
                    }
                    catch (e) {
                        console.error(e)
                    }
                    localStorage.setItem("expressionText", expressionText);

                    try {
                        const response = await fetch('/api/jsonata', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                input: inputText,
                                expression: expressionText,
                                csvOutput: this.outputFormat == 'csv',
                                csvInput: this.inputFormat == 'csv',
                                csvInputDelimiter: this.csvInputDelimiter,
                                csvOutputDelimiter: this.csvOutputDelimiter
                            })
                        });
                        let data = await response.text();
                        if (response.status == 200) {
                            this.monacoResult.setValue(data);
                        }
                        else {
                            let error = JSON.parse(data);
                            let errorText = `${error.error}\nDetails: ${JSON.stringify(error.details, null, 2)}`.replace('\n', "\n");
                            this.monacoResult.setValue(errorText);
                        }

                    } catch (error) {
                        this.monacoResult.setValue(`Error:\n${JSON.stringify(error.message)}`);
                    }
                    this.processing = false;
                },
            }
        });
</script>

<style>
/* Add your component-specific styles here */
</style>
