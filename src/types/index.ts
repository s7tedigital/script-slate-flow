export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  scenes?: Scene[];
}

export interface Scene {
  id: string;
  project_id: string;
  scene_number: string;
  description: string;
  location?: Location;
  location_id?: string;
  estimated_time: number; // in minutes
  shoot_day?: number;
  status: 'unscheduled' | 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'interior' | 'exterior';
}

export interface CreateProjectData {
  name: string;
  description: string;
}

export interface CreateSceneData {
  scene_number: string;
  description: string;
  location_id?: string;
  estimated_time: number;
  notes?: string;
}