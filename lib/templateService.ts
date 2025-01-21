export class TemplateService {
    private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL+'/template';
  
    public async getTemplate(formData:any ) : Promise<any> {
      try {
        const response = await fetch(this.API_BASE_URL+"/", {
              method: 'POST',
              body: JSON.stringify(formData),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
          })
        return response; // Returns the response object directly
      } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate content. Please try again.');
      }
    }
}