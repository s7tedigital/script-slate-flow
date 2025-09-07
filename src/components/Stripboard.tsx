import { Scene } from "@/types";
import { SceneCard } from "@/components/SceneCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface StripboardProps {
  scenes: Scene[];
  onSceneEdit?: (scene: Scene) => void;
  onSceneDelete?: (sceneId: string) => void;
  onSceneStatusChange?: (sceneId: string, status: Scene['status']) => void;
}

export function Stripboard({ scenes, onSceneEdit, onSceneDelete, onSceneStatusChange }: StripboardProps) {
  // Group scenes by shoot day
  const scenesByDay = scenes.reduce((acc, scene) => {
    const day = scene.shoot_day || 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(scene);
    return acc;
  }, {} as Record<number, Scene[]>);

  // Sort scenes within each day by scene number
  Object.keys(scenesByDay).forEach(day => {
    scenesByDay[Number(day)].sort((a, b) => 
      parseInt(a.scene_number) - parseInt(b.scene_number)
    );
  });

  const totalTime = scenes.reduce((sum, scene) => sum + scene.estimated_time, 0);
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;

  return (
    <div className="space-y-6">
      {/* Stripboard Header */}
      <Card className="cinema-card border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cinema-gold" />
              Production Stripboard
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Total: {totalHours}h {totalMinutes}m</span>
              </div>
              <Badge variant="secondary">{scenes.length} scenes</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-cinema-gold font-semibold">{scenes.filter(s => s.status === 'unscheduled').length}</div>
              <div className="text-muted-foreground">Unscheduled</div>
            </div>
            <div className="text-center">
              <div className="text-cinema-blue font-semibold">{scenes.filter(s => s.status === 'scheduled').length}</div>
              <div className="text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-cinema-gold font-semibold">{scenes.filter(s => s.status === 'in-progress').length}</div>
              <div className="text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">{scenes.filter(s => s.status === 'completed').length}</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stripboard Days */}
      {Object.keys(scenesByDay).length === 0 ? (
        <Card className="cinema-card border-border/50">
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No scenes added yet</h3>
            <p className="text-muted-foreground">Start by adding scenes to your project to see them on the stripboard.</p>
          </div>
        </Card>
      ) : (
        Object.entries(scenesByDay)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, dayScenes]) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {day === '0' ? 'Unscheduled' : `Day ${day}`}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(dayScenes.reduce((sum, scene) => sum + scene.estimated_time, 0) / 60)}h{' '}
                    {dayScenes.reduce((sum, scene) => sum + scene.estimated_time, 0) % 60}m
                  </span>
                </div>
                <Badge variant="secondary">{dayScenes.length} scenes</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dayScenes.map((scene) => (
                  <div key={scene.id} className="stripboard-scene">
                    <SceneCard
                      scene={scene}
                      onEdit={onSceneEdit}
                      onDelete={onSceneDelete}
                      onStatusChange={onSceneStatusChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}