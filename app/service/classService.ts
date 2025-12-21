import { getSupabaseAdmin } from '@/lib/supabase/server';
import { ClassItem } from '@/types';

export async function getClasses(): Promise<ClassItem[]> {
  try {
    const startTime = Date.now();
    console.log('Starting classes fetch...');
    
    const supabaseAdmin = await getSupabaseAdmin();
    console.log(`Supabase client ready in ${Date.now() - startTime}ms`);
    
    const { data: classes, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    console.log(`Query completed in ${Date.now() - startTime}ms`);

    if (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes');
    }

    // Transform snake_case to camelCase for frontend
    const transformedClasses: ClassItem[] = classes.map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      level: cls.level,
      type: cls.type,
      category: cls.category,
      image: cls.image,
      tutorId: cls.tutor_id,
      tutorName: cls.tutor_name,
      details: cls.details ? (Array.isArray(cls.details) ? cls.details : [cls.details]) : undefined,
    }));

    return transformedClasses;
  } catch (error) {
    console.error('Service Error:', error);
    return [];
  }
}

export async function getClassById(id: string): Promise<ClassItem | null> {
  try {
    const supabaseAdmin = await getSupabaseAdmin();

    const { data: classItem, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !classItem) {
      console.error('Error fetching class:', error);
      return null;
    }

    // Transform to camelCase
    const transformedClass: ClassItem = {
      id: classItem.id,
      title: classItem.title,
      description: classItem.description,
      level: classItem.level,
      type: classItem.type,
      category: classItem.category,
      image: classItem.image,
      tutorId: classItem.tutor_id,
      tutorName: classItem.tutor_name,
      details: classItem.details ? (Array.isArray(classItem.details) ? classItem.details : [classItem.details]) : undefined,
    };

    return transformedClass;
  } catch (error) {
    console.error('Service Error:', error);
    return null;
  }
}
