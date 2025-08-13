import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor() {}

  listar_certificado_cab(id_solicitud: number, idioma_cert: string): Observable<any[]> {
    const mockData = [{
      numero_expediente: 'EXP-2025-001',
      nombre_exportador: 'Exportadora S.A.',
      nombre_importador: 'Importadora Internacional Ltd.',
      direccion_exportador: 'Av. Principal 123, Lima, Perú',
      direccion_importador: '456 Main Street, New York, USA',
      medio_transporte: 'Aéreo - Vuelo LA2024',
      pais_destino: 'Estados Unidos',
      punto_salida: 'Aeropuerto Jorge Chávez - Lima',
      punto_llegada: 'JFK Airport - New York',
      total_mercancia: '500 Kg',
      pais_transito: 'Colombia',
      fecha_cert: 'Lima, 13 de Agosto de 2025'
    }];
    
    return of(mockData).pipe(delay(500));
  }

  listar_certificado_det(id_solicitud: number, idioma_cert: string): Observable<any[]> {
    const mockAnimales = [
      {
        especie: 'Bovino',
        cantidad: '50',
        identificacion: 'BOV-001-2025',
        microchip: 'MC123456789',
        pais_origen_animal: 'Perú',
        raza: 'Holstein',
        sexo: 'Macho',
        edad: '24 meses'
      },
      {
        especie: 'Porcino',
        cantidad: '100',
        identificacion: 'POR-002-2025',
        microchip: 'MC987654321',
        pais_origen_animal: 'Perú',
        raza: 'Yorkshire',
        sexo: 'Hembra',
        edad: '18 meses'
      }
    ];
    
    return of(mockAnimales).pipe(delay(300));
  }
}