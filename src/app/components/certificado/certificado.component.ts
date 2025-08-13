import { Component, ElementRef, Input, OnInit } from '@angular/core';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { SolicitudService } from '../../services/solicitud.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TranslatorService } from '../../services/translator.service';

declare var jsPDF: any;
declare var html2canvas: any;

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css']
})
export class CertificadoComponent implements OnInit {
  @Input('data_solicitud_new') data_solicitud_new: any = {
    id: 1,
    idioma_cert: 'ESP',
    numero_expediente: 'EXP-2025-001',
    codigo_certificado: 'CERT-001',
    desc_certificado_expo_flag: 'Los productos mencionados',
    desc_certificado_expo: 'cumplen con los requisitos sanitarios establecidos',
    desc_certificado_expo_dos_flag: 'y son aptos',
    desc_certificado_expo_dos: 'para el consumo humano.',
    observacion_certificado_expo: 'Sin observaciones adicionales.'
  };
  @Input('data_solicitud_new2') data_solicitud_new2: any;

  closeResult: string = '';
  modalRef: any; // Add modalRef property
  certificado: any;
  lista_certificado: any;
  lista_animales: any;
  readonlyPorId: { [id: string]: boolean } = {
    exportador: true,
    importador: true,
    direccion_exportador: true,
    direccion_importador: true,
    transporte: true,
    pais_destino: true,
    salida: true,
    entrada: true,
    mercancias: true,
    pais_transito: true,
    certifica: true,
    observaciones: true,
    lugar_fecha: true
  };
  salidaTraducida: any;
  idiomaSeleccionado: string = 'ESP'; // Idioma por defecto
  idiomasDisponibles = [
    { codigo: 'ESP', nombre: 'Español' },
    { codigo: 'ENG', nombre: 'English' },
    { codigo: 'FRA', nombre: 'Français' }
  ];

  bloquear_carga_recuperar: boolean = false;  // CONTROLAR LA CARGA
  traduciendoCertificado: boolean = false;    // CONTROLAR TRADUCCIÓN

  constructor(
    private apiSolicitud: SolicitudService,
    private datepipe: DatePipe,
    private translator: TranslatorService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.inicializarComponente();
  }

  inicializarComponente() {
    this.setIdioma();
    this.llenarFormulario();
  }

  // Método para cambiar idioma y traducir todo el certificado
  async cambiarIdioma(nuevoIdioma: string) {
    if (this.traduciendoCertificado) return;
    
    this.traduciendoCertificado = true;
    this.idiomaSeleccionado = nuevoIdioma;
    
    // Cambiar data_solicitud_new para reflejar el nuevo idioma
    this.data_solicitud_new.idioma_cert = nuevoIdioma;
    
    try {
      if (nuevoIdioma === 'ENG') {
        await this.traducirCertificadoCompleto('es', 'en');
      } else if (nuevoIdioma === 'FRA') {
        await this.traducirCertificadoCompleto('es', 'fr');
      } else {
        // Restaurar al español original
        await this.restaurarIdiomaOriginal();
      }
      
      this.setIdioma();
      this.llenarFormulario();
    } catch (error) {
      console.error('Error al traducir:', error);
    } finally {
      this.traduciendoCertificado = false;
    }
  }

