# Plan de Implementación: Próxima Iteración de Componentes VCL.JS

Plan detallado de especificaciones técnicas, arquitectura e implementación para la siguiente fase de componentes migrados desde **Delphi 4 (`delphi_4\comctrls.pas`)**.

---

## 1. Resumen Ejecutivo y Alcance

Tras la puesta en producción y pulido de `<vcl-toolbar>` y `<vcl-toolbutton>`, la siguiente iteración se enfoca en dotar a **VCL.JS** de componentes críticos de estado, progreso y gestión jerárquica de datos.

### Componentes en el Alcance
1. **`VCLStatusBar` (`<vcl-statusbar>`) & `VCLStatusPanel` (`<vcl-statuspanel>`)**: Pie de página informativo para aplicaciones y contenedores `<vcl-page>`.
2. **`VCLProgressBar` (`<vcl-progressbar>`)**: Indicador de progreso de tareas determinadas e indeterminadas.
3. **`VCLTreeView` (`<vcl-treeview>`) & `VCLTreeNode` (`<vcl-treenode>`)**: Estructura de datos jerárquica anidada con casillas de verificación y soporte de teclado.
4. **`VCLListView` (`<vcl-listview>`) & `VCLListColumn` (`<vcl-listcolumn>`)**: Visualización de listas en modo reporte de tabla, rejilla de iconos o lista detallada.

---

## 2. Especificación Técnica de Componentes

### 2.1 `<vcl-statusbar>` y `<vcl-statuspanel>`

#### Herencia: `VCLContainerElement` (para `VCLStatusBar`), `VCLControlElement` (para `VCLStatusPanel`).

#### Atributos de `<vcl-statusbar>`:
- `simple-text`: Texto de estado único cuando se usa en modo barra simple.
- `simple-panel`: `boolean` - Alterna entre vista de mensaje único o cuadrícula de múltiples paneles.
- `size-grip`: `boolean` - Muestra el agarre de cambio de tamaño en la esquina inferior derecha.

#### Atributos de `<vcl-statuspanel>`:
- `text`: Texto o mensaje del panel.
- `width`: Ancho en px o `%`. Por defecto `auto`.
- `spring`: `boolean` - Expande el panel para ocupar el espacio disponible residual.
- `alignment`: `'left' | 'center' | 'right'` - Alineación del texto.
- `bevel`: `'lowered' | 'raised' | 'none'` - Estilo de bisel/borde (por defecto `lowered`).
- `icon`: Clave de icono opcional.

#### Eventos:
- `vcl-panel-click`: Disparado al hacer clic en un panel de estado específico.

---

### 2.2 `<vcl-progressbar>`

#### Herencia: `VCLControlElement`

#### Atributos:
- `min`: Número (por defecto `0`).
- `max`: Número (por defecto `100`).
- `position` / `value`: Número (valor actual).
- `step`: Incremento por defecto al invocar `stepIt()`.
- `indeterminate`: `boolean` - Modo animación de carga infinita.
- `orientation`: `'horizontal' | 'vertical'` (por defecto `'horizontal'`).
- `show-label`: `boolean` - Muestra el porcentaje (`50%`) sobre la barra.
- `bar-style`: `'primary' | 'success' | 'warning' | 'danger'` - Paleta de colores preset.

#### Métodos Públicos:
- `stepIt()`: Incrementa `position` según el valor `step`.
- `reset()`: Reinicia la posición a `min`.

#### Accesibilidad ARIA:
- `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

---

### 2.3 `<vcl-treeview>` y `<vcl-treenode>`

#### Herencia: `VCLContainerElement` (para `VCLTreeView`), `HTMLElement` / `VCLControlElement` (para `VCLTreeNode`).

#### Atributos de `<vcl-treenode>`:
- `text` / `caption`: Etiqueta del nodo.
- `expanded`: `boolean` - Estado de expansión de hijos.
- `selected`: `boolean` - Estado de selección activa.
- `icon`: Icono del nodo colapsado.
- `expanded-icon`: Icono del nodo expandido.
- `checkboxes`: `boolean` - Muestra casilla de verificación.
- `checked`: `boolean` - Estado de casilla seleccionada.

#### Funcionalidades Clave:
- **Arquitectura de Ranuras Anidadas**: Los `<vcl-treenode>` contienen internamente `<slot>` para albergar sub-nodos `<vcl-treenode>` ilimitados.
- **Navegación por Teclado**:
  - `ArrowDown` / `ArrowUp`: Mueve el foco entre nodos visibles.
  - `ArrowRight`: Expande nodo colapsado.
  - `ArrowLeft`: Colapsa nodo expandido o navega al nodo padre.
  - `Space`: Alterna estado `checked`.

#### Eventos:
- `vcl-tree-select`: Fired al seleccionar un nodo (`detail: { node }`).
- `vcl-tree-expand`: Fired al expandir un nodo.
- `vcl-tree-collapse`: Fired al colapsar un nodo.

---

### 2.4 `<vcl-listview>` y `<vcl-listcolumn>`

#### Herencia: `VCLContainerElement`

#### Atributos:
- `view-style`: `'report' | 'icon' | 'small-icon' | 'list'` (por defecto `'report'`).
- `sortable`: `boolean` - Habilita ordenamiento al hacer clic en columnas.
- `multi-select`: `boolean` - Selección múltiple de elementos.
- `checkboxes`: `boolean` - Casillas de selección por fila.

#### Estructura Interna:
- Encabezados definidos mediante `<vcl-listcolumn caption="Nombre" width="200px" sortable>`.
- Filas renderizadas mediante HTML semántico y Shadow DOM para asegurar alto rendimiento en listas extensas.

---

## 3. Plan de Archivos a Crear y Modificar

### Componentes Nuevos
- `web-components/components/statusbar/vcl-statusbar.ts`
- `web-components/components/progressbar/vcl-progressbar.ts`
- `web-components/components/treeview/vcl-treeview.ts`
- `web-components/components/listview/vcl-listview.ts`

### Registro Principal
- `web-components/index.ts` (Exportar componentes nuevos).

### Bancos de Prueba Interactivos
- `testbed/test-vcl-statusbar.html`
- `testbed/test-vcl-progressbar.html`
- `testbed/test-vcl-treeview.html`
- `testbed/test-vcl-listview.html`

---

## 4. Fases de Ejecución y Cronograma

| Fase | Componente / Tarea | Entregables |
| :--- | :--- | :--- |
| **Fase 1** | Implementación de `VCLStatusBar` y `VCLProgressBar` | Código TypeScript + Páginas de Prueba |
| **Fase 2** | Implementación de `VCLTreeView` y `VCLTreeNode` | Control jerárquico + Teclado + Testbed |
| **Fase 3** | Implementación de `VCLListView` | Modos de vista + Columnas + Testbed |
| **Fase 4** | Integración y Verificación Global | Typecheck `tsc`, Build Vite y Walkthrough |

---

## 5. Criterios de Aceptación y Verificación

1. **Compilación**: Cero errores en `npx tsc --noEmit` y `npm run build`.
2. **Fidelidad Delphi**: Fiel reflejo de propiedades y comportamiento de `comctrls.pas`.
3. **Diseño Moderno**: Paletas de color, efectos hover, animaciones fluidas y soporte completo para modo oscuro.
4. **Accesibilidad**: Roles ARIA nativos e interacción completa por teclado en todos los controles.
