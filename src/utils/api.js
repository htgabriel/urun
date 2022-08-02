import axios from 'axios'

const api = axios.create({
	baseURL: "https://www.sistematreinoonline.com.br"
})

export default api