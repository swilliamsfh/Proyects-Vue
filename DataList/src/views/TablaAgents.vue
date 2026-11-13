<template>
  <div class="contenedor-grid">
    <ModalAgent />
    <div class="barra-acciones">
      <h2>GESTORES</h2>
      <button id="btnAgregar" class="btn-agregar">+</button>
    </div>
    <div class="mitabla" id="miTabla">
      <!-- The AG Grid component -->
      <ag-grid-vue
        :theme="theme"
        style="width: 100%; height: 500px"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowModelType="'infinite'"
        :rowSelection="'single'"
        :clicked="row.onRowClicked"
        :cacheBlockSize="15"
        :pagination="true"
        :paginationPageSize="15"
        :paginationPageSizeSelector="[15, 20, 50, 100]"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import ModalAgent from "@/components/ModalAgent.vue";
import { agentService } from "@/service/agentService.js";
import { ModuleRegistry, AllCommunityModule, themeBalham } from "ag-grid-community";
import { useRouter } from "vue-router";
import { Modal } from "bootstrap";

ModuleRegistry.registerModules([AllCommunityModule]);
const router = useRouter();
const theme = themeBalham;
const token = localStorage.getItem("user_token");
const numsquare = 15;
const defaultColDef = ref({
  filter: true,
  filterParams: {
    maxNumConditions: 1,
  },
});
const rowData = ref([]);
const columnDefs = ref([
  {
    field: "username",
    headerName: "Usuarios",
    width: 150,

    cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" },
  },
  {
    field: "name",
    headerName: "Nombre",
    flex: 2,
    filter: "agTextColumnFilter",
    filterParams: {
      maxNumConditions: 1,
    },
  },
  { field: "title", headerName: "Titulo", flex: 2, sortable: true },
]);

const row = {
  onRowClicked: (event) => {
    console.log("Fila clicada:", event.data); // Objeto completo de la fila
    console.log("Índice visual:", event.rowIndex); // Posición de la fila (0, 1, 2...)
  },
};

// 2. Configuración del origen de datos cuando la tabla está lista
const onGridReady = (params) => {
  const datasource = {
    getRows: async (requestParams) => {
      const pageSize = 15;
      const pageNumber = Math.floor(requestParams.startRow / pageSize);

      const queryParams = new URLSearchParams({
        unit: numsquare,
        page: pageNumber,
        size: pageSize,
      });

      const sortState = params.api
        .getColumnState()
        .filter((col) => col.sort != null)
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

      if (sortState.length > 0) {
        sortState.forEach((col) => {
          // col.colId es el nombre del campo, col.sort es 'asc' o 'desc'
          queryParams.append("sort", `${col.colId},${col.sort}`);
        });
      } else {
        // Si no hay ordenamiento, podemos establecer un ordenamiento predeterminado
        queryParams.append("sort", "username,asc");
      }
      const filterModel = params.api.getFilterModel();

      if (filterModel) {
        Object.entries(filterModel).forEach(([campo, filtroObj]) => {
          // CASO 1: Filtro compuesto con AND u OR (AG Grid 36)
          if (filtroObj.operator && Array.isArray(filtroObj.conditions)) {
            // Envía el operador lógico: ej. name_logic = "OR"
            queryParams.append(`${campo}_logic`, filtroObj.operator);

            filtroObj.conditions.forEach((cond, index) => {
              // index será 0 para la 1ra condición, 1 para la 2da condición
              const num = index + 1;
              if (cond.filter !== undefined && cond.filter !== null) {
                queryParams.append(`${campo}_${num}`, cond.filter);
                queryParams.append(`${campo}_op_${num}`, cond.type);
              } else if (cond.type === "blank" || cond.type === "notBlank") {
                // Por si elige "is blank" que no lleva texto
                queryParams.append(`${campo}_op_${num}`, cond.type);
              }
            });
          }
          // CASO 2: Filtro simple (1 sola condición)
          else if (filtroObj.filter !== undefined && filtroObj.filter !== null) {
            queryParams.append(campo, filtroObj.filter);
            queryParams.append(`${campo}_op`, filtroObj.type);
          }
          // CASO 3: Filtro simple sin texto (blank / notBlank)
          else if (filtroObj.type === "blank" || filtroObj.type === "notBlank") {
            queryParams.append(`${campo}_op`, filtroObj.type);
          }
        });
      }
      const response = async () => {
        try {
          await agentService.getAllAgents(
            (params = queryParams),
            (headers = { Authorization: `Bearer ${token}` })
          );

          const data = response.data;
          console.log("Datos recibidos de la API:", data);
          // Extraemos los registros y el total desde el formato de respuesta de Spring Data
          console.log("Datos recibidos de la API:", data);
          requestParams.successCallback(data.content, data.page.totalElements);
        } catch (error) {
          console.error("Error cargando datos de AG Grid:", error);
          router.push("/login");
          requestParams.failCallback();
        }
      };
    },
  };

  // Asignamos el datasource de scroll infinito al grid

  params.api.setGridOption("datasource", datasource);
  params.api.addEventListener("rowClicked", (event) => {
    const datos = event.data;
    document.getElementById("modalUser").value = datos.username;
    document.getElementById("modalName").value = datos.name;
    document.getElementById("modalTitle").value = datos.title;
    // 2. Abrir el modal de Bootstrap
    const miModal = document.getElementById("modalFila");
    const modalInstance = Modal.getOrCreateInstance(miModal);
    modalInstance.show();
  });
};
document.addEventListener("hide.bs.modal", () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});
</script>

<style scoped>
.tabla-container {
  padding: 20px;
}

/* 1. Contenedor principal en CSS */
.contenedor-grid {
  width: 95%;
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* 2. Barra superior para título y botón */
.barra-acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.barra-acciones h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

/* 3. Estilo del botón agregar */
.btn-agregar {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-agregar:hover {
  background-color: #1d4ed8;
}

/* 4. Contenedor específico de la tabla (requiere altura definida) */
.miTabla {
  width: 100%;
  height: 400px;
}
</style>
