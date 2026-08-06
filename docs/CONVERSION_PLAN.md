# Plan de Conversión e Iteración a Web Components (VCL.JS)

Este documento sirve como la **Guía Maestra de Migración y Estado Actual** para convertir la totalidad de los 169 componentes de **VCL.JS** a **Web Components nativos de HTML5** (`Custom Elements v1` + `Shadow DOM v1`), eliminando **100% la dependencia de JQuery**.

Cualquier subagente o desarrollador que asuma una iteración futura **debe leer este documento, validar el estado actual y seguir el protocolo de iteración**.

---

## 📊 Estado Actual del Proyecto (Check-in)

- **Servidor de Pruebas**: Vite 5.4+ ejecutándose en `http://localhost:5173/` (`npm run dev`).
- **Test Bed Harness**: Activo en `index.html` y `testbed/index.html` con monitor de eventos en tiempo real.
- **Fase 1 (Arquitectura Base)**: **100% Completada**.
- **Fase 2 (Componentes Básicos UI)**: **En progreso** (`<vcl-label>`, `<vcl-input>`, `<vcl-button>`, `<vcl-badge>`, `<vcl-panel>` completados).

---

## 🔄 Protocolo de Iteración y Validación (Pasos para Cada Iteración)

Cuando tomes una iteración para refactorizar un nuevo grupo de componentes:

1. **Consulta la Tabla de Chequeo**: Identifica los siguientes componentes pendientes `[ ]` en el orden de fases.
2. **Crea el Archivo del Web Component**:
   - Ruta: `web-components/components/<nombre>/vcl-<nombre>.ts` (o `containers/` para layouts).
   - Extiende de la clase base nativa correspondiente (`VCLCoreElement`, `VCLControlElement`, `VCLTextBaseElement`, `VCLInputBaseElement`, `VCLPopupBaseElement`, o `VCLContainerElement`).
   - Implementa Shadow DOM (`this.attachShadow({mode: 'open'})`), `observedAttributes`, y emite eventos nativos `vcl-*`.
3. **Exporta en `web-components/index.ts`**:
   - Agrega la exportación explícita del componente.
4. **Agrega el Test Case al Test Bed**:
   - Inyecta el nuevo componente en `index.html` y `testbed/index.html`.
5. **Verifica en Navegador**:
   - Abre `http://localhost:5173/` e interactúa con el componente para validar renderizado y eventos en el monitor terminal.
6. **Actualiza la Lista de Chequeo**:
   - Marca la casilla correspondiente con `[x]` en este archivo `docs/CONVERSION_PLAN.md`.

---

## 🗺️ Fases de Ejecución

### Fase 1: Arquitectura Base y Contenedores Raíz
- [x] `VCLCoreElement` (`TComponent`) → Base raíz nativa ([web-components/core/VCLCoreElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLCoreElement.ts))
- [x] `VCLControlElement` (`TControl`) → Geometría y visibilidad ([web-components/core/VCLControlElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLControlElement.ts))
- [x] `VCLTextBaseElement` (`TTextBase`) → Tipografía ([web-components/core/VCLTextBaseElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLTextBaseElement.ts))
- [x] `VCLInputBaseElement` (`TInputBase`) → Formularios ([web-components/core/VCLInputBaseElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLInputBaseElement.ts))
- [x] `VCLPopupBaseElement` (`TPopupmenuComponent`) → Menús y diálogos ([web-components/core/VCLPopupBaseElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLPopupBaseElement.ts))
- [x] `VCLContainerElement` (`TContainer`) → Layout e hijos ([web-components/core/VCLContainerElement.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/core/VCLContainerElement.ts))
- [x] `<vcl-page>` (`TPage`) → Contenedor raíz ([web-components/containers/page/vcl-page.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/containers/page/vcl-page.ts))

