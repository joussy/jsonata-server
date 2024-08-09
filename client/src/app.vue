<template>
    <div class="m-2" :class="{ 'bg-white': isLight }">
        <div class="row d-flex align-items-center">
            <div class="col-auto">
                <label>
                    Input Format
                </label>
                <select v-model="inputFormat" class="form-select">
                    <option value="json" default>Json</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                </select>
            </div>
            <div class="col-auto">
                <label v-show="inputFormat == 'csv'">
                    Input Delimiter
                    <select class="form-select" v-model="csvInputDelimiter" :disabled="!inputFormat">
                        <option value=";">;</option>
                        <option value=",">,</option>
                        <option value="&#9;">\t</option>
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
                    <option value="xml">XML</option>
                </select>
            </div>
            <div class="col-auto">
                <label v-show="outputFormat == 'csv'">
                    Output Delimiter
                    <select class="form-select" v-model="csvOutputDelimiter" :disabled="!outputFormat">
                        <option value=";">;</option>
                        <option value=",">,</option>
                        <option value="&#9;">\t</option>
                    </select>
                </label>
            </div>
            <div class="col-auto">
                <label>
                    Color Theme
                    <select class="form-select" v-model="colorTheme">
                        <option :value="ColorTheme.Auto">Auto</option>
                        <option :value="ColorTheme.Light">Light</option>
                        <option :value="ColorTheme.Dark">Dark</option>
                    </select>
                </label>
            </div>
            <div class="col-auto">
                <div class="form-check form-switch">
                    <input v-model="autoRefresh" class="form-check-input" type="checkbox" role="switch"
                        id="autorefresh">
                    <label class="form-check-label" for="autorefresh">Auto-Refresh</label>
                </div>
                <button v-show="!processing" type="button" class="btn border border-primary" @click="compute">
                    Convert <i class="bi bi-play"></i>
                </button>
                <span v-show="processing" class="spinner-border text-primary" role="status"></span>
            </div>
            <div class="col-auto ms-auto">
                <div>
                    <a class="btn border" href="https://github.com/joussy/jsonata-server" target="_blank">
                        <i class="p-2 bi bi-github"></i><span>Project Page</span>
                    </a>
                </div>
                <div>
                    <a class="btn border" href="https://docs.jsonata.org/simple" target="_blank">
                        <i class="p-2 bi bi-box-arrow-up-right"></i><span>Jsonata Docs</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <splitpanes horizontal @resized="resized"
        @resize="paneHorizontalSize = $event[0].size; paneOutputEditorSize = $event[1].size"
        :dbl-click-splitter="false">
        <pane :size="paneHorizontalSize">
            <splitpanes @resized="resized"
                @resize="paneInputEditorSize = $event[0].size; paneExpressionEditorSize = $event[1].size"
                :dbl-click-splitter="false">
                <pane :size="paneInputEditorSize" class="monaco-container">
                    <div class="monaco-header">Input</div>
                        <div class="monaco-editor" ref="monacoInput" id="monaco-input"></div>
                </pane>
                <pane :size="paneExpressionEditorSize" class="monaco-container">
                    <div class="monaco-header">JSONata</div>
                    <div class="monaco-editor" ref="monacoExpression" id="monaco-expression"></div>
                </pane>
            </splitpanes>
        </pane>
        <pane :size="paneOutputEditorSize" class="monaco-container">
            <div class="monaco-header">Output</div>
            <div class="monaco-editor" ref="monacoResult" id="monaco-result"></div>
        </pane>
    </splitpanes>
</template>

<script lang="ts">
import { defineComponent, markRaw, toRaw } from 'vue';
import * as monaco from 'monaco-editor'
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'
import { setupLanguages } from './setupMonaco'

