export class AddLogDto {
    user_id: number; 
    endpoint: string; 
    full_url: string;
    req_params: any;
    req_query: any; 
    req_headers: any; 
    req_body: any;
    req_ip: string;
    req_files: any;
}