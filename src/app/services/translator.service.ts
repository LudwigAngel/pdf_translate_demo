import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private apiUrl = 'https://api.mymemory.translated.net/get';

  constructor() {}

  translate(text: string, from: string, to: string): Observable<any> {
    if (!text || text.trim() === '') {
      return of({ translatedText: text });
    }

    // Simular llamada a API para evitar problemas de CORS en desarrollo
    return this.mockTranslate(text, from, to);
  }

  private mockTranslate(text: string, from: string, to: string): Observable<any> {
    // Diccionario de traducciones más completo
    const translations: { [key: string]: { [key: string]: string } } = {
      'es-en': {
        'CERTIFICADO SANITARIO DE EXPORTACIÓN': 'HEALTH CERTIFICATE FOR EXPORT',
        'Expediente N°': 'Dossier N°',
        'Certificado N°': 'Certificate N°',
        'Exportador': 'Exporter',
        'Importador': 'Importer',
        'Dirección': 'Address',
        'Medio de transporte': 'Means of Transport',
        'País de destino': 'Country of destination',
        'Puesto de Control de Salida': 'Control Point of exit',
        'Punto de Entrada': 'Point of entry',
        'Total de mercancías pecuarias': 'Total of livestock goods',
        'País de Tránsito': 'Transit Country',
        'Descripción': 'Description',
        'Especie animal': 'Animal species',
        'Cantidad': 'Quantity',
        'Identificación': 'Identification',
        'Lugar de origen': 'Place of origin',
        'Raza': 'Breed',
        'Sexo': 'Sex',
        'Edad': 'Age',
        'Se certifica que': 'It is hereby certified that',
        'Observaciones': 'Observations',
        'Lugar y Fecha de emisión': 'Place and date of issue',
        'Firma y sello del Inspector Oficial': 'Official Inspector Signature and Stamp',
        'El SENASA, sus funcionarios y representantes declinan toda responsabilidad': 'SENASA, its officials and representatives decline all responsibility',
        'financiera resultante de este Certificado': 'financial resulting from this Certificate',
        'Aeropuerto Jorge Chávez - Lima': 'Jorge Chavez Airport - Lima',
        'Lima, 13 de Agosto de 2025': 'Lima, August 13, 2025',
        'Exportadora S.A.': 'Exporter S.A.',
        'Importadora Internacional Ltd.': 'International Importer Ltd.',
        'Av. Principal 123, Lima, Perú': '123 Main Avenue, Lima, Peru',
        '456 Main Street, New York, USA': '456 Main Street, New York, USA',
        'Aéreo - Vuelo LA2024': 'Air - Flight LA2024',
        'Estados Unidos': 'United States',
        'JFK Airport - New York': 'JFK Airport - New York',
        'Colombia': 'Colombia',
        'Bovino': 'Bovine',
        'Porcino': 'Swine',
        'Holstein': 'Holstein',
        'Yorkshire': 'Yorkshire',
        'Macho': 'Male',
        'Hembra': 'Female',
        'meses': 'months',
        'Perú': 'Peru'
      },
      'es-fr': {
        'CERTIFICADO SANITARIO DE EXPORTACIÓN': 'CERTIFICAT SANITAIRE D\'EXPORTATION',
        'Expediente N°': 'Dossier N°',
        'Certificado N°': 'Certificat N°',
        'Exportador': 'Exportateur',
        'Importador': 'Importateur',
        'Dirección': 'Adresse',
        'Medio de transporte': 'Moyen de transport',
        'País de destino': 'Pays de destination',
        'Puesto de Control de Salida': 'Point de contrôle de sortie',
        'Punto de Entrada': 'Point d\'entrée'
      }
    };

    const langPair = `${from}-${to}`;
    const translation = translations[langPair] && translations[langPair][text] 
      ? translations[langPair][text] 
      : text;

    return of({ translatedText: translation }).pipe(delay(300));
  }

  // Método para traducir usando la API real (para cuando se resuelvan problemas de CORS)
  private translateWithAPI(text: string, from: string, to: string): Observable<any> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    
    // Aquí iría la llamada HTTP real
    // return this.http.get(url).pipe(
    //   map((response: any) => ({
    //     translatedText: response.responseData.translatedText
    //   })),
    //   catchError(error => {
    //     console.error('Translation error:', error);
    //     return of({ translatedText: text });
    //   })
    // );
    
    return this.mockTranslate(text, from, to);
  }

  // Método para traducir múltiples textos
  translateMultiple(texts: string[], from: string, to: string): Observable<{ [key: string]: string }> {
    const translations: { [key: string]: string } = {};
    
    texts.forEach(text => {
      this.translate(text, from, to).subscribe(result => {
        translations[text] = result.translatedText;
      });
    });

    return of(translations).pipe(delay(500));
  }
}