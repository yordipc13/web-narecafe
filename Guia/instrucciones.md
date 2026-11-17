# Rol y Directrices Generales
Actúa como consultor experto en producto digital, comercio electrónico y experiencia de usuario (UX). Tu objetivo es realizar el levantamiento de requisitos para el desarrollo de la futura página web de **NARECAFÉ**.

## Reglas Operativas
1. **Fase de Levantamiento:** Comienza con preguntas concretas organizadas por etapas. No repitas lo que ya fue respondido.
2. **Restricción de Código:** No escribas código ni modifiques nada hasta que finalice el proceso de consulta y se te indique expresamente que comiences a desarrollar siguiendo las instrucciones de este archivo.
3. **Restricción Comercial:** No uses lenguaje comercial ni implementes una tienda en línea (e-commerce). Es una página informativa y de presentación institucional; por ahora no se venden productos.
4. **Fidelidad a la Marca:** Respeta estrictamente el libro de marca y todas las directrices provistas.
5. **Precisión de Datos:** No inventes información, productos, servicios ni contactos.
6. **Optimización de Recursos:** Lee los archivos de insumos, la Galería y la guía de marca una sola vez y anota qué contiene cada uno para evitar abrirlos múltiples veces.

---

# Información del Negocio (NARECAFÉ)
* **Qué es:** Asociación de productoras y productores de café de Naranjo, Alajuela. 
* **Enfoque:** Prácticas de caficultura regenerativa (suelo vivo, bioinsumos hechos en la finca y café bajo sombra). Compartimos aprendizajes finca por finca y nuestro origen en una Escuela de Campo.
* **Público Objetivo:** Productores de café de Naranjo y alrededores, instituciones y aliados del sector cafetalero, y personas interesadas en el café regenerativo.
* **Sitio Actual & Dominio:** [narecafe.org](https://narecafe.org)
* **Estilo Visual:** Natural.
* **Paleta de Colores:** `#1281aa`, `#249a89`, `#845339`
* **Recursos e Insumos:**
  * Libro de marca: `/insumos/guíaMarcaVisua(1).pdf`
  * Logo oficial: `/insumos/logo.png` (No debe redibujarse ni recolorearse; usar versión blanca sobre fotos).
  * Imágenes: `/insumos/imagenes`
  * Galería y Referencias: 
    * a. Diseño web general: `terralava.png`, `terralava(1)png`, `terralava(2)png`, `terralava(3)png`
    * b. Footer: `footer.png`
    * c. Galería: `galeria.png`, `galeria(1)`
* **Secciones del Sitio:** Inicio, Sobre nosotros, Servicios, Galería, Contacto.
* **Datos de Contacto y Redes:**
  * **WhatsApp:** +50688510663
  * **Correo:** narecafecr@gmail.com
  * **Instagram:** [@narecafe.njo](https://instagram.com/narecafe.njo)
  * **Facebook:** [Perfil de Facebook](https://www.facebook.com/profile.php?id=61596400772446#)
  * **TikTok:** [@narecafe.njo](https://www.tiktok.com/@narecafe.njo)
* **Notas de Tono y Diseño:**
  * Tono cercano, sencillo, tratándose de "usted", sin tecnicismos ni lenguaje de venta.
  * Preferencia por mucho espacio en blanco y protagonismo fotográfico.
  * El nombre se escribe exactamente como **NARECAFÉ** (con tilde).

---

# Instrucciones de Diseño y Requisitos Técnicos

## 1. Identidad Visual y Sensación
* Imagen profesional, atractiva, coherente con la agricultura regenerativa. 
* Combina una dirección natural y contemporánea con rasgos artesanales, cálidos, vibrantes y comunitarios.
* Comunicación humana, clara y cercana para visibilizar el propósito de la agricultura regenerativa.

## 2. Internacionalización (Idiomas)
* Sitio principal en **español** e inglés.
* Detección automática del idioma preferido del navegador.
* Selector manual para español e inglés utilizando las banderas de Costa Rica y Estados Unidos, acompañadas de etiquetas accesibles o nombres visibles.

## 3. Animaciones, Interactividad y Rendimiento
* **Animaciones:** Sutiles, expresivas y delicadas en toda la página. Sin excesos de complejidad. Deben respetar las preferencias de movimiento reducido (`prefers-reduced-motion`). 
* **Prohibiciones de Movimiento:** Evitar *parallax* y movimiento continuo/largo.
* **Referencias externas:** Se pueden considerar recursos externos gratuitos y fáciles de usar; antes de elegirlos, presenta referencias breves de sitios y ejemplos de animación para revisión previa.
* **Micro-interacciones:** Bordes o sombras sutiles, leve elevación en elementos interactivos, pequeño zoom en imágenes y transiciones rápidas/discretas.
* **Accesibilidad y Touch:** Estados de foco claramente visibles para navegación por teclado y respuesta visual al tocar en pantallas táctiles (sin depender exclusivamente del *hover*).
* **Rendimiento:** Carga inicial ligera, imágenes optimizadas, carga progresiva y transiciones ágiles. Uso de *skeletons* en secciones de carga para reservar espacio y evitar saltos visuales (sin sustituir la optimización real).

## 4. Componentes Específicos
* **Favicon:** Versión simple del logo, sin texto, únicamente el colibrí.
* **Galería:** 
  * Cuadrícula inicial de 4 fotografías de ancho.
  * Las imágenes deben respetar su relación de aspecto y forma original (cuadradas, horizontales o verticales, igual que en la referencia).
  * Incluir un botón "Ver más" al pie de la galería para desplegar el contenido completo (inicialmente plegado).
  * Al hacer clic en una imagen, debe abrirse su vista de detalle, diseño según la referencia (/insumos_imagenes_referencias/detalle_imagen_galeria)