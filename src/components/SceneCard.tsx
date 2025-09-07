import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Film, MoreHorizontal } from "lucide-react";
import { Scene } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SceneCardProps {
  scene: Scene;
  onEdit?: (scene: Scene) => void;
  onDelete?: (sceneId: string) => void;
  onStatusChange?: (sceneId: string, status: Scene['status']) => void;
}

const statusColors = {
  unscheduled: 'bg-muted',
  scheduled: 'bg-cinema-blue/20 text-cinema-blue',
  'in-progress': 'bg-cinema-gold/20 text-cinema-gold',
  completed: 'bg-green-500/20 text-green-400'
};

export function SceneCard({ scene, onEdit, onDelete, onStatusChange }: SceneCardProps) {
  return (
    <Card className="cinema-card border-border/50 hover:border-cinema-gold/50 group">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cinema-gold/20 flex items-center justify-center">
              <Film className="w-4 h-4 text-cinema-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Scene {scene.scene_number}</h3>
              <Badge className={statusColors[scene.status]}>
                {scene.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(scene)}>
                Edit Scene
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(scene.id, 'scheduled')}>
                Mark as Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(scene.id, 'completed')}>
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(scene.id)}
                className="text-destructive focus:text-destructive"
              >
                Delete Scene
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
          {scene.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{scene.estimated_time}min</span>
          </div>
          {scene.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{scene.location.name}</span>
            </div>
          )}
          {scene.shoot_day && (
            <div className="flex items-center gap-1">
              <span>Day {scene.shoot_day}</span>
            </div>
          )}
        </div>

        {scene.notes && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground italic">
              {scene.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}