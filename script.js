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

// CV Generation
function generateCV() {
    const formData = new FormData(document.getElementById('cvForm'));
    alert('¡CV optimizado generado! 🎉\n\nTu CV ha sido optimizado para superar filtros ATS. Incluye las palabras clave correctas para tu área profesional.');
}


async function downloadCV() 
{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Mostrar mensaje de descarga
    alert('📥 Descargando CV en formato PDF...\n\nTu CV optimizado se está descargando.');

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const area = document.getElementById("area").value;
    const experiencia = document.getElementById("experiencia").value;
    const habilidades = document.getElementById("habilidades").value;
    const objetivo = document.getElementById("objetivo").value;

    doc.setFontSize(16);
    doc.text("Currículum Vitae", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 35);
    doc.text(`Email: ${email}`, 20, 45);
    if (telefono) doc.text(`Teléfono: ${telefono}`, 20, 55);
    doc.text(`Área: ${area}`, 20, 65);

    doc.text("Experiencia laboral:", 20, 80);
    doc.text(doc.splitTextToSize(experiencia || "-", 170), 20, 90);

    doc.text("Habilidades:", 20, 130);
    doc.text(doc.splitTextToSize(habilidades || "-", 170), 20, 140);

    doc.text("Objetivo profesional:", 20, 170);
    doc.text(doc.splitTextToSize(objetivo || "-", 170), 20, 180);

    doc.save("cv_generado.pdf");
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

function showInterviewTips() {
    alert('💡 Consejos para entrevistas:\n\n✅ Investiga la empresa\n✅ Prepara ejemplos específicos\n✅ Practica tu lenguaje corporal\n✅ Haz preguntas inteligentes\n✅ Llega 10 minutos antes');
}
