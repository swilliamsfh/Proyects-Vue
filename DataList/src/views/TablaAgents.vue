<template>
  <!-- The AG Grid component -->
  <ag-grid-vue
    :theme="theme"
    style="width: 64%; height: 500px"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :rowModelType="'infinite'"
    :cacheBlockSize="15"
    :pagination="true"
    :paginationPageSize="15"
    :paginationPageSizeSelector="[15, 20, 50, 100]"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { ModuleRegistry, AllCommunityModule, themeBalham } from "ag-grid-community";
import { useRouter } from "vue-router";

const router = useRouter();
ModuleRegistry.registerModules([AllCommunityModule]);
const theme = themeBalham;
const defaultColDef = ref({
  filter: true,
  filterParams: {
    maxNumConditions: 1,
  },
});

const columnDefs = ref([
  { field: "username", headerName: "Usuarios", width: 100, sortable: true },
  {
    field: "name",
    headerName: "Nombre",
    filter: "agTextColumnFilter",
    filterParams: {
      maxNumConditions: 1,
    },
  },
  { field: "title", headerName: "Titulo", width: 250, sortable: true },
  { field: "unit", headerName: "Plaza" },
]);
const token = localStorage.getItem("user_token");
// 2. Configuración del origen de datos cuando la tabla está lista
const onGridReady = (params) => {
  const datasource = {
    getRows: async (requestParams) => {
      const pageSize = 15;
      const pageNumber = Math.floor(requestParams.startRow / pageSize);
      const numsquare = 15;
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
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/collections/agents",
          {
            params: queryParams,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        // Extraemos los registros y el total desde el formato de respuesta de Spring Data
        console.log("Datos recibidos de la API:", data);
        requestParams.successCallback(data.content, data.page.totalElements);
      } catch (error) {
        console.error("Error cargando datos de AG Grid:", error);
        router.push("/login");
        requestParams.failCallback();
      }
    },
  };

  // Asignamos el datasource de scroll infinito al grid

  params.api.setGridOption("datasource", datasource);
};
</script>

<style scoped>
.tabla-container {
  padding: 20px;
}
</style>
