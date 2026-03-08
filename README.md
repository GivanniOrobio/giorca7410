Listo. He agregado soporte para los siguientes atributos dinámicos en admin.js:

Atributo	Descripción	Ejemplo
data-field	Contenido de texto	<span data-field="titulo">
data-href	Atributo href	<a data-href="url">
data-class	Clases CSS	<div data-class="activo">
data-style	Estilos CSS completos	<div data-style="color: red">
data-style-*	Propiedad específica	<div data-style-color="color">
data-bg-image	Imagen de fondo	<div data-bg-image="imagen">



        <!-- hero slider -->
        <div class="hero-section hero-slider owl-carousel owl-theme" data-collection data-area="sliders" data-elemento="hero" data-template="#template-slider">
            <!-- Dynamic content will be loaded here -->
        </div>
        <!-- hero slider end -->