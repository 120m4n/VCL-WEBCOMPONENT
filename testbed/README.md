# Guía de Uso del Proyecto Test Bed Harness (`testbed/`)

Esta guía documenta el funcionamiento y las reglas de diseño para probar e integrar los nuevos **Web Components Nativos VCL.JS** en el entono de desarrollo.

---

## ⚠️ Regla de Oro N° 1: Contenedor Raíz `<vcl-page>` Obligatorio

> [!IMPORTANT]
> **Todo elemento o control VCL requiere obligatoriamente estar contenido dentro de una etiqueta `<vcl-page>` como padre ancestro.**

### ¿Por qué es obligatorio `<vcl-page>`?
1. **Marco de Layout Aislado**: Define los márgenes, el encabezado global y el contexto de renderizado responsive.
2. **Validación Automática de Ciclo de Vida**: Cada componente derivado de `VCLCoreElement` ejecuta una verificación en su método `connectedCallback()`:
   ```typescript
   const pageParent = this.closest('vcl-page');
   if (!pageParent && this.tagName.toLowerCase() !== 'vcl-page') {
       console.warn(`[VCL Warning]: El componente <${this.tagName.toLowerCase()}> requiere un contenedor <vcl-page> como ancestro.`);
   }
   ```

---

## 🛠️ Estructura de Uso en HTML (Declarativa)

Ejemplo básico de instanciación dentro de un archivo HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Aplicación VCL Web Components</title>
</head>
<body>

    <!-- 1. Contenedor Raíz Obligatorio -->
    <vcl-page title="Panel Principal">
        
        <!-- 2. Etiquetas del Sistema -->
        <vcl-label text="Estado del Sistema:" label-style="info"></vcl-label>
        
        <!-- 3. Entradas de Texto -->
        <vcl-input id="mi-campo" placeholder="Ingrese nombre..."></vcl-input>
        
        <!-- 4. Botones -->
        <vcl-button id="btn-guardar" text="Guardar Cambios" button-style="primary"></vcl-button>

    </vcl-page>

    <script type="module" src="./web-components/index.ts"></script>
</body>
</html>
```

---

## ⚡ Captura de Eventos y Reactividad (Sin JQuery)

Al no utilizar **JQuery**, la comunicación entre componentes se realiza mediante eventos DOM estándar (`CustomEvent`).

### 1. Escuchar Eventos de Clic (`vcl-click`)
```javascript
const boton = document.getElementById('btn-guardar');

boton.addEventListener('vcl-click', (event) => {
    console.log('Botón clickeado!', event.detail);
});
```

### 2. Escuchar Eventos de Cambio de Valor (`vcl-change`)
```javascript
const campoTexto = document.getElementById('mi-campo');

campoTexto.addEventListener('vcl-change', (event) => {
    console.log('Nuevo valor ingresado:', event.detail.value);
});
```

### 3. Modificación Reactiva de Atributos
Puedes cambiar propiedades dinámicamente mediante la API nativa del DOM:
```javascript
// Cambia el estilo del botón
boton.setAttribute('button-style', 'success');

// Cambia el texto de la etiqueta
document.querySelector('vcl-label').setAttribute('text', 'Operación Completada');
```

---

## 🚀 Cómo Ejecutar el Test Bed Localmente

Para previsualizar y probar los componentes en tiempo real:

1. Inicia un servidor local de desarrollo (por ejemplo mediante Vite o Live Server):
   ```bash
   npx vite testbed/index.html
   ```
2. Abre tu navegador en `http://localhost:5173/` (o el puerto asignado).
3. Interactúa con los controles e inspecciona el **Shadow DOM** en las herramientas de desarrollo de Chrome/Firefox (`DevTools`).
