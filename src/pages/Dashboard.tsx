import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Film, Calendar, Clock, Folder, Search } from "lucide-react";
import { Project } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "1",
        name: "Sunset Boulevard Redux",
        description: "A modern reimagining of the classic film noir",
        created_at: "2024-01-15T10:00:00Z",
        scenes: [
          { id: "1", project_id: "1", scene_number: "1A", description: "Opening sequence", estimated_time: 120, status: 'scheduled' },
          { id: "2", project_id: "1", scene_number: "1B", description: "Character introduction", estimated_time: 90, status: 'completed' },
          { id: "3", project_id: "1", scene_number: "2", description: "Confrontation scene", estimated_time: 180, status: 'unscheduled' },
        ]
      },
      {
        id: "2", 
        name: "The Digital Detective",
        description: "Cyberpunk thriller set in 2050",
        created_at: "2024-01-20T14:30:00Z",
        scenes: [
          { id: "4", project_id: "2", scene_number: "1", description: "Neon cityscape opening", estimated_time: 150, status: 'in-progress' },
          { id: "5", project_id: "2", scene_number: "2", description: "Detective's apartment", estimated_time: 75, status: 'scheduled' },
        ]
      }
    ];
    setProjects(mockProjects);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      created_at: new Date().toISOString(),
      scenes: []
    };

    setProjects([project, ...projects]);
    setNewProject({ name: "", description: "" });
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const getProjectStats = (project: Project) => {
    const scenes = project.scenes || [];
    const totalTime = scenes.reduce((sum, scene) => sum + scene.estimated_time, 0);
    const completedScenes = scenes.filter(scene => scene.status === 'completed').length;
    
    return {
      totalScenes: scenes.length,
      completedScenes,
      totalHours: Math.floor(totalTime / 60),
      totalMinutes: totalTime % 60,
      progress: scenes.length > 0 ? Math.round((completedScenes / scenes.length) * 100) : 0
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold cinema-gradient bg-clip-text text-transparent">
                S7Scheduling
              </h1>
              <p className="text-muted-foreground mt-2">
                Professional film production scheduling platform
              </p>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button variant="cinema" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Start a new film production project and begin scheduling your scenes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Project Name
                    </label>
                    <Input
                      placeholder="Enter project name..."
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Brief project description..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateProject} variant="cinema" className="flex-1">
                      Create Project
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cinema-card border-border/50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-cinema-gold">{projects.length}</p>
                </div>
                <Folder className="w-8 h-8 text-cinema-gold/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scenes</p>
                  <p className="text-2xl font-bold text-cinema-blue">
                    {projects.reduce((sum, p) => sum + (p.scenes?.length || 0), 0)}
                  </p>
                </div>
                <Film className="w-8 h-8 text-cinema-blue/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-primary">
                    {projects.reduce((sum, p) => 
                      sum + (p.scenes?.filter(s => s.status === 'scheduled').length || 0), 0
                    )}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary/60" />
              </div>
            </div>
          </Card>
          
          <Card className="cinema-card border-border/50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold text-cinema-silver">
                    {Math.floor(projects.reduce((sum, p) => 
                      sum + (p.scenes?.reduce((s, scene) => s + scene.estimated_time, 0) || 0), 0
                    ) / 60)}h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-cinema-silver/60" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project);
            return (
              <Card 
                key={project.id} 
                className="cinema-card border-border/50 hover:border-cinema-gold/50 cursor-pointer group"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-cinema-gold transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {stats.progress}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{stats.totalScenes} scenes</span>
                      <span>{stats.totalHours}h {stats.totalMinutes}m</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-cinema-gold rounded-full h-2 transition-all duration-300"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {stats.completedScenes} completed
                      </span>
                      <span className="text-cinema-gold">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredProjects.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or create a new project.</p>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-cinema-gold/10 flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-cinema-gold" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to S7Scheduling</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your first film production project and organize your scenes with our professional stripboard system.
            </p>
            <Button onClick={() => setIsCreating(true)} variant="cinema" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}