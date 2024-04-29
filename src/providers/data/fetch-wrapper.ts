import { message } from "antd";
import { GraphQLError, GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    StatusCode: string;

}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem("access_Token");
    const headers = options.headers as Record<string, string>;
    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            "Authorization": headers?.Authorization || `Bearer ${accessToken}`,
            "content-type": "application/json",
            "Apollo-Require-Preflight": "true",
        },
        
    });

}

const getGraphQLErros = (body: Record<"errors", GraphQLFormattedError[] | undefined>): 
Error | null => {
    if(!body){
        return{
            message:'Uknown error',
            StatusCode: "Internal Server Error"
        }
    }
    if("errors" in body){
        const errors = body?.errors;
        const message = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code

        return {
            message: message || JSON.stringify(errors),
            StatusCode: code || 500
        }
    }
    return null;
}

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);
    const responseClone = response.clone();
    const body = await responseClone.json();
    const error = getGraphQLErros(body);
    if(error){
        throw error;
    }
    return response;
}