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
import { createModule, updateModule } from "@/src/presentation/actions/content.actions";
import { useRouter } from "next/navigation";

interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  content: string | null;
  isPublished: boolean;
}

interface ModuleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  courseId: string;
  module?: ModuleData | null;
  maxOrderIndex: number;
}

export function ModuleFormDialog({ isOpen, onClose, mode, courseId, module, maxOrderIndex }: ModuleFormDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 1,
    content: '',
    is_published: false,
  });

  useEffect(() => {
    if (mode === 'edit' && module) {
      setFormData({
        title: module.title,
        description: module.description || '',
        order_index: module.orderIndex,
        content: module.content || '',
        is_published: module.isPublished,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        order_index: maxOrderIndex + 1,
        content: '',
        is_published: false,
      });
    }
    setError(null);
  }, [mode, module, maxOrderIndex, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'create') {
        result = await createModule({
          course_id: courseId,
          title: formData.title,
          description: formData.description || null,
          order_index: formData.order_index,
          content: formData.content || null,
          is_published: formData.is_published,
        });
      } else if (module) {
        result = await updateModule(module.id, {
          title: formData.title,
          description: formData.description || null,
          order_index: formData.order_index,
          content: formData.content || null,
          is_published: formData.is_published,
        });
      }

      if (result && 'error' in result) {
        setError(result.error || 'Error al guardar el módulo');
      } else {
        onClose();
        router.refresh();
      }
    } catch (err) {
      setError('Error inesperado al guardar el módulo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Nuevo Módulo' : 'Editar Módulo'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa la información del nuevo módulo.'
              : 'Modifica la información del módulo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Módulo *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Fundamentos de Python"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe brevemente el contenido del módulo..."
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

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
                Puedes usar cualquier número. Los módulos se ordenarán automáticamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Contenido del módulo en formato Markdown..."
                disabled={isLoading}
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono disabled:cursor-not-allowed disabled:opacity-50"
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
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publicar módulo (visible para estudiantes)
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
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Guardando...
                </>
              ) : (
                mode === 'create' ? 'Crear Módulo' : 'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
