import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RenderImageService {

  renderImage(
    canvas: HTMLCanvasElement,
    image: File,
  ): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      const imageUrl = URL.createObjectURL(image);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('No se pudo obtener el contexto del canvas.');
        return;
      }

      // Crear una nueva imagen
      const newImage = new Image()

      newImage.onload = () => {

        // Calcular la escala para ajustar la imagen al alto del canvas
        const scale = Math.min(canvas.width / newImage.width, canvas.height / newImage.height)

        // Calcular las nuevas dimensiones de la imagen con la escala calculada
        const newWidth = newImage.width * scale
        const newHeight = newImage.height * scale

        // Calcular las coordenadas para centrar la imagen en el canvas
        const offsetX = (canvas.width - newWidth) / 2
        const offsetY = (canvas.height - newHeight) / 2

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Dibujar la nueva imagen en el canvas
        ctx.drawImage(newImage, offsetX, offsetY, newWidth, newHeight)

        //Librar recursos
        URL.revokeObjectURL(imageUrl)

        resolve()

        newImage.onerror = () => reject('Error al cargar la imagen.')
      }
      newImage.src = imageUrl
    })
  }

}
