"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLesson, updateLesson } from "@/src/presentation/actions/content.actions";
import { useRouter } from "next/navigation";

interface LessonData {
  id: string;
  title: string;
  content: string | null;
  orderIndex: number;
  durationMinutes: number | null;
  isPublished: boolean;
}

interface LessonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  moduleId: string;
  lesson?: LessonData | null;
  maxOrderIndex: number;
}

export function LessonFormDialog({ isOpen, onClose, mode, moduleId, lesson, maxOrderIndex }: LessonFormDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order_index: 1,
    duration_minutes: 0,
    is_published: false,
  });

  useEffect(() => {
    if (mode === 'edit' && lesson) {
      setFormData({
        title: lesson.title,
        content: lesson.content || '',
        order_index: lesson.orderIndex,
        duration_minutes: lesson.durationMinutes || 0,
        is_published: lesson.isPublished,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        order_index: maxOrderIndex + 1,
        duration_minutes: 0,
        is_published: false,
      });
    }
    setError(null);
  }, [mode, lesson, maxOrderIndex, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'create') {
        result = await createLesson({
          module_id: moduleId,
          title: formData.title,
          content: formData.content || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
          is_published: formData.is_published,
        });
      } else if (lesson) {
        result = await updateLesson(lesson.id, {
          title: formData.title,
          content: formData.content || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
          is_published: formData.is_published,
        });
      }

      if (result && 'error' in result) {
        setError(result.error || 'Error al guardar la lección');
      } else {
        onClose();
        router.refresh();
      }
    } catch (err) {
      setError('Error inesperado al guardar la lección');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Nueva Lección' : 'Editar Lección'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa la información de la nueva lección.'
              : 'Modifica la información de la lección.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Lección *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Variables y Tipos de Datos"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order_index">Orden *</Label>
                <Input
                  id="order_index"
                  name="order_index"
                  type="number"
                  min="1"
                  value={formData.order_index}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500">
                  Puedes usar cualquier número.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duración (minutos)</Label>
                <Input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min="0"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  placeholder="Ej: 15"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido de la Lección</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Contenido de la lección en formato Markdown..."
                disabled={isLoading}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publicar lección (visible para estudiantes)
              </Label>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Guardando...
                </>
              ) : (
                mode === 'create' ? 'Crear Lección' : 'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
