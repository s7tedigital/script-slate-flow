import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  Film, 
  Calendar,
  Clock,
  MapPin
} from "lucide-react";
import { Project, Scene, CreateSceneData } from "@/types";
import { Stripboard } from "@/components/Stripboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [newScene, setNewScene] = useState<CreateSceneData>({
    scene_number: "",
    description: "",
    estimated_time: 60,
    notes: ""
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    if (!id) return;
    
    const mockProject: Project = {
      id: id,
      name: id === "1" ? "Sunset Boulevard Redux" : "The Digital Detective",
      description: id === "1" ? "A modern reimagining of the classic film noir" : "Cyberpunk thriller set in 2050",
      created_at: "2024-01-15T10:00:00Z"
    };

    const mockScenes: Scene[] = id === "1" ? [
      {
        id: "1",
        project_id: id,
        scene_number: "1A",
        description: "Norma Desmond's mansion - Gloria enters the decaying Hollywood palace",
        estimated_time: 120,
        status: 'scheduled',
        shoot_day: 1,
        location: { id: "1", name: "Desmond Mansion", address: "Beverly Hills", type: "interior" },
        notes: "Golden hour lighting preferred"
      },
      {
        id: "2", 
        project_id: id,
        scene_number: "1B",
        description: "Joe Gillis introduction - Writer desperate for work",
        estimated_time: 90,
        status: 'completed',
        shoot_day: 1,
        location: { id: "2", name: "Apartment Complex", address: "Hollywood", type: "exterior" }
      },
      {
        id: "3",
        project_id: id,
        scene_number: "2",
        description: "Confrontation between Norma and Joe about the script",
        estimated_time: 180,
        status: 'unscheduled',
        location: { id: "1", name: "Desmond Mansion", address: "Beverly Hills", type: "interior" },
        notes: "Emotional climax - requires multiple takes"
      },
      {
        id: "4",
        project_id: id,
        scene_number: "3A",
        description: "Pool scene - Final confrontation",
        estimated_time: 240,
        status: 'scheduled',
        shoot_day: 2,
        location: { id: "3", name: "Beverly Hills Pool", address: "Beverly Hills", type: "exterior" },
        notes: "Night shoot - special lighting equipment needed"
      }
    ] : [
      {
        id: "5",
        project_id: id,
        scene_number: "1",
        description: "Neon cityscape opening - Detective walks through rain-soaked streets",
        estimated_time: 150,
        status: 'in-progress',
        shoot_day: 1,
        location: { id: "4", name: "Downtown LA", address: "Downtown", type: "exterior" }
      },
      {
        id: "6",
        project_id: id,
        scene_number: "2", 
        description: "Detective's apartment - High-tech investigation setup",
        estimated_time: 75,
        status: 'scheduled',
        shoot_day: 1,
        location: { id: "5", name: "Apartment Set", address: "Studio", type: "interior" }
      }
    ];

    setProject(mockProject);
    setScenes(mockScenes);
  }, [id]);

  const handleAddScene = () => {
    if (!newScene.scene_number.trim() || !newScene.description.trim()) {
      toast({
        title: "Error",
        description: "Scene number and description are required",
        variant: "destructive",
      });
      return;
    }

    const scene: Scene = {
      id: Date.now().toString(),
      project_id: project!.id,
      scene_number: newScene.scene_number,
      description: newScene.description,
      estimated_time: newScene.estimated_time,
      status: 'unscheduled',
      notes: newScene.notes
    };

    setScenes([...scenes, scene]);
    setNewScene({
      scene_number: "",
      description: "",
      estimated_time: 60,
      notes: ""
    });
    setIsAddingScene(false);
    
    toast({
      title: "Success",
      description: "Scene added successfully",
    });
  };

  const handleSceneStatusChange = (sceneId: string, status: Scene['status']) => {
    setScenes(scenes.map(scene => 
      scene.id === sceneId ? { ...scene, status } : scene
    ));
    
    toast({
      title: "Success",
      description: `Scene status updated to ${status.replace('-', ' ')}`,
    });
  };

  const handleSceneDelete = (sceneId: string) => {
    setScenes(scenes.filter(scene => scene.id !== sceneId));
    toast({
      title: "Success",
      description: "Scene deleted successfully",
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-cinema-gold/20 flex items-center justify-center mx-auto mb-4">
            <Film className="w-8 h-8 text-cinema-gold animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  const totalTime = scenes.reduce((sum, scene) => sum + scene.estimated_time, 0);
  const completedScenes = scenes.filter(scene => scene.status === 'completed').length;
  const scheduledScenes = scenes.filter(scene => scene.status === 'scheduled').length;
  const progress = scenes.length > 0 ? Math.round((completedScenes / scenes.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={isAddingScene} onOpenChange={setIsAddingScene}>
                <DialogTrigger asChild>
                  <Button variant="cinema">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Scene
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Scene</DialogTitle>
                    <DialogDescription>
                      Add a new scene to your project stripboard.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Scene Number
                        </label>
                        <Input
                          placeholder="e.g., 1A, 2B"
                          value={newScene.scene_number}
                          onChange={(e) => setNewScene({...newScene, scene_number: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Est. Time (min)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={newScene.estimated_time}
                          onChange={(e) => setNewScene({...newScene, estimated_time: parseInt(e.target.value) || 60})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Scene Description
                      </label>
                      <Textarea
                        placeholder="Describe what happens in this scene..."
                        value={newScene.description}
                        onChange={(e) => setNewScene({...newScene, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Notes (Optional)
                      </label>
                      <Textarea
                        placeholder="Any additional notes or requirements..."
                        value={newScene.notes}
                        onChange={(e) => setNewScene({...newScene, notes: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddScene} variant="cinema" className="flex-1">
                        Add Scene
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingScene(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="cinema-card border-border/50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Scenes</p>
                  <p className="text-xl font-bold text-foreground">{scenes.length}</p>
                </div>
                <Film className="w-6 h-6 text-cinema-gold/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="text-xl font-bold text-cinema-blue">{scheduledScenes}</p>
                </div>
                <Calendar className="w-6 h-6 text-cinema-blue/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Time</p>
                  <p className="text-xl font-bold text-cinema-silver">
                    {Math.floor(totalTime / 60)}h {totalTime % 60}m
                  </p>
                </div>
                <Clock className="w-6 h-6 text-cinema-silver/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold text-cinema-gold">{progress}%</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-muted relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cinema-gold transition-all duration-300"
                    style={{ 
                      background: `conic-gradient(hsl(var(--cinema-gold)) ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stripboard */}
        <Stripboard 
          scenes={scenes}
          onSceneStatusChange={handleSceneStatusChange}
          onSceneDelete={handleSceneDelete}
        />
      </div>
    </div>
  );
}