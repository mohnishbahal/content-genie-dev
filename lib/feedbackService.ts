export class FeedbackService {
    private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL+'/feedback';

    public async generateContent(formData:any ) : Promise<any> {
        try {
          const response = await fetch(this.API_BASE_URL+"/add", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
          return response; // Returns the response object directly
        } catch (error) {
          console.error('Error while adding feedback:', error);
          throw new Error('Failed to add feedback. Please try again.');
        }
      }
}