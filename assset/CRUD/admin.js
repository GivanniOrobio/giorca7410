class CollectionManager {
  constructor() {
    this.instances = [];
  }

  iniciar() {
    const elementos = document.querySelectorAll("[data-collection]");

    elementos.forEach((el) => {
      const area = el.dataset.area; //nombre coleccion
      const elemento = el.dataset.elemento; // descripcion
      const templateId = el.dataset.template;

      const instancia = new CollectionRenderer(area, elemento, el, templateId);
      this.instances.push(instancia);
      instancia.init();
    });
  }
}

class CollectionRenderer {
  constructor(area, elemento, container, templateId) {
    this.area = area;
    this.elemento = elemento;
    this.container = container;
    this.template = document.querySelector(templateId);
    this.baseUrl = "https://apinodetestpython.onrender.com/api/collections";
    // Build endpoint - if elemento looks like an ObjectId, use it directly
    // Otherwise, fetch collection and filter by description/slug field
    this.isObjectId = /^[0-9a-fA-F]{24}$/.test(elemento);
    this.endpoint = `${this.baseUrl}/${area}/${elemento}`;
    this.collectionEndpoint = `${this.baseUrl}/${area}`;
  }

  async obtenerDatos() {
    try {
      console.log(`[CollectionRenderer] Cargando datos desde: ${this.endpoint}`);
      
      // If elemento is not a valid ObjectId, fetch collection and filter
      if (!this.isObjectId) {
        return await this.fetchWithFilter();
      }
      
      const response = await fetch(this.endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[CollectionRenderer] Datos recibidos para ${this.area}/${this.elemento}:`, data);
      return this.extractItems(data);
    } catch (error) {
      console.error(`[CollectionRenderer] Error cargando colección ${this.area}/${this.elemento}:`, error);
      return [];
    }
  }

  async fetchWithFilter() {
    try {
      // Map logical names to actual descripcion values
      const filterMap = {
        'header': 'contacto',
        'about': 'about-info',
        'servicios': 'feature-item',
        'hero': 'hero-slider'
      };
      
      const filterValue = filterMap[this.elemento] || this.elemento;
      
      console.log(`[CollectionRenderer] Fetching collection: ${this.collectionEndpoint} and filtering by: ${filterValue}`);
      
      const response = await fetch(this.collectionEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[CollectionRenderer] Collection data:`, data);
      
      const items = this.extractItems(data);
      
      // Filter items by descripcion field or other identifier
      const filteredItems = items.filter(item => {
        return item.descripcion === filterValue ||
               item.slug === filterValue ||
               item.nombre === filterValue;
      });
      
      console.log(`[CollectionRenderer] Filtered items (${this.elemento}):`, filteredItems);
      return filteredItems;
    } catch (error) {
      console.error(`[CollectionRenderer] Error fetching collection ${this.area}:`, error);
      return [];
    }
  }

  extractItems(data) {
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    } else if (typeof data === 'object' && data !== null) {
      const arrayProp = Object.values(data).find(val => Array.isArray(val));
      if (arrayProp) return arrayProp;
      return [data];
    }
    return [];
  }

  renderItem(data) {
    if (!this.template) {
      console.warn(`[CollectionRenderer] Template no encontrado para ${this.area}/${this.elemento}`);
      return document.createElement("div");
    }

    const clone = this.template.content.cloneNode(true);

    // Handle text content fields (data-field)
    const elementos = clone.querySelectorAll("[data-field]");
    elementos.forEach((el) => {
      const campo = el.dataset.field;
      if (data[campo] !== undefined) {
        el.textContent = data[campo];
      } else {
        console.warn(`[CollectionRenderer] Campo "${campo}" no encontrado en los datos`, data);
      }
    });

    // Handle href attributes (data-href)
    const hrefElements = clone.querySelectorAll("[data-href]");
    hrefElements.forEach((el) => {
      const campo = el.dataset.href;
      if (data[campo] !== undefined) {
        el.href = data[campo];
      }
    });

    // Handle src attributes (data-src)
    const srcElements = clone.querySelectorAll("[data-src]");
    srcElements.forEach((el) => {
      const campo = el.dataset.src;
      if (data[campo] !== undefined) {
        el.src = data[campo];
      }
    });
    

    // Handle CSS classes (data-class)
    const classElements = clone.querySelectorAll("[data-class]");
    classElements.forEach((el) => {
      const campo = el.dataset.class;
      if (data[campo] !== undefined) {
        // Split by space to handle multiple classes
        const classes = data[campo].split(' ');
        classes.forEach(cls => {
          if (cls.trim()) {
            el.classList.add(cls.trim());
          }
        });
      }
    });

    // Handle CSS styles (data-style)
    const styleElements = clone.querySelectorAll("[data-style]");
    styleElements.forEach((el) => {
      const campo = el.dataset.style;
      if (data[campo] !== undefined) {
        el.style.cssText = data[campo];
      }
    });

    // Handle specific style properties (data-style-property="field")
    const allElements = clone.querySelectorAll("*");
    allElements.forEach((el) => {
      Object.keys(el.dataset).forEach((key) => {
        if (key.startsWith('style') && key !== 'style') {
          const campo = el.dataset[key];
          const styleProp = key.replace('style', '').replace(/^[A-Z]/, (match) => match.toLowerCase());
          if (data[campo] !== undefined && styleProp !== '') {
            el.style[styleProp] = data[campo];
          }
        }
      });
    });

    // Handle background image (data-bg-image)
    const bgElements = clone.querySelectorAll("[data-bg-image]");
    bgElements.forEach((el) => {
      const bgImage = data.imagen || data.bgImage || el.dataset.bgImage;
      if (bgImage) {
        el.style.backgroundImage = `url(${bgImage})`;
        el.dataset.bgImage = bgImage;
      }
    });

    return clone;
  }

  renderizar(items) {
    console.log(`[CollectionRenderer] Renderizando ${items.length} elementos para ${this.area}/${this.elemento}`);

    this.container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const nodo = this.renderItem(item);
      fragment.appendChild(nodo);
    });

    this.container.appendChild(fragment);

    if (items.length === 0) {
      console.warn(`[CollectionRenderer] No se encontraron elementos para ${this.area}/${this.elemento}`);
    }

    // Disparar evento personalizado para reinicializar Owl Carousel
    const event = new CustomEvent('collection-rendered', {
      detail: {
        area: this.area,
        elemento: this.elemento,
        container: this.container,
        itemsCount: items.length
      }
    });
    document.dispatchEvent(event);
  }

  async init() {
    console.log(`[CollectionRenderer] Iniciando para ${this.area}/${this.elemento}`);
    const datos = await this.obtenerDatos();
    this.renderizar(datos);
    console.log(`[CollectionRenderer] Finalizado para ${this.area}/${this.elemento}`);
  }
}