  // Traducir todo el contenido del certificado
  async traducirCertificadoCompleto(from: string, to: string) {
    if (!this.certificado || !this.lista_animales) return;

    // Traducir datos del certificado
    const certificadoTraducido = { ...this.certificado };
    
    // Campos a traducir
    const camposTraducir = [
      'nombre_exportador', 'nombre_importador', 'direccion_exportador', 
      'direccion_importador', 'medio_transporte', 'pais_destino', 
      'punto_salida', 'punto_llegada', 'total_mercancia', 'pais_transito', 'fecha_cert'
    ];

    for (const campo of camposTraducir) {
      if (certificadoTraducido[campo]) {
        try {
          const traduccion = await this.translator.translate(certificadoTraducido[campo], from, to).toPromise();
          certificadoTraducido[campo] = traduccion.translatedText;
        } catch (error) {
          console.error(`Error traduciendo ${campo}:`, error);
        }
      }
    }

    // Traducir lista de animales
    const animalesTraducidos = [];
    for (const animal of this.lista_animales) {
      const animalTraducido = { ...animal };
      
      const camposAnimal = ['especie', 'pais_origen_animal', 'raza', 'sexo'];
      
      for (const campo of camposAnimal) {
        if (animalTraducido[campo]) {
          try {
            const traduccion = await this.translator.translate(animalTraducido[campo], from, to).toPromise();
            animalTraducido[campo] = traduccion.translatedText;
          } catch (error) {
            console.error(`Error traduciendo animal ${campo}:`, error);
          }
        }
      }
      
      animalesTraducidos.push(animalTraducido);
    }

    // Traducir campos de data_solicitud_new
    if (this.data_solicitud_new.desc_certificado_expo) {
      try {
        const traduccion = await this.translator.translate(this.data_solicitud_new.desc_certificado_expo, from, to).toPromise();
        this.data_solicitud_new.desc_certificado_expo = traduccion.translatedText;
      } catch (error) {
        console.error('Error traduciendo desc_certificado_expo:', error);
      }
    }

    if (this.data_solicitud_new.desc_certificado_expo_dos) {
      try {
        const traduccion = await this.translator.translate(this.data_solicitud_new.desc_certificado_expo_dos, from, to).toPromise();
        this.data_solicitud_new.desc_certificado_expo_dos = traduccion.translatedText;
      } catch (error) {
        console.error('Error traduciendo desc_certificado_expo_dos:', error);
      }
    }

    if (this.data_solicitud_new.observacion_certificado_expo) {
      try {
        const traduccion = await this.translator.translate(this.data_solicitud_new.observacion_certificado_expo, from, to).toPromise();
        this.data_solicitud_new.observacion_certificado_expo = traduccion.translatedText;
      } catch (error) {
        console.error('Error traduciendo observacion_certificado_expo:', error);
      }
    }

    // Actualizar los datos
    this.certificado = certificadoTraducido;
    this.lista_animales = animalesTraducidos;
  }

  // Restaurar idioma original (español)
  async restaurarIdiomaOriginal() {
    // Recargar datos originales
    await this.recuperarCertificado(this.data_solicitud_new.id, 'ESP');
    
    // Restaurar datos originales de data_solicitud_new
    this.data_solicitud_new.desc_certificado_expo = 'cumplen con los requisitos sanitarios establecidos';
    this.data_solicitud_new.desc_certificado_expo_dos = 'para el consumo humano.';
    this.data_solicitud_new.observacion_certificado_expo = 'Sin observaciones adicionales.';
  }

  desbloquearTodosCampos() {
    this.readonlyPorId['exportador'] = false;
    this.readonlyPorId['importador'] = false;
    this.readonlyPorId['direccion_exportador'] = false;
    this.readonlyPorId['direccion_importador'] = false;
    this.readonlyPorId['transporte'] = false;
    this.readonlyPorId['pais_destino'] = false;
    this.readonlyPorId['salida'] = false;
    this.readonlyPorId['entrada'] = false;
    this.readonlyPorId['mercancias'] = false;
    this.readonlyPorId['pais_transito'] = false;
    this.readonlyPorId['certifica'] = false;
    this.readonlyPorId['observaciones'] = false;
    this.readonlyPorId['lugar_fecha'] = false;
  }
  
  bloquearTodosCampos() {
    this.readonlyPorId['exportador'] = true;
    this.readonlyPorId['importador'] = true;
    this.readonlyPorId['direccion_exportador'] = true;
    this.readonlyPorId['direccion_importador'] = true;
    this.readonlyPorId['transporte'] = true;
    this.readonlyPorId['pais_destino'] = true;
    this.readonlyPorId['salida'] = true;
    this.readonlyPorId['entrada'] = true;
    this.readonlyPorId['mercancias'] = true;
    this.readonlyPorId['pais_transito'] = true;
    this.readonlyPorId['certifica'] = true;
    this.readonlyPorId['observaciones'] = true;
    this.readonlyPorId['lugar_fecha'] = true;
  }
  
  desbloquearCampo(id: string) {
    this.readonlyPorId[id] = false;
  }
  
  bloquearCampo(id: string) {
    this.readonlyPorId[id] = true;
  }

