<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-columncontrol-dt";
import "datatables.net-columncontrol-dt/css/columnControl.dataTables.css";

DataTable.use(DataTablesCore);

const list = ref([]);
const cargando = ref(true);
const gestores = ref([]);
const opciones = ref([]);
const loading = ref(true);
const error = ref(null);
const seleccionados = ref([]);
const seleccion = ref([]);
const tablaRef = ref(null); // Referencia para controlar el objeto DataTable interno
const filasSeleccionadas = ref([]);

const columnas = [
  { data: "acct", title: "ID", width: "8%", className: "dt-head-center" },
  { data: "segmento", title: "SEGMENTO", className: "dt-head-center", width: "10%" },
  {
    data: "monto",
    title: "SALDO",
    render: (data) => `$${Number(data).toFixed(2)}`,
    className: "dt-head-center",
  },
  { data: "days", title: "DIAS MORA", width: "6%", className: "dt-head-center" },
  { data: "agency", title: "AGENCIA", width: "10%", className: "dt-head-center" },
  { data: "zip", title: "CODIGO POSTAL", width: "6%", className: "dt-head-center" },
  { data: "city", title: "CIUDAD", className: "dt-head-center" },
  { data: "address1", title: "DIRECCION", className: "dt-head-center" },
  { data: "address1", title: "COLONIA", className: "dt-head-center" },
  { data: "namesuc", title: "SUCURSAL", className: "dt-head-center" },
];

const opcionesDataTable = {
  responsive: true,
  columnControl: ["order", "searchDropdown"],
  layout: {
    topEnd: null, // Quita el buscador global de la esquina superior derecha
  },
  scrollY: "500px", // Altura fija (puede ser en px, vh, etc.)
  scrollCollapse: true, // Ajusta la altura si hay pocos registros
  paging: false,
  ordering: {
    indicators: false,
    handler: false,
  },
  lengthChange: false,
  pageLength: 13, // Cuántos registros mostrar por página
  select: true,
  select: {
    style: "multi", // Permite seleccionar múltiples filas ('os', 'single', 'multi')
    items: "row", // El checkbox solo se activa al hacer clic en la primera columna
  },
  //order: [[1, "asc"]],
  language: {
    search: "🔍 Buscar:",
    lengthMenu: "Mostrar _MENU_ registros por página",
    info: "Mostrando del _START_ al _END_ de un total de _TOTAL_ registros ",
    infoEmpty: "Mostrando 0 al 0 de 0 registros",
    infoFiltered: "(filtrado de un total de _MAX_ registros)",
    zeroRecords: "No se encontraron resultados coincidentes",

    paginate: {
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último",
    },
  },
};

const actualizarSeleccion = () => {
  const dt = tablaRef.value?.dt;

  // 3. Obtenemos los datos con total seguridad
  filasSeleccionadas.value = dt.rows({ selected: true }).data().toArray();

  //console.log("Filas seleccionadas:", filasSeleccionadas);
};

const enviarAPost = async () => {
  try {
    // Ejemplo A: Puedes mapear o usar los datos completos aquí mismo para una alerta
    //const resumenClientes = filasSeleccionadas.value.map((f) => f.cliente).join(", ");
    const resumenClientes = filasSeleccionadas.value;
    //alert(`Enviando cobranzas de: ${resumenClientes}`);
    //console.log("Datos a enviar:", filasSeleccionadas.value);

    const payload = {
      registros: resumenClientes, // Aquí puedes enviar los datos completos o solo los IDs
      user: usuarioSeleccionado.value ? usuarioSeleccionado.value.id : null, // ID del usuario seleccionado
      square: 18,
    };
    // Ejemplo B: Enviar el JSON completo directamente a tu API REST
    const respuesta = await axios.post(
      "http://localhost:7171/cobranza/asignacion",
      payload
    );
    console.log("Respuesta del servidor:", respuesta.data);

    if (respuesta.status === 200) {
      const dt = tablaRef.value?.dt;
      dt.rows({ selected: true }).remove().draw(false);
      filasSeleccionadas.value = [];
    }

    console.log("Datos a enviar:", payload);
  } catch (err) {
    console.error("Error al procesar", err);
  }
};

const getAll = async () => {
  try {
    const [resList, resGestores] = await Promise.all([
      axios.get("http://localhost:7171/collections/data", {
        params: { square: 18 },
      }),
      axios.get("http://localhost:8080/api/v1/collections/agents", {
        params: { square: 18 },
      }),
    ]);
    list.value = resList.data;
    gestores.value = resGestores.data;
    opciones.value = gestores.value.map((item) => ({
      id: item.id,
      nombre: item.name,
      title: item.title,
      square: item.square, // Ajusta según las propiedades que devuelva tu servidor
    }));
    cargando.value = false;
    //console.log(list.value);
    //console.log(opciones.value);
  } catch (error) {
    error.value = "Error al cargar la lista";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  //setTimeout(() => {
  //console.log("Revisando DOM tras 500ms:", tablaRef.value?.dt);
  //}, 500);
  getAll();
});

