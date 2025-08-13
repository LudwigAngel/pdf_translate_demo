// Funcionalidad de la aplicación de certificados
let currentLanguage = 'es'; // Idioma por defecto: español
let originalFormData = {}; // Para almacenar los datos originales
let translatedFormData = {}; // Para almacenar los datos traducidos

// API de traducción
const TRANSLATION_API = 'https://api.mymemory.translated.net/get';

// Función para traducir texto usando MyMemory API
async function translateText(text, fromLang, toLang) {
    if (!text || text.trim() === '') return text;
    
    try {
        const response = await fetch(`${TRANSLATION_API}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        } else {
            console.warn('Translation API warning:', data.responseDetails);
            return text; // Retornar texto original si falla
        }
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // Retornar texto original si falla
    }
}

// Función para traducir todos los campos del formulario
async function translateFormFields(fromLang, toLang) {
    const form = document.getElementById('certificadoForm');
    const fields = form.querySelectorAll('input[type="text"], textarea');
    const loadingOverlay = showLoadingOverlay('Traduciendo contenido...');
    
    try {
        for (let field of fields) {
            if (field.value && field.value.trim() !== '') {
                const translatedText = await translateText(field.value, fromLang, toLang);
                field.value = translatedText;
                
                // Pequeña pausa para no sobrecargar la API
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        showSuccessMessage(translations[currentLanguage].contentTranslated || 'Contenido traducido exitosamente');
    } catch (error) {
        console.error('Error translating form fields:', error);
        showErrorMessage(translations[currentLanguage].translationError || 'Error al traducir el contenido');
    } finally {
        hideLoadingOverlay(loadingOverlay);
    }
}

// Función para mostrar overlay de carga
function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

// Función para ocultar overlay de carga
function hideLoadingOverlay(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

// Diccionario de traducciones
const translations = {
    es: {
        pageTitle: 'Certificado Sanitario',
        openCertificate: 'Abrir Certificado',
        modalTitle: 'Certificado Sanitario',
        close: 'Cerrar',
        downloadPDF: 'Descargar PDF',
        exporter: 'Exportador:',
        importer: 'Importador:',
        exporterAddress: 'Dirección Exportador:',
        importerAddress: 'Dirección Importador:',
        transport: 'Transporte:',
        destinationCountry: 'País de Destino:',
        departurePoint: 'Punto de Salida:',
        entryPoint: 'Punto de Entrada:',
        goods: 'Mercancías:',
        quantity: 'Cantidad:',
        weight: 'Peso:',
        date: 'Fecha:',
        certTitle: 'CERTIFICADO SANITARIO',
        certSubtitle: 'HEALTH CERTIFICATE',
        certDescription: 'Este documento certifica que los productos mencionados cumplen con los requisitos sanitarios necesarios.',
        certDescriptionEn: 'This document certifies that the mentioned products meet the necessary sanitary requirements.',
        languageLabel: '🇺🇸 English',
        successMessage: 'PDF generado exitosamente',
        errorMessage: 'Error al generar el PDF. Por favor, inténtelo de nuevo.',
        contentTranslated: 'Contenido traducido exitosamente',
        translationError: 'Error al traducir el contenido',
        translating: 'Traduciendo contenido...'
    },
    en: {
        pageTitle: 'Health Certificate',
        openCertificate: 'Open Certificate',
        modalTitle: 'Health Certificate',
        close: 'Close',
        downloadPDF: 'Download PDF',
        exporter: 'Exporter:',
        importer: 'Importer:',
        exporterAddress: 'Exporter Address:',
        importerAddress: 'Importer Address:',
        transport: 'Transport:',
        destinationCountry: 'Destination Country:',
        departurePoint: 'Departure Point:',
        entryPoint: 'Entry Point:',
        goods: 'Goods:',
        quantity: 'Quantity:',
        weight: 'Weight:',
        date: 'Date:',
        certTitle: 'HEALTH CERTIFICATE',
        certSubtitle: 'CERTIFICADO SANITARIO',
        certDescription: 'This document certifies that the mentioned products meet the necessary sanitary requirements.',
        certDescriptionEn: 'Este documento certifica que los productos mencionados cumplen con los requisitos sanitarios necesarios.',
        languageLabel: '🇪🇸 Español',
        successMessage: 'PDF generated successfully',
        errorMessage: 'Error generating PDF. Please try again.',
        contentTranslated: 'Content translated successfully',
        translationError: 'Error translating content',
        translating: 'Translating content...'
    }
};

function toggleLanguage() {
    const isEnglish = document.getElementById('languageToggle').checked;
    currentLanguage = isEnglish ? 'en' : 'es';
    updateUILanguage();
    
    // Solo actualizar la interfaz, no traducir el contenido del formulario
    console.log('🔄 Idioma de interfaz cambiado a:', currentLanguage === 'es' ? 'Español' : 'English');
}

function updateUILanguage() {
    const t = translations[currentLanguage];
    
    // Actualizar elementos con atributos data
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        element.textContent = currentLanguage === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
    });
    
    // Actualizar elementos específicos
    document.getElementById('languageLabel').textContent = t.languageLabel;
    document.getElementById('certificadoModalLabel').textContent = t.modalTitle;
    
    // Actualizar template del certificado
    updateCertificateTemplate();
}

function updateCertificateTemplate() {
    const t = translations[currentLanguage];
    
    if (currentLanguage === 'en') {
        // Modo inglés
        document.getElementById('cert-title').textContent = t.certTitle;
        document.getElementById('cert-subtitle').textContent = t.certSubtitle;
        document.getElementById('cert-label-exporter').textContent = 'Exporter:';
        document.getElementById('cert-label-exp-address').textContent = 'Address:';
        document.getElementById('cert-label-importer').textContent = 'Importer:';
        document.getElementById('cert-label-imp-address').textContent = 'Address:';
        document.getElementById('cert-label-transport').textContent = 'Transport:';
        document.getElementById('cert-label-destination').textContent = 'Destination Country:';
        document.getElementById('cert-label-departure').textContent = 'Departure Point:';
        document.getElementById('cert-label-entry').textContent = 'Entry Point:';
        document.getElementById('cert-label-goods').textContent = 'Goods:';
        document.getElementById('cert-label-quantity').textContent = 'Quantity:';
        document.getElementById('cert-label-weight').textContent = 'Weight:';
        document.getElementById('cert-label-date').textContent = 'Date:';
        document.getElementById('cert-description').textContent = t.certDescription;
        document.getElementById('cert-description-en').textContent = t.certDescriptionEn;
        document.getElementById('cert-description-en').style.fontStyle = 'normal';
        document.getElementById('cert-description').style.fontStyle = 'italic';
    } else {
        // Modo español (bilingüe)
        document.getElementById('cert-title').textContent = t.certTitle;
        document.getElementById('cert-subtitle').textContent = t.certSubtitle;
        document.getElementById('cert-label-exporter').textContent = 'Exportador / Exporter:';
        document.getElementById('cert-label-exp-address').textContent = 'Dirección / Address:';
        document.getElementById('cert-label-importer').textContent = 'Importador / Importer:';
        document.getElementById('cert-label-imp-address').textContent = 'Dirección / Address:';
        document.getElementById('cert-label-transport').textContent = 'Transporte / Transport:';
        document.getElementById('cert-label-destination').textContent = 'País de Destino / Destination Country:';
        document.getElementById('cert-label-departure').textContent = 'Punto de Salida / Departure Point:';
        document.getElementById('cert-label-entry').textContent = 'Punto de Entrada / Entry Point:';
        document.getElementById('cert-label-goods').textContent = 'Mercancías / Goods:';
        document.getElementById('cert-label-quantity').textContent = 'Cantidad / Quantity:';
        document.getElementById('cert-label-weight').textContent = 'Peso / Weight:';
        document.getElementById('cert-label-date').textContent = 'Fecha / Date:';
        document.getElementById('cert-description').textContent = t.certDescription;
        document.getElementById('cert-description-en').textContent = t.certDescriptionEn;
        document.getElementById('cert-description').style.fontStyle = 'normal';
        document.getElementById('cert-description-en').style.fontStyle = 'italic';
    }
}
// Función para mostrar el modal de descarga
function showDownloadModal() {
    // Validar que hay datos en el formulario
    if (!validateForm()) {
        showErrorMessage(translations[currentLanguage].errorMessage || 'Por favor, complete los campos requeridos');
        return;
    }
    
    // Cerrar el modal del certificado
    const certificateModal = bootstrap.Modal.getInstance(document.getElementById('certificadoModal'));
    certificateModal.hide();
    
    // Mostrar el modal de descarga después de un breve delay
    setTimeout(() => {
        const downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
        downloadModal.show();
    }, 300);
}

// Función para generar PDF en el idioma seleccionado
async function generatePDFInLanguage(selectedLanguage) {
    const loadingOverlay = showLoadingOverlay(
        selectedLanguage === 'es' ? 'Generando certificado en español...' : 'Generating certificate in English...'
    );
    
    try {
        // Obtener los datos originales del formulario
        const formData = new FormData(document.getElementById('certificadoForm'));
        const originalData = Object.fromEntries(formData);
        
        // Traducir los datos si es necesario
        let finalData = { ...originalData };
        
        if (selectedLanguage !== detectFormLanguage(originalData)) {
            finalData = await translateFormData(originalData, selectedLanguage);
        }
        
        // Generar el PDF con los datos traducidos
        await generatePDFWithData(finalData, selectedLanguage);
        
        // Cerrar el modal de descarga
        const downloadModal = bootstrap.Modal.getInstance(document.getElementById('downloadModal'));
        downloadModal.hide();
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showErrorMessage(
            selectedLanguage === 'es' 
                ? 'Error al generar el certificado' 
                : 'Error generating certificate'
        );
    } finally {
        hideLoadingOverlay(loadingOverlay);
    }
}

// Función para detectar el idioma predominante del formulario
function detectFormLanguage(formData) {
    let spanishCount = 0;
    let englishCount = 0;
    
    Object.values(formData).forEach(value => {
        if (value && value.trim()) {
            const detected = detectLanguage(value);
            if (detected === 'es') spanishCount++;
            if (detected === 'en') englishCount++;
        }
    });
    
    return spanishCount >= englishCount ? 'es' : 'en';
}

// Función para traducir todos los datos del formulario
async function translateFormData(originalData, targetLanguage) {
    const translatedData = { ...originalData };
    const sourceLanguage = detectFormLanguage(originalData);
    
    // Solo traducir campos de texto, no la fecha
    const fieldsToTranslate = [
        'exportador', 'importador', 'direccion_exportador', 'direccion_importador',
        'transporte', 'pais_destino', 'salida', 'entrada', 'mercancias', 'cantidad', 'peso'
    ];
    
    for (const field of fieldsToTranslate) {
        if (originalData[field] && originalData[field].trim()) {
            try {
                translatedData[field] = await translateText(
                    originalData[field], 
                    sourceLanguage, 
                    targetLanguage
                );
                // Pequeña pausa para no sobrecargar la API
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error translating field ${field}:`, error);
                translatedData[field] = originalData[field]; // Mantener original si falla
            }
        }
    }
    
    return translatedData;
}

