/* ============================================================
   BIBLIOTECA DE PROMPS — PROMPTS GPT-4O IMAGES
   Módulo: Prompts de generación de imagen traducidos/adaptados al
   español desde el proyecto jamez-bondos/awesome-gpt4o-images.
   Licencia del contenido original: CC BY 4.0 (atribución requerida).
   Fuente: https://github.com/jamez-bondos/awesome-gpt4o-images
   Modelos recomendados: GPT-4o Image / gpt-image-1 (ChatGPT, Sora).
   ============================================================ */
/* global module */

const PROMPTS_DB_GPT4O = {
  'categorias': [
    {
      'id': 'gpt4o_imagen',
      'nombre': 'Generación de Imagen GPT-4o',
      'icono': '🎨',
      'color': '#ad1457',
      'descripcion': 'Prompts de generación y edición de imagen con GPT-4o / gpt-image-1',
      'fuente': 'awesome-gpt4o-images',
      'subcategorias': [
        {
          'id': 'g4o_estilo',
          'nombre': 'Estilos Artísticos',
          'prompts': [
            {
              'id': 'g4o_art_001',
              'titulo': 'Paisaje miniatura Cyberpunk con efecto tilt-shift',
              'categoria': 'Arte',
              'prioridad': 'media',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Cyberpunk', 'Miniatura', 'Tilt-shift', '3D', 'isométrico'],
              'nota': "Puedes reemplazar [Cyberpunk] por otros estilos: 'Ciudad futurista', 'Steampunk', 'Aldea medieval', etc.",
              'prompt': 'Un paisaje miniatura de [Cyberpunk] muy detallado visto desde arriba, usando un efecto de lente tilt-shift. La escena está llena de elementos de juguete, todos renderizados en CG de alta resolución. Una iluminación dramática crea una atmósfera cinematográfica, con colores vívidos y fuerte contraste, enfatizando la profundidad de campo y una micro-perspectiva realista, haciendo que el espectador sienta que contempla un mundo de juguete. La imagen contiene muchos detalles y juegos visuales que invitan a mirarla repetidamente.'
            },
            {
              'id': 'g4o_art_002',
              'titulo': 'Arte de silueta con fondo degradado',
              'categoria': 'Arte',
              'prioridad': 'media',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Silueta', 'Minimalista', 'Degradado'],
              'nota': 'Reemplaza [SUJETO] por el objeto o figura deseada.',
              'prompt': 'La silueta del contorno básico de un [SUJETO]. El fondo es de un amarillo brillante con un degradado suave. Diseño minimalista y elegante, alto contraste entre la silueta negra y el fondo luminoso, composición centrada y limpia.'
            },
            {
              'id': 'g4o_art_003',
              'titulo': 'Retrato en doble exposición surrealista',
              'categoria': 'Arte',
              'prioridad': 'alta',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Doble exposición', 'Surrealista', 'Retrato', 'Naturaleza'],
              'prompt': 'Una imagen de doble exposición que combina el perfil de un rostro humano con un paisaje natural (bosque, montañas y cielo nublado) fundiéndose dentro de la silueta de la cara. Estilo artístico monocromático con tonos suaves, alto detalle, atmósfera onírica y cinematográfica, transparencia y superposición de capas.'
            }
          ]
        },
        {
          'id': 'g4o_objetos',
          'nombre': 'Objetos y Productos',
          'prompts': [
            {
              'id': 'g4o_obj_001',
              'titulo': 'Icono 3D estilo vóxel (Octane render)',
              'categoria': 'Producto',
              'prioridad': 'alta',
              'uso': 'Diseño UI',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Vóxel', '3D', 'Icono', 'Octane', '8k'],
              'nota': 'Requiere imagen de referencia: sube un ícono vóxel de referencia y la imagen a convertir.',
              'prompt': 'Convierte la imagen / descripción / emoji en un ícono 3D vóxel igual que la imagen de referencia, render Octane, 8k. Pasos: 1) Subir imagen de referencia del estilo vóxel. 2) Subir la foto/ícono a convertir. 3) Aplicar este prompt.'
            },
            {
              'id': 'g4o_obj_002',
              'titulo': 'Diorama miniatura dentro de un keycap ESC',
              'categoria': 'Producto',
              'prioridad': 'alta',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Isométrico', 'Diorama', 'Keycap', '3D', 'Miniatura'],
              'prompt': "Un render 3D isométrico ultrarrealista que muestra un mini espacio de trabajo de computadora dentro de un keycap de teclado mecánico translúcido, colocado sobre la tecla ESC de un teclado mecánico real de superficie mate. Dentro del keycap, un pequeño personaje con una sudadera cómoda y texturizada se sienta en una silla ergonómica moderna, trabajando concentrado frente a una pantalla brillante ultrarrealista. El espacio está lleno de accesorios tecnológicos miniatura realistas: lámpara de escritorio, monitores con reflejos, pequeñas rejillas de altavoz, cables enrollados y tazas de cerámica. La base está compuesta por tierra, rocas y musgo, con textura fotográfica. La iluminación interior simula luz natural de la mañana con sombras suaves y tonos cálidos. La palabra 'ESC' está grabada con sutil efecto de vidrio esmerilado en la parte superior del keycap. Teclas circundantes (F1, Q, Shift, CTRL) visibles con texturas realistas. Imagen como capturada por una cámara de gama alta, con poca profundidad de campo y detalle cinematográfico."
            },
            {
              'id': 'g4o_obj_003',
              'titulo': 'Gota de helado con emoji (brote de crema)',
              'categoria': 'Producto',
              'prioridad': 'media',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Emoji', 'Helado', '3D', 'Render'],
              'nota': 'Reemplaza el emoji por el deseado.',
              'prompt': 'Un cono de helado suave y cremoso en forma de emoji, con la textura del emoji expresado en el sabor y colores correspondientes. Renderizado 3D fotorrealista, iluminación de estudio limpia, colores pastel vibrantes, aspecto apetitoso y juguetón sobre fondo liso minimalista.'
            }
          ]
        },
        {
          'id': 'g4o_personajes',
          'nombre': 'Personajes y Retratos',
          'prompts': [
            {
              'id': 'g4o_per_001',
              'titulo': 'Portada de revista de moda (cheongsam rosa)',
              'categoria': 'Retrato',
              'prioridad': 'alta',
              'uso': 'Publicidad',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Moda', 'Retrato', 'Magazine', 'Fotorrealista'],
              'prompt': "Una mujer hermosa viste un cheongsam (qipao) rosa, con un delicado tocado floral en el cabello adornado con flores de colores, y un elegante cuello de encaje blanco alrededor del cuello. Con una mano sostiene suavemente varias mariposas grandes. El estilo de fotografía presenta una textura de alta definición, similar al diseño de portada de una revista de moda, con el texto 'FASHION DESIGN' en el centro superior de la foto. El fondo es un gris claro liso y minimalista para resaltar al sujeto."
            },
            {
              'id': 'g4o_per_002',
              'titulo': 'Muñeco de punto acogedor (knitted doll)',
              'categoria': 'Personaje',
              'prioridad': 'media',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Knitted', 'Tejido', 'Peluche', 'Tierno'],
              'nota': 'Reemplaza [SUJETO] por el personaje o animal deseado.',
              'prompt': 'Un adorable muñeco de punto tejido a mano de [SUJETO], estilo suave y acogedor, hecho de lana con costuras y textura de tejido visibles, ojos de botón, fondo desenfocado cálido, iluminación suave, fotografía macro de producto, aspecto tierno y artesanal.'
            },
            {
              'id': 'g4o_per_003',
              'titulo': 'Figura de acción anime personalizada desde foto',
              'categoria': 'Personaje',
              'prioridad': 'alta',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Anime', 'Figura', 'Figma', 'Estilizado'],
              'nota': 'Requiere una foto de referencia de la persona.',
              'prompt': 'Convierte la persona de la foto en una figura de acción estilo anime coleccionable, presentada dentro de su empaque/blister de juguete original con tarjeta de personaje ilustrada. Estilo de escultura anime con proporciones estilizadas, colores vibrantes, acabado de PVC, iluminación de producto, fotografía realista de la figura en su caja.'
            }
          ]
        },
        {
          'id': 'g4o_conceptos',
          'nombre': 'Conceptos Creativos',
          'prompts': [
            {
              'id': 'g4o_con_001',
              'titulo': 'Criatura/Pokémon original a partir de un objeto',
              'categoria': 'Concepto',
              'prioridad': 'alta',
              'uso': 'Creativo',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Pokemon', 'Criatura', 'RPG', 'Enciclopedia'],
              'nota': 'Requiere una foto de un objeto o comida como inspiración. Si no funciona a la primera, abre una nueva conversación.',
              'prompt': 'Crea una criatura original inspirada en este objeto (foto provista). La criatura debe parecer pertenecer a un universo fantástico de captura de monstruos, con un diseño tierno o genial influido por el arte retro de monstruos de RPG japoneses. La imagen debe incluir: una vista de cuerpo completo de la criatura inspirada en la forma, materiales o propósito del objeto; una pequeña esfera o cápsula (similar a una pokeball) a sus pies, con patrones y colores que combinen con el aspecto del objeto (diseño personalizado, no una pokeball estándar); un nombre inventado para la criatura mostrado junto a ella; y su tipo elemental (Fuego, Agua, Metal, Naturaleza, Eléctrico, etc.) basado en las propiedades del objeto. La ilustración debe parecer sacada de una enciclopedia de criaturas fantásticas, con líneas limpias, sombras suaves y un diseño expresivo.'
            },
            {
              'id': 'g4o_con_002',
              'titulo': 'Anuncio creativo de producto (cápsula de felicidad)',
              'categoria': 'Publicidad',
              'prioridad': 'media',
              'uso': 'Publicidad',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Anuncio', 'Producto', 'Copy', 'Mockup'],
              'prompt': "Título (letras grandes): 'Cápsulas de Felicidad de Acción Rápida'. Una pequeña píldora con la mitad superior verde estilo Starbucks y la mitad inferior transparente, con el logo impreso, llena de granos de café adentro. Descripción (letras pequeñas): 'Tómalo cuando estés triste, tres veces al día, dos cápsulas por toma'. Botón de compra del mismo color que la píldora, con el precio debajo: $9. Incluye la nota 'Compra según criterio médico'. Diseño de empaque/anuncio limpio y profesional."
            },
            {
              'id': 'g4o_con_003',
              'titulo': 'Fusión de letra y significado de palabra',
              'categoria': 'Concepto',
              'prioridad': 'media',
              'uso': 'Diseño',
              'fuente': 'awesome-gpt4o-images',
              'tags': ['Tipografía', 'Letra', 'Concepto', 'Diseño'],
              'nota': 'Reemplaza la letra y la palabra por las deseadas.',
              'prompt': "La letra mayúscula '[LETRA]' en el centro, donde la forma de la letra se integra creativamente con objetos/escenas que representan el significado de la palabra '[PALABRA]'. Ilustración 3D conceptual, composición limpia, colores armónicos, tipografía grande y legible, estilo de póster minimalista con fondo neutro."
            }
          ]
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROMPTS_DB_GPT4O };
}
