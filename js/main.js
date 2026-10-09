/* =====================================================================
   ASC-PressMan · Interactividad (Integrante 3)
   - Pestañas accesibles (ARIA + teclado)
   - Simulador de capas del proceso de GCS
   - Recorrido de un cambio con registro REC
   JavaScript puro, sin dependencias.
   ===================================================================== */
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Utilidad: crear elementos sin usar innerHTML
       ------------------------------------------------------------------ */
    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (key) {
            var value = attrs[key];
            if (value === false || value === null || value === undefined) { return; }
            if (key === 'class') { node.className = value; }
            else if (key === 'text') { node.textContent = value; }
            else { node.setAttribute(key, value === true ? '' : value); }
        });
        [].concat(children || []).forEach(function (child) {
            if (child === null || child === undefined) { return; }
            node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
        return node;
    }

    /* ------------------------------------------------------------------
       1. PESTAÑAS
       Marcado esperado: [data-tabs] > [role=tablist] > [role=tab]
                         y [role=tabpanel] con aria-labelledby.
       ------------------------------------------------------------------ */
    function initTabs(root) {
        var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
        if (!tabs.length) { return; }

        function panelOf(tab) {
            return document.getElementById(tab.getAttribute('aria-controls'));
        }

        function select(tab, moveFocus) {
            tabs.forEach(function (t) {
                var active = t === tab;
                t.setAttribute('aria-selected', active ? 'true' : 'false');
                t.setAttribute('tabindex', active ? '0' : '-1');
                var panel = panelOf(t);
                if (panel) { panel.hidden = !active; }
            });
            if (moveFocus) { tab.focus(); }
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () { select(tab, false); });
            tab.addEventListener('keydown', function (event) {
                var target = null;
                if (event.key === 'ArrowRight') { target = tabs[(index + 1) % tabs.length]; }
                else if (event.key === 'ArrowLeft') { target = tabs[(index - 1 + tabs.length) % tabs.length]; }
                else if (event.key === 'Home') { target = tabs[0]; }
                else if (event.key === 'End') { target = tabs[tabs.length - 1]; }
                if (target) {
                    event.preventDefault();
                    select(target, true);
                }
            });
        });

        var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
        select(initial, false);
    }

    /* ------------------------------------------------------------------
       2. DATOS DEL PROCESO DE GCS
       Orden: de la capa más interna (cercana a los ICS) a la más externa.
       ------------------------------------------------------------------ */
    var NUCLEO = {
        id: 'ics',
        nombre: 'Elementos de Configuración (ICS)',
        resumen: 'Son las unidades de información que se gestionan como una sola entidad: código, documentos, casos de prueba y diagramas. Todas las capas del proceso existen para proteger y controlar estos elementos.',
        salidas: ['Objetos básicos (por ejemplo, un archivo de código)', 'Objetos compuestos (por ejemplo, el sitio completo publicado)'],
        ejemplo: 'En este proyecto, index.html, css/styles.css y js/script.js son objetos básicos; el sitio publicado en GitHub Pages es un objeto compuesto.',
        seccion: '#ics-versiones',
        seccionNombre: 'Sección 3: Identificación de objetos (ICS)'
    };

    var CAPAS = [
        {
            id: 'identificacion',
            nombre: 'Identificación de objetos',
            resumen: 'Define qué elementos forman el sistema, les asigna un nombre e identificador únicos y establece las líneas base.',
            salidas: ['Lista de ICS con identificador único', 'Relaciones de dependencia entre ICS', 'Línea base inicial'],
            ejemplo: 'Se decide que index.html, el CSS y el JavaScript son ICS con un responsable asignado a cada uno.',
            sinCapa: 'No se sabe con claridad qué archivos están bajo control, quién responde por ellos ni qué otros elementos se afectan al cambiar uno.',
            seccion: '#ics-versiones',
            seccionNombre: 'Sección 3: Identificación de objetos (ICS)'
        },
        {
            id: 'versiones',
            nombre: 'Control de versiones',
            resumen: 'Gestiona las revisiones y variantes de cada ICS con herramientas como Git, para volver a cualquier estado anterior y trabajar en paralelo.',
            salidas: ['Historial de commits', 'Ramas de trabajo aisladas', 'Versiones identificables (por ejemplo, SemVer)'],
            ejemplo: 'Cada integrante trabaja en su propia rama y registra commits descriptivos antes de proponer su cambio.',
            sinCapa: 'Los cambios se sobrescriben entre integrantes, no hay manera de volver a una versión estable y se pierde trabajo.',
            seccion: '#ics-versiones',
            seccionNombre: 'Sección 3.2: Control de versiones'
        },
        {
            id: 'cambios',
            nombre: 'Control de cambios',
            resumen: 'Evalúa, autoriza e implementa las modificaciones mediante un procedimiento: solicitud, evaluación técnica, decisión de la ACC y Orden de Cambio de Ingeniería (OCI).',
            salidas: ['Solicitud de cambio evaluada', 'Decisión de la ACC (aprobar o rechazar)', 'Orden de Cambio de Ingeniería (OCI)'],
            ejemplo: 'Un Pull Request se revisa y se aprueba antes de fusionarse con la rama main.',
            sinCapa: 'Cualquier modificación entra sin autorización ni análisis de impacto, y aparecen errores y efectos secundarios inesperados.',
            seccion: '#control-cambios',
            seccionNombre: 'Sección 4: Control de cambios'
        },
        {
            id: 'auditoria',
            nombre: 'Auditoría de configuración',
            resumen: 'Comprueba que el cambio implementado coincide con lo autorizado y que se siguieron los procedimientos y estándares.',
            salidas: ['Revisión técnica del elemento modificado', 'Verificación frente a la OCI', 'Resultados de la auditoría'],
            ejemplo: 'Se revisa que un cambio en index.html no haya eliminado contenido de otras personas.',
            sinCapa: 'Nadie confirma que lo implementado sea lo autorizado, y los defectos o los cambios no registrados pasan a la versión final.',
            seccion: '#auditoria-estado',
            seccionNombre: 'Sección 5: Auditoría de configuración'
        },
        {
            id: 'reporte',
            nombre: 'Reporte de estado (REC)',
            resumen: 'Registra y comunica qué ocurrió, quién lo hizo, cuándo sucedió y qué más se verá afectado.',
            salidas: ['Registros REC', 'Historial de cambios consultable', 'Informes para el equipo'],
            ejemplo: 'El historial de commits y de Pull Requests de GitHub sirve como evidencia para el reporte.',
            sinCapa: 'No hay trazabilidad: el equipo no puede reconstruir qué cambió, quién lo cambió ni por qué.',
            seccion: '#reporte-estado',
            seccionNombre: 'Sección 5.5: Reporte de estado (REC)'
        }
    ];

    /* ------------------------------------------------------------------
       3. SIMULADOR DE CAPAS
       Cada capa se puede seleccionar (ver detalle) y desactivar (ver riesgos).
       ------------------------------------------------------------------ */
    function initLayerSimulator(root) {
        var activas = {};
        CAPAS.forEach(function (capa) { activas[capa.id] = true; });
        var seleccionada = CAPAS[0].id;

        var diagrama = el('div', { class: 'layer-diagram' });
        var detalle = el('div', { class: 'sim-detail', 'aria-live': 'polite' });
        var medidor = el('div', { class: 'sim-meter' });
        var riesgos = el('div', { class: 'sim-risks', 'aria-live': 'polite' });

        root.appendChild(el('div', { class: 'sim-layout' }, [
            diagrama,
            el('div', { class: 'sim-side' }, [detalle, medidor, riesgos])
        ]));

        /* Construye el diagrama anidado: la capa más externa contiene a las demás. */
        function buildLayer(index) {
            if (index < 0) { return buildCore(); }
            var capa = CAPAS[index];
            var checkboxId = 'capa-switch-' + capa.id;

            var boton = el('button', {
                type: 'button',
                class: 'layer-select',
                'data-select': capa.id,
                'aria-pressed': 'false'
            }, capa.nombre);

            var interruptor = el('input', {
                type: 'checkbox',
                id: checkboxId,
                'data-toggle': capa.id,
                checked: true
            });

            var cabecera = el('div', { class: 'layer-head' }, [
                boton,
                el('label', { class: 'layer-switch', for: checkboxId }, [interruptor, 'Activa'])
            ]);

            return el('div', { class: 'layer', 'data-layer': capa.id }, [cabecera, buildLayer(index - 1)]);
        }

        function buildCore() {
            return el('div', { class: 'layer-core', 'data-layer': NUCLEO.id }, [
                el('button', {
                    type: 'button',
                    class: 'layer-select layer-select-core',
                    'data-select': NUCLEO.id,
                    'aria-pressed': 'false'
                }, [el('span', { class: 'layer-core-title', text: 'ICS' }), el('span', { class: 'layer-core-sub', text: 'Elementos de Configuración' })])
            ]);
        }

        diagrama.appendChild(buildLayer(CAPAS.length - 1));

        function buscar(id) {
            return id === NUCLEO.id ? NUCLEO : CAPAS.filter(function (c) { return c.id === id; })[0];
        }

        function renderDetalle() {
            var item = buscar(seleccionada);
            detalle.textContent = '';
            detalle.appendChild(el('h4', { text: item.nombre }));
            detalle.appendChild(el('p', { text: item.resumen }));
            detalle.appendChild(el('p', { class: 'sim-label', text: 'Qué produce o contiene' }));
            detalle.appendChild(el('ul', {}, item.salidas.map(function (s) { return el('li', { text: s }); })));
            detalle.appendChild(el('p', { class: 'sim-example' }, [el('strong', { text: 'En este proyecto: ' }), item.ejemplo]));
            detalle.appendChild(el('a', { class: 'sim-link', href: item.seccion, text: 'Ir a ' + item.seccionNombre + ' →' }));
        }

        function renderEstado() {
            var total = CAPAS.length;
            var activasTotal = CAPAS.filter(function (c) { return activas[c.id]; }).length;
            var inactivas = CAPAS.filter(function (c) { return !activas[c.id]; });

            medidor.textContent = '';
            medidor.appendChild(el('p', { class: 'sim-label', text: 'Capas activas: ' + activasTotal + ' de ' + total }));
            var barra = el('div', { class: 'meter-bar', 'aria-hidden': 'true' }, [el('div', { class: 'meter-fill' })]);
            barra.firstChild.style.width = (activasTotal / total * 100) + '%';
            barra.firstChild.setAttribute('data-level', activasTotal === total ? 'ok' : (activasTotal >= 3 ? 'warn' : 'danger'));
            medidor.appendChild(barra);

            riesgos.textContent = '';
            if (!inactivas.length) {
                riesgos.appendChild(el('p', { class: 'sim-ok', text: 'Con las cinco capas activas, cada cambio se identifica, se versiona, se autoriza, se verifica y se reporta.' }));
            } else {
                riesgos.appendChild(el('p', { class: 'sim-label', text: 'Riesgos de trabajar sin estas capas' }));
                riesgos.appendChild(el('ul', { class: 'risk-list' }, inactivas.map(function (c) {
                    return el('li', {}, [el('strong', { text: c.nombre + ': ' }), c.sinCapa]);
                })));
                riesgos.appendChild(el('button', { type: 'button', class: 'btn btn-secondary', 'data-reset-layers': 'true', text: 'Activar todas las capas' }));
            }

            [].forEach.call(diagrama.querySelectorAll('.layer'), function (nodo) {
                var id = nodo.getAttribute('data-layer');
                nodo.classList.toggle('is-off', !activas[id]);
            });
            [].forEach.call(diagrama.querySelectorAll('[data-toggle]'), function (input) {
                input.checked = !!activas[input.getAttribute('data-toggle')];
            });
        }

        function renderSeleccion() {
            [].forEach.call(diagrama.querySelectorAll('[data-select]'), function (boton) {
                var activo = boton.getAttribute('data-select') === seleccionada;
                boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
            });
            [].forEach.call(diagrama.querySelectorAll('[data-layer]'), function (nodo) {
                nodo.classList.toggle('is-selected', nodo.getAttribute('data-layer') === seleccionada);
            });
            renderDetalle();
        }

        root.addEventListener('click', function (event) {
            var boton = event.target.closest('[data-select]');
            if (boton && root.contains(boton)) {
                seleccionada = boton.getAttribute('data-select');
                renderSeleccion();
                return;
            }
            if (event.target.closest('[data-reset-layers]')) {
                CAPAS.forEach(function (c) { activas[c.id] = true; });
                renderEstado();
            }
        });

        root.addEventListener('change', function (event) {
            var interruptor = event.target.closest('[data-toggle]');
            if (!interruptor) { return; }
            activas[interruptor.getAttribute('data-toggle')] = interruptor.checked;
            renderEstado();
        });

        renderEstado();
        renderSeleccion();
    }

    /* ------------------------------------------------------------------
       4. RECORRIDO DE UN CAMBIO (con registro REC)
       ------------------------------------------------------------------ */
    var ESCENARIOS = [
        {
            id: 'redaccion',
            titulo: 'Corregir un error de redacción en la Introducción',
            ics: ['index.html (sección 1)'],
            afecta: 'README.md, si cita el texto modificado',
            rama: 'rama-correccion-redaccion',
            commit: 'Corrige redacción de la introducción'
        },
        {
            id: 'seccion',
            titulo: 'Agregar una nueva sección al sitio',
            ics: ['index.html', 'css/styles.css'],
            afecta: 'Menú de navegación y numeración de las secciones',
            rama: 'rama-nueva-seccion',
            commit: 'Agrega nueva sección al sitio'
        },
        {
            id: 'colores',
            titulo: 'Cambiar la paleta de colores del sitio',
            ics: ['css/styles.css'],
            afecta: 'Todas las secciones de index.html (legibilidad y contraste)',
            rama: 'rama-paleta-colores',
            commit: 'Actualiza paleta de colores'
        }
    ];

    var PASOS = [
        { id: 'identificacion', etiqueta: 'Identificación' },
        { id: 'cambios', etiqueta: 'Control de cambios' },
        { id: 'versiones', etiqueta: 'Control de versiones' },
        { id: 'auditoria', etiqueta: 'Auditoría' },
        { id: 'reporte', etiqueta: 'Reporte (REC)' }
    ];

    var COMPROBACIONES = [
        'El cambio realizado coincide con lo autorizado en la OCI.',
        'Se realizó una revisión técnica del elemento modificado.',
        'No se eliminó contenido de otros integrantes y el CSS sigue funcionando.'
    ];

    function formatearHora(fecha) {
        try {
            return fecha.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            return fecha.toTimeString().slice(0, 8);
        }
    }

    function initChangeSimulator(root) {
        var estado;

        function reiniciar() {
            estado = { escenario: null, paso: -1, rechazado: false, terminado: false, registros: [] };
        }
        reiniciar();

        var progreso = el('ol', { class: 'sim-steps', 'aria-label': 'Pasos del recorrido' });
        var panel = el('div', { class: 'sim-panel', tabindex: '-1', 'aria-live': 'polite' });
        var registro = el('div', { class: 'sim-log' });
        root.appendChild(progreso);
        root.appendChild(panel);
        root.appendChild(registro);

        function registrar(que, quien, afecta) {
            var numero = String(estado.registros.length + 1);
            while (numero.length < 2) { numero = '0' + numero; }
            estado.registros.push({
                id: 'REC-SIM-' + numero,
                que: que,
                quien: quien,
                cuando: formatearHora(new Date()),
                afecta: afecta
            });
        }

        function boton(texto, clase, accion, deshabilitado) {
            return el('button', {
                type: 'button',
                class: 'btn ' + clase,
                'data-action': accion,
                disabled: deshabilitado
            }, texto);
        }

        function renderProgreso() {
            progreso.textContent = '';
            PASOS.forEach(function (paso, i) {
                var clases = 'sim-step';
                var marca = '';
                var actual = estado.paso === i && !estado.terminado;
                if (estado.paso > i || (estado.terminado && !estado.rechazado)) { clases += ' is-done'; marca = ' (completado)'; }
                else if (estado.rechazado && estado.paso === i) { clases += ' is-rejected'; marca = ' (rechazado)'; }
                else if (actual) { clases += ' is-current'; marca = ' (paso actual)'; }
                var item = el('li', { class: clases }, [paso.etiqueta, el('span', { class: 'sr-only', text: marca })]);
                if (actual) { item.setAttribute('aria-current', 'step'); }
                progreso.appendChild(item);
            });
        }

        function contenidoPaso() {
            var esc = estado.escenario;
            var contenido = [];

            if (estado.paso === -1) {
                var opciones = ESCENARIOS.map(function (s) {
                    return el('option', { value: s.id, text: s.titulo });
                });
                contenido.push(el('h4', { text: 'Elige un cambio para simularlo' }));
                contenido.push(el('p', { text: 'Imagina que alguien del equipo solicita una modificación. Verás cómo cada capa del proceso interviene y qué registros genera el REC.' }));
                contenido.push(el('label', { class: 'sim-field', for: 'sim-escenario' }, 'Solicitud de cambio'));
                contenido.push(el('select', { id: 'sim-escenario', class: 'sim-select' }, opciones));
                contenido.push(boton('Iniciar solicitud', 'btn-primary', 'iniciar'));
                return contenido;
            }

            if (estado.terminado) {
                contenido.push(el('h4', { text: estado.rechazado ? 'Solicitud rechazada' : 'Cambio integrado y reportado' }));
                contenido.push(el('p', {
                    text: estado.rechazado
                        ? 'La ACC rechazó la solicitud. El cambio no se implementa, pero queda registrado en el REC para mantener la trazabilidad.'
                        : 'El cambio atravesó las cinco capas: se identificó, fue autorizado, se versionó, se auditó y quedó registrado. Revisa el REC de abajo.'
                }));
                contenido.push(boton('Simular otro cambio', 'btn-primary', 'reiniciar'));
                return contenido;
            }

            var paso = PASOS[estado.paso].id;

            if (paso === 'identificacion') {
                contenido.push(el('h4', { text: '1. Identificación: ¿qué ICS se ven afectados?' }));
                contenido.push(el('p', {}, [el('strong', { text: 'Solicitud: ' }), esc.titulo + '.']));
                contenido.push(el('p', { class: 'sim-label', text: 'ICS identificados' }));
                contenido.push(el('ul', {}, esc.ics.map(function (i) { return el('li', {}, [el('code', { text: i })]); })));
                contenido.push(el('p', {}, [el('strong', { text: 'También podría afectar: ' }), esc.afecta + '.']));
                contenido.push(boton('Enviar a control de cambios', 'btn-primary', 'siguiente'));
            } else if (paso === 'cambios') {
                contenido.push(el('h4', { text: '2. Control de cambios: decisión de la ACC' }));
                contenido.push(el('p', { text: 'La Autoridad de Control del Cambio (ACC) evalúa la viabilidad técnica, el costo y el impacto. Si aprueba, se emite una Orden de Cambio de Ingeniería (OCI).' }));
                contenido.push(el('div', { class: 'sim-actions' }, [
                    boton('Aprobar y emitir OCI', 'btn-primary', 'aprobar'),
                    boton('Rechazar solicitud', 'btn-danger', 'rechazar')
                ]));
            } else if (paso === 'versiones') {
                contenido.push(el('h4', { text: '3. Control de versiones: implementación en una rama' }));
                contenido.push(el('p', { text: 'Con la OCI emitida, el responsable trabaja en una rama aislada y registra el cambio con un commit descriptivo.' }));
                contenido.push(el('pre', { class: 'sim-code' }, [el('code', { text: 'git switch -c ' + esc.rama + '\ngit commit -m "' + esc.commit + '"' })]));
                contenido.push(boton('Registrar commit y abrir Pull Request', 'btn-primary', 'siguiente'));
            } else if (paso === 'auditoria') {
                contenido.push(el('h4', { text: '4. Auditoría: verifica el cambio' }));
                contenido.push(el('p', { text: 'Marca cada comprobación para poder completar la auditoría.' }));
                contenido.push(el('ul', { class: 'sim-checks' }, COMPROBACIONES.map(function (texto, i) {
                    var id = 'sim-check-' + i;
                    return el('li', {}, [
                        el('input', { type: 'checkbox', id: id, 'data-check': 'true' }),
                        el('label', { for: id, text: texto })
                    ]);
                })));
                contenido.push(boton('Completar auditoría', 'btn-primary', 'siguiente', true));
            } else if (paso === 'reporte') {
                contenido.push(el('h4', { text: '5. Reporte de estado: cierre del cambio' }));
                contenido.push(el('p', { text: 'Se fusiona el Pull Request con main y se deja constancia en el REC: qué ocurrió, quién lo hizo, cuándo y qué más se afectó.' }));
                contenido.push(boton('Fusionar con main y reportar', 'btn-primary', 'siguiente'));
            }
            return contenido;
        }

        function renderRegistro() {
            registro.textContent = '';
            registro.appendChild(el('h4', { text: 'Registro de estado de la configuración (REC) de la simulación' }));
            if (!estado.registros.length) {
                registro.appendChild(el('p', { class: 'sim-empty', text: 'Aún no hay registros. Inicia una solicitud para generar el primero.' }));
                return;
            }
            var cuerpo = el('tbody', {}, estado.registros.map(function (r) {
                return el('tr', {}, [
                    el('td', { text: r.id }),
                    el('td', { text: r.que }),
                    el('td', { text: r.quien }),
                    el('td', { text: r.cuando }),
                    el('td', { text: r.afecta })
                ]);
            }));
            var tabla = el('table', { class: 'acs-table' }, [
                el('thead', {}, [el('tr', {}, ['Registro', '¿Qué ocurrió?', '¿Quién?', '¿Cuándo?', '¿Qué más se afecta?'].map(function (t) {
                    return el('th', { scope: 'col', text: t });
                }))]),
                cuerpo
            ]);
            registro.appendChild(el('div', { class: 'table-container' }, [tabla]));
        }

        function render(enfocar) {
            renderProgreso();
            panel.textContent = '';
            contenidoPaso().forEach(function (nodo) { panel.appendChild(nodo); });
            renderRegistro();
            if (enfocar) { panel.focus(); }
        }

        function avanzar() {
            var esc = estado.escenario;
            var paso = PASOS[estado.paso].id;
            if (paso === 'identificacion') {
                registrar('ICS afectados identificados: ' + esc.ics.join(', '), 'Desarrollador', esc.afecta);
            } else if (paso === 'versiones') {
                registrar('Cambio implementado en la rama ' + esc.rama, 'Desarrollador', esc.ics.join(', '));
            } else if (paso === 'auditoria') {
                registrar('Auditoría completada: cambio verificado frente a la OCI', 'Equipo auditor', 'Elementos relacionados revisados');
            } else if (paso === 'reporte') {
                registrar('Pull Request fusionado con main y cambio reportado', 'Responsable de ACS', 'Nueva versión disponible para el equipo');
                estado.terminado = true;
                return;
            }
            estado.paso += 1;
        }

        root.addEventListener('click', function (event) {
            var accion = event.target.closest('[data-action]');
            if (!accion || !root.contains(accion)) { return; }
            var tipo = accion.getAttribute('data-action');

            if (tipo === 'iniciar') {
                var id = root.querySelector('#sim-escenario').value;
                estado.escenario = ESCENARIOS.filter(function (s) { return s.id === id; })[0];
                estado.paso = 0;
                registrar('Solicitud de cambio recibida: ' + estado.escenario.titulo, 'Solicitante', 'Pendiente de evaluar');
            } else if (tipo === 'siguiente') {
                avanzar();
            } else if (tipo === 'aprobar') {
                registrar('La ACC aprobó la solicitud y emitió la OCI', 'ACC', estado.escenario.ics.join(', '));
                estado.paso += 1;
            } else if (tipo === 'rechazar') {
                registrar('La ACC rechazó la solicitud; no se implementa el cambio', 'ACC', 'Ningún elemento modificado');
                estado.rechazado = true;
                estado.terminado = true;
            } else if (tipo === 'reiniciar') {
                reiniciar();
            }
            render(true);
        });

        root.addEventListener('change', function (event) {
            if (!event.target.matches('[data-check]')) { return; }
            var marcadas = root.querySelectorAll('[data-check]:checked').length;
            var total = root.querySelectorAll('[data-check]').length;
            var completar = root.querySelector('[data-action="siguiente"]');
            if (completar) { completar.disabled = marcadas !== total; }
        });

        render(false);
    }

    /* ------------------------------------------------------------------
       Inicio
       ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        [].forEach.call(document.querySelectorAll('[data-tabs]'), initTabs);

        var capas = document.getElementById('capas-sim');
        if (capas) { initLayerSimulator(capas); }

        var cambio = document.getElementById('cambio-sim');
        if (cambio) { initChangeSimulator(cambio); }
    });
})();