// Función para generar PDF con datos específicos
async function generatePDFWithData(data, language) {
    // Actualizar el template del certificado con el idioma seleccionado
    currentLanguage = language; // Temporalmente cambiar para el template
    updateCertificateTemplate();
    
    // Llenar el template del certificado con los datos traducidos
    document.getElementById('cert-exportador').textContent = data.exportador || '';
    document.getElementById('cert-direccion-exportador').textContent = data.direccion_exportador || '';
    document.getElementById('cert-importador').textContent = data.importador || '';
    document.getElementById('cert-direccion-importador').textContent = data.direccion_importador || '';
    document.getElementById('cert-transporte').textContent = data.transporte || '';
    document.getElementById('cert-pais-destino').textContent = data.pais_destino || '';
    document.getElementById('cert-salida').textContent = data.salida || '';
    document.getElementById('cert-entrada').textContent = data.entrada || '';
    document.getElementById('cert-mercancias').textContent = data.mercancias || '';
    document.getElementById('cert-cantidad').textContent = data.cantidad || '';
    document.getElementById('cert-peso').textContent = data.peso || '';
    document.getElementById('cert-fecha').textContent = data.fecha || '';
    
    // Mostrar el template temporalmente para capturarlo
    const certificateTemplate = document.getElementById('certificateTemplate');
    certificateTemplate.style.display = 'block';
    
    // Generar PDF usando html2canvas y jsPDF
    const canvas = await html2canvas(certificateTemplate, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Crear PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    
    // Descargar el PDF
    const exportador = data.exportador || (language === 'es' ? 'certificado' : 'certificate');
    const prefix = language === 'es' ? 'certificado_sanitario' : 'health_certificate';
    pdf.save(`${prefix}_${exportador.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    
    // Ocultar el template nuevamente
    certificateTemplate.style.display = 'none';
    
    // Mostrar mensaje de éxito
    const successMessage = language === 'es' 
        ? 'Certificado generado exitosamente en español'
        : 'Certificate generated successfully in English';
    showSuccessMessage(successMessage);
    
    // Restaurar el idioma de la interfaz original
    updateUILanguage();
}

// Función original de generatePDF (mantenida para compatibilidad)
function generatePDF() {
    showDownloadModal();
}

// Función para mostrar sugerencia de traducción (mantenida para detección)
function showTranslationSuggestion(detectedLang) {
    // Esta función ya no es necesaria con el nuevo flujo, pero se mantiene para compatibilidad
    console.log('Language detected:', detectedLang);
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Función para detectar el idioma del texto (simple heurística)
function detectLanguage(text) {
    if (!text || text.trim() === '') return null;
    
    // Palabras comunes en español
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'pero', 'sus', 'fue', 'ser', 'han', 'todo', 'está', 'tiene', 'más', 'uno', 'sobre', 'sin', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todos', 'durante', 'sido', 'tres', 'estado', 'muy', 'entre', 'tanto', 'vida', 'bajo', 'años'];
    
    // Palabras comunes en inglés
    const englishWords = ['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'];
    
    const words = text.toLowerCase().split(/\s+/);
    let spanishCount = 0;
    let englishCount = 0;
    
    words.forEach(word => {
        if (spanishWords.includes(word)) spanishCount++;
        if (englishWords.includes(word)) englishCount++;
    });
    
    if (spanishCount > englishCount) return 'es';
    if (englishCount > spanishCount) return 'en';
    return null; // No detectado
}

// Función para mostrar sugerencia de traducción (mantenida para detección)
function showTranslationSuggestion(detectedLang) {
    // Esta función ya no es necesaria con el nuevo flujo, pero se mantiene para compatibilidad
    console.log('Language detected:', detectedLang);
}

// Llenar automáticamente la fecha actual cuando se abre el modal
document.getElementById('certificadoModal').addEventListener('shown.bs.modal', function () {
    const fechaInput = document.getElementById('fecha');
    if (!fechaInput.value) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }
});

// Validación del formulario
function validateForm() {
    const requiredFields = ['exportador', 'importador', 'mercancias'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            if (field) field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Agregar validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('certificadoForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Inicializar idioma por defecto
    updateUILanguage();
    
    console.log('✅ Aplicación de Certificados Sanitarios cargada correctamente');
    console.log('🌐 Sistema de traducción con modal de descarga habilitado');
    console.log('🔗 API de traducción: MyMemory Translation Service');
    console.log('📄 Modo: El formulario mantiene datos originales, el PDF se traduce según selección');
});
