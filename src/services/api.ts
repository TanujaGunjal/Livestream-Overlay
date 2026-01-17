const API_BASE_URL = 'http://localhost:5000';

export interface Overlay {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  created_at?: string;
  updated_at?: string;
}

export interface CreateOverlayData {
  type: 'text' | 'image';
  content: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export const overlayAPI = {
  async getAll(): Promise<Overlay[]> {
    const response = await fetch(`${API_BASE_URL}/overlays`);
    if (!response.ok) {
      throw new Error('Failed to fetch overlays');
    }
    return response.json();
  },

  async create(data: CreateOverlayData): Promise<Overlay> {
    const response = await fetch(`${API_BASE_URL}/overlays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create overlay');
    }
    return response.json();
  },

  async update(id: string, data: Partial<Overlay>): Promise<Overlay> {
    const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update overlay');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete overlay');
    }
  },

  async createStream(rtspUrl: string): Promise<{ hls_url: string }> {
    const response = await fetch(`${API_BASE_URL}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rtsp_url: rtspUrl }),
    });
    if (!response.ok) {
      throw new Error('Failed to create stream');
    }
    return response.json();
  },
};