  async open(content: any) {
    this.bloquear_carga_recuperar = false;  // FINALIZÓ CARGA
    // Simulación de modal - en lugar de usar NgBootstrap
    console.log('Abriendo certificado...');
    
    this.setIdioma();
    this.initTextareas();
    await this.recuperarCertificado(this.data_solicitud_new.id, this.data_solicitud_new.idioma_cert);
    this.llenarFormulario();
    this.bloquearTodosCampos();
    await this.traducirPuntoSalida();
  }

  setIdioma():void {
    const setTextContent = (id: string, value: string): void => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
      else console.warn(`Elemento con id '${id}' no encontrado`);
    };

    if (this.data_solicitud_new.idioma_cert === 'ING') {
      setTextContent('titulo-h1', 'HEALT CERTIFICATE');
      setTextContent('text-nro-expediente', 'Dossier N° :');
      setTextContent('text-nro-certificado', 'Certificate N° :');
      setTextContent('text-exportador', 'Exporter:');
      setTextContent('text-importador', 'Importer:');
      setTextContent('text-direccion-exportador', 'Address:');
      setTextContent('text-direccion-importador', 'Address:');
      setTextContent('text-transporte', 'Means of Transport:');
      setTextContent('text-pais-destino', 'Country of destination:');
      setTextContent('text-salida', 'Control Point of exit:');
      setTextContent('text-entrada', 'Point of entry:');
      setTextContent('text-mercancias', 'Total of goods:');
      setTextContent('text-pais-transito', 'Transit Country:');
      setTextContent('text-descripcion', 'Description:');
      setTextContent('tabla-text-especie-1', 'Animal species');
      setTextContent('tabla-text-especie-2', '-Product-');
      setTextContent('tabla-text-especie-3', 'By-products');
      setTextContent('tabla-text-cantidad-1', 'Quantity');
      setTextContent('tabla-text-cantidad-2', '(Kg)');
      setTextContent('tabla-text-identificacion', 'Identification');
      setTextContent('tabla-text-lugar-origen', 'Place of source');
      setTextContent('tabla-text-animales', 'Only for animals');
      setTextContent('tabla-text-raza', 'Breed');
      setTextContent('tabla-text-sexo', 'Sex');
      setTextContent('tabla-text-edad', 'Age');
      setTextContent('text-certifica', 'Certification:');
      setTextContent('text-observaciones', 'Comments:');
      setTextContent('text-lugar-fecha', 'Place and date of issue:');
      setTextContent('text-firma-sello', 'Official Inspector Signatura and Stamp');
      setTextContent('text-pie-pagina-1', 'No financial liability with respect to this certificate shall attach to SENASA or to ');
      setTextContent('text-pie-pagina-2', 'any of its officers or representatives.');

    } else if (this.data_solicitud_new.idioma_cert === 'ESP') {
      setTextContent('titulo-h1', 'CERTIFICADO SANITARIO DE EXPORTACIÓN');
      setTextContent('text-nro-expediente', 'Expediente N° :');
      setTextContent('text-nro-certificado', 'Certificado N° :');
      setTextContent('text-exportador', 'Exportador:');
      setTextContent('text-importador', 'Importador:');
      setTextContent('text-direccion-exportador', 'Dirección:');
      setTextContent('text-direccion-importador', 'Dirección:');
      setTextContent('text-transporte', 'Medio de transporte:');
      setTextContent('text-pais-destino', 'País de destino:');
      setTextContent('text-salida', 'Puesto de Control de Salida:');
      setTextContent('text-entrada', 'Punto de Entrada:');
      setTextContent('text-mercancias', 'Total de mercancias pecuarias:');
      setTextContent('text-pais-transito', 'País de Tránsito:');
      setTextContent('text-descripcion', 'Descripción:');
      setTextContent('tabla-text-especie-1', 'Especie animal');
      setTextContent('tabla-text-especie-2', '-Productos-');
      setTextContent('tabla-text-especie-3', 'Subproducto');
      setTextContent('tabla-text-cantidad-1', 'Cantidad');
      setTextContent('tabla-text-cantidad-2', '(Kg)');
      setTextContent('tabla-text-identificacion', 'Identificación');
      setTextContent('tabla-text-lugar-origen', 'Lugar de origen');
      setTextContent('tabla-text-animales', 'Solo para animales');
      setTextContent('tabla-text-raza', 'Raza');
      setTextContent('tabla-text-sexo', 'Sexo');
      setTextContent('tabla-text-edad', 'Edad');
      setTextContent('text-certifica', 'Se certifica que:');
      setTextContent('text-observaciones', 'Observaciones:');
      setTextContent('text-lugar-fecha', 'Lugar y Fecha de emisión:');
      setTextContent('text-firma-sello', 'Firma y sello del Inspector Oficial');
      setTextContent('text-pie-pagina-1', 'El SENASA, sus funcionarios y representantes declinan toda responsabilidad');
      setTextContent('text-pie-pagina-2', 'financiera resultante de este Certificado.');
    }
  }

  async recuperarCertificado(id_solicitud: number, idioma_cert: string) {
    const data = await this.apiSolicitud.listar_certificado_cab(id_solicitud, idioma_cert).toPromise();
    console.log(data);
    this.lista_certificado = data;
    this.certificado = this.lista_certificado[0];

    const data1 = await this.apiSolicitud.listar_certificado_det(id_solicitud, idioma_cert).toPromise();
    console.log(data1);
    this.lista_animales = data1;
  }

  async initTextareas() {
    const modalElement = document.querySelector('.modal-contenido');
    if (!modalElement) return;

    const textareas = modalElement.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
    textareas.forEach(textarea => {
      textarea.style.overflow = 'hidden';
      textarea.style.resize = 'none';
      this.adjustHeight(textarea);
      textarea.addEventListener('input', () => this.adjustHeight(textarea));
    });
  }

  private adjustHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = '15px';
    textarea.style.height = textarea.scrollHeight + 'px';
    if (textarea.value.trim() !== '') { textarea.classList.add('filled-propio'); }
    else { textarea.classList.remove('filled-propio'); }
  }

  private getDismissReason(reason: any): string {
    if (reason === 'ESC') {
      return 'by pressing ESC';
    } else if (reason === 'BACKDROP_CLICK') {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async descargarPDF(): Promise<void> {
    this.bloquear_carga_recuperar = true;  // EMPIEZA A CARGAR

    // Esperar un poco para que el modal esté renderizado
    await new Promise(r => setTimeout(r, 100));

    const modalBody = document.querySelector('.modal-cuerpo');
    if (!modalBody) {
      console.error('No se encontró el modal-body para capturar.');
      return;
    }

    const secciones = modalBody.querySelectorAll('.doc-seccion');
    if (secciones.length === 0) {
      console.error('No se encontraron secciones secciones del documento dentro del modal.');
      return;
    }

    var pdf = new jsPDF('p', 'pt','a4',true);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let cursorY = 0;

    for (let i = 0; i < secciones.length; i++) {
      const seccion = secciones[i] as HTMLElement;

      // Reemplazar textareas por divs para html2canvas
      const textareas = seccion.querySelectorAll('textarea');
      const reemplazos: { original: HTMLTextAreaElement; reemplazo: HTMLDivElement }[] = [];

      textareas.forEach((textarea: HTMLTextAreaElement) => {
        const div = document.createElement('div');
        div.textContent = textarea.value;
        div.style.whiteSpace = 'pre-wrap';
        div.style.font = window.getComputedStyle(textarea).font;
        div.style.padding = textarea.style.padding;
        div.style.border = textarea.style.border;
        div.style.width = textarea.offsetWidth + 'px';
        div.style.height = textarea.offsetHeight + 'px';
        div.style.backgroundColor = '#fff';
        textarea.style.display = 'none';
        textarea.parentNode!.insertBefore(div, textarea.nextSibling);
        reemplazos.push({ original: textarea, reemplazo: div });
      });

      // Renderizar con html2canvas
      const canvas = await html2canvas(seccion, { scale: 4 });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Agregar página nueva si no cabe
      if (cursorY + imgHeight > pageHeight) {
        pdf.addPage();
        cursorY = 0;
      }

      pdf.addImage(imgData, 'PNG', 0, cursorY, imgWidth, imgHeight);
      cursorY += imgHeight;

      // Restaurar textareas
      reemplazos.forEach(({ original, reemplazo }) => {
        reemplazo.remove();
        original.style.display = 'block';
      });
    }
    let nombre_file = "CERTIFICADO" + this.data_solicitud_new.numero_expediente + "_" +this.data_solicitud_new.id + "_" + this.datepipe.transform(new Date(), 'yyyyMMdd_HHmmss') + ".pdf"
    pdf.save(nombre_file);
    this.bloquear_carga_recuperar = false;  // FINALIZÓ CARGA
  }

  agregarFilaVacia(): void {
    const tbody = document.querySelector("#descripcion tbody") as HTMLTableSectionElement | null;
    if (!tbody) {
      console.warn("No se encontró el tbody con id 'descripcion'");
      return;
    }
    const filaOriginal = tbody.querySelector("tr") as HTMLTableRowElement | null;
    if (!filaOriginal) {
      console.warn("No se encontró una fila original para clonar");
      return;
    }
    const nuevaFila = filaOriginal.cloneNode(true) as HTMLTableRowElement;

    const textareas = nuevaFila.querySelectorAll("textarea") as NodeListOf<HTMLTextAreaElement>;
    textareas.forEach(textarea => textarea.value = "");

    tbody.appendChild(nuevaFila);

    this.initTextareas();
  }

  async traducirPuntoSalida() {
    this.translator.translate(this.certificado.punto_salida, 'es', 'en')
      .subscribe(res => {
        this.salidaTraducida = res.translatedText;
        alert (this.salidaTraducida)
      });
  }

  llenarFormulario(): void {
    const setTextContent = (id: string, value: string): void => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
      else console.warn(`Elemento con id '${id}' no encontrado`);
    };

    const setInputValue = (id: string, value: string): void => {
      const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (input) input.value = value;
      else console.warn(`Elemento con id '${id}' no encontrado`);
    };

    if (this.certificado) {
      setTextContent('nro-certificado', this.data_solicitud_new.codigo_certificado);
      setTextContent('nro-expediente', this.certificado.numero_expediente);
      setInputValue('exportador', this.certificado.nombre_exportador);
      setInputValue('importador', this.certificado.nombre_importador);
      setInputValue('direccion-exportador', this.certificado.direccion_exportador);
      setInputValue('direccion-importador', this.certificado.direccion_importador);
      setInputValue('transporte', this.certificado.medio_transporte);
      setInputValue('pais-destino', this.certificado.pais_destino);
      setInputValue('salida', this.certificado.punto_salida);
      setInputValue('entrada', this.certificado.punto_llegada);
      setInputValue('mercancias', this.certificado.total_mercancia);
      setInputValue('pais-transito', this.certificado.pais_transito);
      setInputValue('certifica', this.data_solicitud_new.desc_certificado_expo_flag  + ' ' +this.data_solicitud_new.desc_certificado_expo );
      setInputValue('certifica2', this.data_solicitud_new.desc_certificado_expo_dos_flag + ' ' + this.data_solicitud_new.desc_certificado_expo_dos);
      setInputValue('observaciones', this.data_solicitud_new.observacion_certificado_expo);
      setInputValue('lugar-fecha', this.certificado.fecha_cert);
    }

    if (this.lista_animales) {
      const arrayAnimales: string[][] = this.lista_animales.map((animal: any) => [
        String(animal.especie),
        String(animal.cantidad),
        String(animal.identificacion),
        String(animal.microchip),
        String(animal.pais_origen_animal),
        String(animal.raza),
        String(animal.sexo),
        String(animal.edad)
      ]);
      const datos = arrayAnimales;

      datos.forEach((filaDatos, index) => {
        const filas = document.querySelectorAll("#descripcion tbody tr") as NodeListOf<HTMLTableRowElement>;
        const ultimaFila = filas[filas.length - 1];
        const textareas = ultimaFila.querySelectorAll("textarea") as NodeListOf<HTMLTextAreaElement>;
        textareas.forEach((textarea, i) => {
          textarea.value = filaDatos[i] || "";
        });
        if (index < datos.length - 1) {
          this.agregarFilaVacia();
        } else {
          this.initTextareas();
        }
      });
    }
  }
}