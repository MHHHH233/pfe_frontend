import { useEffect } from "react"
import axios from "axios"



useEffect(
    async ()=>{
        const response = await axios.get(meta.env.api_url + '/reservations')
    },[]
)