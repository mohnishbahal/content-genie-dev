export class ContentService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL+'/content';

  public async generateContent(formData:any ) : Promise<any> {
    try {
      const response = await fetch(this.API_BASE_URL+"/generate", {
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

  public async regenerateContentForAttributes(formData:any) : Promise<Response> {
    try {
      const response = await fetch(this.API_BASE_URL+"/regenerate", {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }
  
  public async addNewOrUpdateContent(formData:any) : Promise<Response> {
    try {
      const response = await fetch(this.API_BASE_URL+"/add", {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }
}