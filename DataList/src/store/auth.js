import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useRouter } from "vue-router";


export const useAuthStore = defineStore('auth', () => {
  
    const token = ref(localStorage.getItem('user_token') || null)
    const roles = ref(localStorage.getItem('user_role') ? [localStorage.getItem('user_role')] : [])
    const router = useRouter()
    const errorMsg = ref('')
    const username = ref('')

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
       
    // Ajustamos la desestructuración según lo que envías desde Spring Boot (roles)
    // Si tu Spring Boot envía "role" en singular, déjalo como role. Si envía "roles", cámbialo a roles.
    const { token: userToken, rol: userRol } = data
   
    token.value = userToken
    roles.value = Array.isArray(userRol) ? userRol : [userRol] // Asegura que siempre sea un array
    
    localStorage.setItem('user_token', userToken)
    localStorage.setItem('user_role', JSON.stringify(roles.value)) 
    
    const mapaRutas = {
      'ROLE_ADMIN': '/dashboard',
      'ROLE_USER': '/table'
    }

    // Buscamos la ruta correspondiente evaluando el array de roles
    const rutadestino = roles.value.map(r => mapaRutas[r]).find(Boolean) || '/login'
    
    router.push(rutadestino)
    }

  } catch (error) {
      
      errorMsg.value = error.response?.data?.message 
      
      
      throw error.message 
    }
}
  return { 
    token, 
    roles, 
    loginUser, 
    errorMsg
  } 
})