enum ColorTheme {
    Auto = "auto",
    Light = "light",
    Dark = "dark"
}

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
            colorTheme: ColorTheme.Auto,
            ColorTheme: ColorTheme,
            paneInputEditorSize: null,
            paneExpressionEditorSize: null,
            paneHorizontalSize: null,
            paneOutputEditorSize: null,
            timer: null as number | null,
            monacoInput: null as monaco.editor.IStandaloneCodeEditor | null,
            monacoExpression: null as monaco.editor.IStandaloneCodeEditor | null,
            monacoResult: null as monaco.editor.IStandaloneCodeEditor | null,
            isLight: true
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
            this.colorTheme = configLocalStorage.colorTheme;
            this.paneHorizontalSize = configLocalStorage.paneHorizontalSize;
            this.paneInputEditorSize = configLocalStorage.paneVerticalSize;
            this.paneExpressionEditorSize = configLocalStorage.paneExpressionEditorSize;
            this.paneOutputEditorSize = configLocalStorage.paneOutputEditorSize;
        }
        this.initializeEditors();
        this.updateColorTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.updateColorTheme.bind(this));
        this.initialized = true;
    },
    watch: {
        outputFormat() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChangeLanguage(false);
            this.onEditorChangeContent();
        },
        inputFormat() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChangeLanguage(true);
            this.onEditorChangeContent();
        },
        csvInputDelimiter() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChangeLanguage(true);
            this.onEditorChangeContent();
        },
        csvOutputDelimiter() {
            this.saveConfigurationToLocalStorage();
            this.onEditorChangeLanguage(false);
            this.onEditorChangeContent();
        },
        autoRefresh() {
            this.saveConfigurationToLocalStorage();
        },
        colorTheme() {
            this.saveConfigurationToLocalStorage();
            this.updateColorTheme();
        }
    },
    methods: {
        onEditorChangeLanguage(isInput: boolean) {
            const editor = toRaw(isInput ? this.monacoInput : this.monacoResult);
            const model = editor?.getModel();
            if (!model) {
                return;
            }
            let language = isInput ? this.inputFormat : this.outputFormat;
            const mode = this.isLight ? 'light' : 'dark';
            let theme = `${language}-${mode}`;
            let delimiter = null;

            if (language == 'csv') {
                delimiter = isInput ? this.csvInputDelimiter : this.csvOutputDelimiter;
                language = `${language}-${delimiter}`;
            }

            console.log({ language, theme })
            // monaco.editor.setTheme(theme)
            monaco.editor.setModelLanguage(model, language)
        },
        resized() {
            this.saveConfigurationToLocalStorage();
        },
        updateColorTheme() {
            if (this.colorTheme == ColorTheme.Dark) {
                this.isLight = false;
            }
            else if (this.colorTheme == ColorTheme.Auto && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.isLight = false;
            }
            else {
                this.isLight = true;
            }
            const mode = this.isLight ? 'light' : 'dark';
            document.querySelector('html')?.setAttribute('data-bs-theme', mode)
            monaco.editor.setTheme(`jsonataTheme-${mode}`);
        },
        saveConfigurationToLocalStorage() {
            let configAsString = JSON.stringify({
                outputFormat: this.outputFormat,
                inputFormat: this.inputFormat,
                autoRefresh: this.autoRefresh,
                csvInputDelimiter: this.csvInputDelimiter,
                csvOutputDelimiter: this.csvOutputDelimiter,
                colorTheme: this.colorTheme,
                paneVerticalSize: this.paneInputEditorSize,
                paneExpressionEditorSize: this.paneExpressionEditorSize,
                paneHorizontalSize: this.paneHorizontalSize,
                paneOutputEditorSize: this.paneOutputEditorSize
            })
            localStorage.setItem("config", configAsString);
        },
        initializeEditors() {
            if (!window.MonacoEnvironment) {
                setupLanguages();

                window.MonacoEnvironment = {
                    getWorker: function (): Promise<Worker> | Worker {
                        return new jsonWorker();
                    }
                }
            }

            const conf: monaco.editor.IStandaloneEditorConstructionOptions = {
                automaticLayout: true
            };

            this.monacoInput = markRaw(monaco.editor.create(this.$refs.monacoInput as HTMLElement, {
                ...conf,
                language: 'json',
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
                language: 'jsonata',
                minimap: { enabled: false },
                hover: { above: false },
                theme: 'jsonataTheme',
                value: localStorage.getItem('expressionText') ?? `$`
            });
            this.monacoResult = markRaw(monaco.editor.create(this.$refs.monacoResult as HTMLElement, {
                ...conf,
                language: 'json',
                value: "",
                readOnly: true
            }));

            this.monacoInput.onDidChangeModelContent(() => {
                this.onEditorChangeContent()
            });
            this.monacoExpression.onDidChangeModelContent(() => {
                this.onEditorChangeContent()
            });
        },
        onEditorChangeContent() {
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
                        outputFormat: this.outputFormat,
                        inputFormat: this.inputFormat,
                        csvInputDelimiter: this.csvInputDelimiter,
                        csvOutputDelimiter: this.csvOutputDelimiter
                    })
                });
                let data = await response.text();
                this.clearDecorations(toRaw(this.monacoExpression));
                if (response.status == 200) {
                    toRaw(this.monacoResult).setValue(data);
                }
                else {
                    let error = JSON.parse(data);
                    let errorText = `${error.error}\nDetails: ${JSON.stringify(error.details, null, 2)}`.replace('\n', "\n");
                    toRaw(this.monacoResult).setValue(errorText);
                    this.setErrorMarker(toRaw(this.monacoExpression), error.details.position, error.details.position + 3, error.details.message);
                }
            } catch (error: any) {
                toRaw(this.monacoResult).setValue(`Error:\n${JSON.stringify(error?.message)}`);
            }
            this.processing = false;
        },
        clearDecorations(editor: monaco.editor.IStandaloneCodeEditor) {
            const model = editor.getModel();

            if (!model) {
                return false;
            }
            const existingDecorations = model.getAllDecorations();
            if (existingDecorations) {
                editor.removeDecorations(existingDecorations.map(d => d.id));
            }
        },
        setErrorMarker(editor: monaco.editor.IStandaloneCodeEditor, start: number, end: number, message: string) {
            const model = editor.getModel();

            if (!model) {
                return;
            }

            const from = model.getPositionAt(start)
            const to = model.getPositionAt(end)
            let marker: monaco.editor.IMarkerData = {
                message: message,
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: from.lineNumber,
                startColumn: from.column,
                endLineNumber: to.lineNumber,
                endColumn: to.column,
            };
            monaco.editor.setModelMarkers(model, "owner", [marker]);

            editor.createDecorationsCollection([
                {
                    range: new monaco.Range(from.lineNumber, 1, to.lineNumber, 1),
                    options: {
                        isWholeLine: true,
                        linesDecorationsClassName: "errorLineDecoration",
                    },
                }
            ]);
        }
    }
});
</script>

<style>
@font-face {
    font-family: inter;
    src: url('~@/assets/fonts/<static_font_file>.ttf');
}

.monaco-container {
    background-color: #F1F5F9;
    /*border-radius: 6px;*/
    border-radius: 16px;
    border: 1px solid black;
    padding: 10px;
    height: 100%;
}

.monaco-header {
    font-family: var(--font-sans),ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"
}

.splitpanes {
    background-color: #f8f8f8;
}

.splitpanes__splitter {
    background-color: white;
    position: relative;
}

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

.splitpanes__splitter:hover:before {
    opacity: 1;
}

.splitpanes--vertical>.splitpanes__splitter:before {
    left: -5px;
    right: -5px;
    height: 100%;
}

.splitpanes--horizontal>.splitpanes__splitter:before {
    top: -5px;
    bottom: -5px;
    width: 100%;
}
</style>
