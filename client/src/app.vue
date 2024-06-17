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
    <splitpanes horizontal @resized="resized" @resize="paneHorizontalSize = $event[0].size" :dbl-click-splitter="false">
        <pane :size="paneHorizontalSize">
            <splitpanes @resized="resized" @resize="paneVerticalSize = $event[0].size" :dbl-click-splitter="false">
                <pane :size="paneVerticalSize">
                    <div 
                    class="monaco-editor" 
                    ref="monacoInput" 
                    id="monaco-input"
                    ></div>
                </pane>
                <pane>
                    <div 
                    class="monaco-editor" 
                    ref="monacoExpression" 
                    id="monaco-expression"
                    ></div>
                </pane>
            </splitpanes>
        </pane>
        <pane>
            <div 
            class="monaco-editor" 
            ref="monacoResult" 
            id="monaco-result"
            ></div>
        </pane>
    </splitpanes>
</template>

<script lang="ts">
import { defineComponent, markRaw, toRaw } from 'vue';
import * as monaco from 'monaco-editor'
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'

export default defineComponent({
    components: { Splitpanes, Pane },
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
            paneVerticalSize: 50,
            paneHorizontalSize: 50,
            timer: null as number | null,
            monacoInput: null as monaco.editor.IStandaloneCodeEditor | null,
            monacoExpression: null as monaco.editor.IStandaloneCodeEditor | null,
            monacoResult: null as monaco.editor.IStandaloneCodeEditor | null
        }
    },
    mounted() {
        let configLocalStorageItem = localStorage.getItem("config");
        if (configLocalStorageItem) {
            const configLocalStorage = JSON.parse(configLocalStorageItem);
            this.autoRefresh = configLocalStorage.autoRefresh;
            this.outputFormat = configLocalStorage.outputFormat;
            this.inputFormat = configLocalStorage.inputFormat;
            this.csvInputDelimiter = configLocalStorage.csvInputDelimiter;
            this.csvOutputDelimiter = configLocalStorage.csvOutputDelimiter;
            this.darkMode = configLocalStorage.darkMode;
            this.paneHorizontalSize = configLocalStorage.paneHorizontalSize;
            this.paneVerticalSize = configLocalStorage.paneVerticalSize;
        }
        this.initializeEditors();
        this.updateDarkMode();
        this.initialized = true;
    },
    watch: {
        outputFormat() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChange();
        },
        inputFormat() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChange();
        },
        csvInputDelimiter() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChange();
        },
        csvOutputDelimiter() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChange();
        },
        autoRefresh() {
            this.saveConfigurationToLocalStorage();
        },
        darkMode() {
            this.saveConfigurationToLocalStorage();
            this.updateDarkMode();
        }
    },
    methods: {
        resized() {
            console.log([this.paneVerticalSize, this.paneHorizontalSize])
            this.saveConfigurationToLocalStorage();
        },
        updateDarkMode() {
            const mode = this.darkMode ? 'dark' : 'light';
            document.querySelector('html')?.setAttribute('data-bs-theme', mode)
            monaco.editor.setTheme(`vs-${mode}`);
        },
        saveConfigurationToLocalStorage() {
            let configAsString = JSON.stringify({
                outputFormat: this.outputFormat,
                inputFormat: this.inputFormat,
                autoRefresh: this.autoRefresh,
                csvInputDelimiter: this.csvInputDelimiter,
                csvOutputDelimiter: this.csvOutputDelimiter,
                darkMode: this.darkMode,
                paneVerticalSize: this.paneVerticalSize,
                paneHorizontalSize: this.paneHorizontalSize
            })
            localStorage.setItem("config", configAsString);
        },
        initializeEditors() {
            const conf : monaco.editor.IStandaloneEditorConstructionOptions = {
                theme: document.querySelector('html[data-bs-theme="dark"]') ? 'vs-dark' : 'vs-light',
                automaticLayout: true
            };


            this.monacoInput = markRaw(monaco.editor.create(this.$refs.monacoInput as HTMLElement, {
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
            }));
            this.monacoExpression = monaco.editor.create(this.$refs.monacoExpression as HTMLElement, {
                ...conf,
                value: localStorage.getItem('expressionText') ?? `$`
            });
            this.monacoResult = markRaw(monaco.editor.create(this.$refs.monacoResult as HTMLElement, {
                ...conf,
                value: "",
                readOnly: true
            }));

            this.monacoInput.onDidChangeModelContent(() => {
                this.onEditorChange()
            });
            this.monacoExpression.onDidChangeModelContent(() => {
                this.onEditorChange()
            });
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
            if (!this.monacoInput || !this.monacoExpression || !this.monacoResult) {
                return;
            }
            this.processing = true;
            const inputText = toRaw(this.monacoInput).getValue();
            const expressionText = toRaw(this.monacoExpression).getValue();
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
                    toRaw(this.monacoResult).setValue(data);
                }
                else {
                    let error = JSON.parse(data);
                    let errorText = `${error.error}\nDetails: ${JSON.stringify(error.details, null, 2)}`.replace('\n', "\n");
                    toRaw(this.monacoResult).setValue(errorText);
                }
            } catch (error: any) {
                toRaw(this.monacoResult).setValue(`Error:\n${JSON.stringify(error?.message)}`);
            }
            this.processing = false;
        },
    }
});
</script>

<style>

.splitpanes {background-color: #f8f8f8;}

.splitpanes__splitter {background-color: #ccc;position: relative;}
.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: #0d6efd;
  opacity: 0;
  z-index: 3000;
}
.splitpanes__splitter:hover:before {opacity: 1;}
.splitpanes--vertical > .splitpanes__splitter:before {left: -5px;right: -5px;height: 100%;}
.splitpanes--horizontal > .splitpanes__splitter:before {top: -5px;bottom: -5px;width: 100%;}
</style>
