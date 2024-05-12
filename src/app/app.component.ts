import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Paciente } from './interface/paciente';
import { RenderImageService } from './service/render-image.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  form!: FormGroup
  fileName!: any;
  paciente!: Paciente | null

  @ViewChild('canva') canva!: ElementRef<HTMLCanvasElement>

  constructor(
    private _render: RenderImageService,
    private _fb: FormBuilder
  ) {
    this.form = this._fb.group({
      imagen: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      peso: ['', Validators.required],
      altura: ['', Validators.required],
    })
  }

  onFileSelected(event: Event): void {
    this.fileName = (event.target as HTMLInputElement).files?.[0]
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const data: Paciente = {
      imagen: this.form.value.imagen,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      peso: this.form.value.peso,
      altura: this.form.value.altura,
    }

    this.paciente = data
    this.paciente.resultado = this.calcularIMC(data.peso, data.altura)
    this.processImage(this.fileName)    
    this.form.reset()
  }

  private processImage(imageFile: File): void {
    this._render.renderImage(this.canva.nativeElement, imageFile)
  }

  calcularIMC(peso: number, altura: number): string {
    const alturaMetros = altura / 100;

    const imc = peso / Math.pow(alturaMetros, 2);

    let categoria = '';
    if (imc < 18.5) categoria = 'Bajo peso';
    else if (imc >= 18.5 && imc < 25) categoria = 'Peso normal';
    else if (imc >= 25 && imc < 30) categoria = 'Sobrepeso';
    else categoria = 'Obesidad'

    return `Su IMC es ${imc.toFixed(2)} y estás en la categoría de: ${categoria}`;
  }

  clean() {
    this.paciente = null
    const canvas = this.canva.nativeElement
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
  }

}
