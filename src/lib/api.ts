const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async get<T>(path: string, init?: RequestInit): Promise<{ data: T }> {
    const apiPrefix = "";
    const url = new URL(apiPrefix.concat(path), baseUrl);
    const response = await fetch(url.toString(), init);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados em ${url.toString()}`);
    }

    const data: T = await response.json();
    return { data };
  },

};
