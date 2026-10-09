# ASC-PressMan

Resumen interactivo de la sección 22.3 de Pressman sobre la **Administración de la Configuración del Software (ACS)**. Es una página web estática, publicada con GitHub Pages y desarrollada en equipo con Git y GitHub, usando ramas y Pull Requests.

> Referencia: Pressman, R. S. (2010). *Ingeniería del software: un enfoque práctico* (7.ª ed.). McGraw-Hill Interamericana. Capítulo 22, sección 22.3.

## Contenido del sitio

| # | Sección | Qué explica |
|---|---------|-------------|
| 1 | Introducción | Qué es la ACS y sus cuatro pilares |
| 2 | El rol del repositorio | Repositorio como fuente única de la verdad |
| 3 | Identificación (ICS) y control de versiones | Elementos de configuración, ramas y versionado semántico |
| 4 | Control de cambios | Niveles de control, ACC y flujo de la OCI |
| 5 | Auditoría e informes de estado | Auditoría de configuración y reporte REC |
| — | Simulador interactivo | Capas del proceso y recorrido de un cambio |
| 6 | Conclusión | Síntesis del proyecto |
| 7 | Referencias | Fuente bibliográfica |

## Simulador interactivo

La sección **Simulador de capas del proceso de GCS** tiene dos pestañas:

- **Capas del proceso:** diagrama de capas anidadas alrededor de los ICS. Se puede seleccionar cada capa para ver su detalle y desactivarla para ver los riesgos de trabajar sin ella.
- **Recorrido de un cambio:** guía paso a paso (identificación, control de cambios, control de versiones, auditoría y reporte) y genera un registro REC con qué ocurrió, quién, cuándo y qué más se afecta.

Las capas y los pasos son una adaptación didáctica del proceso descrito por Pressman.

## Estructura del repositorio

```
ASC-PressMan/
├── index.html        # Contenido de todas las secciones
├── css/
│   └── styles.css    # Hoja de estilos (diseño, pestañas y simulador)
├── js/
│   └── script.js     # Pestañas y simulador de capas
├── assets/
│   └── img/          # Imágenes del sitio
├── docs/             # Documentación adicional
└── README.md
```

## Cómo ejecutarlo en local

No requiere instalación ni dependencias. Opciones:

1. Abrir `index.html` directamente en el navegador.
2. O levantar un servidor local desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Tecnologías

HTML5, CSS3 y JavaScript sin librerías externas.

## Flujo de trabajo en equipo

Cada integrante trabaja en su propia rama y propone sus cambios con un Pull Request hacia `main`. Es una aplicación práctica de los principios de control de cambios que explica el sitio.

| Integrante | Rama | Responsabilidad |
|------------|------|-----------------|
| 1 | `rama-estructura-y-proceso` | Estructura base, introducción, repositorio, identificación de objetos (ICS) y control de versiones |
| 2 | `rama-control-auditoria-reporte` | Control de cambios (flujo de la OCI), auditoría de configuración, reporte de estado (REC), conclusión y referencias |
| 3 | `rama-diseno-interactividad-docs` | Hoja de estilos, interactividad en JavaScript (pestañas y simulador) y este README |

### Pasos para contribuir

1. Actualizar `main` y crear la rama de trabajo:

   ```bash
   git switch main
   git pull origin main
   git switch -c nombre-de-tu-rama
   ```

2. Hacer cambios y registrarlos con commits descriptivos:

   ```bash
   git add .
   git commit -m "Describe lo que cambiaste"
   ```

3. Subir la rama y abrir un Pull Request en GitHub:

   ```bash
   git push -u origin nombre-de-tu-rama
   ```

4. Otra persona del equipo revisa el Pull Request (pestaña *Files changed*), comprueba que no se haya eliminado contenido ajeno y lo aprueba.
5. Se fusiona con **Merge pull request**. Después, cada integrante actualiza su copia local con `git pull origin main`.

## Publicación

El sitio se publica con GitHub Pages desde la rama `main` (*Settings → Pages → Deploy from a branch*).
