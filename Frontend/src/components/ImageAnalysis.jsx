export async function analyzeImage(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error processing image');
  }
  
  const data = await response.json();
  return data;
}