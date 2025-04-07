declare module '../services/propertyService' {
  export function createProperty(data: any): Promise<any>;
  export function updateProperty(id: string, data: any): Promise<any>;
  export function getProperties(): Promise<any[]>;
}