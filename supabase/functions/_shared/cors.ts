export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export function addCorsHeaders(headers: Record<string, string>) {
  return {
    ...headers,
    ...corsHeaders,
  };
}
