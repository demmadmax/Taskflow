import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, ListChecks, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("taskflow-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTitle("");
    setNewDescription("");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, title: editTitle.trim(), description: editDescription.trim() }
          : t
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, 
            hsl(230 60% 8%) 0%, 
            hsl(260 50% 12%) 50%, 
            hsl(200 60% 8%) 100%)`
        }}
      />
      
      {/* Floating blobs */}
      <div 
        className="floating-blob w-96 h-96 -top-48 -left-48 animate-blob"
        style={{ background: 'hsl(280 70% 50% / 0.3)' }}
      />
      <div 
        className="floating-blob w-80 h-80 top-1/3 -right-40 animate-blob animate-blob-delay-1"
        style={{ background: 'hsl(174 72% 40% / 0.25)' }}
      />
      <div 
        className="floating-blob w-72 h-72 -bottom-36 left-1/4 animate-blob animate-blob-delay-2"
        style={{ background: 'hsl(200 80% 45% / 0.2)' }}
      />

      <div className="relative z-10 px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
              TaskFlow
            </h1>
            <p className="text-muted-foreground text-lg">
              Organize your day, achieve your goals
            </p>
          </header>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>{pendingTasks.length} pending</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ListChecks className="w-4 h-4 text-accent" />
              <span>{completedTasks.length} completed</span>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="glass-input text-lg"
              />
              <input
                type="text"
                placeholder="Add a description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="glass-input"
              />
              <button
                onClick={addTask}
                disabled={!newTitle.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <section className="mb-8">
              <div className="section-divider">
                <span className="text-sm font-medium text-muted-foreground px-3">
                  Pending Tasks
                </span>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isEditing={editingId === task.id}
                    editTitle={editTitle}
                    editDescription={editDescription}
                    onEditTitleChange={setEditTitle}
                    onEditDescriptionChange={setEditDescription}
                    onToggleComplete={() => toggleComplete(task.id)}
                    onStartEdit={() => startEdit(task)}
                    onSaveEdit={() => saveEdit(task.id)}
                    onCancelEdit={cancelEdit}
                    onDelete={() => deleteTask(task.id)}
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <section>
              <div className="section-divider">
                <span className="text-sm font-medium text-muted-foreground px-3">
                  Completed
                </span>
              </div>
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isEditing={editingId === task.id}
                    editTitle={editTitle}
                    editDescription={editDescription}
                    onEditTitleChange={setEditTitle}
                    onEditDescriptionChange={setEditDescription}
                    onToggleComplete={() => toggleComplete(task.id)}
                    onStartEdit={() => startEdit(task)}
                    onSaveEdit={() => saveEdit(task.id)}
                    onCancelEdit={cancelEdit}
                    onDelete={() => deleteTask(task.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <ListChecks className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No tasks yet
              </h3>
              <p className="text-muted-foreground">
                Add your first task to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onToggleComplete: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

const TaskCard = ({
  task,
  isEditing,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  style,
}: TaskCardProps) => {
  return (
    <div
      className={`task-card animate-fade-in-up ${task.completed ? "task-completed" : ""}`}
      style={style}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            className="glass-input"
            autoFocus
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => onEditDescriptionChange(e.target.value)}
            placeholder="Description (optional)"
            className="glass-input text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={onSaveEdit}
              className="btn-icon text-primary hover:bg-primary/20"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={onCancelEdit}
              className="btn-icon text-muted-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={onToggleComplete}
            className={`checkbox-custom flex-shrink-0 mt-0.5 ${
              task.completed ? "checked" : ""
            }`}
          >
            {task.completed && (
              <Check className="w-4 h-4 text-primary-foreground animate-check-bounce" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`task-title font-medium text-foreground ${task.completed ? '' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {!task.completed && (
              <button
                onClick={onStartEdit}
                className="btn-icon text-muted-foreground hover:text-primary"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="btn-icon text-muted-foreground hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
