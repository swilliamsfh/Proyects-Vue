import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  
    const token = ref(localStorage.getItem('user_token') || null)
    const role = ref(localStorage.getItem('user_role') ? [localStorage.getItem('user_role')] : [])
    const router = useRouter()
    const errorMsg = ref('')
    const username = ref('')
    const showHide = ref(false);

    function logout() {
    // 2. Limpiar por completo el localStorage
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_token'); 
    localStorage.clear();
    showHide.value = false;
    // 3. Redirigir al Login inmediatamente
    router.push('/login');
    }

  async function loginUser(credentials) {
   try{
     const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
    
     if (response.ok) {
        const data = await response.json();
        showHide.value = true;
    // Ajustamos la desestructuración según lo que envías desde Spring Boot (roles)
    // Si tu Spring Boot envía "role" en singular, déjalo como role. Si envía "roles", cámbialo a roles.
    const { token: userToken, roles: userRol } = data
   
    token.value = userToken
    role.value = Array.isArray(userRol) ? userRol : [] // Asegura que siempre sea un array
    
    localStorage.setItem('user_token', userToken)
    localStorage.setItem('user_role', JSON.stringify(role.value)) 
  
    const mapaRutas = {
      'ROLE_ADMIN': '/dashboard',
      'ROLE_USER': '/table'
    }
    
    // Buscamos la ruta correspondiente evaluando el array de roles
    const rutadestino = role.value.map(r => mapaRutas[r?.name]).find(Boolean) || '/login'
    router.push(rutadestino) 
    }

  } catch (error) {
      
      errorMsg.value = error.response?.data?.message 
      
      
      throw error.message 
    }
}
  return { 
    token, 
    role, 
    loginUser, 
    errorMsg,
    logout,
    showHide,
  } 
})