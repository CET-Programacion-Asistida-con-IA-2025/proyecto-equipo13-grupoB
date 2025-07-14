// Toggle functions
function toggleCVBuilder() {
    const section = document.getElementById('cvBuilder');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleCourses() {
    const section = document.getElementById('coursesSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleResources() {
    const section = document.getElementById('resourcesSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleSimulator() {
    const section = document.getElementById('interviewSimulator');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    if (section.style.display === 'block') {
        initializeInterview();
    }
}

// Navegación entre páginas

function showInterviewTips() {
    alert('💡 Consejos para entrevistas:\n\n✅ Investiga la empresa\n✅ Prepara ejemplos específicos\n✅ Practica tu lenguaje corporal\n✅ Haz preguntas inteligentes\n✅ Llega 10 minutos antes');
}

function openCVBuilderNewTab() {
    window.open('cv-builder.html', '_blank');
}

function openCoursesNewTab() {
    window.open('cursos-gratuitos.html', '_blank');
}

function openResourcesNewTab() {
    window.open('resources.html', '_blank');
}

function openSimulatorNewTab() {
    window.open('interview-simulator.html', '_blank');
}

// URLs externas
function openExternalCourses() {
    window.open('https://www.coursera.org', '_blank');
}

function openLinkedInJobs() {
    window.open('https://www.linkedin.com/jobs', '_blank');
}

function navigateToPage(url, newTab = false) {
    if (newTab) {
        window.open(url, '_blank');
    } else {
        window.location.href = url;
    }
}

// CV Generation
async function downloadCV() {
    console.log("🚀 Iniciando generación de PDF...");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margin = 10;
    let y = margin;

    try {
        // Obtener datos
        const nombre = document.getElementById("preview-nombre").textContent;
        const email = document.getElementById("preview-email").textContent;
        const telefono = document.getElementById("preview-telefono").textContent;
        const direccion = document.getElementById("preview-direccion").textContent;
        const linkedin = document.getElementById("preview-linkedin").textContent;
        const perfil = document.getElementById("preview-perfil").textContent;
        const experiencia = document.getElementById("preview-experiencia").innerText;
        const educacion = document.getElementById("preview-educacion").innerText;
        const habilidades = document.getElementById("preview-habilidades").innerText;
        const idiomas = document.getElementById("preview-idiomas").innerText;

        console.log("📄 Datos capturados:");
        console.log({ nombre, email, telefono, direccion, linkedin, perfil, experiencia, educacion, habilidades, idiomas });

        // Título
        doc.setFontSize(18);
        doc.text(nombre, margin, y);
        y += 10;

        doc.setFontSize(11);
        doc.text(email, margin, y); y += 6;
        doc.text(telefono, margin, y); y += 6;
        doc.text(direccion, margin, y); y += 6;
        doc.text(linkedin, margin, y); y += 10;

        // Sección Perfil
        doc.setFontSize(14);
        doc.text("Perfil Profesional", margin, y); y += 6;

        doc.setFontSize(11);
        const perfilLines = doc.splitTextToSize(perfil, 180);
        doc.text(perfilLines, margin, y); y += perfilLines.length * 6;

        // Sección Experiencia
        doc.setFontSize(14);
        doc.text("Experiencia Laboral", margin, y); y += 6;

        doc.setFontSize(11);
        const expLines = doc.splitTextToSize(experiencia, 180);
        doc.text(expLines, margin, y); y += expLines.length * 6;

        // Sección Educación
        doc.setFontSize(14);
        doc.text("Educación", margin, y); y += 6;

        doc.setFontSize(11);
        const eduLines = doc.splitTextToSize(educacion, 180);
        doc.text(eduLines, margin, y); y += eduLines.length * 6;

        // Sección Habilidades
        doc.setFontSize(14);
        doc.text("Habilidades", margin, y); y += 6;

        doc.setFontSize(11);
        const habLines = doc.splitTextToSize(habilidades, 180);
        doc.text(habLines, margin, y); y += habLines.length * 6;

        // Sección Idiomas
        doc.setFontSize(14);
        doc.text("Idiomas", margin, y); y += 6;

        doc.setFontSize(11);
        const idiomaLines = doc.splitTextToSize(idiomas, 180);
        doc.text(idiomaLines, margin, y); y += idiomaLines.length * 6;

        console.log("✅ PDF listo, descargando...");
        doc.save("cv_generado.pdf");

    } catch (error) {
        console.error("❌ Error al generar el PDF:", error);
    }
}


// Course filtering
function filterCourses(category, event) {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.resource-item');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Interview simulator
const questions =
    [
        {
            text: "¿Cuáles son tus principales fortalezas?",
            keywords: ["fortaleza", "habilidad", "competencia", "experiencia", "logro"],
            type: "strengths"
        },
        {
            text: "¿Cómo manejas el trabajo bajo presión?",
            keywords: ["presión", "estrés", "deadline", "tiempo", "organización", "priorizar"],
            type: "pressure"
        },
        {
            text: "¿Dónde te ves en 5 años?",
            keywords: ["futuro", "crecimiento", "objetivo", "carrera", "desarrollo", "aspiración"],
            type: "future"
        },
        {
            text: "¿Por qué deberíamos contratarte?",
            keywords: ["valor", "aporte", "beneficio", "experiencia", "diferencia", "contribución"],
            type: "value"
        },
        {
            text: "Cuéntame sobre un desafío que hayas superado",
            keywords: ["desafío", "problema", "solución", "resultado", "aprendizaje", "superé"],
            type: "challenge"
        }
    ];

let currentQuestion = null;

function analyzeResponse(response, questionType) {
    const text = response.toLowerCase();
    const words = text.split(' ');
    const wordCount = words.length;

    let feedback = "🤖 **Análisis de tu respuesta:**\n\n";
    let score = 0;
    let suggestions = [];

    // Análisis de longitud
    if (wordCount < 20) {
        feedback += "⚠️ **Longitud:** Tu respuesta es muy breve. ";
        suggestions.push("Desarrolla más tus ideas con ejemplos específicos");
    } else if (wordCount > 100) {
        feedback += "⚠️ **Longitud:** Tu respuesta es muy extensa. ";
        suggestions.push("Sé más conciso y directo");
        score += 5;
    } else {
        feedback += "✅ **Longitud:** Perfecta extensión. ";
        score += 15;
    }

    // Análisis específico por tipo de pregunta
    switch (questionType) {
        case "strengths":
            if (text.includes("soy") || text.includes("tengo") || text.includes("mi")) {
                score += 10;
                feedback += "✅ **Personalización:** Bien, hablas en primera persona. ";
            } else {
                suggestions.push("Usa más 'yo soy' o 'tengo la habilidad de'");
            }

            if (text.includes("ejemplo") || text.includes("cuando") || text.includes("vez")) {
                score += 15;
                feedback += "✅ **Ejemplos:** Excelente, incluyes ejemplos concretos. ";
            } else {
                suggestions.push("Agrega un ejemplo específico de cuándo usaste esa fortaleza");
            }
            break;

        case "pressure":
            if (text.includes("organizo") || text.includes("priorizo") || text.includes("planif")) {
                score += 15;
                feedback += "✅ **Estrategia:** Bien, mencionas técnicas específicas. ";
            } else {
                suggestions.push("Menciona técnicas concretas como organización o priorización");
            }

            if (text.includes("resultado") || text.includes("logré") || text.includes("exitoso")) {
                score += 10;
                feedback += "✅ **Resultados:** Perfecto, hablas de outcomes positivos. ";
            } else {
                suggestions.push("Menciona los resultados positivos que obtuviste");
            }
            break;

        case "future":
            if (text.includes("crecimiento") || text.includes("desarrollar") || text.includes("aprender")) {
                score += 15;
                feedback += "✅ **Crecimiento:** Excelente, muestras mentalidad de crecimiento. ";
            } else {
                suggestions.push("Enfatiza tu deseo de crecimiento y aprendizaje");
            }

            if (text.includes("empresa") || text.includes("organización") || text.includes("equipo")) {
                score += 10;
                feedback += "✅ **Compromiso:** Bien, conectas tu futuro con la empresa. ";
            } else {
                suggestions.push("Conecta tus objetivos con el crecimiento de la empresa");
            }
            break;

        case "value":
            if (text.includes("experiencia") || text.includes("habilidad") || text.includes("conocimiento")) {
                score += 10;
                feedback += "✅ **Credenciales:** Bien, mencionas tu experiencia. ";
            } else {
                suggestions.push("Destaca tu experiencia y habilidades relevantes");
            }

            if (text.includes("beneficio") || text.includes("aporte") || text.includes("contribu")) {
                score += 15;
                feedback += "✅ **Valor:** Perfecto, hablas de tu contribución. ";
            } else {
                suggestions.push("Explica específicamente qué valor agregarías a la empresa");
            }
            break;

        case "challenge":
            if (text.includes("situación") || text.includes("problema") || text.includes("desafío")) {
                score += 10;
                feedback += "✅ **Contexto:** Bien, describes la situación claramente. ";
            } else {
                suggestions.push("Describe mejor el contexto del desafío");
            }

            if (text.includes("solución") || text.includes("resolv") || text.includes("logré")) {
                score += 15;
                feedback += "✅ **Solución:** Excelente, explicas cómo lo resolviste. ";
            } else {
                suggestions.push("Explica paso a paso cómo solucionaste el problema");
            }
            break;
    }

    // Análisis de palabras clave
    const questionKeywords = questions.find(q => q.type === questionType)?.keywords || [];
    const keywordMatches = questionKeywords.filter(keyword =>
        text.includes(keyword) || text.includes(keyword.slice(0, -1))
    );

    if (keywordMatches.length > 0) {
        score += keywordMatches.length * 5;
        feedback += `✅ **Relevancia:** Usas palabras clave relevantes (${keywordMatches.join(', ')}). `;
    }

    // Análisis de estructura STAR (Situación, Tarea, Acción, Resultado)
    let starElements = 0;
    if (text.includes("situación") || text.includes("contexto")) starElements++;
    if (text.includes("tarea") || text.includes("responsabilidad")) starElements++;
    if (text.includes("hice") || text.includes("realicé") || text.includes("decidí")) starElements++;
    if (text.includes("resultado") || text.includes("logré") || text.includes("conseguí")) starElements++;

    if (starElements >= 2) {
        score += 10;
        feedback += "✅ **Estructura:** Sigues una buena estructura narrativa. ";
    } else {
        suggestions.push("Usa la estructura STAR: Situación, Tarea, Acción, Resultado");
    }

    // Puntuación final
    feedback += `\n\n📊 **Puntuación: ${score}/100**\n\n`;

    if (score >= 80) {
        feedback += "🎉 **¡Excelente respuesta!** Estás muy bien preparado.";
    } else if (score >= 60) {
        feedback += "👍 **Buena respuesta.** Con algunos ajustes será perfecta.";
    } else if (score >= 40) {
        feedback += "⚡ **Respuesta aceptable.** Necesita mejoras importantes.";
    } else {
        feedback += "🔄 **Respuesta necesita trabajo.** Te sugiero rehacer la respuesta.";
    }

    // Agregar sugerencias
    if (suggestions.length > 0) {
        feedback += "\n\n💡 **Sugerencias para mejorar:**\n";
        suggestions.forEach((suggestion, index) => {
            feedback += `${index + 1}. ${suggestion}\n`;
        });
    }

    return feedback;
}

function submitResponse() {
    const response = document.getElementById('userResponse').value;
    if (response.trim()) {
        const chatArea = document.getElementById('chatArea');

        // Mostrar respuesta del usuario
        chatArea.innerHTML += `<div style="background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #2196F3;"><strong>📝 Tu respuesta:</strong><br>${response}</div>`;

        // Analizar respuesta
        const feedback = analyzeResponse(response, currentQuestion?.type || 'general');

        // Mostrar feedback analizado
        chatArea.innerHTML += `<div style="background: #f1f8e9; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #4CAF50; white-space: pre-line;"><strong>🎯 Análisis detallado:</strong><br><br>${feedback}</div>`;

        // Limpiar campo
        document.getElementById('userResponse').value = '';

        // Scroll al final
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

function getNewQuestion() {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    currentQuestion = randomQuestion;
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML += `<div style="background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #FF9800;"><strong>🎤 Nueva pregunta:</strong><br>${randomQuestion.text}</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Inicializar con primera pregunta
function initializeInterview() {
    currentQuestion = questions[0];
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
        <div style="background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 10px; text-align: center;">
            <h3>🤖 Entrevistador Virtual</h3>
            <p>¡Hola! Soy tu entrevistador con IA. Analizaré cada respuesta y te daré feedback detallado para mejorar.</p>
        </div>
        <div style="background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #FF9800;">
            <strong>🎤 Pregunta inicial:</strong><br>${currentQuestion.text}
            <br><br>
            <small>💡 <strong>Tip:</strong> Usa ejemplos específicos y la estructura STAR (Situación, Tarea, Acción, Resultado)</small>
        </div>
    `;
}

let experienciaCount = 0;
let educacionCount = 0;
let idiomasCount = 0;

// Agregar experiencia
function agregarExperiencia() {
    experienciaCount++;
    const container = document.getElementById('experiencia-container');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.innerHTML = `
                <h3>Experiencia ${experienciaCount}</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Puesto</label>
                        <input type="text" class="exp-puesto" placeholder="Ej: Desarrollador Full Stack">
                    </div>
                    <div class="form-group">
                        <label>Empresa</label>
                        <input type="text" class="exp-empresa" placeholder="Ej: Tech Company S.A.">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha inicio</label>
                        <input type="month" class="exp-inicio">
                    </div>
                    <div class="form-group">
                        <label>Fecha fin</label>
                        <input type="month" class="exp-fin">
                    </div>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea class="exp-descripcion" placeholder="Describe tus responsabilidades y logros..."></textarea>
                </div>
                <button class="btn btn-danger" onclick="eliminarElemento(this)">Eliminar</button>
            `;
    container.appendChild(div);
    agregarEventListeners();
}

// Agregar educación
function agregarEducacion() {
    educacionCount++;
    const container = document.getElementById('educacion-container');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.innerHTML = `
                <h3>Educación ${educacionCount}</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Título</label>
                        <input type="text" class="edu-titulo" placeholder="Ej: Ingeniería en Sistemas">
                    </div>
                    <div class="form-group">
                        <label>Institución</label>
                        <input type="text" class="edu-institucion" placeholder="Ej: Universidad de Buenos Aires">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Año de graduación</label>
                        <input type="number" class="edu-año" placeholder="2023">
                    </div>
                </div>
                <button class="btn btn-danger" onclick="eliminarElemento(this)">Eliminar</button>
            `;
    container.appendChild(div);
    agregarEventListeners();
}

// Agregar idioma
function agregarIdioma() {
    idiomasCount++;
    const container = document.getElementById('idiomas-container');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.innerHTML = `
                <h3>Idioma ${idiomasCount}</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Idioma</label>
                        <input type="text" class="idioma-nombre" placeholder="Ej: Inglés">
                    </div>
                    <div class="form-group">
                        <label>Nivel</label>
                        <select class="idioma-nivel">
                            <option value="Básico">Básico</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                            <option value="Nativo">Nativo</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="eliminarElemento(this)">Eliminar</button>
            `;
    container.appendChild(div);
    agregarEventListeners();
}

// Eliminar elemento
function eliminarElemento(button) {
    button.parentElement.remove();
    actualizarPreview();
}

// Actualizar preview
function actualizarPreview() {
    // Información personal
    document.getElementById('preview-nombre').textContent = document.getElementById('nombre').value || 'Tu Nombre';
    // document.getElementById('preview-email').textContent = document.getElementById('email').value || 'tu@email.com';
    // document.getElementById('preview-telefono').textContent = document.getElementById('telefono').value || 'Tu teléfono';
    // document.getElementById('preview-direccion').textContent = document.getElementById('direccion').value || 'Tu dirección';
    // document.getElementById('preview-linkedin').textContent = document.getElementById('linkedin').value || 'LinkedIn';
    // document.getElementById('preview-perfil').textContent = document.getElementById('perfil').value || 'Aquí aparecerá tu perfil profesional...';

    // Experiencia
    const experienciaContainer = document.getElementById('preview-experiencia');
    experienciaContainer.innerHTML = '';
    document.querySelectorAll('#experiencia-container .dynamic-section').forEach(section => {
        const puesto = section.querySelector('.exp-puesto').value;
        const empresa = section.querySelector('.exp-empresa').value;
        const inicio = section.querySelector('.exp-inicio').value;
        const fin = section.querySelector('.exp-fin').value;
        const descripcion = section.querySelector('.exp-descripcion').value;

        if (puesto || empresa) {
            const div = document.createElement('div');
            div.className = 'cv-item';
            div.innerHTML = `
                        <h4>${puesto} - ${empresa}</h4>
                        <p>${inicio} - ${fin}</p>
                        <p>${descripcion}</p>
                    `;
            experienciaContainer.appendChild(div);
        }
    });

    // Educación
    const educacionContainer = document.getElementById('preview-educacion');
    educacionContainer.innerHTML = '';
    document.querySelectorAll('#educacion-container .dynamic-section').forEach(section => {
        const titulo = section.querySelector('.edu-titulo').value;
        const institucion = section.querySelector('.edu-institucion').value;
        const año = section.querySelector('.edu-año').value;

        if (titulo || institucion) {
            const div = document.createElement('div');
            div.className = 'cv-item';
            div.innerHTML = `
                        <h4>${titulo}</h4>
                        <p>${institucion} - ${año}</p>
                    `;
            educacionContainer.appendChild(div);
        }
    });

    // Habilidades
    const habilidadesContainer = document.getElementById('preview-habilidades');
    habilidadesContainer.innerHTML = '';
    const habilidades = document.getElementById('habilidades').value.split(',');
    habilidades.forEach(habilidad => {
        if (habilidad.trim()) {
            const span = document.createElement('span');
            span.className = 'skill-tag';
            span.textContent = habilidad.trim();
            habilidadesContainer.appendChild(span);
        }
    });

    // Idiomas
    const idiomasContainer = document.getElementById('preview-idiomas');
    idiomasContainer.innerHTML = '';
    document.querySelectorAll('#idiomas-container .dynamic-section').forEach(section => {
        const nombre = section.querySelector('.idioma-nombre').value;
        const nivel = section.querySelector('.idioma-nivel').value;

        if (nombre) {
            const div = document.createElement('div');
            div.className = 'cv-item';
            div.innerHTML = `<p><strong>${nombre}</strong> - ${nivel}</p>`;
            idiomasContainer.appendChild(div);
        }
    });
}

// Agregar event listeners
function agregarEventListeners() {
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', actualizarPreview);
        element.addEventListener('change', actualizarPreview);
    });
}


// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el formulario?')) {
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.value = '';
        });
        document.getElementById('experiencia-container').innerHTML = '';
        document.getElementById('educacion-container').innerHTML = '';
        document.getElementById('idiomas-container').innerHTML = '';
        experienciaCount = 0;
        educacionCount = 0;
        idiomasCount = 0;
        actualizarPreview();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    agregarEventListeners();
    actualizarPreview();
});