const selectAll = computed({
  get() {
    return seleccionados.value.length === list.value.length;
  },
  set(value) {
    if (value) {
      seleccionados.value = list.value.map((item) => item.acct);
    } else {
      seleccionados.value = [];
    }
  },
});

const usuarioSeleccionado = computed(() => {
  return opciones.value.find((user) => user.nombre === seleccion.value);
});

const nombresOrdenados = computed(() => {
  return [...opciones.value].sort((a, b) => a.nombre.localeCompare(b.nombre));
});
</script>

<template>
  <div class="datatable-container">
    <div class="row">
      <div class="col-sm">
        <h3>Control de Cobranza</h3>
      </div>
      <div
        class="col-sm"
        style="
          margin-right: 10px;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
          background-color: #f9f9f9;
        "
      >
        <div class="combo-container">
          <label for="selector-axios" style="font-size: 13px"
            >Seleccione un Colaborador:
          </label>
          <select
            id="selector-axios"
            v-model="seleccion"
            :disabled="error"
            style="font-size: 14px"
          >
            <option value="" disabled>
              {{ "-- Elige una opción --" }}
            </option>

            <option
              v-for="opcion in nombresOrdenados"
              :key="opcion.nombre"
              :value="opcion.nombre"
            >
              {{ opcion.nombre }}
            </option>
          </select>
        </div>
        <div class="col-sm">
          <!-- Alerta visual si Axios falla -->
          <p v-if="error" class="error-msg">⚠️ {{ error }}</p>

          <!-- Imprime en pantalla el ID seleccionado -->
          <div v-if="seleccion">
            <div class="row">
              <div class="texto-izquierda col-sm">
                <strong>ID Colaborador:</strong>
                {{ usuarioSeleccionado ? usuarioSeleccionado.id : "No encontrado" }}
              </div>
              <div class="texto-derecha col-sm">
                <strong>Puesto:</strong>
                {{ usuarioSeleccionado ? usuarioSeleccionado.title : "No encontrado" }}
              </div>
              <div class="row">
                <div class="combo-container">
                  <button
                    @click="enviarAPost"
                    class="btn-process"
                    :disabled="filasSeleccionadas.length === 0 || seleccion.length === 0"
                  >
                    Procesar Seleccionados ({{ filasSeleccionadas.length }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="datatable-container">
    <DataTable
      ref="tablaRef"
      :data="list"
      :columns="columnas"
      :options="opcionesDataTable"
      @select="actualizarSeleccion"
      @deselect="actualizarSeleccion"
      class="display cell-border"
    />
  </div>
</template>

<style scoped>
.datatable-container {
  max-width: 1400px;
  margin: 5px auto;
  padding: 2px;
  font-size: 12px;
}

:deep(table.dataTable thead tr > td) {
  background-color: #eff0f2 !important; /* Reemplaza por tu color (ej: Azul oscuro) */
  color: #101010 !important; /* Color del texto */
  border-bottom: 2px solid #c9cacd !important; /* Línea divisoria inferior */
}

:deep(table.dataTable tbody tr.selected > *) {
  box-shadow: inset 0 0 0 9999px #b7ead2 !important; /* Reemplaza por tu color (ej. Verde Hex) */
  color: #111111 !important; /* Color del texto al seleccionar */
  border-bottom: 2px solid #ffffff !important; /* Línea divisoria inferior al seleccionar */
}

:deep(table.dataTable tbody tr.selected:hover > *) {
  box-shadow: inset 0 0 0 9999px #03d975 !important; /* Color ligeramente más oscuro al hacer hover */
}

:deep(div.dataTables_wrapper div.dataTables_filter),
:deep(div.dt-container div.dt-search) {
  position: absolute;
  left: 50% !important;
  transform: translateX(-168%) !important;
  margin-bottom: 2rem;
  z-index: 10;
}

/* Le damos un espacio al contenedor superior para que el buscador no tape la tabla */
:deep(div.dataTables_wrapper),
:deep(div.dt-container) {
  padding-top: 10px !important;
  position: relative;
}

:deep(.dt-search input) {
  width: 350px !important; /* Cambia el ancho a tu gusto (ej. 350px, 50%, etc.) */
  height: 35px !important; /* Cambia el alto (ej: 40px o 45px para que sea más robusto) */
  font-size: 1rem !important; /* Ajusta el tamaño de la letra si es necesario */
  border-radius: 8px !important; /* Opcional: bordes más redondeados tipo Bootstrap */
}

.combo-container {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  margin-top: 10px;
}

.texto-derecha {
  display: flex;
  justify-content: right; /* Centra horizontalmente */
  align-items: right; /* Centra verticalmente */
  padding-top: 15px;
  padding-bottom: 5px;
  padding-right: 40px;
}

.texto-izquierda {
  display: flex;
  justify-content: left; /* Centra horizontalmente */
  align-items: left; /* Centra verticalmente */
  padding-top: 15px;
  padding-bottom: 5px;
  padding-left: 40px;
}
</style>
