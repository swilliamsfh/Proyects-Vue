<template>
  <!-- Modal -->
  <div class="modal" tabindex="-1" id="modalFila">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Usuario:</span>
            <input
              type="text"
              class="form-control"
              id="modalUser"
              disabled
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon2">Nombre:</span>
            <input
              type="text"
              class="form-control"
              id="modalName"
              aria-describedby="basic-addon2"
            />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon3">Titulo:</span>
            <input
              type="text"
              class="form-control"
              id="modalTitle"
              aria-describedby="basic-addon3"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cerrar
          </button>
          <button type="button" class="btn btn-secondary">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>