### Fase 2: Componentes UI Básicos, Formularios, Texto e Imágenes
- [x] `<vcl-label>` (`TLabel`) ([web-components/components/label/vcl-label.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/label/vcl-label.ts))
- [x] `<vcl-input>` (`TInput`) ([web-components/components/input/vcl-input.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/input/vcl-input.ts))
- [x] `<vcl-button>` (`TButton`) ([web-components/components/button/vcl-button.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/button/vcl-button.ts))
- [x] `<vcl-badge>` (`TBadge`) ([web-components/components/badge/vcl-badge.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/badge/vcl-badge.ts))
- [x] `<vcl-checkbox>` (`TCheckBox`) ([web-components/components/checkbox/vcl-checkbox.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/checkbox/vcl-checkbox.ts))
- [x] `<vcl-radiobutton>` (`TRadioButton`) ([web-components/components/radiobutton/vcl-radiobutton.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/radiobutton/vcl-radiobutton.ts))
- [x] `<vcl-textarea>` (`TTextArea`) ([web-components/components/textarea/vcl-textarea.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/textarea/vcl-textarea.ts))
- [x] `<vcl-text>` (`TText`) ([web-components/components/text/vcl-text.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/text/vcl-text.ts))
- [x] `<vcl-input-numeric>` (`TInputNumeric`) ([web-components/components/input-numeric/vcl-input-numeric.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/input-numeric/vcl-input-numeric.ts))
- [x] `<vcl-combobox>` (`TCombobox`) ([web-components/components/combobox/vcl-combobox.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/combobox/vcl-combobox.ts))
- [x] `<vcl-listbox>` (`TListBox`) ([web-components/components/listbox/vcl-listbox.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/listbox/vcl-listbox.ts))
- [x] `<vcl-image>` (`TImage`) ([web-components/components/image/vcl-image.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/image/vcl-image.ts))
- [x] `<vcl-icon>` (`TIcon`) ([web-components/components/icon/vcl-icon.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/icon/vcl-icon.ts))
- [x] `<vcl-toggleswitch>` (`TToggleSwitch`) ([web-components/components/toggleswitch/vcl-toggleswitch.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/toggleswitch/vcl-toggleswitch.ts))
- [x] `<vcl-typeahead>` (`TInputTypeaHead`) ([web-components/components/typeahead/vcl-typeahead.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/typeahead/vcl-typeahead.ts))

