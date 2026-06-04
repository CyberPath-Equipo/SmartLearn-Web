import api from '../api/axios';

/**
 * Sube una imagen asociada a una materia.
 * Envía un FormData con el archivo y el idMateria al endpoint /imagenes/subir.
 * Cloudinary devuelve la URL y el backend actualiza materia.slug.
 *
 * @param {File} file - Archivo de imagen seleccionado por el usuario.
 * @param {number|string} idMateria - ID de la materia a la que se asociará la imagen.
 * @returns {Promise<Object>} La materia actualizada con el nuevo slug.
 */
export const subirImagenMateria = async (file, idMateria) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('idMateria', idMateria);

  const response = await api.post(
    '/imagenes/subir',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};
