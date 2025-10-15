import { Host } from "@/utils/constant";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: Host
})