### Fase 3: Layout, Paneles, Navegación, Diálogos y Menús (Bloque 2 Objetivo)
- [x] `<vcl-panel>` (`TPanel`) ([web-components/components/panel/vcl-panel.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/panel/vcl-panel.ts))
- [x] `<vcl-modal>` (`TModal`) ([web-components/components/modal/vcl-modal.ts](file:///c:/Users/roman/GitHub/VCL.JS/web-components/components/modal/vcl-modal.ts)) - *Comportamiento Delphi 10.3 Modal Form*
- [ ] `<vcl-breadcrumb>` (`TBreadCrumb`)
- [ ] `<vcl-pagination>` (`TPagination`)
- [ ] `<vcl-alert>` (`TAlert`)
- [ ] `<vcl-accordion>` (`TAccordion`)
- [ ] `<vcl-tabpanel>` (`TTabPanel`)
- [ ] `<vcl-row>` / `<vcl-col>` (`TBootstrapRow` / `TBootstrapSpan`)
- [ ] `<vcl-navbar>` / `<vcl-sidebar>` (`TNavBar` / `TSideBar`)
- [ ] `<vcl-well>` (`TWell`)

### Fase 4: Entradas Avanzadas, Árboles, Fechas y Deslizadores
- [ ] Entradas de fecha/hora, listbox, árboles, sliders y barras de progreso.

### Fase 5: Motores de Datos, Grillas (Grids), OLAP y Mapas
- [ ] Datasets, `TDBGrid`, motores de consulta y mapas.

### Fase 6: Gráficos de Datos y Sparklines
- [ ] Componentes de gráficos D3/RGraph sustituidos por SVG/Canvas nativos.

---

## 📋 Lista de Chequeo General (100% de los 169 Componentes)

| # | Componente | Archivo Fuente Original | Fase | Estado |
| :-: | :--- | :--- | :-: | :-: |
| 1 | `TAccordion` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [x] Completado (`<vcl-accordion>`) |
| 2 | `TAccordionGroup` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 3 | `TAccordionGroupButton` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 4 | `TAccordionGroupPanel` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 5 | `TAlert` | [VCL/VXAlert.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXAlert.ts) | 3 | [x] Completado (`<vcl-alert>`) |
| 6 | `TApplication` | [VCL/VXApplication.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXApplication.ts) | 1 | [ ] Pendiente |
| 7 | `TBadge` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [x] Completado (`<vcl-badge>`) |
| 8 | `TBarBase` | [VCL/VXSideBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSideBar.ts) | 3 | [ ] Pendiente |
| 9 | `TBarValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 10 | `TBaseGridDataSource` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 11 | `TBootstrapRow` | [VCL/VXContainer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXContainer.ts) | 3 | [x] Completado (`<vcl-row>`) |
| 12 | `TBootstrapRowFluid` | [VCL/VXContainer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXContainer.ts) | 3 | [ ] Pendiente |
| 13 | `TBootstrapSpan` | [VCL/VXContainer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXContainer.ts) | 3 | [ ] Pendiente |
| 14 | `TBreadCrumb` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [x] Completado (`<vcl-breadcrumb>`) |
| 15 | `TBreadCrumbItem` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 16 | `TBubbleValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 17 | `TButton` | [VCL/VXButton.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXButton.ts) | 2 | [x] Completado (`<vcl-button>`) |
| 18 | `TCarousel` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [ ] Pendiente |
| 19 | `TCarouselPage` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [ ] Pendiente |
| 20 | `TChartArea` | [VCL/VXChartLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartLine.ts) | 6 | [ ] Pendiente |
| 21 | `TChartBar` | [VCL/VXChartBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBar.ts) | 6 | [ ] Pendiente |
| 22 | `TChartBarH` | [VCL/VXChartBarH.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBarH.ts) | 6 | [ ] Pendiente |
| 23 | `TChartBase` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 24 | `TChartBubble` | [VCL/VXChartDot.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartDot.ts) | 6 | [ ] Pendiente |
| 25 | `TChartBullet` | [VCL/VXChartBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBar.ts) | 6 | [ ] Pendiente |
| 26 | `TChartDonut` | [VCL/VXChartDonut.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartDonut.ts) | 6 | [ ] Pendiente |
| 27 | `TChartDot` | [VCL/VXChartDot.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartDot.ts) | 6 | [ ] Pendiente |
| 28 | `TChartDotBase` | [VCL/VXChartDot.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartDot.ts) | 6 | [ ] Pendiente |
| 29 | `TChartLine` | [VCL/VXChartLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartLine.ts) | 6 | [ ] Pendiente |
| 30 | `TChartLineBase` | [VCL/VXChartLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartLine.ts) | 6 | [ ] Pendiente |
| 31 | `TChartValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 32 | `TChartValuesCollection` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 33 | `TCheckBox` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [x] Completado (`<vcl-checkbox>`) |
| 34 | `TCheckBoxBase` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 35 | `TClientDataset` | [VCL/VXDataset.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDataset.ts) | 5 | [ ] Pendiente |
| 36 | `TCollection` | [VCL/VXObject.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXObject.ts) | 5 | [ ] Pendiente |
| 37 | `TCollectionItem` | [VCL/VXObject.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXObject.ts) | 5 | [ ] Pendiente |
| 38 | `TComboItem` | [VCL/VXCombo.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCombo.ts) | 2 | [ ] Pendiente |
| 39 | `TComboItemCollection` | [VCL/VXCombo.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCombo.ts) | 2 | [ ] Pendiente |
| 40 | `TCombobox` | [VCL/VXCombo.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCombo.ts) | 2 | [x] Completado (`<vcl-combobox>`) |
| 41 | `TComboboxBase` | [VCL/VXCombo.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCombo.ts) | 2 | [ ] Pendiente |
| 42 | `TComponent` | [VCL/VXComponent.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXComponent.ts) | 1 | [x] Completado (`VCLCoreElement`) |
| 43 | `TConst` | [VCL/VXConst.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXConst.ts) | 5 | [ ] Pendiente |
| 44 | `TContainer` | [VCL/VXContainer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXContainer.ts) | 1 | [x] Completado (`VCLContainerElement`) |
| 45 | `TControl` | [VCL/VXComponent.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXComponent.ts) | 1 | [x] Completado (`VCLControlElement`) |
| 46 | `TDBBadge` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 47 | `TDBChartArea` | [VCL/VXChartLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartLine.ts) | 6 | [ ] Pendiente |
| 48 | `TDBChartBar` | [VCL/VXChartBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBar.ts) | 6 | [ ] Pendiente |
| 49 | `TDBChartBarH` | [VCL/VXChartBarH.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBarH.ts) | 6 | [ ] Pendiente |
| 50 | `TDBChartDonut` | [VCL/VXChartDonut.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartDonut.ts) | 6 | [ ] Pendiente |
| 51 | `TDBChartLine` | [VCL/VXChartLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartLine.ts) | 6 | [ ] Pendiente |
| 52 | `TDBCheckBox` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 53 | `TDBCombobox` | [VCL/VXCombo.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCombo.ts) | 2 | [ ] Pendiente |
| 54 | `TDBDateInput` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 55 | `TDBGrid` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 56 | `TDBGridColumn` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 57 | `TDBGridDataSource` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 58 | `TDBInput` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [ ] Pendiente |
| 59 | `TDBInputNumeric` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [ ] Pendiente |
| 60 | `TDBLabel` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 61 | `TDBLabeledText` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [ ] Pendiente |
| 62 | `TDBSparkBar` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 63 | `TDBSparkLine` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 64 | `TDBSparkPie` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 65 | `TDBText` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 66 | `TDBTextArea` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [ ] Pendiente |
| 67 | `TDBTextBase` | [VCL/VXTextBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTextBase.ts) | 1 | [ ] Pendiente |
| 68 | `TDataset` | [VCL/VXDataset.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDataset.ts) | 5 | [ ] Pendiente |
| 69 | `TDateButton` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 70 | `TDateInput` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 71 | `TDateInputBase` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 72 | `TDateSlicer` | [VCL/VXOlapSSAS.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXOlapSSAS.ts) | 5 | [ ] Pendiente |
| 73 | `TDotValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 74 | `TDountValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 75 | `TEditorBase` | [VCL/VXInputBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInputBase.ts) | 1 | [ ] Pendiente |
| 76 | `TFacebookAPI` | [VCL/VXApplication.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXApplication.ts) | 5 | [ ] Pendiente |
| 77 | `TFacebookButton` | [VCL/VXButton.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXButton.ts) | 2 | [ ] Pendiente |
| 78 | `TGauge` | [VCL/VXGauge.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXGauge.ts) | 4 | [ ] Pendiente |
| 79 | `TGenericDataset` | [VCL/VXDataset.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDataset.ts) | 5 | [ ] Pendiente |
| 80 | `TGoogleMap` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 5 | [ ] Pendiente |
| 81 | `TGoogleMapHeatmapMarker` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 5 | [ ] Pendiente |
| 82 | `TGoogleMapMarker` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 5 | [ ] Pendiente |
| 83 | `TGraphBar` | [VCL/VXRGraphBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXRGraphBase.ts) | 6 | [ ] Pendiente |
| 84 | `TGraphEditor` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [ ] Pendiente |
| 85 | `TGraphic` | [VCL/VXImage.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXImage.ts) | 2 | [ ] Pendiente |
| 86 | `TGravatarImage` | [VCL/VXImage.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXImage.ts) | 2 | [ ] Pendiente |
| 87 | `TGrid` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 88 | `TGridBase` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 89 | `TGridChartBase` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 90 | `TGridColumnCollection` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 91 | `TGridDataSource` | [VCL/VXDBGrid.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDBGrid.ts) | 5 | [ ] Pendiente |
| 92 | `TIcon` | [VCL/VXImage.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXImage.ts) | 2 | [x] Completado (`<vcl-icon>`) |
| 93 | `TImage` | [VCL/VXImage.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXImage.ts) | 2 | [x] Completado (`<vcl-image>`) |
| 94 | `TInput` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [x] Completado (`<vcl-input>`) |
| 95 | `TInputBase` | [VCL/VXInputBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInputBase.ts) | 1 | [x] Completado (`VCLInputBaseElement`) |
| 96 | `TInputNumeric` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [x] Completado (`<vcl-input-numeric>`) |
| 97 | `TInputTime` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 98 | `TInputTypeaHead` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [x] Completado (`<vcl-typeahead>`) |
| 99 | `TLabel` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [x] Completado (`<vcl-label>`) |
| 100 | `TLabeledBase` | [VCL/VXInputBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInputBase.ts) | 1 | [ ] Pendiente |
| 101 | `TLineValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 102 | `TList` | [VCL/VXObject.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXObject.ts) | 5 | [ ] Pendiente |
| 103 | `TListbox` | [VCL/VXListBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXListBox.ts) | 4 | [x] Completado (`<vcl-listbox>`) |
| 104 | `TListboxItem` | [VCL/VXListBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXListBox.ts) | 4 | [ ] Pendiente |
| 105 | `TLocaleSettings` | [VCL/VXApplication.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXApplication.ts) | 5 | [ ] Pendiente |
| 106 | `TMemeberSlicer` | [VCL/VXOlapSSAS.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXOlapSSAS.ts) | 5 | [ ] Pendiente |
| 107 | `TMenuItem` | [VCL/VXMenu.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXMenu.ts) | 3 | [ ] Pendiente |
| 108 | `TMenuItemCollection` | [VCL/VXMenu.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXMenu.ts) | 3 | [ ] Pendiente |
| 109 | `TModal` | [VCL/VXModal.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXModal.ts) | 3 | [x] Completado (`<vcl-modal>`) |
| 110 | `TModalBuilder` | [VCL/VXModal.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXModal.ts) | 3 | [ ] Pendiente |
| 111 | `TNavBar` | [VCL/VXSideBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSideBar.ts) | 3 | [x] Completado (`<vcl-navbar>`) |
| 112 | `TNavbarItem` | [VCL/VXApplication.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXApplication.ts) | 3 | [ ] Pendiente |
| 113 | `TNestedClientDataset` | [VCL/VXDataset.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDataset.ts) | 5 | [ ] Pendiente |
| 114 | `TNotification` | [VCL/VXAlert.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXAlert.ts) | 3 | [ ] Pendiente |
| 115 | `TObject` | [VCL/VXObject.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXObject.ts) | 5 | [ ] Pendiente |
| 116 | `TOlapMemeber` | [VCL/VXOlapSSAS.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXOlapSSAS.ts) | 5 | [ ] Pendiente |
| 117 | `TOlapSSAS` | [VCL/VXOlapSSAS.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXOlapSSAS.ts) | 5 | [ ] Pendiente |
| 118 | `TPage` | [VCL/VXPage.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXPage.ts) | 1 | [x] Completado (`<vcl-page>`) |
| 119 | `TPagination` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [x] Completado (`<vcl-pagination>`) |
| 120 | `TPaginationItem` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 121 | `TPanel` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [x] Completado (`<vcl-panel>`) |
| 122 | `TPanelButton` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [ ] Pendiente |
| 123 | `TPillBox` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 124 | `TPillBoxItem` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 125 | `TPopup` | [VCL/VXPopup.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXPopup.ts) | 3 | [ ] Pendiente |
| 126 | `TPopupmenuComponent` | [VCL/VXComponent.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXComponent.ts) | 1 | [x] Completado (`VCLPopupBaseElement`) |
| 127 | `TProgressBar` | [VCL/VXProgressBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXProgressBar.ts) | 4 | [ ] Pendiente |
| 128 | `TQuery` | [VCL/VXQuery.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXQuery.ts) | 5 | [ ] Pendiente |
| 129 | `TQueryBase` | [VCL/VXQuery.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXQuery.ts) | 5 | [ ] Pendiente |
| 130 | `TQueryParam` | [VCL/VXQuery.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXQuery.ts) | 5 | [ ] Pendiente |
| 131 | `TQueryRemote` | [VCL/VXQuery.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXQuery.ts) | 5 | [ ] Pendiente |
| 132 | `TRadioButton` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [x] Completado (`<vcl-radiobutton>`) |
| 133 | `TRadioButtonBase` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 134 | `TRangeSlider` | [VCL/VXProgressBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXProgressBar.ts) | 4 | [ ] Pendiente |
| 135 | `TRatingStart` | [VCL/VXProgressBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXProgressBar.ts) | 4 | [ ] Pendiente |
| 136 | `TRepeater` | [VCL/VXContainer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXContainer.ts) | 3 | [ ] Pendiente |
| 137 | `TSelectedChartValue` | [VCL/VXChartBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXChartBase.ts) | 6 | [ ] Pendiente |
| 138 | `TServer` | [VCL/VXServer.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXServer.ts) | 5 | [ ] Pendiente |
| 139 | `TSideBar` | [VCL/VXSideBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSideBar.ts) | 3 | [ ] Pendiente |
| 140 | `TSlicer` | [VCL/VXOlapSSAS.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXOlapSSAS.ts) | 5 | [ ] Pendiente |
| 141 | `TSlider` | [VCL/VXProgressBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXProgressBar.ts) | 4 | [ ] Pendiente |
| 142 | `TSliderBase` | [VCL/VXProgressBar.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXProgressBar.ts) | 4 | [ ] Pendiente |
| 143 | `TSparkBar` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 144 | `TSparkBase` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 145 | `TSparkLine` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 146 | `TSparkPie` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 147 | `TSparkValue` | [VCL/VXSparkLine.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXSparkLine.ts) | 6 | [ ] Pendiente |
| 148 | `TTabPage` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 149 | `TTabPanel` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [x] Completado (`<vcl-tabpanel>`) |
| 150 | `TTabSheet` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 151 | `TTagCloud` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 152 | `TTagCloudItem` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [ ] Pendiente |
| 153 | `TText` | [VCL/VXText.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXText.ts) | 2 | [x] Completado (`<vcl-text>`) |
| 154 | `TTextArea` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [x] Completado (`<vcl-textarea>`) |
| 155 | `TTextBase` | [VCL/VXTextBase.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTextBase.ts) | 1 | [x] Completado (`VCLTextBaseElement`) |
| 156 | `TTimeInputBase` | [VCL/VXDateInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXDateInput.ts) | 4 | [ ] Pendiente |
| 157 | `TTimer` | [VCL/VXObject.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXObject.ts) | 5 | [ ] Pendiente |
| 158 | `TToggleSwitch` | [VCL/VXButton.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXButton.ts) | 2 | [x] Completado (`<vcl-toggleswitch>`) |
| 159 | `TTree` | [VCL/VXListBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXListBox.ts) | 4 | [ ] Pendiente |
| 160 | `TTreeNodeItem` | [VCL/VXListBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXListBox.ts) | 4 | [ ] Pendiente |
| 161 | `TTypeaHeadItem` | [VCL/VXInput.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXInput.ts) | 2 | [ ] Pendiente |
| 162 | `TVerticalCheckBoxItem` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 163 | `TVerticalCheckBoxItemCollection` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 164 | `TVerticalCheckBoxList` | [VCL/VXCheckBox.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXCheckBox.ts) | 2 | [ ] Pendiente |
| 165 | `TWdgetPanel` | [VCL/VXGridSter.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXGridSter.ts) | 3 | [ ] Pendiente |
| 166 | `TWell` | [VCL/VXWell.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXWell.ts) | 3 | [x] Completado (`<vcl-well>`) |
| 167 | `TWidgetGrid` | [VCL/VXGridSter.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXGridSter.ts) | 3 | [ ] Pendiente |
| 168 | `TWizardButtons` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
| 169 | `TWizardButtonsStep` | [VCL/VXTab.ts](file:///c:/Users/roman/GitHub/VCL.JS/VCL/VXTab.ts) | 3 | [ ] Pendiente |
