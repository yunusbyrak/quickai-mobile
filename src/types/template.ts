import { Database } from './database';

export type TemplateGroup = Database['public']['Tables']['templates_group']['Row'];
export type Template = Database['public']['Tables']['templates']['Row'];
export type UserTemplate = Database['public']['Tables']['user_templates']['Row'];
export type UserGeneratedTemplate = Database['public']['Tables']['user_generated_templates']['Row'] & {
  note_id?: string | null;
};

export type TemplateWithGroup = Template & {
  templates_group?: TemplateGroup;
};

export type UserTemplateWithGenerated = UserTemplate & {
  user_generated_templates?: UserGeneratedTemplate[];
};

export interface TemplatesState {
  templateGroups: TemplateGroup[];
  templates: Template[];
  userTemplates: UserTemplate[];
  userGeneratedTemplates: Record<string, UserGeneratedTemplate[]>; // keyed by note_id
  loading: boolean;
  error: string | null;
}

export interface TemplatesActions {
  fetchTemplateGroups: (language: string) => Promise<void>;
  fetchTemplates: (language: string, groupId?: string) => Promise<void>;
  fetchUserTemplates: (userId: string, language: string) => Promise<void>;
  fetchUserGeneratedTemplatesByNote: (userId: string, noteId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}
