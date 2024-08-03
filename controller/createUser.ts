import { urlBase } from "@/config/config";
import axios from "axios";

export const createUser = async (
    body: any
) => {
    try {
        /*const response = await axios.post(`${urlBase}/users`, 
          body
        , {
            headers: {
                "Content-Type": "application/json",
            }
        });*/
        const response = { status: true, data: {} }
        if (!response.status) {
            throw new Error('Network response was not ok');
        }
        return await response.data;
    } catch (error) {
        console.error('Error fetching dataaaa:', error);
        throw error;
    }
};
