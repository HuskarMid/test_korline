import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "/api/news",
    }),
    tagTypes: ['News'],
    endpoints: (builder) => ({
        getNews: builder.query<any, { year: number, month: number }>({
            query: ({ year, month }) => `/${year}/${month}.json?api-key=${process.env.NEXT_PUBLIC_NYT_API_KEY}`,
        }),
    }),
});

export const { useGetNewsQuery } = newsApi;