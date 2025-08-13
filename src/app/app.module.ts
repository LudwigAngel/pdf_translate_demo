import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CertificadoComponent } from './components/certificado/certificado.component';
import { SolicitudService } from './services/solicitud.service';
import { TranslatorService } from './services/translator.service';

@NgModule({
  declarations: [
    AppComponent,
    CertificadoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SolicitudService,
    TranslatorService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }