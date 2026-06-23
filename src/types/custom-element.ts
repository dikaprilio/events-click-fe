/**
 * Custom Element Types (CMS)
 * Maps to backend custom_site_elements table
 */

export type ElementSection = 
  | 'hero' 
  | 'services' 
  | 'cta' 
  | 'footer' 
  | 'about'
  | 'contact'
  | string;

export type ElementType = 
  | 'button' 
  | 'text' 
  | 'heading' 
  | 'image' 
  | 'link'
  | 'html';

export interface CustomElement {
  id: number;
  element_name: string;
  section: ElementSection;
  element_type: ElementType;
  content: string;
  link_url?: string | null;
}

/**
 * Grouped elements by section for easier access
 */
export type GroupedElements = Record<string, CustomElement[]>;

export function groupElementsBySection(
  elements: CustomElement[]
): GroupedElements {
  return elements.reduce((acc, element) => {
    const section = element.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(element);
    return acc;
  }, {} as GroupedElements);
}

/**
 * Find element by name within a section
 */
export function findElement(
  elements: CustomElement[],
  elementName: string
): CustomElement | undefined {
  return elements.find(el => el.element_name === elementName);
}
